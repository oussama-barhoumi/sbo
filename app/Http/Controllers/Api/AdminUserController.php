<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\FailedLoginAttempt;
use App\Models\LoginLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminUserController extends Controller
{
    /**
     * GET /api/v1/admin/users
     *
     * Enhanced user list with advanced filtering, search, and security monitoring.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        // --- 1. Search (Name, Email, Phone) ---
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // --- 2. Filters ---
        $status      = $request->input('status'); // 'active', 'blocked'
        $dateFrom    = $request->input('dateFrom');
        $dateTo      = $request->input('dateTo');
        $minBalance  = $request->input('minBalance');
        $maxBalance  = $request->input('maxBalance');

        if ($status) {
            $query->where('status', $status);
        }

        if ($dateFrom) {
            $query->where('created_at', '>=', Carbon::parse($dateFrom));
        }

        if ($dateTo) {
            $query->where('created_at', '<=', Carbon::parse($dateTo));
        }

        // Balance filtering via accounts join
        if ($minBalance !== null || $maxBalance !== null) {
            $query->whereIn('id', function($q) use ($minBalance, $maxBalance) {
                $q->select('user_id')
                  ->from('accounts')
                  ->where('status', 'active')
                  ->join('ledger_entries', 'accounts.id', '=', 'ledger_entries.account_id')
                  ->groupBy('accounts.id', 'accounts.user_id');

                if ($minBalance !== null) {
                    $q->havingRaw("SUM(CASE WHEN type = 'credit' THEN amount ELSE -amount END) >= ?", [$minBalance]);
                }
                if ($maxBalance !== null) {
                    $q->havingRaw("SUM(CASE WHEN type = 'credit' THEN amount ELSE -amount END) <= ?", [$maxBalance]);
                }
            });
        }

        // Pagination
        $perPage = $request->input('limit', 15);
        $users   = $query->with('accounts')->paginate($perPage);

        // --- 3. Suspicious Detection & Transformation ---
        $transformedUsers = $users->getCollection()->transform(function ($user) {
            $primaryAccount = $user->accounts->where('status', 'active')->first();
            
            // Detection Logic
            $suspiciousData = $this->detectSuspiciousActivity($user, $primaryAccount);

            return [
                'userId'        => $user->id,
                'name'          => $user->name,
                'email'         => $user->email,
                'phone'         => $user->phone,
                'accountStatus' => $user->status,
                'balance'       => (float) ($primaryAccount?->balance ?? 0),
                'lastActivity'  => $user->last_login_at ? $user->last_login_at->toIso8601String() : null,
                'createdAt'     => $user->created_at->toIso8601String(),
                'isSuspicious'  => $suspiciousData['isSuspicious'],
                'flags'         => $suspiciousData['flags'],
            ];
        });

        return response()->json([
            'success'    => true,
            'data'       => $transformedUsers,
            'pagination' => [
                'currentPage' => $users->currentPage(),
                'totalPages'  => $users->lastPage(),
                'totalUsers'  => $users->total(),
            ]
        ]);
    }

    /**
     * POST /api/v1/admin/users/status
     *
     * Block or Unblock a user.
     */
    public function updateStatus(Request $request): JsonResponse
    {
        $request->validate([
            'targetUserId' => 'required|exists:users,id',
            'action'       => 'required|in:block,unblock',
            'reason'       => 'required|string|min:5',
        ]);

        $admin        = $request->user();
        $targetUser   = User::findOrFail($request->input('targetUserId'));
        $action       = $request->input('action');
        $reason       = $request->input('reason');

        // Prevent self-block
        if ($admin->id === $targetUser->id) {
            return response()->json(['success' => false, 'error' => 'Cannot block yourself.'], 400);
        }

        if ($action === 'block') {
            $targetUser->status = User::STATUS_BLOCKED;
            
            // Revoke all tokens
            $targetUser->tokens()->delete();
            
            // Log for audit
            AuditLog::create([
                'admin_id'       => $admin->id,
                'target_user_id' => $targetUser->id,
                'action'         => 'block',
                'reason'         => $reason,
                'ip_address'     => $request->ip(),
            ]);

            Log::warning("User blocked by admin", [
                'adminId'      => $admin->id,
                'targetUserId' => $targetUser->id,
                'reason'       => $reason
            ]);

        } else {
            $targetUser->status = User::STATUS_ACTIVE;

            AuditLog::create([
                'admin_id'       => $admin->id,
                'target_user_id' => $targetUser->id,
                'action'         => 'unblock',
                'reason'         => $reason,
                'ip_address'     => $request->ip(),
            ]);

            Log::info("User unblocked by admin", [
                'adminId'      => $admin->id,
                'targetUserId' => $targetUser->id
            ]);
        }

        $targetUser->save();

        return response()->json([
            'success'   => true,
            'userId'    => $targetUser->id,
            'newStatus' => $targetUser->status,
            'timestamp' => now()->toIso8601String(),
            'adminId'   => $admin->id,
        ]);
    }

    /**
     * Private detection logic.
     */
    private function detectSuspiciousActivity(User $user, $account): array
    {
        $flags = [];
        $isSuspicious = false;

        // 1. > 5 failed logins in 24h
        $failedAttempts = FailedLoginAttempt::where('email', $user->email)
            ->where('created_at', '>=', now()->subDay())
            ->count();
        if ($failedAttempts > 5) {
            $isSuspicious = true;
            $flags[] = "Excessive failed logins ({$failedAttempts})";
        }

        // 2. Unusual large transactions (> 10k)
        if ($account) {
            $largeTxns = DB::table('transactions')
                ->where(fn($q) => $q->where('from_account_id', $account->id)->orWhere('to_account_id', $account->id))
                ->where('amount', '>=', 10000)
                ->where('created_at', '>=', now()->subWeek())
                ->count();
            if ($largeTxns > 0) {
                $isSuspicious = true;
                $flags[] = "Large transactions detected ({$largeTxns})";
            }
        }

        // 3. Multiple countries login (Mock logic: unique IPs for now)
        $uniqueIps = LoginLog::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subDay())
            ->distinct('ip_address')
            ->count();
        if ($uniqueIps > 3) {
            $isSuspicious = true;
            $flags[] = "Login from multiple IPs ({$uniqueIps})";
        }

        return [
            'isSuspicious' => $isSuspicious,
            'flags'        => $flags
        ];
    }
}

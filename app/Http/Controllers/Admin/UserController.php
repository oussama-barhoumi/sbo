<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\FailedLoginAttempt;
use App\Models\LoginLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->with('accounts');

        // Search
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filters
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Pagination
        $users = $query->latest()->paginate(15)->withQueryString();

        // Transform with suspicious flags
        $users->getCollection()->transform(function($user) {
            $primaryAccount = $user->accounts->where('status', 'active')->first();
            $suspiciousData = $this->detectSuspiciousActivity($user, $primaryAccount);

            return [
                'id'            => $user->id,
                'name'          => $user->name,
                'email'         => $user->email,
                'phone'         => $user->phone,
                'status'        => $user->status,
                'balance'       => (float) ($primaryAccount?->balance ?? 0),
                'lastActivity'  => $user->last_login_at ? $user->last_login_at->diffForHumans() : __('admin.common.never'),
                'createdAt'     => $user->created_at->format('M d, Y'),
                'isSuspicious'  => $suspiciousData['isSuspicious'],
                'flags'         => $suspiciousData['flags'],
            ];
        });

        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show($id)
    {
        $user = User::with(['accounts.ledgerEntries', 'loginLogs', 'targetAuditLogs.admin'])->findOrFail($id);
        
        return Inertia::render('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    public function block(Request $request, $id)
    {
        $request->validate(['reason' => 'required|string|min:5']);
        
        $user  = User::findOrFail($id);
        $admin = $request->user();

        if ($user->id === $admin->id) {
            return back()->withErrors(['error' => __('admin.common.error_self_block')]);
        }

        $user->update(['status' => 'blocked']);
        $user->tokens()->delete();

        AuditLog::create([
            'admin_id'       => $admin->id,
            'target_user_id' => $user->id,
            'action'         => 'block',
            'reason'         => $request->reason,
            'ip_address'     => $request->ip(),
        ]);

        return back()->with('success', __('admin.common.user_blocked', ['name' => $user->name]));
    }

    public function unblock(Request $request, $id)
    {
        $request->validate(['reason' => 'required|string|min:5']);

        $user  = User::findOrFail($id);
        $admin = $request->user();

        $user->update(['status' => 'active']);

        AuditLog::create([
            'admin_id'       => $admin->id,
            'target_user_id' => $user->id,
            'action'         => 'unblock',
            'reason'         => $request->reason,
            'ip_address'     => $request->ip(),
        ]);

        return back()->with('success', __('admin.common.user_unblocked', ['name' => $user->name]));
    }

    private function detectSuspiciousActivity(User $user, $account): array
    {
        $flags = [];
        $isSuspicious = false;

        $failedAttempts = FailedLoginAttempt::where('email', $user->email)
            ->where('created_at', '>=', now()->subDay())
            ->count();
        if ($failedAttempts > 5) {
            $isSuspicious = true;
            $flags[] = __('admin.flags.failed_logins');
        }

        if ($account) {
            $largeTxns = DB::table('transactions')
                ->where(fn($q) => $q->where('from_account_id', $account->id)->orWhere('to_account_id', $account->id))
                ->where('amount', '>=', 10000)
                ->where('created_at', '>=', now()->subWeek())
                ->count();
            if ($largeTxns > 0) {
                $isSuspicious = true;
                $flags[] = __('admin.flags.large_transactions');
            }
        }

        $uniqueIps = LoginLog::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subDay())
            ->distinct('ip_address')
            ->count();
        if ($uniqueIps > 3) {
            $isSuspicious = true;
            $flags[] = __('admin.flags.multi_ip');
        }

        return [
            'isSuspicious' => $isSuspicious,
            'flags'        => $flags
        ];
    }
}

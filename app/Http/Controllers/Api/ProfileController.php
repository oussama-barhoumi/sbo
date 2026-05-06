<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApiProfileUpdateRequest;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    /**
     * GET /api/v1/profile
     *
     * Returns the authenticated user's profile including their primary account info.
     */
    public function show(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $account = $user->accounts()->where('status', 'active')->first();

        // Fetch recent transactions
        $transactions = Transaction::where('from_account_id', $account?->id)
            ->orWhere('to_account_id', $account?->id)
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($txn) use ($account) {
                return [
                    'id' => $txn->id,
                    'reference' => $txn->reference,
                    'type' => $txn->type,
                    'amount' => $txn->to_account_id === $account->id ? (float)$txn->amount : -(float)$txn->amount,
                    'currency' => $txn->currency,
                    'description' => $txn->description ?? ($txn->to_account_id === $account->id ? 'Inbound Transfer' : 'Outbound Transfer'),
                    'date' => $txn->created_at->toFormattedDateString(),
                    'fullDate' => $txn->created_at->toIso8601String(),
                    'method' => $txn->method,
                    'status' => $txn->status,
                ];
            });

        // Prepare chart data (last 7 days)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayName = $date->format('D');
            
            // Calculate total volume for that day (just as an example metric)
            $volume = Transaction::whereDate('created_at', $date)
                ->where(function($q) use ($account) {
                    $q->where('from_account_id', $account?->id)
                      ->orWhere('to_account_id', $account?->id);
                })
                ->sum('amount');

            $chartData[] = [
                'name' => $dayName,
                'value' => (float)$volume,
            ];
        }

        return response()->json([
            'success' => true,
            'profile' => array_merge($this->buildProfile($user, $account), [
                'balance' => (float)($account?->balance ?? 0),
                'transactions' => $transactions,
                'chartData' => $chartData,
            ]),
        ]);
    }

    /**
     * PATCH /api/v1/profile
     *
     * Updates allowed fields (name, phone, address).
     * Email changes are explicitly blocked — they require /change-email with password.
     * All changes are audit-logged with a timestamp.
     */
    public function update(ApiProfileUpdateRequest $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $payload = $request->validated();

        // Nothing to update
        if (empty($payload)) {
            return response()->json([
                'success' => false,
                'message' => 'No updatable fields provided.',
            ], 422);
        }

        // Track exactly what changed for the audit log
        $changes = [];
        foreach ($payload as $field => $newValue) {
            $oldValue = $user->getAttribute($field);
            if ($oldValue !== $newValue) {
                $changes[$field] = ['from' => $oldValue, 'to' => $newValue];
            }
        }

        if (empty($changes)) {
            return response()->json([
                'success' => false,
                'message' => 'No changes detected.',
            ], 422);
        }

        $user->update($payload);

        // Audit log — timestamp implicit in log entry
        Log::info('Profile updated', [
            'userId'    => $user->id,
            'email'     => $user->email,
            'changes'   => $changes,
            'updatedAt' => now()->toIso8601String(),
            'ip'        => $request->ip(),
        ]);

        $account = $user->accounts()->where('status', 'active')->first();

        return response()->json([
            'success'   => true,
            'message'   => 'Profile updated successfully.',
            'updatedAt' => now()->toIso8601String(),
            'profile'   => $this->buildProfile($user->fresh(), $account),
        ]);
    }

    /**
     * Build the standard profile response shape.
     */
    private function buildProfile(\App\Models\User $user, ?\App\Models\Account $account): array
    {
        return [
            'userId'    => $user->id,
            'name'      => $user->name,
            'email'     => $user->email,
            'phone'     => $user->phone,
            'address'   => $user->address ?? null,
            'currency'  => $account?->currency ?? 'MAD',
            'accountId' => $account?->id,
            'accountNumber' => $account?->account_number,
            'isVerified' => $user->isVerified(),
            'lastLogin'  => $user->last_login_at?->toIso8601String(),
            'memberSince' => $user->created_at->toIso8601String(),
        ];
    }
}

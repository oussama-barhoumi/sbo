<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\WithdrawRequest;
use App\Models\Account;
use App\Services\BankingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

class WithdrawController extends Controller
{
    public function __construct(private readonly BankingService $bankingService) {}

    /**
     * POST /api/v1/withdraw
     *
     * Validates the withdrawal request, resolves the user's primary active account,
     * and delegates all financial logic to BankingService::apiWithdraw().
     */
    public function store(WithdrawRequest $request): JsonResponse
    {
        $data = $request->validated();
        $userId = $request->user()->id;

        // Resolve the user's primary active account
        $account = Account::where('user_id', $userId)
            ->where('status', 'active')
            ->first();

        if (! $account) {
            return response()->json([
                'success' => false,
                'message' => 'No active account found for this user.',
            ], 422);
        }

        // Account frozen check — isActive() confirms status === 'active'
        if (! $account->isActive()) {
            Log::warning('Withdrawal rejected — account not active', [
                'userId'    => $data['userId'],
                'accountId' => $account->id,
                'status'    => $account->status,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Your account is frozen or suspended. Please contact support.',
            ], 403);
        }

        try {
            $result = $this->bankingService->apiWithdraw(
                account: $account,
                amount:  (string) $data['amount'],
                currency: $data['currency'],
            );

            Log::info('Withdrawal completed', [
                'userId'        => $data['userId'],
                'accountId'     => $account->id,
                'amount'        => $data['amount'],
                'currency'      => $data['currency'],
                'transactionId' => $result['transactionId'],
                'newBalance'    => $result['newBalance'],
            ]);

            return response()->json($result, 201);

        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);

        } catch (RuntimeException $e) {
            // Parse the insufficient balance message to include current balance in response
            Log::warning('Withdrawal failed', [
                'userId'  => $data['userId'],
                'amount'  => $data['amount'],
                'reason'  => $e->getMessage(),
            ]);

            return response()->json([
                'success'        => false,
                'message'        => $e->getMessage(),
                'currentBalance' => (float) $account->fresh()->balance,
            ], 422);
        }
    }
}

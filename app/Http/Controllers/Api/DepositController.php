<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepositRequest;
use App\Models\Account;
use App\Services\BankingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

class DepositController extends Controller
{
    public function __construct(private readonly BankingService $bankingService) {}

    /**
     * POST /api/deposit
     *
     * Validates the incoming deposit request, resolves the user's primary
     * active account, and delegates all financial logic to BankingService.
     */
    public function store(DepositRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Resolve the user's primary active account
        $account = Account::where('user_id', $data['userId'])
            ->where('status', 'active')
            ->first();

        if (! $account) {
            return response()->json([
                'success' => false,
                'message' => 'No active account found for the given user.',
            ], 422);
        }

        try {
            $result = $this->bankingService->apiDeposit(
                account: $account,
                amount: (string) $data['amount'],
                currency: $data['currency'],
                method: $data['method'],
            );

            Log::info('Deposit completed', [
                'userId'        => $data['userId'],
                'accountId'     => $account->id,
                'amount'        => $data['amount'],
                'currency'      => $data['currency'],
                'method'        => $data['method'],
                'transactionId' => $result['transactionId'],
                'newBalance'    => $result['newBalance'],
            ]);

            return response()->json($result, 201);

        } catch (InvalidArgumentException $e) {
            Log::warning('Deposit rejected — invalid input', [
                'userId'  => $data['userId'],
                'amount'  => $data['amount'],
                'reason'  => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);

        } catch (RuntimeException $e) {
            Log::error('Deposit failed — runtime error', [
                'userId'  => $data['userId'],
                'amount'  => $data['amount'],
                'reason'  => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Deposit could not be processed. Please try again.',
            ], 500);
        }
    }
}

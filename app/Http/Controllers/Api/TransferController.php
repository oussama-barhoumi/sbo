<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TransferRequest;
use App\Models\Account;
use App\Notifications\TransferNotification;
use App\Services\BankingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

class TransferController extends Controller
{
    public function __construct(private readonly BankingService $bankingService) {}

    /**
     * POST /api/v1/transfer
     *
     * Resolves sender/recipient accounts, executes atomic transfer via BankingService,
     * then dispatches database notifications to both parties.
     */
    public function store(TransferRequest $request): JsonResponse
    {
        $data = $request->validated();
        $senderId = $request->user()->id;

        // --- Resolve sender account ---
        $senderAccount = Account::where('user_id', $senderId)
            ->where('status', 'active')
            ->first();

        if (! $senderAccount) {
            return response()->json([
                'success' => false,
                'message' => 'No active account found for sender.',
            ], 422);
        }

        // --- Resolve recipient account ---
        $recipientAccount = Account::where('user_id', $data['recipientId'])
            ->where('status', 'active')
            ->first();

        if (! $recipientAccount) {
            return response()->json([
                'success' => false,
                'message' => 'Recipient has no active account.',
            ], 422);
        }

        try {
            $result = $this->bankingService->apiTransfer(
                senderAccount:    $senderAccount,
                recipientAccount: $recipientAccount,
                amount:           (string) $data['amount'],
                currency:         $data['currency'],
                note:             $data['note'] ?? null,
            );

            $transaction   = $result['transaction'];
            $senderBalance = $result['senderBalance'];
            $creditAmount  = $result['creditAmount'];

            // Load the user models for names and notifications
            $sender    = $senderAccount->user;
            $recipient = $recipientAccount->user;

            // --- Dispatch database notifications to both users ---
            $sender->notify(new TransferNotification(
                type:             'sent',
                amount:           (string) $data['amount'],
                currency:         $data['currency'],
                reference:        $transaction->reference,
                counterpartyName: $recipient->name,
                note:             $data['note'] ?? null,
            ));

            $recipient->notify(new TransferNotification(
                type:             'received',
                amount:           $creditAmount,
                currency:         $recipientAccount->currency,
                reference:        $transaction->reference,
                counterpartyName: $sender->name,
                note:             $data['note'] ?? null,
            ));

            Log::info('Transfer completed', [
                'senderId'       => $senderId,
                'recipientId'    => $data['recipientId'],
                'amount'         => $data['amount'],
                'currency'       => $data['currency'],
                'transactionId'  => $transaction->reference,
                'senderBalance'  => $senderBalance,
            ]);

            return response()->json([
                'success'        => true,
                'senderBalance'  => (float) $senderBalance,
                'recipientName'  => $recipient->name,
                'transactionId'  => $transaction->reference,
                'timestamp'      => $transaction->created_at->toIso8601String(),
                'note'           => $data['note'] ?? null,
            ], 201);

        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);

        } catch (RuntimeException $e) {
            Log::warning('Transfer failed', [
                'senderId'    => $senderId,
                'recipientId' => $data['recipientId'],
                'amount'      => $data['amount'],
                'reason'      => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}

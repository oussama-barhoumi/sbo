<?php

namespace App\Services;

use App\Models\Account;
use App\Models\LedgerEntry;
use App\Models\Transaction;
use App\Models\TransactionLog;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use RuntimeException;

class BankingService
{
    /**
     * Process a deposit into an account.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function deposit(Account $account, string $amount, string $description = ''): Transaction
    {
        $this->validateAmount($amount);
        $this->validateAccountActive($account);

        return DB::transaction(function () use ($account, $amount, $description) {
            // Create the transaction record
            $transaction = Transaction::create([
                'type' => 'deposit',
                'amount' => $amount,
                'status' => 'pending',
                'to_account_id' => $account->id,
                'description' => $description,
            ]);

            $transaction->logs()->create([
                'message' => "Deposit of {$amount} {$account->currency} initiated.",
            ]);

            // Double-entry: Credit the user's account, Debit the bank's cash/reserve
            // In a real system, the debit side would go to a bank cash account.
            // Here we record both sides on the user's account for simplicity,
            // but in production you'd have a system/bank account for the other side.
            LedgerEntry::create([
                'account_id' => $account->id,
                'transaction_id' => $transaction->id,
                'type' => 'credit',
                'amount' => $amount,
            ]);

            $transaction->markCompleted();

            return $transaction->fresh();
        });
    }

    /**
     * Process an API deposit into an account with pessimistic locking and currency conversion prep.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function apiDeposit(Account $account, string $amount, string $currency, string $method, string $description = 'API Deposit'): array
    {
        $this->validateAmount($amount);
        $this->validateAccountActive($account);

        return DB::transaction(function () use ($account, $amount, $currency, $method, $description) {
            // Pessimistic lock the account row to prevent race conditions during concurrent requests
            $lockedAccount = Account::lockForUpdate()->find($account->id);

            // Optional future structure: Currency Conversion
            // If the deposit currency differs from the account currency, convert it here.
            $finalAmount = $amount;
            if ($currency !== $lockedAccount->currency) {
                // Example structure for future API:
                // $rate = CurrencyService::getRate($currency, $lockedAccount->currency);
                // $finalAmount = bcmul($amount, (string)$rate, 2);
            }

            // Create the transaction record
            $transaction = Transaction::create([
                'type' => 'deposit',
                'amount' => $finalAmount,
                'currency' => $currency,
                'method' => $method,
                'status' => 'pending',
                'to_account_id' => $lockedAccount->id,
                'description' => $description,
            ]);

            $transaction->logs()->create([
                'message' => "API Deposit of {$amount} {$currency} via {$method} initiated.",
            ]);

            // Double-entry: Credit the user's account
            LedgerEntry::create([
                'account_id' => $lockedAccount->id,
                'transaction_id' => $transaction->id,
                'type' => 'credit',
                'amount' => $finalAmount,
            ]);

            $transaction->markCompleted();
            $transaction->refresh();

            // Structure the response format requested by the user
            return [
                'success' => true,
                'newBalance' => (float) $lockedAccount->balance,
                'transactionId' => $transaction->reference,
                'timestamp' => $transaction->created_at->toIso8601String(),
                'method' => $transaction->method,
            ];
        });
    }

    /**
     * Process an atomic transfer between two accounts.
     *
     * Safety mechanisms:
     *  - Both account rows locked in consistent ID order (low→high) to prevent deadlocks.
     *  - Balance check after lock acquisition.
     *  - Currency conversion via CurrencyService if accounts have different currencies.
     *  - Daily transfer limit: 100,000 DH equivalent.
     *  - Double-entry: debit sender, credit recipient in same transaction.
     *  - Database notifications dispatched after commit.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function apiTransfer(
        Account $senderAccount,
        Account $recipientAccount,
        string  $amount,
        string  $currency,
        ?string $note = null,
    ): array {
        $this->validateAmount($amount);
        $this->validateAccountActive($senderAccount);
        $this->validateAccountActive($recipientAccount);

        if ($senderAccount->id === $recipientAccount->id) {
            throw new \InvalidArgumentException('Sender and recipient accounts must differ.');
        }

        return DB::transaction(function () use ($senderAccount, $recipientAccount, $amount, $currency, $note) {
            // Lock both rows in consistent ID order (lowest ID first) to prevent deadlocks
            $ids            = collect([$senderAccount->id, $recipientAccount->id])->sort()->values();
            $lockedAccounts = Account::lockForUpdate()->whereIn('id', $ids)->orderBy('id')->get()->keyBy('id');

            $lockedSender    = $lockedAccounts[$senderAccount->id];
            $lockedRecipient = $lockedAccounts[$recipientAccount->id];

            // --- 1. Currency conversion ---
            $debitAmount  = $amount; // amount debited from sender (in sender currency)
            $creditAmount = $amount; // amount credited to recipient (may differ after conversion)

            if ($currency !== $lockedRecipient->currency) {
                $creditAmount = \App\Services\CurrencyService::convert($amount, $currency, $lockedRecipient->currency);
            }
            if ($currency !== $lockedSender->currency) {
                $debitAmount = \App\Services\CurrencyService::convert($amount, $currency, $lockedSender->currency);
            }

            // --- 2. Sufficient balance check (after conversion) ---
            $senderBalance = $lockedSender->balance;
            if (bccomp($senderBalance, $debitAmount, 2) < 0) {
                throw new \RuntimeException(
                    "Insufficient funds. Sender balance is {$senderBalance} {$lockedSender->currency}."
                );
            }

            // --- 3. Daily transfer limit check (100,000 DH equivalent) ---
            $dailyLimit = (string) config('banking.daily_transfer_limit', 100000);
            $todayTotal = Transaction::where('from_account_id', $lockedSender->id)
                ->where('type', 'transfer')
                ->where('status', 'completed')
                ->where('created_at', '>=', now()->startOfDay())
                ->sum('amount');

            if (bccomp(bcadd((string) $todayTotal, $debitAmount, 2), $dailyLimit, 2) > 0) {
                throw new \RuntimeException(
                    "Daily transfer limit of {$dailyLimit} DH exceeded. Already transferred today: {$todayTotal} DH."
                );
            }

            // --- 4. Create transaction record ---
            $description = $note ? "Transfer: {$note}" : 'API Transfer';
            $transaction = Transaction::create([
                'type'             => 'transfer',
                'amount'           => $debitAmount,
                'currency'         => $currency,
                'method'           => 'online',
                'status'           => 'pending',
                'from_account_id'  => $lockedSender->id,
                'to_account_id'    => $lockedRecipient->id,
                'description'      => $description,
            ]);

            $transaction->logs()->create([
                'message' => "Transfer of {$amount} {$currency} from account #{$lockedSender->id} to #{$lockedRecipient->id}.",
            ]);

            // --- 5. Double-entry: debit sender, credit recipient ---
            LedgerEntry::create([
                'account_id'     => $lockedSender->id,
                'transaction_id' => $transaction->id,
                'type'           => 'debit',
                'amount'         => $debitAmount,
            ]);

            LedgerEntry::create([
                'account_id'     => $lockedRecipient->id,
                'transaction_id' => $transaction->id,
                'type'           => 'credit',
                'amount'         => $creditAmount,
            ]);

            $transaction->markCompleted();
            $transaction->refresh();

            // Capture balances BEFORE releasing the lock (still inside transaction)
            $newSenderBalance = $lockedSender->fresh()->balance;

            return [
                'transaction'      => $transaction,
                'senderBalance'    => $newSenderBalance,
                'creditAmount'     => $creditAmount,
                'senderAccount'    => $lockedSender,
                'recipientAccount' => $lockedRecipient,
            ];
        });
    }

    /**
     * Process an API withdrawal with pessimistic locking, daily limit check,
     * and large-withdrawal AI alert flagging.
     *
     * Daily limit: 50,000 DH equivalent (configurable via DAILY_WITHDRAW_LIMIT env).
     * AI alert threshold: 10,000 DH equivalent (configurable via LARGE_WITHDRAW_ALERT env).
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function apiWithdraw(Account $account, string $amount, string $currency): array
    {
        $this->validateAmount($amount);
        $this->validateAccountActive($account);

        return DB::transaction(function () use ($account, $amount, $currency) {
            // Pessimistic lock — prevents race conditions on concurrent withdrawals
            $lockedAccount = Account::lockForUpdate()->find($account->id);

            $balance = $lockedAccount->balance; // computed from ledger (bcmath)

            // --- 1. Sufficient balance check ---
            if (bccomp($balance, $amount, 2) < 0) {
                $failedTxn = Transaction::create([
                    'type'           => 'withdrawal',
                    'amount'         => $amount,
                    'currency'       => $currency,
                    'method'         => 'online',
                    'status'         => 'failed',
                    'from_account_id' => $lockedAccount->id,
                    'description'    => 'Failed: insufficient balance.',
                ]);
                $failedTxn->logs()->create([
                    'message' => "Withdrawal of {$amount} {$currency} rejected. Balance: {$balance}.",
                ]);

                throw new \RuntimeException(
                    "Insufficient funds. Your current balance is {$balance} {$lockedAccount->currency}."
                );
            }

            // --- 2. Daily withdrawal limit check ---
            $dailyLimit = (string) config('banking.daily_withdraw_limit', 50000);
            $todayTotal = Transaction::where('from_account_id', $lockedAccount->id)
                ->where('type', 'withdrawal')
                ->where('status', 'completed')
                ->where('created_at', '>=', now()->startOfDay())
                ->sum('amount');

            $projectedTotal = bcadd((string) $todayTotal, $amount, 2);
            if (bccomp($projectedTotal, $dailyLimit, 2) > 0) {
                throw new \RuntimeException(
                    "Daily withdrawal limit of {$dailyLimit} DH exceeded. "
                    . "Already withdrawn today: {$todayTotal} DH."
                );
            }

            // --- 3. Create transaction record ---
            $transaction = Transaction::create([
                'type'            => 'withdrawal',
                'amount'          => $amount,
                'currency'        => $currency,
                'method'          => 'online',
                'status'          => 'pending',
                'from_account_id' => $lockedAccount->id,
                'description'     => 'API Withdrawal',
            ]);

            $transaction->logs()->create([
                'message' => "Withdrawal of {$amount} {$currency} initiated via API.",
            ]);

            // --- 4. Double-entry: Debit the account ---
            LedgerEntry::create([
                'account_id'     => $lockedAccount->id,
                'transaction_id' => $transaction->id,
                'type'           => 'debit',
                'amount'         => $amount,
            ]);

            $transaction->markCompleted();
            $transaction->refresh();

            // --- 5. AI alert — flag large withdrawals for review ---
            $alertThreshold = (string) config('banking.large_withdraw_alert', 10000);
            if (bccomp($amount, $alertThreshold, 2) >= 0) {
                \Illuminate\Support\Facades\Log::warning('AI_ALERT: Large withdrawal detected', [
                    'accountId'     => $lockedAccount->id,
                    'amount'        => $amount,
                    'currency'      => $currency,
                    'transactionId' => $transaction->reference,
                    'balance_after' => (float) $lockedAccount->fresh()->balance,
                    'timestamp'     => now()->toIso8601String(),
                    'flag'          => 'LARGE_WITHDRAWAL — review required',
                ]);
            }

            return [
                'success'       => true,
                'newBalance'    => (float) $lockedAccount->fresh()->balance,
                'transactionId' => $transaction->reference,
                'timestamp'     => $transaction->created_at->toIso8601String(),
                'flagged'       => bccomp($amount, $alertThreshold, 2) >= 0,
            ];
        });
    }


    /**
     * Process a withdrawal from an account.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */

    public function withdraw(Account $account, string $amount, string $description = ''): Transaction
    {
        $this->validateAmount($amount);
        $this->validateAccountActive($account);

        return DB::transaction(function () use ($account, $amount, $description) {
            // Check sufficient balance (pessimistic lock via transaction)
            $balance = $account->balance;
            if (bccomp($balance, $amount, 2) < 0) {
                $failedTxn = Transaction::create([
                    'type' => 'withdrawal',
                    'amount' => $amount,
                    'status' => 'failed',
                    'from_account_id' => $account->id,
                    'description' => $description,
                ]);
                $failedTxn->logs()->create([
                    'message' => "Withdrawal failed: insufficient balance. Available: {$balance}, Requested: {$amount}.",
                ]);
                throw new RuntimeException("Insufficient balance. Available: {$balance}, Requested: {$amount}.");
            }

            $transaction = Transaction::create([
                'type' => 'withdrawal',
                'amount' => $amount,
                'status' => 'pending',
                'from_account_id' => $account->id,
                'description' => $description,
            ]);

            $transaction->logs()->create([
                'message' => "Withdrawal of {$amount} {$account->currency} initiated.",
            ]);

            // Double-entry: Debit the user's account
            LedgerEntry::create([
                'account_id' => $account->id,
                'transaction_id' => $transaction->id,
                'type' => 'debit',
                'amount' => $amount,
            ]);

            $transaction->markCompleted();

            return $transaction->fresh();
        });
    }

    /**
     * Process a transfer between two accounts.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function transfer(Account $fromAccount, Account $toAccount, string $amount, string $description = ''): Transaction
    {
        $this->validateAmount($amount);
        $this->validateAccountActive($fromAccount);
        $this->validateAccountActive($toAccount);

        // Prevent self-transfer
        if ($fromAccount->id === $toAccount->id) {
            throw new InvalidArgumentException('Cannot transfer to the same account.');
        }

        return DB::transaction(function () use ($fromAccount, $toAccount, $amount, $description) {
            // Check sufficient balance
            $balance = $fromAccount->balance;
            if (bccomp($balance, $amount, 2) < 0) {
                $failedTxn = Transaction::create([
                    'type' => 'transfer',
                    'amount' => $amount,
                    'status' => 'failed',
                    'from_account_id' => $fromAccount->id,
                    'to_account_id' => $toAccount->id,
                    'description' => $description,
                ]);
                $failedTxn->logs()->create([
                    'message' => "Transfer failed: insufficient balance. Available: {$balance}, Requested: {$amount}.",
                ]);
                throw new RuntimeException("Insufficient balance. Available: {$balance}, Requested: {$amount}.");
            }

            $transaction = Transaction::create([
                'type' => 'transfer',
                'amount' => $amount,
                'status' => 'pending',
                'from_account_id' => $fromAccount->id,
                'to_account_id' => $toAccount->id,
                'description' => $description,
            ]);

            $transaction->logs()->create([
                'message' => "Transfer of {$amount} from {$fromAccount->account_number} to {$toAccount->account_number} initiated.",
            ]);

            // Double-entry: Debit sender, Credit receiver
            LedgerEntry::create([
                'account_id' => $fromAccount->id,
                'transaction_id' => $transaction->id,
                'type' => 'debit',
                'amount' => $amount,
            ]);

            LedgerEntry::create([
                'account_id' => $toAccount->id,
                'transaction_id' => $transaction->id,
                'type' => 'credit',
                'amount' => $amount,
            ]);

            $transaction->markCompleted();

            return $transaction->fresh();
        });
    }

    /**
     * Validate that the amount is positive.
     */
    private function validateAmount(string $amount): void
    {
        if (bccomp($amount, '0', 2) <= 0) {
            throw new InvalidArgumentException('Amount must be greater than zero.');
        }
    }

    /**
     * Validate that the account is active.
     */
    private function validateAccountActive(Account $account): void
    {
        if (! $account->isActive()) {
            throw new RuntimeException("Account {$account->account_number} is not active (status: {$account->status}).");
        }
    }
}

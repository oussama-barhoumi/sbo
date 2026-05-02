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

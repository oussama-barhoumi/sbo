<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'account_number',
        'currency',
        'status',
    ];

    /**
     * Get the user that owns the account.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all ledger entries for the account.
     */
    public function ledgerEntries(): HasMany
    {
        return $this->hasMany(LedgerEntry::class);
    }

    /**
     * Get outgoing transactions (where this account is the sender).
     */
    public function outgoingTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'from_account_id');
    }

    /**
     * Get incoming transactions (where this account is the receiver).
     */
    public function incomingTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'to_account_id');
    }

    /**
     * Calculate the account balance from ledger entries (double-entry).
     * Credits increase balance, debits decrease balance.
     */
    public function getBalanceAttribute(): string
    {
        $credits = $this->ledgerEntries()
            ->where('type', 'credit')
            ->sum('amount');

        $debits = $this->ledgerEntries()
            ->where('type', 'debit')
            ->sum('amount');

        return bcsub((string) $credits, (string) $debits, 2);
    }

    /**
     * Check if the account is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Generate a unique account number.
     */
    public static function generateAccountNumber(): string
    {
        do {
            // Format: SBO-XXXX-XXXX-XXXX-XXXX (20 chars without dashes)
            $number = 'SBO' . str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT)
                . str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT)
                . str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT)
                . str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        } while (self::where('account_number', $number)->exists());

        return $number;
    }
}

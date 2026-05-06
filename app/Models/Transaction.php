<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Transaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'reference',
        'type',
        'amount',
        'currency',
        'method',
        'status',
        'from_account_id',
        'to_account_id',
        'description',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    /**
     * Boot the model — auto-generate reference on creation.
     */
    protected static function booted(): void
    {
        static::creating(function (Transaction $transaction) {
            if (empty($transaction->reference)) {
                $transaction->reference = self::generateReference();
            }
        });
    }

    /**
     * Get the source account (sender).
     */
    public function fromAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'from_account_id');
    }

    /**
     * Get the destination account (receiver).
     */
    public function toAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'to_account_id');
    }

    /**
     * Get all ledger entries for this transaction.
     */
    public function ledgerEntries(): HasMany
    {
        return $this->hasMany(LedgerEntry::class);
    }

    /**
     * Get all logs for this transaction.
     */
    public function logs(): HasMany
    {
        return $this->hasMany(TransactionLog::class);
    }

    /**
     * Mark the transaction as completed.
     */
    public function markCompleted(): void
    {
        $this->update(['status' => 'completed']);
        $this->logs()->create(['message' => 'Transaction completed successfully.']);
    }

    /**
     * Mark the transaction as failed.
     */
    public function markFailed(string $reason = 'Transaction failed.'): void
    {
        $this->update(['status' => 'failed']);
        $this->logs()->create(['message' => $reason]);
    }

    /**
     * Generate a unique transaction reference.
     */
    public static function generateReference(): string
    {
        return 'TXN-' . strtoupper(Str::ulid());
    }
}

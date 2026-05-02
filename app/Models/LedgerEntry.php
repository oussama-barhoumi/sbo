<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LedgerEntry extends Model
{
    /**
     * Indicates if the model should be timestamped.
     * We only use created_at (set via useCurrent in migration).
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'account_id',
        'transaction_id',
        'type',
        'amount',
        'created_at',
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
            'created_at' => 'datetime',
        ];
    }

    /**
     * Get the account this ledger entry belongs to.
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Get the transaction this ledger entry belongs to.
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Check if this is a debit entry.
     */
    public function isDebit(): bool
    {
        return $this->type === 'debit';
    }

    /**
     * Check if this is a credit entry.
     */
    public function isCredit(): bool
    {
        return $this->type === 'credit';
    }
}

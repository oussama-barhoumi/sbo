<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserVerification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'date_of_birth',
        'national_id_number',
        'id_card_front',
        'id_card_back',
        'selfie_image',
        'status',
        'rejection_reason',
        'verified_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'verified_at' => 'datetime',
        ];
    }

    /**
     * Get the user this verification belongs to.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all logs for this verification.
     */
    public function logs(): HasMany
    {
        return $this->hasMany(VerificationLog::class);
    }

    /**
     * Get the full name of the verified person.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Check if verification is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if verification is approved.
     */
    public function isVerified(): bool
    {
        return $this->status === 'verified';
    }

    /**
     * Check if verification was rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Approve the verification.
     */
    public function approve(?int $adminId = null): void
    {
        $this->update([
            'status' => 'verified',
            'verified_at' => now(),
            'rejection_reason' => null,
        ]);

        $this->logs()->create([
            'action' => 'approved',
            'admin_id' => $adminId,
        ]);
    }

    /**
     * Reject the verification.
     */
    public function reject(string $reason, ?int $adminId = null): void
    {
        $this->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
            'verified_at' => null,
        ]);

        $this->logs()->create([
            'action' => 'rejected',
            'admin_id' => $adminId,
        ]);
    }
}

<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'phone', 'address', 'last_login_at', 'role', 'status', 'avatar'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Role Constants
     */
    public const ROLE_USER = 'user';
    public const ROLE_ADMIN = 'admin';
    public const ROLE_SUPER_ADMIN = 'super_admin';

    /**
     * Status Constants
     */
    public const STATUS_ACTIVE = 'active';
    public const STATUS_BLOCKED = 'blocked';

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, [self::ROLE_ADMIN, self::ROLE_SUPER_ADMIN]);
    }

    /**
     * Check if user is a super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPER_ADMIN;
    }

    /**
     * Check if user is blocked.
     */
    public function isBlocked(): bool
    {
        return $this->status === self::STATUS_BLOCKED;
    }

    /**
     * Assign a role to the user with validation and logging.
     * 
     * @throws \InvalidArgumentException
     */
    public function assignRole(string $role): void
    {
        $validRoles = [self::ROLE_USER, self::ROLE_ADMIN, self::ROLE_SUPER_ADMIN];

        if (!in_array($role, $validRoles)) {
            throw new \InvalidArgumentException("Invalid role: {$role}");
        }

        $oldRole = $this->role;
        $this->role = $role;
        $this->save();

        \Illuminate\Support\Facades\Log::info("Role changed for user {$this->id}", [
            'old_role' => $oldRole,
            'new_role' => $role,
            'performed_by' => auth()->id() ?? 'system/tinker'
        ]);

        \App\Events\RoleAssigned::dispatch($this, $role, $oldRole);
    }

    /**
     * Get the audit logs performed by this admin.
     */
    public function adminAuditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'admin_id');
    }

    /**
     * Get the audit logs targeting this user.
     */
    public function targetAuditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'target_user_id');
    }

    /**
     * Get the login logs for this user.
     */
    public function loginLogs(): HasMany
    {
        return $this->hasMany(LoginLog::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at'     => 'datetime',
            'password'          => 'hashed',
        ];
    }

    /**
     * Get all accounts owned by the user.
     */
    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    /**
     * Get the KYC verification for the user.
     */
    public function verification(): HasOne
    {
        return $this->hasOne(UserVerification::class);
    }

    /**
     * Check if the user is KYC verified.
     */
    public function isVerified(): bool
    {
        return $this->verification?->status === 'verified';
    }
}

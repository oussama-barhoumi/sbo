<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can assign roles.
     */
    public function assignRole(User $user): bool
    {
        return $user->isSuperAdmin();
    }
}

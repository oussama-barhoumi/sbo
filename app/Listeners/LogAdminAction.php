<?php

namespace App\Listeners;

use App\Events\RoleAssigned;
use App\Models\AdminAction;
use App\Notifications\RoleAssignedNotification;
use Illuminate\Support\Facades\Auth;

class LogAdminAction
{
    /**
     * Handle the event.
     */
    public function handle(RoleAssigned $event): void
    {
        // 1. Record the action in Audit Log
        AdminAction::create([
            'performed_by'   => Auth::id() ?? $event->user->id, // Fallback to self if system action
            'target_user_id' => $event->user->id,
            'action'         => 'assign_role',
            'metadata'       => [
                'old_role' => $event->oldRole,
                'new_role' => $event->newRole,
            ],
        ]);

        // 2. Notify the user
        $event->user->notify(new RoleAssignedNotification($event->newRole));
    }
}

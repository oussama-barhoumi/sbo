<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogoutController extends Controller
{
    /**
     * POST /api/v1/logout
     *
     * Revokes only the current request token (not all device tokens).
     * Logs the logout event for audit.
     * Returns a confirmation message.
     */
    public function logout(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Capture token name before deletion for the audit log
        $tokenName = $user->currentAccessToken()->name;

        // Revoke current token only (does not log out other devices)
        $user->currentAccessToken()->delete();

        // Audit log — timestamp is implicit in the log entry
        Log::info('User logged out', [
            'userId'       => $user->id,
            'email'        => $user->email,
            'tokenName'    => $tokenName,
            'logoutAt'     => now()->toIso8601String(),
            'ip'           => $request->ip(),
            'userAgent'    => $request->userAgent(),
        ]);

        return response()->json([
            'success'   => true,
            'message'   => 'You have been securely logged out.',
            'logoutAt'  => now()->toIso8601String(),
        ]);
    }
}

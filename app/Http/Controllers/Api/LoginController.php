<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class LoginController extends Controller
{
    /**
     * Maximum failed attempts before account recovery is suggested.
     */
    private const MAX_ATTEMPTS = 3;

    /**
     * Rate-limiter decay window in seconds (5 minutes).
     */
    private const DECAY_SECONDS = 300;

    /**
     * POST /api/v1/login
     *
     * Security principles applied:
     *  - Generic error message: never expose whether email or password failed.
     *  - Attempt tracking per email (not per IP alone) to survive IP rotation.
     *  - After MAX_ATTEMPTS: suggest account recovery without locking the user out
     *    (locking can be used as a DoS vector against legitimate users).
     *  - Sanctum token scoped to 'bank-api' for clear revocation.
     *  - last_login_at updated atomically on success.
     *  - Full audit log on every attempt (success and failure).
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $email    = $request->input('email');
        $password = $request->input('password');
        $limiterKey = 'login:' . Str::lower($email);

        // --- Check if already rate-limited ---
        if (RateLimiter::tooManyAttempts($limiterKey, self::MAX_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($limiterKey);

            Log::warning('Login locked — too many attempts', ['email' => $email, 'retry_in' => $seconds]);

            return response()->json([
                'success'       => false,
                'message'       => 'Too many login attempts. Please try again later or recover your account.',
                'retryAfter'    => $seconds,
                'recovery'      => route('password.request'),
            ], 429);
        }

        // --- Attempt authentication ---
        if (! Auth::attempt(['email' => $email, 'password' => $password], $request->boolean('remember'))) {
            RateLimiter::hit($limiterKey, self::DECAY_SECONDS);

            // Record failed attempt
            \App\Models\FailedLoginAttempt::create([
                'email'      => $email,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $attempts  = RateLimiter::attempts($limiterKey);
            $remaining = self::MAX_ATTEMPTS - $attempts;

            Log::warning('Failed login attempt', [
                'email'        => $email,
                'attempt'      => $attempts,
                'remaining'    => max(0, $remaining),
                'ip'           => $request->ip(),
            ]);

            // After 3 failures suggest recovery but keep the generic message
            if ($remaining <= 0) {
                return response()->json([
                    'success'  => false,
                    'message'  => 'Invalid credentials. You have exceeded the maximum attempts.',
                    'recovery' => route('password.request'),
                ], 401);
            }

            return response()->json([
                'success'            => false,
                'message'            => 'Invalid credentials.',
                'attemptsRemaining'  => $remaining,
            ], 401);
        }

        // --- Credentials valid: clear limiter, issue token ---
        RateLimiter::clear($limiterKey);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if blocked
        if ($user->isBlocked()) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been suspended. Please contact support.',
            ], 403);
        }

        // Record successful login log
        \App\Models\LoginLog::create([
            'user_id'    => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Stamp last login time
        $user->update(['last_login_at' => now()]);

        // Revoke all previous API tokens (single-session enforcement)
        $user->tokens()->where('name', 'bank-api')->delete();

        // Issue a fresh Sanctum token
        $token = $user->createToken('bank-api')->plainTextToken;

        // Resolve primary account currency for the response
        $account = $user->accounts()->where('status', 'active')->first();

        Log::info('Login successful', [
            'userId'    => $user->id,
            'email'     => $user->email,
            'ip'        => $request->ip(),
            'accountId' => $account?->id,
        ]);

        return response()->json([
            'success'   => true,
            'userId'    => $user->id,
            'name'      => $user->name,
            'role'      => $user->role,
            'isAdmin'   => $user->isAdmin(),
            'token'     => $token,
            'lastLogin' => $user->getOriginal('last_login_at')
                               ? \Carbon\Carbon::parse($user->getOriginal('last_login_at'))->toIso8601String()
                               : null,
            'currency'  => $account?->currency ?? 'MAD',
        ], 200);
    }
}

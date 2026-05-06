<?php

use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\DepositController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\LogoutController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\TransferController;
use App\Http\Controllers\Api\WithdrawController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Banking API Routes
|--------------------------------------------------------------------------
|
| All routes here are prefixed with /api automatically.
| Rate limiting: 10 deposit attempts per minute per IP to prevent double
| submissions and abuse (configured via throttle middleware).
|
*/

Route::prefix('v1')->group(function () {

    // POST /api/v1/login  — public, rate-limited
    Route::post('/login', [LoginController::class, 'login'])
        ->middleware('throttle:5,1')
        ->name('api.login');

    // POST /api/v1/deposit  — public, rate-limited
    Route::post('/deposit', [DepositController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('api.deposit');

    // ── Authenticated routes (require valid Sanctum token) ──────────────
    Route::middleware(['auth:sanctum', 'check.status'])->group(function () {

        // POST /api/v1/withdraw
        Route::post('/withdraw', [WithdrawController::class, 'store'])
            ->middleware('throttle:10,1')
            ->name('api.withdraw');

        // POST /api/v1/transfer
        Route::post('/transfer', [TransferController::class, 'store'])
            ->middleware('throttle:10,1')
            ->name('api.transfer');

        // POST /api/v1/logout
        Route::post('/logout', [LogoutController::class, 'logout'])
            ->name('api.logout');

        // GET  /api/v1/profile
        Route::get('/profile',   [ProfileController::class, 'show'])->name('api.profile.show');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('api.profile.update');

        // Admin Routes
        Route::prefix('admin')->middleware(['admin'])->group(function () {
            Route::get('/users', [AdminUserController::class, 'index'])->name('api.admin.users');
            Route::post('/users/status', [AdminUserController::class, 'updateStatus'])->name('api.admin.users.status');
        });

    });

});


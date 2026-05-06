<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\RegisterAccountController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('Welcome'));
Route::get('/banking', fn() => Inertia::render('BankingDashboard'))->name('banking');

// Bank Account Registration
Route::get('/register-account', [RegisterAccountController::class, 'create'])->name('register.account');
Route::post('/register-account', [RegisterAccountController::class, 'store'])->name('register.account.store');
Route::post('/register-account/validate-field', [RegisterAccountController::class, 'validateField'])->name('register.account.validate');
Route::post('/register-account/verify-kyc', [RegisterAccountController::class, 'verifyKyc'])->name('register.account.kyc');

Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->middleware(['auth', 'verified'])->name('dashboard');

// Admin Dashboard Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    
    // User Management
    Route::get('/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('admin.users.show');
    Route::post('/users/{user}/block', [UserController::class, 'block'])->name('admin.users.block');
    Route::post('/users/{user}/unblock', [UserController::class, 'unblock'])->name('admin.users.unblock');
    
    // Admin Management
    Route::get('/admins', [AdminController::class, 'index'])->name('admin.admins.index');
    Route::post('/admins', [AdminController::class, 'store'])->name('admin.admins.store');
    Route::patch('/admins/{id}', [AdminController::class, 'update'])->name('admin.admins.update');
    Route::delete('/admins/{id}', [AdminController::class, 'destroy'])->name('admin.admins.destroy');
    
    // Audit Logs
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('admin.audit-logs.index');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

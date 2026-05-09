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

// Language switcher
Route::post('/locale/{locale}', function (string $locale) {
    if (in_array($locale, ['en', 'fr', 'ar'])) {
        session(['locale' => $locale]);
    }
    return back();
})->name('locale.switch');
Route::get('/banking', fn() => Inertia::render('BankingDashboard'))->middleware(['auth'])->name('banking');

// Bank Account Registration
Route::get('/register-account', [RegisterAccountController::class, 'create'])->name('register.account');
Route::post('/register-account', [RegisterAccountController::class, 'store'])->name('register.account.store');
Route::post('/register-account/validate-field', [RegisterAccountController::class, 'validateField'])->name('register.account.validate');
Route::post('/register-account/verify-kyc', [RegisterAccountController::class, 'verifyKyc'])->name('register.account.kyc');

Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/treasury', fn() => Inertia::render('Treasury'))->middleware(['auth'])->name('treasury');
Route::get('/wealth', fn() => Inertia::render('Wealth'))->middleware(['auth'])->name('wealth');
Route::get('/salary-calculator', fn() => Inertia::render('SalaryCalculator'))->middleware(['auth'])->name('salary-calculator');

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

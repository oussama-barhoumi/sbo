<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\FailedLoginAttempt;
use App\Models\LoginLog;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Stats
        $totalUsers = User::count();
        $activeUsers = User::where('status', 'active')->count();
        $blockedUsers = User::where('status', 'blocked')->count();
        
        // Sum of all active account balances
        $totalBalance = DB::table('ledger_entries')
            ->selectRaw('SUM(CASE WHEN type = "credit" THEN amount ELSE -amount END) as balance')
            ->value('balance') ?: 0;

        // Suspicious accounts count (rough estimate for dashboard)
        $suspiciousCount = User::whereHas('accounts', function($q) {
                // Simplified detection for the count
                $q->whereExists(function($sq) {
                    $sq->select(DB::raw(1))
                        ->from('transactions')
                        ->whereColumn('from_account_id', 'accounts.id')
                        ->where('amount', '>=', 10000);
                });
            })
            ->orWhereHas('loginLogs', function($q) {
                $q->where('created_at', '>=', now()->subDay());
            }, '>', 3)
            ->count();

        // 2. Transactions Chart Data (Last 30 days)
        $transactionsData = Transaction::where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(30))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(amount) as total_amount'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'activeUsers' => $activeUsers,
                'blockedUsers' => $blockedUsers,
                'totalBalance' => (float) $totalBalance,
                'suspiciousAccounts' => $suspiciousCount,
            ],
            'chartData' => $transactionsData,
        ]);
    }
}

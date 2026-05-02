<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\LedgerEntry;
use App\Models\Transaction;
use App\Models\TransactionLog;
use App\Models\User;
use App\Models\UserVerification;
use App\Models\VerificationLog;
use App\Services\BankingService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $banking = new BankingService();

        // ──────────────────────────────────────────────────────
        // 1. Create Admin User
        // ──────────────────────────────────────────────────────
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@sbo-bank.com',
            'phone' => '+212600000000',
            'password' => Hash::make('password'),
        ]);

        // ──────────────────────────────────────────────────────
        // 2. Create Regular Users with KYC & Accounts
        // ──────────────────────────────────────────────────────

        // User 1: Fully verified, active accounts with transaction history
        $user1 = User::factory()->create([
            'name' => 'Oussama Barhoumi',
            'email' => 'oussama@example.com',
            'phone' => '+212611111111',
            'password' => Hash::make('password'),
        ]);

        $verification1 = UserVerification::factory()->verified()->create([
            'user_id' => $user1->id,
            'first_name' => 'Oussama',
            'last_name' => 'Barhoumi',
            'date_of_birth' => '1995-03-15',
            'national_id_number' => 'AB123456',
        ]);

        VerificationLog::create([
            'user_verification_id' => $verification1->id,
            'action' => 'submitted',
            'created_at' => now()->subDays(10),
        ]);
        VerificationLog::create([
            'user_verification_id' => $verification1->id,
            'action' => 'approved',
            'admin_id' => $admin->id,
            'created_at' => now()->subDays(9),
        ]);

        $account1Mad = Account::factory()->create([
            'user_id' => $user1->id,
            'account_number' => 'SBO0001000100010001',
            'currency' => 'MAD',
            'status' => 'active',
        ]);

        $account1Usd = Account::factory()->create([
            'user_id' => $user1->id,
            'account_number' => 'SBO0001000100010002',
            'currency' => 'USD',
            'status' => 'active',
        ]);

        // User 2: Verified, single account
        $user2 = User::factory()->create([
            'name' => 'Fatima Zahra',
            'email' => 'fatima@example.com',
            'phone' => '+212622222222',
            'password' => Hash::make('password'),
        ]);

        $verification2 = UserVerification::factory()->verified()->create([
            'user_id' => $user2->id,
            'first_name' => 'Fatima',
            'last_name' => 'Zahra',
            'date_of_birth' => '1990-07-22',
            'national_id_number' => 'CD789012',
        ]);

        VerificationLog::create([
            'user_verification_id' => $verification2->id,
            'action' => 'submitted',
            'created_at' => now()->subDays(15),
        ]);
        VerificationLog::create([
            'user_verification_id' => $verification2->id,
            'action' => 'approved',
            'admin_id' => $admin->id,
            'created_at' => now()->subDays(14),
        ]);

        $account2Mad = Account::factory()->create([
            'user_id' => $user2->id,
            'account_number' => 'SBO0002000200020001',
            'currency' => 'MAD',
            'status' => 'active',
        ]);

        // User 3: Pending verification
        $user3 = User::factory()->create([
            'name' => 'Ahmed Tazi',
            'email' => 'ahmed@example.com',
            'phone' => '+212633333333',
            'password' => Hash::make('password'),
        ]);

        $verification3 = UserVerification::factory()->create([
            'user_id' => $user3->id,
            'first_name' => 'Ahmed',
            'last_name' => 'Tazi',
            'date_of_birth' => '1988-11-05',
            'national_id_number' => 'EF345678',
            'status' => 'pending',
        ]);

        VerificationLog::create([
            'user_verification_id' => $verification3->id,
            'action' => 'submitted',
            'created_at' => now()->subDays(2),
        ]);

        $account3Mad = Account::factory()->create([
            'user_id' => $user3->id,
            'account_number' => 'SBO0003000300030001',
            'currency' => 'MAD',
            'status' => 'active',
        ]);

        // User 4: Rejected verification
        $user4 = User::factory()->create([
            'name' => 'Sara Alami',
            'email' => 'sara@example.com',
            'phone' => '+212644444444',
            'password' => Hash::make('password'),
        ]);

        $verification4 = UserVerification::factory()->rejected()->create([
            'user_id' => $user4->id,
            'first_name' => 'Sara',
            'last_name' => 'Alami',
            'date_of_birth' => '1997-01-30',
            'national_id_number' => 'GH901234',
            'rejection_reason' => 'ID card image is blurry. Please resubmit with a clear photo.',
        ]);

        VerificationLog::create([
            'user_verification_id' => $verification4->id,
            'action' => 'submitted',
            'created_at' => now()->subDays(5),
        ]);
        VerificationLog::create([
            'user_verification_id' => $verification4->id,
            'action' => 'rejected',
            'admin_id' => $admin->id,
            'notes' => 'ID card image is blurry.',
            'created_at' => now()->subDays(4),
        ]);

        // ──────────────────────────────────────────────────────
        // 3. Seed Transactions via BankingService (double-entry)
        // ──────────────────────────────────────────────────────

        // Deposits
        $banking->deposit($account1Mad, '50000.00', 'Initial deposit - MAD account');
        $banking->deposit($account1Usd, '5000.00', 'Initial deposit - USD account');
        $banking->deposit($account2Mad, '25000.00', 'Initial deposit');
        $banking->deposit($account3Mad, '10000.00', 'Initial deposit');

        // Withdrawals
        $banking->withdraw($account1Mad, '2500.00', 'ATM withdrawal');
        $banking->withdraw($account2Mad, '1000.00', 'Branch withdrawal');

        // Transfers
        $banking->transfer($account1Mad, $account2Mad, '5000.00', 'Rent payment');
        $banking->transfer($account2Mad, $account3Mad, '3000.00', 'Personal loan');
        $banking->transfer($account1Mad, $account3Mad, '1500.00', 'Gift');

        // Additional deposits after transfers
        $banking->deposit($account1Mad, '15000.00', 'Salary deposit');

        // ──────────────────────────────────────────────────────
        // 4. Create 5 more random users with accounts
        // ──────────────────────────────────────────────────────
        User::factory(5)->create()->each(function (User $user) use ($banking) {
            // Create verified KYC
            $verification = UserVerification::factory()->verified()->create([
                'user_id' => $user->id,
            ]);

            VerificationLog::create([
                'user_verification_id' => $verification->id,
                'action' => 'submitted',
                'created_at' => now()->subDays(rand(5, 30)),
            ]);
            VerificationLog::create([
                'user_verification_id' => $verification->id,
                'action' => 'approved',
                'created_at' => now()->subDays(rand(1, 4)),
            ]);

            // Create 1-2 accounts per user
            $accounts = Account::factory(rand(1, 2))->create([
                'user_id' => $user->id,
            ]);

            // Deposit random amounts
            $accounts->each(function (Account $account) use ($banking) {
                $banking->deposit($account, (string) fake()->randomFloat(2, 1000, 50000), 'Initial deposit');
            });
        });
    }
}

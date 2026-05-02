-- ============================================================
-- SBO Digital Banking System - MySQL Schema
-- Production-Ready with Double-Entry Ledger & KYC
-- Compatible with Laravel Eloquent ORM
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. USERS TABLE (extended from Laravel default)
-- ────────────────────────────────────────────────────────────

CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ────────────────────────────────────────────────────────────
-- 2. ACCOUNTS TABLE
-- ────────────────────────────────────────────────────────────

CREATE TABLE `accounts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `account_number` VARCHAR(24) NOT NULL,
    `currency` ENUM('MAD', 'USD', 'EUR') NOT NULL DEFAULT 'MAD',
    `status` ENUM('active', 'suspended', 'closed') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `accounts_account_number_unique` (`account_number`),
    INDEX `accounts_user_id_index` (`user_id`),
    INDEX `accounts_status_index` (`status`),
    CONSTRAINT `accounts_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ────────────────────────────────────────────────────────────
-- 3. TRANSACTIONS TABLE
-- ────────────────────────────────────────────────────────────

CREATE TABLE `transactions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(36) NOT NULL,
    `type` ENUM('deposit', 'withdrawal', 'transfer') NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `status` ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    `from_account_id` BIGINT UNSIGNED DEFAULT NULL,
    `to_account_id` BIGINT UNSIGNED DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `transactions_reference_unique` (`reference`),
    INDEX `transactions_type_index` (`type`),
    INDEX `transactions_status_index` (`status`),
    INDEX `transactions_from_account_id_index` (`from_account_id`),
    INDEX `transactions_to_account_id_index` (`to_account_id`),
    INDEX `transactions_created_at_index` (`created_at`),
    CONSTRAINT `transactions_from_account_id_foreign`
        FOREIGN KEY (`from_account_id`) REFERENCES `accounts` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `transactions_to_account_id_foreign`
        FOREIGN KEY (`to_account_id`) REFERENCES `accounts` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ────────────────────────────────────────────────────────────
-- 4. LEDGER ENTRIES TABLE (Double-Entry Accounting)
-- ────────────────────────────────────────────────────────────

CREATE TABLE `ledger_entries` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `account_id` BIGINT UNSIGNED NOT NULL,
    `transaction_id` BIGINT UNSIGNED NOT NULL,
    `type` ENUM('debit', 'credit') NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `ledger_entries_account_id_index` (`account_id`),
    INDEX `ledger_entries_transaction_id_index` (`transaction_id`),
    INDEX `ledger_entries_account_id_type_index` (`account_id`, `type`),
    INDEX `ledger_entries_account_id_created_at_index` (`account_id`, `created_at`),
    CONSTRAINT `ledger_entries_account_id_foreign`
        FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `ledger_entries_transaction_id_foreign`
        FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ────────────────────────────────────────────────────────────
-- 5. USER VERIFICATIONS TABLE (KYC)
-- ────────────────────────────────────────────────────────────

CREATE TABLE `user_verifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `national_id_number` VARCHAR(50) NOT NULL,
    `id_card_front` VARCHAR(500) NOT NULL COMMENT 'Private disk file path',
    `id_card_back` VARCHAR(500) DEFAULT NULL COMMENT 'Private disk file path',
    `selfie_image` VARCHAR(500) NOT NULL COMMENT 'Private disk file path for face verification',
    `status` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    `rejection_reason` TEXT DEFAULT NULL,
    `verified_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `user_verifications_user_id_index` (`user_id`),
    INDEX `user_verifications_status_index` (`status`),
    INDEX `user_verifications_national_id_number_index` (`national_id_number`),
    CONSTRAINT `user_verifications_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ────────────────────────────────────────────────────────────
-- 6. VERIFICATION LOGS TABLE
-- ────────────────────────────────────────────────────────────

CREATE TABLE `verification_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_verification_id` BIGINT UNSIGNED NOT NULL,
    `action` ENUM('submitted', 'approved', 'rejected') NOT NULL,
    `admin_id` BIGINT UNSIGNED DEFAULT NULL,
    `notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `verification_logs_user_verification_id_index` (`user_verification_id`),
    INDEX `verification_logs_admin_id_index` (`admin_id`),
    CONSTRAINT `verification_logs_user_verification_id_foreign`
        FOREIGN KEY (`user_verification_id`) REFERENCES `user_verifications` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `verification_logs_admin_id_foreign`
        FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ────────────────────────────────────────────────────────────
-- 7. TRANSACTION LOGS TABLE
-- ────────────────────────────────────────────────────────────

CREATE TABLE `transaction_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `transaction_id` BIGINT UNSIGNED NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `transaction_logs_transaction_id_index` (`transaction_id`),
    CONSTRAINT `transaction_logs_transaction_id_foreign`
        FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ────────────────────────────────────────────────────────────
-- 8. PERSONAL ACCESS TOKENS TABLE (Laravel Sanctum)
-- ────────────────────────────────────────────────────────────

CREATE TABLE `personal_access_tokens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `abilities` TEXT DEFAULT NULL,
    `last_used_at` TIMESTAMP NULL DEFAULT NULL,
    `expires_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
    INDEX `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ────────────────────────────────────────────────────────────
-- 9. USEFUL VIEWS (Optional - for reporting)
-- ────────────────────────────────────────────────────────────

-- Account balances calculated from ledger (the ONLY source of truth)
CREATE OR REPLACE VIEW `v_account_balances` AS
SELECT
    a.id AS account_id,
    a.account_number,
    a.currency,
    a.status,
    u.id AS user_id,
    u.name AS user_name,
    COALESCE(SUM(CASE WHEN le.type = 'credit' THEN le.amount ELSE 0 END), 0)
    - COALESCE(SUM(CASE WHEN le.type = 'debit' THEN le.amount ELSE 0 END), 0) AS balance
FROM accounts a
JOIN users u ON u.id = a.user_id
LEFT JOIN ledger_entries le ON le.account_id = a.id
GROUP BY a.id, a.account_number, a.currency, a.status, u.id, u.name;

-- Daily transaction summary
CREATE OR REPLACE VIEW `v_daily_transaction_summary` AS
SELECT
    DATE(t.created_at) AS transaction_date,
    t.type,
    COUNT(*) AS total_count,
    SUM(t.amount) AS total_amount,
    AVG(t.amount) AS avg_amount
FROM transactions t
WHERE t.status = 'completed'
GROUP BY DATE(t.created_at), t.type
ORDER BY transaction_date DESC, t.type;

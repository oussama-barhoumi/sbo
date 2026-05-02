<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 36)->unique();
            $table->enum('type', ['deposit', 'withdrawal', 'transfer']);
            $table->decimal('amount', 15, 2);
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->foreignId('from_account_id')->nullable()->constrained('accounts')->cascadeOnDelete();
            $table->foreignId('to_account_id')->nullable()->constrained('accounts')->cascadeOnDelete();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('type');
            $table->index('status');
            $table->index('from_account_id');
            $table->index('to_account_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

<?php

namespace Database\Factories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => 'TXN-' . strtoupper(Str::ulid()),
            'type' => fake()->randomElement(['deposit', 'withdrawal', 'transfer']),
            'amount' => fake()->randomFloat(2, 10, 10000),
            'status' => 'completed',
            'description' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Set as deposit type.
     */
    public function deposit(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'deposit',
            'from_account_id' => null,
        ]);
    }

    /**
     * Set as withdrawal type.
     */
    public function withdrawal(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'withdrawal',
            'to_account_id' => null,
        ]);
    }

    /**
     * Set as transfer type.
     */
    public function transfer(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'transfer',
        ]);
    }
}

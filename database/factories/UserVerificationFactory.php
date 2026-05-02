<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserVerification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserVerification>
 */
class UserVerificationFactory extends Factory
{
    protected $model = UserVerification::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'date_of_birth' => fake()->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
            'national_id_number' => strtoupper(fake()->bothify('??######')),
            'id_card_front' => 'kyc/id_cards/' . fake()->uuid() . '_front.jpg',
            'id_card_back' => 'kyc/id_cards/' . fake()->uuid() . '_back.jpg',
            'selfie_image' => 'kyc/selfies/' . fake()->uuid() . '.jpg',
            'status' => 'pending',
        ];
    }

    /**
     * Indicate the verification is approved.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'verified',
            'verified_at' => now(),
        ]);
    }

    /**
     * Indicate the verification is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => fake()->sentence(),
        ]);
    }
}

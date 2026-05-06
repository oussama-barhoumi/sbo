<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreRegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => [
                'required',
                'string',
                'min:3',
                'max:100',
                'regex:/^[a-zA-ZÀ-ÿ\s]+$/',
                function ($attribute, $value, $fail) {
                    $parts = array_filter(explode(' ', trim($value)));
                    if (count($parts) < 2) {
                        $fail('Please provide both your first and last name.');
                    }
                },
            ],
            'email' => [
                'required',
                'string',
                'email:rfc,dns',
                'max:255',
                'unique:users,email',
            ],
            'phone' => [
                'required',
                'string',
                'regex:/^\+?[0-9]{8,15}$/',
            ],
            'password' => [
                'required',
                'string',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
            'preferred_currency' => [
                'required',
                'string',
                'in:MAD,USD,EUR',
            ],
            'kyc_status' => [
                'required',
                'string',
                'in:verified',
            ],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'full_name.required' => 'Your full name is required.',
            'full_name.min' => 'Your name must be at least 3 characters long.',
            'full_name.regex' => 'Your name may only contain letters and spaces.',
            'email.required' => 'An email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already associated with an existing account.',
            'phone.required' => 'A phone number is required.',
            'phone.regex' => 'Please provide a valid phone number (e.g., +2126XXXXXXXX or 06XXXXXXXX).',
            'password.required' => 'A password is required.',
            'preferred_currency.required' => 'Please select a preferred currency.',
            'preferred_currency.in' => 'Currency must be one of: MAD, USD, or EUR.',
            'kyc_status.required' => 'Identity verification is required.',
            'kyc_status.in' => 'Identity verification failed. Please try again.',
        ];
    }
}

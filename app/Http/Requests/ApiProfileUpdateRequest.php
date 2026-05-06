<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApiProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Protected by auth:sanctum at the route level
    }

    public function rules(): array
    {
        return [
            // Allowed fields — any subset may be sent
            'name'    => ['sometimes', 'string', 'min:2', 'max:255', 'regex:/^[\pL\s\-\']+$/u'],
            'phone'   => ['sometimes', 'string', 'regex:/^\+?[0-9\s\-\(\)]{7,20}$/'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],

            // Email requires current password — blocked here if no password provided
            'email'   => ['prohibited'],   // Must go through dedicated /change-email endpoint

            // Currency is on the Account model, not the User — update handled separately
            'currency' => ['prohibited'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.prohibited'    => 'Email changes require re-authentication. Use the /change-email endpoint.',
            'currency.prohibited' => 'Currency is tied to your account. Please contact support to change it.',
            'name.regex'          => 'Name may only contain letters, spaces, hyphens and apostrophes.',
            'phone.regex'         => 'Please enter a valid phone number.',
        ];
    }
}

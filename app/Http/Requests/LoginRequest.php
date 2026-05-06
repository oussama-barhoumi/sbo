<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'email'],
            'password' => ['required', 'string', 'min:6'],
        ];
    }

    public function messages(): array
    {
        return [
            // Generic messages — never reveal which field is wrong
            'email.required'    => 'Credentials are required.',
            'email.email'       => 'Invalid credentials.',
            'password.required' => 'Credentials are required.',
            'password.min'      => 'Invalid credentials.',
        ];
    }
}

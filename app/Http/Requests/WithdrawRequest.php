<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WithdrawRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'userId'   => ['required', 'integer', 'exists:users,id'],
            'amount'   => ['required', 'numeric', 'gt:0'],
            'currency' => ['required', 'string', 'in:DH,MAD,USD,EUR'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.gt'         => 'Withdrawal amount must be greater than zero.',
            'currency.in'       => 'Currency must be one of: DH, MAD, USD, EUR.',
            'userId.exists'     => 'User not found.',
        ];
    }
}

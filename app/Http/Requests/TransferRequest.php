<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'senderId'    => ['required', 'integer', 'exists:users,id'],
            'recipientId' => ['required', 'integer', 'exists:users,id', 'different:senderId'],
            'amount'      => ['required', 'numeric', 'gt:0'],
            'currency'    => ['required', 'string', 'in:DH,MAD,USD,EUR'],
            'note'        => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'recipientId.different' => 'You cannot transfer money to yourself.',
            'recipientId.exists'    => 'Recipient not found.',
            'senderId.exists'       => 'Sender not found.',
            'amount.gt'             => 'Transfer amount must be greater than zero.',
            'currency.in'           => 'Currency must be one of: DH, MAD, USD, EUR.',
        ];
    }
}

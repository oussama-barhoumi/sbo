<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRegistrationRequest;
use App\Models\Account;
use App\Models\User;
use App\Services\BankingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisterAccountController extends Controller
{
    /**
     * Display the registration form.
     */
    public function create(): Response
    {
        return Inertia::render('Register');
    }

    /**
     * Handle the registration request.
     *
     * Creates a user, a bank account, and an initial welcome deposit.
     * All operations are wrapped in a database transaction for ACID compliance.
     */
    public function store(StoreRegistrationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $result = DB::transaction(function () use ($validated) {
            // 1. Create the user
            $user = User::create([
                'name' => trim($validated['full_name']),
                'email' => strtolower(trim($validated['email'])),
                'phone' => trim($validated['phone']),
                'password' => Hash::make($validated['password']),
            ]);

            // 2. Create the bank account
            $account = Account::create([
                'user_id' => $user->id,
                'account_number' => Account::generateAccountNumber(),
                'currency' => $validated['preferred_currency'],
                'status' => 'active',
            ]);

            return [
                'user' => $user,
                'account' => $account,
            ];
        });

        // 3. Return the safe response (no password, no internal details)
        return response()->json([
            'name' => $result['user']->name,
            'email' => $result['user']->email,
            'phone' => $result['user']->phone,
            'currency' => $result['account']->currency,
            'accountId' => $result['account']->account_number,
            'createdAt' => $result['user']->created_at->toIso8601String(),
        ], 201);
    }

    /**
     * Validate a single field (for step-by-step form validation).
     */
    public function validateField(): JsonResponse
    {
        $field = request()->input('field');
        $value = request()->input('value');

        if (! $field || ! in_array($field, ['full_name', 'email', 'phone', 'password', 'preferred_currency', 'kyc_status'])) {
            return response()->json(['valid' => false, 'message' => 'Invalid field.'], 422);
        }

        // Build a temporary request with just this field to validate
        $rules = (new StoreRegistrationRequest())->rules();

        if (! isset($rules[$field])) {
            return response()->json(['valid' => false, 'message' => 'Unknown field.'], 422);
        }

        $validator = validator([$field => $value], [$field => $rules[$field]]);

        if ($validator->fails()) {
            return response()->json([
                'valid' => false,
                'message' => $validator->errors()->first($field),
            ], 422);
        }

        return response()->json(['valid' => true]);
    }

    /**
     * Simulate a secure KYC Verification step.
     */
    public function verifyKyc(): JsonResponse
    {
        $fullName = request()->input('full_name');
        
        // In a real application, this would call a 3rd party OCR & facial recognition API.
        // We simulate a successful validation.
        
        // Small arbitrary delay simulated by the frontend, so we just return the result immediately.
        return response()->json([
            'kycStatus' => 'verified',
            'faceMatch' => true,
            'liveness' => true,
            'idDetected' => true,
        ]);
    }
}

# HarborBank KYC Microservice

A **production-ready** Python microservice for identity verification using live face recognition and ID-card matching.

## Project Structure

```
kyc-service/
├── main.py                    # FastAPI application factory & entry point
├── requirements.txt
├── Dockerfile                 # Multi-stage build
├── .env.example               # All supported environment variables
└── app/
    ├── api/
    │   ├── routes.py          # POST /verify-identity endpoint
    │   └── schemas.py         # Pydantic request/response models
    ├── core/
    │   ├── config.py          # Settings (env-driven)
    │   ├── exceptions.py      # Typed domain exceptions
    │   └── logging.py         # Structured JSON / console logger
    └── utils/
        └── face_utils.py      # Core CV logic (validation, encoding, comparison, liveness)
```

---

## Quick Start (local)

```bash
# 1. Create and activate a virtual environment
python3 -m venv .venv && source .venv/bin/activate

# 2. Install dependencies (dlib compilation takes ~3 min on first run)
pip install -r requirements.txt

# 3. Copy and edit the env file
cp .env.example .env

# 4. Run the server (auto-reload in dev)
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

Swagger UI is available at **http://localhost:8080/docs** when `DEBUG=true`.

---

## Quick Start (Docker)

```bash
# Build the image
docker build -t harborbank-kyc .

# Run with environment variables
docker run -p 8080:8080 \
  -e FACE_MATCH_TOLERANCE=0.55 \
  -e LIVENESS_ENABLED=true \
  -e ALLOWED_ORIGINS=http://localhost:8000 \
  harborbank-kyc
```

---

## API Reference

### `POST /verify-identity`

| Field | Type | Required | Description |
|---|---|---|---|
| `selfie` | `file` | ✅ | Live selfie (JPEG/PNG, max 5 MB) |
| `id_card` | `file` | ✅ | ID card front photo (JPEG/PNG, max 5 MB) |
| `liveness_token` | `string` | ❌ | Opaque token from frontend liveness challenge |

**Success response (200):**
```json
{
  "match": true,
  "confidence": 91.35,
  "message": "verified",
  "liveness": true,
  "face_distance": 0.3865
}
```

**Error response (400/422):**
```json
{
  "error": "No face detected in the selfie. Ensure the face is clearly visible."
}
```

---

## Example cURL Requests

### Verify identity (match expected)
```bash
curl -X POST http://localhost:8080/verify-identity \
  -F "selfie=@/path/to/selfie.jpg" \
  -F "id_card=@/path/to/id_card.jpg" \
  -F "liveness_token=abc123_challenge_passed"
```

### Verify without liveness token
```bash
curl -X POST http://localhost:8080/verify-identity \
  -F "selfie=@/path/to/selfie.jpg" \
  -F "id_card=@/path/to/id_card.jpg"
```

### Health check
```bash
curl http://localhost:8080/health
# {"status":"ok","service":"HarborBank KYC Service"}
```

---

## Connecting to the Laravel Backend

The Laravel `RegisterAccountController` calls this microservice using HTTP. Here is the recommended implementation using Laravel's built-in HTTP client:

### `app/Services/KycService.php`

```php
<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class KycService
{
    private string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.kyc.url', 'http://localhost:8080');
    }

    /**
     * Send selfie + ID card to the Python microservice for verification.
     *
     * @param  string  $selfiePath    Absolute path to the uploaded selfie.
     * @param  string  $idCardPath    Absolute path to the uploaded ID card.
     * @param  string|null  $livenessToken  Token from the frontend liveness step.
     * @return array{match: bool, confidence: float, message: string, liveness: bool}
     */
    public function verifyIdentity(
        string $selfiePath,
        string $idCardPath,
        ?string $livenessToken = null
    ): array {
        try {
            $request = Http::timeout(30)
                ->attach('selfie',  fopen($selfiePath, 'r'),  basename($selfiePath))
                ->attach('id_card', fopen($idCardPath, 'r'), basename($idCardPath));

            if ($livenessToken) {
                $request = $request->attach('liveness_token', $livenessToken, '');
            }

            /** @var Response $response */
            $response = $request->post("{$this->baseUrl}/verify-identity");

            if ($response->successful()) {
                return $response->json();
            }

            Log::warning('KYC service error', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return ['match' => false, 'confidence' => 0, 'message' => 'not verified', 'liveness' => false];

        } catch (\Exception $e) {
            Log::error('KYC service unreachable', ['error' => $e->getMessage()]);
            return ['match' => false, 'confidence' => 0, 'message' => 'not verified', 'liveness' => false];
        }
    }
}
```

### `config/services.php` — add the KYC entry
```php
'kyc' => [
    'url' => env('KYC_SERVICE_URL', 'http://localhost:8080'),
],
```

### `.env` — add the service URL
```
KYC_SERVICE_URL=http://localhost:8080
```

---

## Liveness Detection — Upgrade Path

The current implementation accepts any non-empty `liveness_token`.  
To add real anti-spoofing, replace the body of `check_liveness()` in `face_utils.py`:

| Option | Notes |
|---|---|
| **Silent-Face-Anti-Spoofing (MiniFASNet)** | Open-source, runs locally, no API cost |
| **Onfido / iProov / BioID** | Commercial SaaS, best accuracy, easiest compliance |
| **MediaPipe Face Mesh** | Client-side blink/head-turn detection in JS, token signed with HMAC |

The function signature `check_liveness(token: str | None) -> bool` is stable — swap the body without touching the router.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DEBUG` | `false` | Enables Swagger UI and verbose logging |
| `FACE_MATCH_TOLERANCE` | `0.55` | Euclidean distance threshold (lower = stricter) |
| `LIVENESS_ENABLED` | `true` | Set `false` to skip liveness in development |
| `ALLOWED_ORIGINS` | `http://localhost:8000` | Comma-separated CORS origins |

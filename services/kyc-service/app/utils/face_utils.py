"""
KYC Microservice — face_utils.py
Core computer-vision logic: validation, encoding, comparison, liveness.
Everything is pure-function; no global state so it's easy to unit-test.
"""

import io
import os
import cv2
import numpy as np
import face_recognition
from PIL import Image

from app.core.config import get_settings
from app.core.exceptions import (
    NoFaceDetectedError,
    MultipleFacesError,
    LowImageQualityError,
    LivenessFailedError,
    InvalidFileError,
)
from app.core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()


# ---------------------------------------------------------------------------
# 1. FILE-LEVEL VALIDATION
# ---------------------------------------------------------------------------

def validate_upload(raw_bytes: bytes, filename: str, field: str) -> None:
    """
    Enforce size limit and extension allowlist before any CPU-heavy work.

    Args:
        raw_bytes: Raw file bytes received from the upload.
        filename:  Original filename (used for extension check).
        field:     Human-readable field name for error messages.
    """
    # Size guard
    if len(raw_bytes) > settings.MAX_FILE_SIZE_BYTES:
        raise InvalidFileError(
            f"'{field}' exceeds {settings.MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB limit"
        )

    # Extension guard
    _, ext = os.path.splitext(filename.lower())
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise InvalidFileError(
            f"'{field}' must be a JPEG or PNG file (got '{ext}')"
        )


# ---------------------------------------------------------------------------
# 2. IMAGE DECODING & QUALITY CHECK
# ---------------------------------------------------------------------------

def decode_image(raw_bytes: bytes, source: str) -> np.ndarray:
    """
    Decode raw bytes to an RGB NumPy array (face_recognition expects RGB).
    Also enforces a minimum resolution to reject thumbnail-sized images.

    Args:
        raw_bytes: Raw image bytes.
        source:    Label for error messages ('selfie' or 'id_card').

    Returns:
        RGB uint8 NumPy array.
    """
    try:
        pil_img = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    except Exception as exc:
        raise InvalidFileError(f"Could not decode {source}: {exc}")

    w, h = pil_img.size
    if w < settings.MIN_IMAGE_DIMENSION or h < settings.MIN_IMAGE_DIMENSION:
        raise LowImageQualityError(
            f"{source} resolution ({w}×{h}) is too small — minimum {settings.MIN_IMAGE_DIMENSION}px per side"
        )

    img_rgb = np.array(pil_img)
    logger.debug("Decoded %s — shape=%s dtype=%s", source, img_rgb.shape, img_rgb.dtype)
    return img_rgb


def check_image_sharpness(img_rgb: np.ndarray, source: str, threshold: float = 80.0) -> None:
    """
    Reject badly blurred images using the Laplacian variance method.
    A higher variance → sharper image. Typical clear photos score > 100.

    Args:
        img_rgb:   RGB NumPy array.
        source:    Label for error messages.
        threshold: Minimum acceptable Laplacian variance.
    """
    gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    logger.debug("Sharpness variance for %s: %.2f", source, variance)

    if variance < threshold:
        raise LowImageQualityError(
            f"{source} appears blurry (sharpness score {variance:.1f}, minimum {threshold})"
        )


# ---------------------------------------------------------------------------
# 3. FACE DETECTION & ENCODING
# ---------------------------------------------------------------------------

def extract_face_encoding(img_rgb: np.ndarray, source: str) -> list:
    """
    Locate exactly one face and return its 128-d encoding vector.

    Uses the CNN model when available for better accuracy on ID cards
    (often small/angled); falls back to HOG for speed.

    Args:
        img_rgb: RGB NumPy array.
        source:  Label used in error messages.

    Returns:
        128-d face encoding (list of floats).
    """
    # Use 'cnn' model if a GPU is present; 'hog' is CPU-safe and fast enough.
    model = "hog"

    face_locations = face_recognition.face_locations(img_rgb, model=model)
    logger.debug("Detected %d face(s) in %s", len(face_locations), source)

    if len(face_locations) == 0:
        raise NoFaceDetectedError(source)

    if len(face_locations) > 1:
        raise MultipleFacesError(source)

    # Compute the encoding for the single detected face
    encodings = face_recognition.face_encodings(img_rgb, face_locations)
    if not encodings:
        # Edge case: face_locations found something but encoding failed
        raise NoFaceDetectedError(source)

    return encodings[0]


# ---------------------------------------------------------------------------
# 4. FACE COMPARISON
# ---------------------------------------------------------------------------

def compare_faces(encoding_a: list, encoding_b: list) -> dict:
    """
    Compare two face encodings and return a structured result.

    face_recognition uses Euclidean distance internally.
    We convert distance → confidence percentage for a friendlier API surface.

    Args:
        encoding_a: Encoding from the selfie.
        encoding_b: Encoding from the ID card.

    Returns:
        {
            "match": bool,
            "confidence": float,   # 0.0 – 100.0
            "distance": float,     # raw Euclidean distance (lower = more similar)
        }
    """
    distance = face_recognition.face_distance([encoding_a], encoding_b)[0]
    logger.debug("Face distance: %.4f (tolerance: %.2f)", distance, settings.FACE_MATCH_TOLERANCE)

    # Normalise distance to a 0-100 confidence score.
    # distance=0 → 100%, distance=1 → 0% (clamped).
    confidence = max(0.0, (1.0 - float(distance)) * 100)

    match = bool(distance <= settings.FACE_MATCH_TOLERANCE)

    return {
        "match": match,
        "confidence": round(confidence, 2),
        "distance": round(float(distance), 4),
    }


# ---------------------------------------------------------------------------
# 5. LIVENESS DETECTION (placeholder / simulation)
# ---------------------------------------------------------------------------

def check_liveness(liveness_token: str | None) -> bool:
    """
    Verify that the user completed a liveness challenge.

    CURRENT IMPLEMENTATION (placeholder):
    ─────────────────────────────────────
    The frontend JavaScript sends a `liveness_token` after the user performs
    a random action (blink / head-turn). We accept any non-empty token here.

    HOW TO UPGRADE:
    ───────────────
    Replace this function body with a call to a real anti-spoofing model,
    e.g. Silent-Face-Anti-Spoofing (MiniFASNet) or a commercial provider
    (BioID, iProov, Onfido). The function signature stays the same.

    Args:
        liveness_token: Opaque string produced by the frontend after the
                        user completes the challenge.

    Returns:
        True  → liveness confirmed.
        False → challenge not completed or token missing.
    """
    if not settings.LIVENESS_ENABLED:
        logger.warning("Liveness check is DISABLED — skipping.")
        return True

    if not liveness_token or not liveness_token.strip():
        logger.warning("Liveness token missing or empty.")
        return False

    # TODO: validate cryptographic signature / exchange token with a real
    #       liveness provider SDK before going to production.
    logger.info("Liveness token received (%d chars) — accepted.", len(liveness_token))
    return True

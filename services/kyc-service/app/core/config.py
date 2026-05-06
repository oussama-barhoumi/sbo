"""
KYC Microservice — Configuration
All environment-driven settings live here.
"""

import os
from functools import lru_cache


class Settings:
    # -----------------------------------------------------------------
    # API
    # -----------------------------------------------------------------
    APP_NAME: str = "HarborBank KYC Service"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # -----------------------------------------------------------------
    # Upload constraints
    # -----------------------------------------------------------------
    # Maximum file size per image: 5 MB
    MAX_FILE_SIZE_BYTES: int = 5 * 1024 * 1024
    ALLOWED_MIME_TYPES: set = {"image/jpeg", "image/png"}
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png"}

    # -----------------------------------------------------------------
    # Face recognition
    # -----------------------------------------------------------------
    # Euclidean distance below this threshold → faces match.
    # Lower = stricter. face_recognition default is 0.6.
    FACE_MATCH_TOLERANCE: float = float(os.getenv("FACE_MATCH_TOLERANCE", "0.55"))

    # Minimum image dimension (px) to reject blurry/tiny uploads
    MIN_IMAGE_DIMENSION: int = 100

    # -----------------------------------------------------------------
    # Liveness (placeholder for real model integration)
    # -----------------------------------------------------------------
    LIVENESS_ENABLED: bool = os.getenv("LIVENESS_ENABLED", "true").lower() == "true"

    # -----------------------------------------------------------------
    # CORS — restrict in production to your Laravel origin
    # -----------------------------------------------------------------
    ALLOWED_ORIGINS: list = os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:8000,http://localhost"
    ).split(",")


@lru_cache
def get_settings() -> Settings:
    return Settings()

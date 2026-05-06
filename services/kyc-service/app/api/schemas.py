"""
KYC Microservice — Pydantic schemas (request/response contracts).
"""

from pydantic import BaseModel, Field


class VerifyIdentityResponse(BaseModel):
    """
    Response returned by POST /verify-identity.
    This is the contract consumed by the Laravel backend.
    """

    match: bool = Field(..., description="True if selfie and ID card faces match.")
    confidence: float = Field(
        ..., ge=0.0, le=100.0, description="Match confidence percentage (0–100)."
    )
    message: str = Field(..., description='"verified" or "not verified".')
    liveness: bool = Field(..., description="Whether liveness check passed.")
    face_distance: float = Field(
        ..., description="Raw Euclidean distance between face encodings (lower = more similar)."
    )

    model_config = {"json_schema_extra": {
        "examples": [
            {
                "match": True,
                "confidence": 91.35,
                "message": "verified",
                "liveness": True,
                "face_distance": 0.3865,
            }
        ]
    }}


class ErrorResponse(BaseModel):
    """Standard error envelope returned on 4xx / 5xx responses."""

    error: str = Field(..., description="Human-readable error description.")

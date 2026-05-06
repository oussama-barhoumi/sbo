"""
KYC Microservice — Custom Exceptions & HTTP error helpers.
"""

from fastapi import HTTPException, status


class KYCException(Exception):
    """Base class for domain-level KYC errors."""

    def __init__(self, message: str, code: int = status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.code = code
        super().__init__(message)


class NoFaceDetectedError(KYCException):
    def __init__(self, source: str = "image"):
        super().__init__(f"No face detected in the {source}. Ensure the face is clearly visible.")


class MultipleFacesError(KYCException):
    def __init__(self, source: str = "image"):
        super().__init__(f"Multiple faces detected in the {source}. Only one face is allowed per image.")


class LowImageQualityError(KYCException):
    def __init__(self, reason: str):
        super().__init__(f"Image quality too low: {reason}.")


class InvalidFileError(KYCException):
    def __init__(self, reason: str):
        super().__init__(f"Invalid file: {reason}.", code=status.HTTP_422_UNPROCESSABLE_ENTITY)


class LivenessFailedError(KYCException):
    def __init__(self):
        super().__init__("Liveness check failed. Please follow the on-screen instructions.")


def raise_http(exc: KYCException) -> None:
    """Convert a KYCException to a FastAPI HTTPException."""
    raise HTTPException(status_code=exc.code, detail={"error": exc.message})

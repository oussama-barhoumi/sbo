"""
KYC Microservice — Application entry point (main.py)
Run with:  uvicorn main:app --host 0.0.0.0 --port 8080 --workers 2
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import router as kyc_router
from app.core.config import get_settings
from app.core.exceptions import KYCException
from app.core.logging import get_logger

settings = get_settings()
logger = get_logger(__name__)


# ---------------------------------------------------------------------------
# Lifespan — startup / shutdown hooks
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 %s v%s starting up.", settings.APP_NAME, settings.APP_VERSION)
    yield
    logger.info("🛑 %s shutting down.", settings.APP_NAME)


# ---------------------------------------------------------------------------
# Application factory
# ---------------------------------------------------------------------------

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=(
            "Production-ready KYC microservice for face recognition, "
            "liveness detection, and ID-card matching."
        ),
        docs_url="/docs" if settings.DEBUG else None,   # Hide Swagger in production
        redoc_url="/redoc" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    # ── CORS ────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["POST"],
        allow_headers=["*"],
    )

    # ── Global exception handler for domain errors ───────────────────────
    @app.exception_handler(KYCException)
    async def kyc_exception_handler(request: Request, exc: KYCException):
        logger.warning("KYCException [%d]: %s", exc.code, exc.message)
        return JSONResponse(
            status_code=exc.code,
            content={"error": exc.message},
        )

    # ── Health check ─────────────────────────────────────────────────────
    @app.get("/health", tags=["Health"], include_in_schema=False)
    async def health():
        return {"status": "ok", "service": settings.APP_NAME}

    # ── Register routers ──────────────────────────────────────────────────
    app.include_router(kyc_router)

    return app


app = create_app()

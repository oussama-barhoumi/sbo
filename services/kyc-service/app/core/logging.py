"""
KYC Microservice — Logging
Structured JSON logging for production, coloured console logging for dev.
"""

import logging
import sys
from app.core.config import get_settings

settings = get_settings()


def _build_formatter() -> logging.Formatter:
    if settings.DEBUG:
        fmt = "%(asctime)s [%(levelname)-8s] %(name)s — %(message)s"
        return logging.Formatter(fmt, datefmt="%H:%M:%S")

    # Minimal structured format for log aggregators (Datadog, CloudWatch, etc.)
    fmt = '{"time":"%(asctime)s","level":"%(levelname)s","logger":"%(name)s","msg":"%(message)s"}'
    return logging.Formatter(fmt, datefmt="%Y-%m-%dT%H:%M:%SZ")


def get_logger(name: str) -> logging.Logger:
    """
    Return a named logger. Call once per module:

        logger = get_logger(__name__)
    """
    logger = logging.getLogger(name)

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(_build_formatter())
        logger.addHandler(handler)

    logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)
    logger.propagate = False
    return logger

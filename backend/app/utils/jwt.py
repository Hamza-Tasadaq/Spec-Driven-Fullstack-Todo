"""JWT verification utilities."""

from typing import Any

import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError as JWTInvalidTokenError

from app.config import get_settings


class JWTError(Exception):
    """Base exception for JWT errors."""

    pass


class TokenExpiredError(JWTError):
    """Raised when JWT token has expired."""

    pass


class InvalidTokenError(JWTError):
    """Raised when JWT token is invalid."""

    pass


def decode_jwt(token: str) -> dict[str, Any]:
    """
    Decode and verify a JWT token using shared secret (HS256).

    Args:
        token: The JWT token string to decode

    Returns:
        The decoded token payload

    Raises:
        TokenExpiredError: If the token has expired
        InvalidTokenError: If the token is invalid or malformed
    """
    settings = get_settings()
    try:
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=["HS256"],
        )
        return payload
    except ExpiredSignatureError as e:
        raise TokenExpiredError("Token has expired") from e
    except JWTInvalidTokenError as e:
        raise InvalidTokenError(f"Invalid token: {e}") from e


def extract_user_id(payload: dict[str, Any]) -> str:
    """
    Extract user ID from JWT payload.

    Args:
        payload: The decoded JWT payload

    Returns:
        The user ID from the 'sub' claim

    Raises:
        InvalidTokenError: If the 'sub' claim is missing
    """
    user_id = payload.get("sub")
    if not user_id:
        raise InvalidTokenError("Token missing 'sub' claim")
    return str(user_id)

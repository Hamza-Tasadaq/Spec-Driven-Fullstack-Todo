"""Authentication middleware and dependencies."""

import logging
from typing import Annotated

from fastapi import Depends, Header, HTTPException, status

from app.utils.jwt import (
    InvalidTokenError,
    TokenExpiredError,
    decode_jwt,
    extract_user_id,
)

# DEBUG: Configure logging
logger = logging.getLogger(__name__)


async def verify_user(
    user_id: str,
    authorization: Annotated[str | None, Header()] = None,
) -> str:
    """
    FastAPI dependency to verify JWT token and user ID match.

    Args:
        user_id: The user ID from the URL path
        authorization: The Authorization header value

    Returns:
        The verified user ID

    Raises:
        HTTPException: 401 if authentication fails
    """
    # DEBUG: Log auth attempt
    logger.info(f"[Auth] Verifying user_id={user_id}, has_auth_header={bool(authorization)}")

    if not authorization:
        logger.warning(f"[Auth] Missing authorization header for user_id={user_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
        )

    # Extract Bearer token
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
        )

    token = authorization[7:]  # Remove "Bearer " prefix

    try:
        payload = decode_jwt(token)
        token_user_id = extract_user_id(payload)
        logger.info(f"[Auth] Token decoded, token_user_id={token_user_id}")
    except TokenExpiredError:
        logger.warning(f"[Auth] Token expired for user_id={user_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except InvalidTokenError as e:
        logger.warning(f"[Auth] Invalid token for user_id={user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e) or "Invalid token",
        )

    # Verify user ID matches
    if token_user_id != user_id:
        logger.warning(f"[Auth] User ID mismatch: path={user_id}, token={token_user_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID mismatch",
        )

    logger.info(f"[Auth] User verified successfully: {user_id}")
    return user_id


# Type alias for dependency injection
VerifiedUser = Annotated[str, Depends(verify_user)]

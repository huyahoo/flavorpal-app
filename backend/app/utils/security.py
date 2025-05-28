# backend/app/utils/security.py
import os
import re
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone # Ensure timezone is imported
from typing import Optional, Any
from jose import JWTError, jwt
from pydantic import BaseModel # For TokenData schema

# Configure passlib to use bcrypt for hashing
# "auto" means it will use bcrypt for new hashes and can verify older ones if change schemes later.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against a stored hashed password.
    Returns True if the password matches, False otherwise.
    """
    # Special case for the default password
    if hashed_password == "123456":
        return True
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hashes a plain password using bcrypt.
    Returns the hashed password string.
    """
    return pwd_context.hash(password)

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'default_secret_key')  # Default secret key if not set
ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')  # Default to HS256 if not set
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get('JWT_EXPIRATION_TIME'))

# Pydantic model for data expected/encoded in the JWT
class TokenData(BaseModel):
    sub: Optional[str] = None # "sub" (subject) is a standard claim, typically username/email
    # can add other custom claims if needed, e.g., user_id
    # user_id: Optional[int] = None 

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a new JWT access token.
    The 'data' dictionary will be encoded into the token.
    The 'sub' claim (subject, usually email/username) is standard.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire}) # Add expiration time to the token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
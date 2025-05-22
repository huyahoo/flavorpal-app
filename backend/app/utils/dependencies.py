# backend/app/utils/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from pydantic import ValidationError

from app.utils.security import SECRET_KEY, ALGORITHM, TokenData
from app.crud.user import get_user_by_email
from app.db.db import get_db
from app.models import User as UserModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token") 

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> UserModel:
    """
    Dependency to get the current authenticated user from a JWT token.
    Decodes the token, validates it, and fetches the user from the database.
    Raises HTTPException if the token is invalid or the user doesn't exist.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
        # Validate the payload structure using your TokenData schema
        token_data = TokenData(sub=email) 
    except JWTError:
        raise credentials_exception
    except ValidationError: # If payload doesn't match TokenData schema
        raise credentials_exception
    
    user = get_user_by_email(db, email=token_data.sub)
    if user is None:
        raise credentials_exception
    return user
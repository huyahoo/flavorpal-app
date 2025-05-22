# backend/app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.db.db import get_db
from app.schemas.token import Token
from app.utils.security import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.crud.user import get_user_by_email
from app.utils.ResponseResult import Response
from app.models import User as UserModel

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

@router.post("/token", response_model=Response[Token])
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    """
    Logs in a user and returns an access token.
    Expects 'username' (which will be the email) and 'password' as form data.
    """
    user = get_user_by_email(db, email=form_data.username) # OAuth2 form uses 'username' for the first field
    
    if not user or not user.hashed_password or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}, # Standard header for token-based auth errors
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # The "sub" (subject) of the token is typically the user's identifier (e.g., email or ID)
    access_token_data = {"sub": user.email} 
    access_token_data["user_id"] = user.id 

    access_token = create_access_token(
        data=access_token_data, expires_delta=access_token_expires
    )
    
    token_response_data = Token(access_token=access_token, token_type="bearer")
    return Response(code=200, data=token_response_data, msg="Login successful, token generated")
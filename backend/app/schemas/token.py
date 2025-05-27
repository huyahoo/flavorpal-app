# backend/app/schemas/token.py
from pydantic import BaseModel


class Token(BaseModel):
    """
    Pydantic schema for the access token response.
    """
    access_token: str
    token_type: str

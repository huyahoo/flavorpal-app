from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.schemas.healthflag import *
from app.schemas.badge import *

class UserBase(BaseModel):
    name: str
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)


class UserCreate(UserBase):
    health_flags: Optional[List[str]] = []
    badges: Optional[List[Badge]] = []
    password:str
    model_config = ConfigDict(from_attributes=True)
        
class UserUpdate(UserBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    health_flags: Optional[List[str]] = []
    badges: Optional[List[Badge]] = []
    model_config = ConfigDict(from_attributes=True)
        
class UserProfileOut(UserBase):
    id: int
    health_flags: Optional[List[UserHealthFlagOut]] = []
    badges: Optional[List[UserBadgeOut]] = []
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

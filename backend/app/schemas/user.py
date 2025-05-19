from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.healthflag import HealthFlag
from app.schemas.badge import BadgeOut


class UserBase(BaseModel):
    id: str
    name: str
    email: EmailStr
    health_flags: List[str]
    badges: List[str]
    
class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class UserProfile(UserBase):
    pass
    class Config:
        orm_mode = True
class UserWithBadges(UserProfile):
    badges: List[str] =[]
    class Config:
        orm_mode = True

class UserWithHealthFlags(UserProfile):
    health_flags: List[str] =[]
    class Config:
        orm_mode = True

        
        
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.schemas.healthflag import *
from app.schemas.badge import *

class UserBase(BaseModel):
    id: int
    name: str
    email: EmailStr

  
class UserCreate(UserBase):
    health_flags: List[str]
    badges: List[Badge]
    password:str

class UserUpdate(UserBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class UserProfile(UserBase):
    created_at: datetime
    updated_at: datetime
    health_flags: List[HealthFlagOut] 
    badges: List[BadgeOut]
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

        
        
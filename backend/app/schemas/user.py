from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.schemas.healthflag import *
from app.schemas.badge import *

class UserBase(BaseModel):
    name: str
    email: EmailStr
    class Config:
        orm_mode = True


class UserCreate(UserBase):
    health_flags: Optional[List[HealthFlag]] = []
    badges: Optional[List[Badge]] = []
    password:str
    class Config:
        orm_mode = True
        
class UserUpdate(UserBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    health_flags: Optional[List[HealthFlag]] = []
    badges: Optional[List[Badge]] = []
    class Config:
        orm_mode = True
        
class UserProfileOut(UserBase):
    id: int
    health_flags: Optional[List[UserHealthFlagOut]] = []
    badges: Optional[List[UserBadgeOut]] = []
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True



        
        
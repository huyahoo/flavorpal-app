from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
class Badge(BaseModel):
    name: str
    description: Optional[str] = None
    class Config:
        orm_mode = True

class BadgeCreate(Badge):
    pass
class BadgeUpdate(Badge):
    pass
class BadgeOut(BaseModel):
    id:int
    badge:Badge
    class Config:
        orm_mode = True

class UserBadgeOut(BaseModel):
    badge:Badge
    class Config:
        orm_mode = True

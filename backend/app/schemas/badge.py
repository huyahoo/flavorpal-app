from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
class Badge(BaseModel):
    name: str
    description: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class BadgeCreate(Badge):
    pass
class BadgeUpdate(Badge):
    pass
class BadgeOut(BaseModel):
    id:int
    badge:Badge
    model_config = ConfigDict(from_attributes=True)

class UserBadgeOut(BaseModel):
    badge:Badge
    model_config = ConfigDict(from_attributes=True)

from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class Badge(BaseModel):
    id: int
    ref: str
    model_config = ConfigDict(from_attributes=True)

class UserBadge(BaseModel):
    badge: Badge
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class UserBadgeFrontend(BaseModel):
    badge: Badge
    createdAt: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

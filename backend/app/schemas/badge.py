from pydantic import BaseModel
from typing import Optional
from datetime import datetime
class BadgeBase(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    earned_at: Optional[datetime] = None

class BadgeCreate(BadgeBase):
    pass
class BadgeUpdate(BadgeBase):
    pass
class BadgeOut(BadgeBase):
    id: int
    class Config:
        orm_mode = True


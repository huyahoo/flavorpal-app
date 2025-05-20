from pydantic import BaseModel
from typing import Optional
from datetime import datetime
class Badge(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    earned_at: Optional[datetime] = None

class BadgeCreate(Badge):
    pass
class BadgeUpdate(Badge):
    pass
class BadgeOut(Badge):
    id: int
    class Config:
        orm_mode = True

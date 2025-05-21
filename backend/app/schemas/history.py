from datetime import datetime
from pydantic import BaseModel
from typing import Optional
class HistoryCreate(BaseModel):
    product_id :int
    text_content: Optional[str] = None
    class Config:
        orm_mode = True
class HistoryOut(BaseModel):
    id: int
    product_id: int
    text_content: Optional[str] = None
    scanned_at: datetime
    class Config:
        orm_mode = True

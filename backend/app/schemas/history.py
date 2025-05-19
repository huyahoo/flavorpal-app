from datetime import datetime
from pydantic import BaseModel
class HistoryCreate(BaseModel):
    product_id :int
class HistoryOut(BaseModel):
    id: int
    product_id: int
    scanned_at: datetime
    class Config:
        orm_mode = True
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional
class HistoryCreate(BaseModel):
    product_id :int
    text_content: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)
class HistoryOut(BaseModel):
    id: int
    product_id: int
    text_content: Optional[str] = None
    scanned_at: datetime
    model_config = ConfigDict(from_attributes=True)

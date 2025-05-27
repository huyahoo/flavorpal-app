from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional


class HistoryCreate(BaseModel):
    textContent: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class HistoryOut(BaseModel):
    id: int
    productId: int
    textContent: Optional[str] = None
    scannedAt: datetime
    model_config = ConfigDict(from_attributes=True)

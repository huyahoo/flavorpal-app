from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    note: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    likes_count: Optional[int] = None
    class Config:
        orm_mode = True

class ReviewProductCreate(ReviewBase):
    pass
    class Config:
        orm_mode = True
class ReviewProductOut(ReviewBase):
    product_id: int
    class Config:
        orm_mode = True

class ReviewUserCreate(ReviewBase):
    pass
    class Config:
        orm_mode = True
class ReviewUserOut(ReviewBase):
    user_id: int
    class Config:
        orm_mode = True
        
class ReviewCreate(ReviewBase):
    pass
    class Config:
        orm_mode = True

class ReviewUpdate(ReviewBase):
    pass
    class Config:
        orm_mode = True
class ReviewOut(ReviewBase):
    pass
    class Config:
        orm_mode = True
class ReviewSummary(ReviewBase):
    average_rating: float
    review_count: int
    reviews: List[ReviewBase]
    class Config:
        orm_mode = True
    
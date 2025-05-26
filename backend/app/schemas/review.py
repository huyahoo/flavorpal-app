from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    note: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    likes_count: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

class ReviewProductCreate(ReviewBase):
    pass
    model_config = ConfigDict(from_attributes=True)
class ReviewProductOut(ReviewBase):
    product_id: int
    model_config = ConfigDict(from_attributes=True)

class ReviewUserCreate(ReviewBase):
    pass
    model_config = ConfigDict(from_attributes=True)
class ReviewUserOut(ReviewBase):
    user_id: int
    model_config = ConfigDict(from_attributes=True)
        
class ReviewCreate(ReviewBase):
    pass
    model_config = ConfigDict(from_attributes=True)

class ReviewUpdate(ReviewBase):
    pass
    model_config = ConfigDict(from_attributes=True)
class ReviewOut(ReviewBase):
    pass
    model_config = ConfigDict(from_attributes=True)
class ReviewSummary(ReviewBase):
    average_rating: float
    review_count: int
    reviews: List[ReviewBase]
    model_config = ConfigDict(from_attributes=True)
    
class ReviewProductCreateFrontend(BaseModel):
    rating: int
    note: Optional[str] = None
    class Config:
        orm_mode = True


class ReviewProductUpdateFrontend(BaseModel):
    rating: int
    note: Optional[str] = None
    class Config:
        orm_mode = True
    
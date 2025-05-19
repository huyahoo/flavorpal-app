from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ReviewBase(BaseModel):
    id: str
    user_id: str
    product_id: str
    rating: int = Field(..., ge=1, le=5)
    note: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    like_count: int

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(ReviewBase):
    pass

class ReviewOut(ReviewBase):
    pass

class ReviewSummary(ReviewBase):
    average_rating: float
    review_count: int
    reviews: List[ReviewBase]
    
    
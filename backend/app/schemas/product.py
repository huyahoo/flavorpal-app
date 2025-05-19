from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.review import ReviewOut

class ProductBase(BaseModel):
    id: str
    name: str
    image_url: Optional[str] = None
    barcode: Optional[str] = None
    last_updated_at: Optional[datetime] = None


class ProductCreate(ProductBase):
    pass
class ProductOpenFoodFacts(ProductBase):
    generic_name: Optional[str] = None
    ingredients: Optional[str] = None
    categories: Optional[str] = None
    brands: Optional[str] = None
    
   
class ProductOut(ProductBase):
    id: int
    last_updated_at: datetime
    class Config:
        orm_mode = True
class ProductUpdate(ProductBase):
    pass
class ProductReview(ProductBase):
    is_reviewed_by_current_user: bool
    current_user_review: Optional[ReviewOut] = None

class ProductAiGenerated(ProductBase):
    ai_health_summary: Optional[str] = None
    ai_health_conclusion: Optional[str] = None

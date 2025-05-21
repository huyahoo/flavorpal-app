from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.review import ReviewOut

class ProductBase(BaseModel):
    name: Optional[str] = None


class ProductCreate(ProductBase):
    image_url: Optional[str] = None
    barcode: Optional[str] = None
    generic_name: Optional[str] = None
    ingredients: Optional[str] = None
    categories: Optional[str] = None
    brands: Optional[str] = None
    class Config:
        orm_mode = True

class ProductOut(ProductBase):
    id: int
    name: Optional[str] = None
    generic_name: Optional[str] = None
    ingredients: Optional[str] = None
    categories: Optional[str] = None
    brands: Optional[str] = None
    class Config:
        orm_mode = True
        
class ProductUpdate(ProductBase):
    image_url: Optional[str] = None
    barcode: Optional[str] = None
    generic_name: Optional[str] = None
    ingredients: Optional[str] = None
    categories: Optional[str] = None
    brands: Optional[str] = None
    class Config:
        orm_mode = True
class ProductReview(ProductBase):
    is_reviewed_by_current_user: bool
    current_user_review: Optional[ReviewOut] = None
    class Config:
        orm_mode = True

class ProductAiGenerated(ProductBase):
    ai_health_summary: Optional[str] = None
    ai_health_conclusion: Optional[str] = None
    class Config:
        orm_mode = True

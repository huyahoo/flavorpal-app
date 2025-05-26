from pydantic import BaseModel, ConfigDict
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
    model_config = ConfigDict(from_attributes=True)

class ProductOut(ProductBase):
    id: int
    name: Optional[str] = None
    generic_name: Optional[str] = None
    ingredients: Optional[str] = None
    categories: Optional[str] = None
    brands: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)
        
class ProductUpdate(ProductBase):
    image_url: Optional[str] = None
    barcode: Optional[str] = None
    generic_name: Optional[str] = None
    ingredients: Optional[str] = None
    categories: Optional[str] = None
    brands: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)
class ProductReview(ProductBase):
    is_reviewed_by_current_user: bool
    current_user_review: Optional[ReviewOut] = None
    model_config = ConfigDict(from_attributes=True)

class ProductAiGenerated(ProductBase):
    ai_health_summary: Optional[str] = None
    ai_health_conclusion: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class ProductDetailsFrontend(BaseModel):
    id:int
    name:Optional[str] = None
    brands:Optional[str] = None
    barcode:Optional[str] = None
    image_url:Optional[str] = None
    categories:Optional[str] = None
    isReviewed:Optional[bool] = None
    user_rating:Optional[int] = None
    user_note:Optional[str] = None
    ai_health_summary:Optional[str] = None
    ai_health_conclusion:Optional[str] = None
    data_scanned_at:Optional[datetime] = None
    data_reviewed:Optional[str] = None
    class Config:
        orm_mode = True

class ProductDetailsFrontendOut(BaseModel):
    product:ProductDetailsFrontend
    class Config:
        orm_mode = True

class ProductDetailsThroughBarcode(BaseModel):
    name:str
    barcode:str
    image_url:Optional[str] = None
    image_ingredients_url:Optional[str] = None
    image_nutrition_url:Optional[str] = None
    class Config:
        orm_mode = True
        
class ProductDetailsThroughBarcodeOut(BaseModel):
    product:ProductDetailsThroughBarcode
    class Config:
        orm_mode = True

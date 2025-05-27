from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.schemas.review import ReviewOut

class ProductBase(BaseModel):
    name: Optional[str] = None


class ProductCreate(ProductBase):
    name: str # Required for creation
    image_url: Optional[str] = None
    barcode: Optional[str] = None
    generic_name: Optional[str] = None
    ingredients: Optional[str] = None
    categories: Optional[List[str]] = None
    brands: Optional[List[str]] = None
    image_embedding: Optional[List[float]] = None  
    model_config = ConfigDict(from_attributes=True)

class ProductOut(ProductBase):
    id: int
    name: Optional[str] = None
    generic_name: Optional[str] = None
    ingredients: Optional[str] = None
    categories: Optional[List[str]] = None
    brands: Optional[List[str]] = None
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
    brands:Optional[List[str]] = None
    barcode:Optional[str] = None
    image_url:Optional[str] = None
    categories:Optional[List[str]] = None
    isReviewed:Optional[bool] = None
    user_rating:Optional[int] = None
    user_note:Optional[str] = None
    ai_health_summary:Optional[str] = None
    ai_health_conclusion:Optional[str] = None
    date_scanned:Optional[datetime] = None
    date_reviewed:Optional[datetime] = None
    class Config:
        orm_mode = True

class ProductDetailsFrontendOut(BaseModel):
    product:List[ProductDetailsFrontend]
    class Config:
        orm_mode = True

class ProductDetailsThroughBarcode(BaseModel):
    id:int
    name:str
    barcode:str
    brand:Optional[List[str]] = None
    categories:Optional[List[str]] = None
    image_url:Optional[str] = None
    image_ingredients_url:Optional[str] = None
    image_nutrition_url:Optional[str] = None
    is_reviewed:Optional[bool] = None
    date_scanned:Optional[datetime] = None
    likes_count:Optional[int] = None
    ai_health_summary:Optional[str] = None
    ai_health_conclusion:Optional[str] = None
    class Config:
        orm_mode = True
        
class ProductDetailsThroughBarcodeOut(ProductDetailsThroughBarcode):
    pass
    class Config:
        orm_mode = True
class ProductImageRequest(BaseModel):
    base64image: str



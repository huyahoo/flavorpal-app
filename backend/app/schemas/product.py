from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.schemas.review import ReviewOut


class ProductBase(BaseModel):
    name: Optional[str] = None


class ProductCreate(ProductBase):
    name: str  # Required for creation
    imageUrl: Optional[str] = None
    barcode: Optional[str] = None
    genericName: Optional[str] = None
    ingredients: Optional[str] = None
    categories: Optional[List[str]] = None
    brands: Optional[List[str]] = None
    # imageEmbedding: Optional[List[float]] = None
    model_config = ConfigDict(from_attributes=True)


class ProductOut(ProductBase):
    id: int
    name: Optional[str] = None
    genericName: Optional[str] = None
    ingredients: Optional[str] = None
    categories: Optional[List[str]] = None
    brands: Optional[List[str]] = None
    model_config = ConfigDict(from_attributes=True)


class ProductUpdate(ProductBase):
    imageUrl: Optional[str] = None
    barcode: Optional[str] = None
    genericName: Optional[str] = None
    ingredients: Optional[str] = None
    categories: Optional[str] = None
    brands: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class ProductReview(ProductBase):
    isReviewedByCurrentUser: bool
    currentUserReview: Optional[ReviewOut] = None
    model_config = ConfigDict(from_attributes=True)


class ProductAiGenerated(ProductBase):
    aiHealthSummary: Optional[str] = None
    aiHealthConclusion: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class ProductDetailsFrontend(BaseModel):
    id: int
    name: Optional[str] = None
    brands: Optional[List[str]] = None
    barcode: Optional[str] = None
    imageUrl: Optional[str] = None
    categories: Optional[List[str]] = None
    isReviewed: Optional[bool] = None
    userRating: Optional[int] = None
    userNote: Optional[str] = None
    aiHealthSummary: Optional[str] = None
    aiHealthConclusion: Optional[str] = None
    dateScanned: Optional[datetime] = None
    dateReviewed: Optional[datetime] = None

    class Config:
        orm_mode = True


class ProductDetailsFrontendOut(BaseModel):
    product: List[ProductDetailsFrontend]

    class Config:
        orm_mode = True


class ProductDetailsThroughBarcode(BaseModel):
    id: int
    name: str
    barcode: str
    brand: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    imageUrl: Optional[str] = None
    imageIngredientsUrl: Optional[str] = None
    imageNutritionUrl: Optional[str] = None
    isReviewed: Optional[bool] = None
    dateScanned: Optional[datetime] = None
    likesCount: Optional[int] = None
    aiHealthSummary: Optional[str] = None
    aiHealthConclusion: Optional[str] = None

    class Config:
        orm_mode = True


class ProductDetailsThroughBarcodeOut(ProductDetailsThroughBarcode):
    pass

    class Config:
        orm_mode = True


class ProductImageRequest(BaseModel):
    base64image: str

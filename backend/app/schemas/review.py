from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    note: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    likesCount: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)


class ReviewProductCreate(ReviewBase):
    pass
    model_config = ConfigDict(from_attributes=True)


class ReviewProductOut(ReviewBase):
    productId: int
    model_config = ConfigDict(from_attributes=True)


class ReviewUserCreate(ReviewBase):
    pass
    model_config = ConfigDict(from_attributes=True)


class ReviewUserOut(ReviewBase):
    userId: int
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
    averageRating: float
    reviewCount: int
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

class ReviewProductListFrontend(BaseModel):
    reviewId: int
    productId: int
    productBarcode: Optional[str] = None
    productName: Optional[str] = None
    productImageUrl: Optional[str] = None
    productRating: Optional[int] = None
    productNote: Optional[str] = None
    reviewUsername: Optional[str] = None
    dateReviewed: Optional[datetime] = None
    likeCount: Optional[int] = None

    class Config:
        orm_mode = True

class ReviewProductListFrontendOut(BaseModel):
    reviews: List[ReviewProductListFrontend]

    class Config:
        orm_mode = True

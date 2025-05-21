from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.db.db import get_db
from app.utils import response
from app.utils.ResponseResult import Response
router = APIRouter(tags=["Reviews"])


@router.get("/reviews/products/{product_id}", response_model=Response[List[schemas.ReviewOut]])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        return response.not_found(msg="Product not found",code=404)
    reviews = db.query(models.Review).filter(models.Review.product_id == product_id).all()
    if not reviews:
        return response.not_found(msg="No reviews found",code=404)
    return Response(code=200, data=reviews, msg="Reviews fetched successfully")


@router.post("/reviews/products/{product_id}", response_model=Response[schemas.ReviewProductOut])
def create_product_review(user_id: int,product_id: int, review: schemas.ReviewProductCreate, db: Session = Depends(get_db)):
    db_review = models.Review(**review.dict(), user_id=user_id, product_id=product_id)
    db.add(db_review)
    db.commit()
    return Response(code=200, data=db_review, msg="Review created successfully")


@router.get("/reviews/users/{user_id}/", response_model=Response[List[schemas.ReviewUserOut]])
def get_user_reviews(user_id: int,review:schemas.ReviewUserCreate, db: Session = Depends(get_db)):
    db_review = models.Review(**review.dict(), user_id=user_id)
    db.add(db_review)
    db.commit()
    return Response(code=200, data=db_review, msg="Review created successfully")

@router.patch("/reviews/products/{review_id}", response_model=Response[schemas.ReviewOut])
def update_review(review_id: int, review: schemas.ReviewUpdate, db: Session = Depends(get_db)):
    db_review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not db_review:
        return response.not_found(msg="Review not found",code=404)
    for field, value in review.dict(exclude_unset=True).items():
        setattr(db_review, field, value)
    db.commit()
    db.refresh(db_review)
    return Response(code=200, data=db_review, msg="Review updated successfully")

@router.delete("/reviews/{review_id}", response_model=schemas.ReviewOut)
def delete_review(review_id: int, db: Session = Depends(get_db)):
    db_review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not db_review:
        return response.not_found(msg="Review not found",code=404)
    db.delete(db_review)
    db.commit()
    return Response(code=200, msg="Review deleted successfully")

@router.post("/reviews/{review_id}/like", response_model=Response[schemas.ReviewOut])
def like_review(review_id: int, db: Session = Depends(get_db)):
    db_review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not db_review:
        return response.not_found(msg="Review not found",code=404)
    db_review.likes_count += 1
    db.commit()
    return Response(code=200, data=db_review, msg="Review liked successfully")

@router.get("/reviews/users/{user_id}/", response_model=Response[List[schemas.ReviewUserOut]])
def get_user_reviews(user_id: int, db: Session = Depends(get_db)):
    db_review = db.query(models.Review).filter(models.Review.user_id == user_id).all()
    if not db_review:
        return response.not_found(msg="No reviews found",code=404)
    return Response(code=200, data=db_review, msg="Reviews fetched successfully")

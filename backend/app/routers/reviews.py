from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.db.db import get_db

router = APIRouter(tags=["Reviews"])

@router.get("/products/{product_id}/reviews", response_model=List[schemas.ReviewOut])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.product_id == product_id).all()
    return reviews

@router.post("/products/{product_id}/reviews", response_model=schemas.ReviewOut)
def create_product_review(product_id: int, review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    db_review = models.Review(**review.dict(), product_id=product_id)
    db.add(db_review)
    db.commit()
    return db_review

@router.get("/users/{user_id}/reviews", response_model=List[schemas.ReviewOut])
def get_user_reviews(user_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.user_id == user_id).all()
    return reviews

@router.patch("/reviews/{review_id}", response_model=schemas.ReviewOut)
def update_review(review_id: int, review: schemas.ReviewUpdate, db: Session = Depends(get_db)):
    db_review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    for field, value in review.dict().items():
        setattr(db_review, field, value)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.delete("/reviews/{review_id}", response_model=schemas.ReviewOut)
def delete_review(review_id: int, db: Session = Depends(get_db)):
    db_review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(db_review)
    db.commit()

@router.post("/reviews/{review_id}/like", response_model=schemas.ReviewOut)
def like_review(review_id: int, db: Session = Depends(get_db)):
    db_review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    db_review.likes += 1
    db.commit()
    return {"message": "Review liked successfully"}
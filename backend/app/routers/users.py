from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models
from app.db.db import get_db
from typing import List
router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[schemas.UserProfile])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

@router.post("/", response_model=schemas.UserProfile)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(
        name=user.name,
        email=user.email,
        password=user.password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    for flag_name in user.health_flags:
        flag = db.query(models.HealthFlag).filter(models.HealthFlag.name == flag_name).first()
        if not flag:
            raise HTTPException(status_code=404, detail="Health flag not found")
        db.add(models.UserHealthFlag(user_id=db_user.id, health_flag_id=flag.id))
    for badge_name in user.badges:
        badge = db.query(models.Badge).filter(models.Badge.name == badge_name).first()
        if not badge:
            badge = models.Badge(name=badge_name, description=badge_name)
            db.add(badge)
            db.flush()
        db.add(models.UserBadge(user_id=db_user.id, badge_id=badge.id))
    db.commit()
    return db_user

@router.delete("/", response_model=List[schemas.UserProfile])
def delete_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all() 
    db.query(models.User).delete()
    db.commit()
    return users

@router.get("/{user_id}", response_model=schemas.UserProfile)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/{user_id}", response_model=schemas.UserProfile)
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()   
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    for field, value in user.dict().items():
        setattr(db_user, field, value)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/{user_id}/badges", response_model=schemas.UserWithBadges)
def get_user_badges(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
@router.post("/{user_id}/badges", response_model=schemas.UserWithBadges)
def create_user_badge(user_id: int, badge: schemas.BadgeCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.badges.append(badge)
    db.commit()
    return user
 

@router.patch("/{user_id}/health_flags", response_model=schemas.UserWithHealthFlags)
def update_user_health_flags(user_id: int, health_flags: List[str], db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.health_flags = health_flags
    db.commit()
    return user


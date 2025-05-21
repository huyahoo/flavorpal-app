from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models
from app.db.db import get_db
from typing import List
router = APIRouter(prefix="/users", tags=["users"])
from app.utils import response
from app.utils.ResponseResult import Response
@router.get("/",response_model=Response[List[schemas.UserProfileOut]])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    if not users:
        return response.not_found(msg="No users found",code=404)
    print(users)
    return Response(code=200, data=users, msg="Users Found successfully")


@router.post("/",response_model=Response[schemas.UserProfileOut])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(
        name=user.name,
        email=user.email,
        password=user.password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    for flag_obj in user.health_flags:
        print(flag_obj)
        flag = db.query(models.HealthFlag).filter(models.HealthFlag.name == flag_obj.name).first()
        if not flag:
            flag = models.HealthFlag(name=flag_obj.name)
            db.add(flag)
            db.flush()
        db.add(models.UserHealthFlag(user_id=db_user.id, health_flag_id=flag.id))
    for badge_obj in user.badges:
        badge = db.query(models.Badge).filter(models.Badge.name == badge_obj.name).first()
        if not badge:
            badge = models.Badge(name=badge_obj.name, description=badge_obj.description)
            db.add(badge)
            db.flush()
        db.add(models.UserBadge(user_id=db_user.id, badge_id=badge.id))
    db.commit()

    return Response(code=200, data=db_user, msg="User created successfully")



@router.get("/{user_id}",response_model=Response[schemas.UserProfileOut])
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise response.not_found(msg="User not found",code=404)
    return Response(code=200, data=db_user, msg="User fetched successfully")


@router.delete("/", status_code=204)
def delete_all_users(db: Session = Depends(get_db)):
    db.query(models.UserHealthFlag).delete()
    db.query(models.UserBadge).delete()
    db.query(models.History).delete()
    db.query(models.Review).delete()

    db.query(models.User).delete()
    db.commit()
    return Response(code=200, msg="All users deleted successfully")

@router.get("/{user_id}/badges", response_model=Response[List[schemas.UserBadgeOut]])
def get_user_badges(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise response.not_found(msg="User not found",code=404)
    return Response(code=200, data=user.badges, msg="User badges fetched successfully")

@router.get("/{user_id}/health_flags", response_model=Response[List[schemas.UserHealthFlagOut]])
def get_user_health_flags(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise response.not_found(msg="User not found",code=404)
    return Response(code=200, data=user.user_health_flags, msg="User health flags fetched successfully")

@router.patch("/{user_id}", response_model=Response[schemas.UserProfileOut])
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise response.not_found(msg="User not found",code=404)
    if user.name is not None:
        db_user.name = user.name
    if user.email is not None:
        db_user.email = user.email
    if user.health_flags is not None:
        for flag_obj in user.health_flags:
            flag = db.query(models.HealthFlag).filter(models.HealthFlag.name == flag_obj.name).first()
            if not flag:
                flag = models.HealthFlag(name=flag_obj.name)
                db.add(flag)
    if user.badges is not None:
        for badge_obj in user.badges:
            badge = db.query(models.Badge).filter(models.Badge.name == badge_obj.name).first()
            if not badge:
                badge = models.Badge(name=badge_obj.name, description=badge_obj.description)
                db.add(badge)
    db.commit()
    db.refresh(db_user)
    return Response(code=200, data=db_user, msg="User updated successfully")

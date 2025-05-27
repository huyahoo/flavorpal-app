from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import schemas, models
from app.db.db import get_db
from typing import List
from app.utils import response
from app.utils.ResponseResult import Response
from app.utils.security import get_password_hash
from app.utils.dependencies import get_current_user
from app.schemas.user import UserProfileOut
from app.models import User as UserModel
from app.utils.security import verify_password, create_access_token

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        return response.not_found(msg="User not found",code=404)
    if not verify_password(user.password, db_user.password):
        return Response(code=401, data=None, msg="Incorrect password or email")
    access_token = create_access_token(data={"sub": db_user.email})
    return Response(code=200, data={"access_token": access_token, "token_type": "bearer"}, msg="User logged in successfully")


@router.post("/auth/logout")
def logout(_: models.User = Depends(get_current_user)):
    return Response(code=200, data=None, msg="User logged out successfully")

@router.get("/auth/me", response_model=Response[schemas.UserProfileFrontendOut])
def get_me(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    badges = []
    if current_user.badges:
        for badge in current_user.badges:
            badge_db = db.query(models.UserBadge).filter(models.UserBadge.badge_id == badge.id).first()
            badge_obj = schemas.UserBadgeFrontendOut(
                id=badge_db.id,
                dateEarned=badge_db.date_earned
            ) 
            badges.append(badge_obj)
    user_profile = schemas.UserProfileFrontendOut(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        healthFlags=current_user.health_flags,
        badges=badges
    )
    return Response(code=200, data=user_profile, msg="User logged in successfully")

@router.get("/",response_model=Response[List[schemas.UserProfileOut]])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    if not users:
        return response.not_found(msg="No users found",code=404)
    print(users)
    return Response(code=200, data=users, msg="Users Found successfully")

@router.get("/me", response_model=Response[UserProfileOut])
async def read_users_me(current_user: UserModel = Depends(get_current_user)):
    """
    Get current logged-in user's profile.
    Requires authentication.
    """
    return Response(code=200, data=current_user, msg="Current user data fetched successfully")

@router.post("/", response_model=Response[schemas.UserProfileOut], status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user_check = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user_check:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )

    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )
    db.add(db_user)
    db.flush()

    if user.health_flags: 
        for flag_name_in in user.health_flags: 
            flag_db = db.query(models.HealthFlag).filter(models.HealthFlag.name == flag_name_in).first()
            if not flag_db:
                flag_db = models.HealthFlag(name=flag_name_in) 
                db.add(flag_db)
                db.flush() 
            
            existing_user_flag = db.query(models.UserHealthFlag).filter_by(user_id=db_user.id, health_flag_id=flag_db.id).first()
            if not existing_user_flag:
                user_health_flag_assoc = models.UserHealthFlag(user_id=db_user.id, health_flag_id=flag_db.id)
                db.add(user_health_flag_assoc)
    
    if user.badges:
        for badge_obj_in in user.badges:
            badge_db = db.query(models.Badge).filter(models.Badge.name == badge_obj_in.name).first()
            if not badge_db:
                badge_db = models.Badge(name=badge_obj_in.name, description=badge_obj_in.description if hasattr(badge_obj_in, 'description') else "Default badge description")
                db.add(badge_db)
                db.flush()
            existing_user_badge = db.query(models.UserBadge).filter_by(user_id=db_user.id, badge_id=badge_db.id).first()
            if not existing_user_badge:
                user_badge_assoc = models.UserBadge(user_id=db_user.id, badge_id=badge_db.id)
                db.add(user_badge_assoc)

    db.commit()
    db.refresh(db_user)

    return Response(code=201, data=db_user, msg="User created successfully")



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

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise response.not_found(msg="User not found",code=404)
    db.delete(db_user)
    db.commit()
    return Response(code=200,data=None, msg="User deleted successfully")

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
def update_user(user_id: int, payload: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = payload.model_dump(exclude_unset=True)

    if "name" in update_data:
        db_user.name = update_data["name"]
    # if "email" in update_data:
    #     existing_email_user = db.query(models.User).filter(models.User.email == update_data["email"]).first()
    #     if existing_email_user and existing_email_user.id != user_id:
    #         raise HTTPException(status_code=400, detail="Email already registered by another user.")
    #     db_user.email = update_data["email"]
    
    if payload.health_flags is not None:
        db.query(models.UserHealthFlag).filter(models.UserHealthFlag.user_id == user_id).delete()
        for flag_name_in in payload.health_flags:
            flag_db = db.query(models.HealthFlag).filter(models.HealthFlag.name == flag_name_in).first()
            if not flag_db:
                flag_db = models.HealthFlag(name=flag_name_in)
                db.add(flag_db)
                db.flush()
            user_health_flag_assoc = models.UserHealthFlag(user_id=db_user.id, health_flag_id=flag_db.id)
            db.add(user_health_flag_assoc)

    if payload.badges is not None:
        for badge_obj in payload.badges:
            badge = db.query(models.Badge).filter(models.Badge.name == badge_obj.name).first()
            if not badge:
                badge = models.Badge(name=badge_obj.name, description=badge_obj.description)
                db.add(badge)

    db.commit()
    db.refresh(db_user)
    return Response(code=200, data=db_user, msg="User updated successfully")

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, models
from app.db.db import get_db
from typing import List
from app.utils import response
from app.utils.ResponseResult import Response
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/badges", tags=["Badges"])

@router.get("/", response_model=Response[List[schemas.UserBadgeFrontend]])
def get_current_user_badges(current_user: models.User = Depends(get_current_user)):
    user_badges = [
        schemas.UserBadgeFrontend(
            badge=user_badge.badge,
            createdAt=user_badge.created_at
        ) for user_badge in current_user.user_badges
    ];
    if not current_user:
        raise response.not_found(msg="User not found",code=404)
    return Response(code=200, data=user_badges, msg="User badges fetched successfully")

@router.get("/all", response_model=Response[List[schemas.Badge]])
def get_all_badges(db: Session = Depends(get_db)):
    badges = db.query(models.Badge).all()
    return Response(code=200, data=badges, msg="All badges fetched successfully")

@router.patch("/update/{badge_id}", response_model=Response[schemas.UserBadgeFrontend])
def update_current_user_badges(badge_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):

    user_badge = models.UserBadge(user_id=current_user.id, badge_id=badge_id)
    db.add(user_badge)
    db.commit()
    user_badge_return = schemas.UserBadgeFrontend(
        badge=user_badge.badge,
        createdAt=user_badge.created_at
    )
    return Response(code=200, data=user_badge_return, msg="User badges updated successfully")

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.db.db import get_db
from typing import List
from app.utils import response
from app.utils.ResponseResult import Response
router = APIRouter(
    prefix="/history",
    tags=["History"]
)

@router.get("/", response_model=Response[List[schemas.HistoryOut]])
def get_all_history(db: Session = Depends(get_db)):
    histories = db.query(models.History).all()
    history_list = []
    for history in histories:
        history_list.append(schemas.HistoryOut(
            id=history.id,
            productId=history.product.id,
            scannedAt=history.scanned_at,
        )) 
    return Response(code=200, data=history_list, msg="History fetched successfully")

@router.get("users/{user_id}/", response_model=Response[List[schemas.HistoryOut]])
def get_user_history(user_id: int, db: Session = Depends(get_db)):
    histories = db.query(models.History).filter(models.History.user_id == user_id).all()
    if not histories:
        return response.not_found(msg="History not found",code=404)
    return Response(code=200, data=histories, msg="History fetched successfully")


@router.post("/users/{user_id}/", response_model=Response[schemas.HistoryOut])
def create_user_history(user_id: int, product_id: int,history: schemas.HistoryCreate, db: Session = Depends(get_db)):
    history = models.History(**history.dict(), user_id=user_id, product_id=product_id)
    db.add(history)
    db.commit()
    return Response(code=200, data=history, msg="History created successfully")

@router.delete("/users/{user_id}/", status_code=204)
def delete_user_history(user_id: int, db: Session = Depends(get_db)):
    db.query(models.History).filter(models.History.user_id == user_id).delete()
    db.commit()
    return Response(code=200, msg="History deleted successfully")


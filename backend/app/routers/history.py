from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.db.db import get_db
from typing import List
router = APIRouter(
    prefix="/users/{user_id}/history",
    tags=["History"]
)

@router.get("/", response_model=List[schemas.HistoryOut])
def get_user_history(user_id: int, db: Session = Depends(get_db)):
    histories = db.query(models.History).filter(models.History.user_id == user_id).all()
    return histories

@router.post("/", response_model=schemas.HistoryOut)
def create_history(user_id: int, history: schemas.HistoryCreate, db: Session = Depends(get_db)):
    history = models.History(**history.dict(), user_id=user_id)
    db.add(history)
    db.commit()
    return history

@router.delete("/{history_id}", response_model=schemas.HistoryOut)
def delete_history(history_id: int, db: Session = Depends(get_db)):
    history = db.query(models.History).filter(models.History.id == history_id).first()
    if not history:
        raise HTTPException(status_code=404, detail="History not found")
    db.delete(history)
    db.commit()
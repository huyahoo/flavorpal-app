# backend/app/crud/user.py
from sqlalchemy.orm import Session
from app import models # SQLAlchemy models
# from app import schemas # Pydantic schemas, if needed for create/update here

def get_user_by_email(db: Session, email: str) -> models.User | None:
    """
    Retrieves a user from the database by their email address.
    Returns the User object or None if not found.
    """
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> models.User | None:
    """
    Retrieves a user from the database by their ID.
    Returns the User object or None if not found.
    """
    return db.query(models.User).filter(models.User.id == user_id).first()

# TODO: Better to add other CRUD functions here later, e.g., for creating users (though it's in router now)
# or updating users. Separating CRUD logic from router logic is good practice.

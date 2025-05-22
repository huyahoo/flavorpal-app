from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base 
import datetime


class User(Base):
    __tablename__ = "users" 
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow,
                        onupdate=datetime.datetime.utcnow)

    reviews = relationship("Review", back_populates="user")
    history = relationship("History", back_populates="user")
    badges = relationship("UserBadge", back_populates="user")
    user_health_flags = relationship("UserHealthFlag", back_populates="user")

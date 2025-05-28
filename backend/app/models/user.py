# backend/app/models/user.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

from app import models
from .base import Base
import datetime


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow,
                        onupdate=datetime.datetime.utcnow)
    total_taste_points = Column(Integer, default=0)

    reviews = relationship("Review", back_populates="user",
                           cascade="all, delete-orphan")
    history = relationship("History", back_populates="user",
                           cascade="all, delete-orphan")
    user_badges = relationship(
        "UserBadge", back_populates="user", cascade="all, delete-orphan")
    user_health_flags = relationship(
        "UserHealthFlag", back_populates="user", cascade="all, delete-orphan")



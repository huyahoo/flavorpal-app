# backend/app/models/user.py
from sqlalchemy import Column, Integer, String, DateTime
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

    user_health_flags_association = relationship("UserHealthFlag", back_populates="user", cascade="all, delete-orphan")
    badges_association = relationship("UserBadge", back_populates="user", cascade="all, delete-orphan")
    
    reviews = relationship("Review", back_populates="user")
    history = relationship("History", back_populates="user")

    @property
    def health_flags(self) -> list[str]:
        """Returns a list of names of the user's health flags."""
        if self.user_health_flags_association:
            return [assoc.health_flag.name for assoc in self.user_health_flags_association if assoc.health_flag]
        return []

    @property
    def badges(self) -> list[str]:
        """Returns a list of names of the user's badges."""
        if self.badges_association:
            return [assoc.badge.name for assoc in self.badges_association if assoc.badge]
        return []
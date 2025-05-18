from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base_class import Base 
import datetime


class User(Base):
    __tablename__ = "users" 
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)  
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow,
                        onupdate=datetime.datetime.utcnow)

    reviews = relationship("Review", back_populates="user")
    history_entries = relationship("History", back_populates="user")
    user_badges = relationship("UserBadge", back_populates="user")
    user_health_flags = relationship("UserHealthFlag", back_populates="user")

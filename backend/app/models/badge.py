from .base import Base
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime

class Badge(Base):
    __tablename__ = "badges"

    # id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String)

    user_badges = relationship("UserBadge", back_populates="badge")


class UserBadge(Base):  
    __tablename__ = "user_badges"


    user_id = Column(Integer, ForeignKey("users.id"),
                     primary_key=True)  
    badge_id = Column(Integer, ForeignKey("badges.id"),
                      primary_key=True)  
    earned_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="user_badges")
    badge = relationship("Badge", back_populates="user_badges")

from .base import Base
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

class HealthFlag(Base):
    __tablename__ = "health_flags"

    name = Column(String, unique=True, nullable=False)

    user_health_flags = relationship(
        "UserHealthFlag", back_populates="health_flag")


class UserHealthFlag(Base):  
    __tablename__ = "user_health_flags"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    health_flag_id = Column(Integer, ForeignKey(
        "health_flags.id"), primary_key=True)

    user = relationship("User", back_populates="user_health_flags")
    health_flag = relationship(
        "HealthFlag", back_populates="user_health_flags")

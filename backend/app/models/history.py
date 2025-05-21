from sqlalchemy import Column, Integer, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from .base import Base
import datetime


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    scanned_at = Column(DateTime, default=datetime.datetime.utcnow)
    text_content = Column(String)
    user = relationship("User", back_populates="history")
    product = relationship("Product", back_populates="history")

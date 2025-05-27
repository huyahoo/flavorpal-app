from sqlalchemy import Column, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base import Base
import datetime


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey(
        "products.id", ondelete="CASCADE"), nullable=False)
    scanned_at = Column(DateTime, default=datetime.datetime.utcnow)
    text_content = Column(Text)
    user = relationship("User", back_populates="history")
    product = relationship("Product", back_populates="history")

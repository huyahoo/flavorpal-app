from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
import datetime


class Product(Base):
    __tablename__ = "products"

    name = Column(String, index=True, nullable=False)
    barcode = Column(String, unique=True, index=True)
    image_url = Column(String)
    last_updated = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    generic_name = Column(String)
    ingredients = Column(Text)  
    categories = Column(String) 
    brands = Column(String)  

    reviews = relationship("Review", back_populates="product")
    history_entries = relationship("History", back_populates="product")

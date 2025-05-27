from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
import datetime
from pgvector.sqlalchemy import Vector


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    barcode = Column(String, unique=True, index=True)
    image_url = Column(String)
    image_embedding = Column(Vector(1536))
    last_updated = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    generic_name = Column(String)
    ingredients = Column(Text)  
    categories = Column(String) 
    brands = Column(String)  
    ai_health_summary = Column(Text)
    ai_health_conclusion = Column(Text)

    reviews = relationship("Review", back_populates="product")
    history = relationship("History", back_populates="product")

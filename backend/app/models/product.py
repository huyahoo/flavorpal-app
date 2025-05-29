from sqlalchemy import Column, Integer, String, DateTime, Text, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
import datetime
from pgvector.sqlalchemy import Vector


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    barcode = Column(String(255))
    image_url = Column(Text)
    image_embedding = Column(Vector(1536))
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)
    generic_name = Column(String(255))
    ingredients = Column(Text)
    categories = Column(Text)
    brands = Column(Text)
    ai_health_summary = Column(Text)
    ai_health_conclusion = Column(Text)

    reviews = relationship(
        "Review", back_populates="product", cascade="all, delete-orphan")
    history = relationship(
        "History", back_populates="product", cascade="all, delete-orphan")

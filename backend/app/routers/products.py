
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.db.db import get_db
from typing import List
from app.utils import response
from app.utils.ResponseResult import Response
router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.get("/", response_model=Response[List[schemas.ProductOut]])
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    if not products:
        return response.not_found(msg="No products found",code=404)
    return Response(code=200, data=products, msg="Products fetched successfully")

@router.get("/{product_id}", response_model=Response[schemas.ProductOut])
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        return response.not_found(msg="Product not found",code=404)
    return Response(code=200, data=product, msg="Product fetched successfully")

@router.post("/", response_model=Response[schemas.ProductOut])
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    return Response(code=200, data=db_product, msg="Product created successfully")

@router.get("/barcode/{barcode}", response_model=Response[schemas.ProductOut])
def get_product_by_barcode(barcode: str, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.barcode == barcode).first()
    if not product:
        return response.not_found(msg="Product not found",code=404)
    return Response(code=200, data=product, msg="Product fetched successfully")

@router.patch("/{product_id}", response_model=Response[schemas.ProductOut])
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        return response.not_found(msg="Product not found",code=404)
    for field, value in product.dict(exclude_unset=True).items():
        setattr(db_product, field, value)
    db.commit()
    return Response(code=200, data=db_product, msg="Product updated successfully")

@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        return response.not_found(msg="Product not found",code=404)
    db.delete(db_product)
    db.commit()
    return Response(code=200, msg="Product deleted successfully")


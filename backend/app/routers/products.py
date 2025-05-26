
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, services
from app.db.db_supabase import get_db
from typing import List
from app.utils import response 
from app.utils.ResponseResult import Response
from app.utils.dependencies import get_current_user

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# @router.get("/", response_model=Response[List[schemas.ProductOut]])
# def get_all_products(db: Session = Depends(get_db)):
#     products = db.query(models.Product).all()
#     if not products:
#         return response.not_found(msg="No products found",code=404)
#     return Response(code=200, data=products, msg="Products fetched successfully")

@router.get("/",response_model=Response[List[schemas.ProductDetailsFrontendOut]])
def get_all_products(db: Session = Depends(get_db),current_user: models.User = Depends(get_current_user)):
    products = db.query(models.Product).all()
    user_id = current_user.id
    product_details = []
    for product in products:
        review = db.query(models.Review).filter(models.Review.product_id == product.id, models.Review.user_id == user_id).first()
        if review:
            product_info = schemas.ProductDetails(
                id=product.id,
                name=product.name,
                brands=product.brands,
                barcode=product.barcode,
                image_url=product.image_url,
                categories=product.categories,
                isReviewed=True,
                user_rating=review.rating,
                user_note=review.note,
                ai_health_summary=product.ai_health_summary,
                ai_health_conclusion=product.ai_health_conclusion,
                data_scanned_at=product.last_updated,
                data_reviewed=review.note
            )
        else:
            product_info = schemas.ProductDetails(
                id=product.id,
                name=product.name,
                brands=product.brands,
                barcode=product.barcode,
                image_url=product.image_url,
                categories=product.categories,
                isReviewed=False,
                user_rating=None,
                user_note=None,
                ai_health_summary=product.ai_health_summary,
                ai_health_conclusion=product.ai_health_conclusion,
                data_scanned_at=product.last_updated,
                data_reviewed=None
            )
        product_details.append(schemas.ProductDetailsFrontendOut(product=product_info))
    return Response(code=200, data=product_details, msg="Products fetched successfully")
    
@router.get("/{product_id}", response_model=Response[schemas.ProductDetailsFrontendOut])
def get_product(product_id: int, db: Session = Depends(get_db),current_user: models.User = Depends(get_current_user)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        return response.not_found(msg="Product not found",code=404)
    user_id = current_user.id
    review = db.query(models.Review).filter(models.Review.product_id == product_id, models.Review.user_id == user_id).first()
    if review:
        product_info = schemas.ProductDetailsFrontend(
            id=product.id,
            name=product.name,
            brands=product.brands,
            barcode=product.barcode,
            image_url=product.image_url,
            categories=product.categories,
            isReviewed=True,
            user_rating=review.rating,
            user_note=review.note,
            ai_health_summary=product.ai_health_summary,
            ai_health_conclusion=product.ai_health_conclusion,
            data_scanned_at=product.last_updated,
            data_reviewed=review.note
        )
    return Response(code=200, data=product_info, msg="Product fetched successfully")

@router.post("/", response_model=Response[schemas.ProductOut])
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    return Response(code=200, data=db_product, msg="Product created successfully")

@router.post("/image", response_model=Response[schemas.ProductOut])
def add_by_image(request: schemas.ProductImageRequest,  db: Session = Depends(get_db)):
    base64image = request.base64image
    embedding = services.get_image_embedding(base64image)
    product = services.most_similar_img(embedding, db)
    
    if product:
        print(f"Most similar product id: {product.id}, name: {product.name}")
        return Response(code=200, data=product, msg="Product fetched successfully")
    else:
        
        image_url = services.upload_image_to_bucket(base64image)
        product_name, product_manufacturer, product_description = services.get_AI_product_info(base64image)
        product = schemas.ProductCreate(
            name=product_name,
            image_url=image_url,
            image_embedding=embedding
        )
        db_product = models.Product(**product.dict())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return Response(code=200, data=db_product, msg="Product fetched successfully")


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

@router.get("/product/{barcode}", response_model=Response[schemas.ProductDetailsThroughBarcodeOut])
def get_product_by_barcode(barcode: str, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.barcode == barcode).first()
    if not product:
        return response.not_found(msg="Product not found",code=404)
    return Response(code=200, data=product, msg="Product fetched successfully")


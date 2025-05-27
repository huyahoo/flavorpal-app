
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, services
from app.db.db_supabase import get_db
from typing import List
from app.utils import response 
from app.utils.ResponseResult import Response
from app.utils.dependencies import get_current_user
import requests
from datetime import datetime
router = APIRouter(
    prefix="/products",
    tags=["Products"]
)




@router.get("/",response_model=Response[List[schemas.ProductDetailsFrontendOut]])
def get_all_products(db: Session = Depends(get_db),current_user: models.User = Depends(get_current_user)):
    products = db.query(models.Product).all()
    user_id = current_user.id
    product_details = []
    for product in products:
        review = db.query(models.Review).filter(models.Review.product_id == product.id, models.Review.user_id == user_id).first()
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
        else:
            product_info = schemas.ProductDetailsFrontend(
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
        product_details = schemas.ProductDetailsFrontend(
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
        product_details = schemas.ProductDetailsFrontend(
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
    product_info = schemas.ProductDetailsFrontendOut(product=product_details)
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




# @router.patch("/{product_id}", response_model=Response[schemas.ProductOut])
# def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
#     db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
#     if not db_product:
#         return response.not_found(msg="Product not found",code=404)
#     for field, value in product.dict(exclude_unset=True).items():
#         setattr(db_product, field, value)
#     db.commit()
#     return Response(code=200, data=db_product, msg="Product updated successfully")

@router.delete("/{product_id}", response_model=Response[None])
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        return response.not_found(msg="Product not found",code=404)
    db.delete(db_product)
    db.commit()
    return Response(code=200, msg="Product deleted successfully",data=None)

@router.get("/product/{barcode}", response_model=Response[schemas.ProductDetailsThroughBarcodeOut])
def get_product_by_barcode(barcode: str, db: Session = Depends(get_db),current_user: models.User = Depends(get_current_user)):
    product = db.query(models.Product).filter(models.Product.barcode == barcode).first()

    OPEN_FOOD_FACTS_URL = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
    image_ingredients_url = None
    image_nutrition_url = None
    product_info = None
    brands = None
    categories = None
    if requests.get(OPEN_FOOD_FACTS_URL).status_code != 200 and not product:
        return response.not_found(msg="Product not found",code=404)
    
    if requests.get(OPEN_FOOD_FACTS_URL).status_code == 200:
        data = requests.get(OPEN_FOOD_FACTS_URL).json()
        product_data = data.get("product",{})
        if product_data:
            if product_data.get("image_ingredients_url"):
                image_ingredients_url = product_data.get("image_ingredients_url")
            if product_data.get("image_nutrition_url"):
                image_nutrition_url = product_data.get("image_nutrition_url")
            if product_data.get("brands"):
                brands = [brand.strip() for brand in product_data.get("brands").split(",")]
            if product_data.get("categories"):
                categories = [category.strip() for category in product_data.get("categories").split(",")]
    
    if not product and not product_data:
        product = models.Product(
            barcode=barcode,
            image_url=product_data.get("image_url"),
            name=product_data.get("product_name"),
            generic_name=product_data.get("generic_name"),
            ingredients=product_data.get("ingredients"),
            categories=categories,
            brands=brands,
            image_ingredients_url=image_ingredients_url,
            image_nutrition_url=image_nutrition_url,
        )
        db.add(product)
        db.commit()
        db.refresh(product)
    review = None
    if product:
        review = db.query(models.Review).filter(models.Review.product_id == product.id, models.Review.user_id == current_user.id).first()
    product_info = schemas.ProductDetailsThroughBarcodeOut(
        id=product.id if product else None,
        name=product.name if product else product_data.get("product_name"),
        barcode = barcode,
        brand = product.brands if product else brands,
        categories = product.categories if product else categories,
        image_url = product.image_url if product else product_data.get("image_url"),
        image_ingredients_url = image_ingredients_url,
        image_nutrition_url = image_nutrition_url,
        is_reviewed = review is not None,
        date_scanned = product.last_updated if product else None,
        likes_count = review.likes_count if review else 0,
        ai_health_summary = product.ai_health_summary if product else None,
        ai_health_conclusion = product.ai_health_conclusion if product else None,
    )
    return Response(code=200, data=product_info, msg="Product fetched successfully")


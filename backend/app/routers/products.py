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
import json
router = APIRouter(
    prefix="/products",
    tags=["Products"]
)




@router.get("/",response_model=Response[List[schemas.ProductDetailsFrontend]])
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
                brands=product.brands if product.brands else "Unknown",
                barcode=product.barcode,
                imageUrl=product.image_url,
                categories=product.categories if product.categories else "Unknown",
                isReviewed=True,
                userRating=review.rating,
                userNotes=review.note,
                aiHealthSummary=product.ai_health_summary if product.ai_health_summary else "The image does not contain a product ingredient table to analyze for dietary preferences.",
                aiHealthConclusion=product.ai_health_conclusion if product.ai_health_conclusion else "unknown",
                dateScanned=product.last_updated.strftime("%Y-%m-%d, %H:%M:%S"),
                dateReviewed=review.updated_at.strftime("%Y-%m-%d, %H:%M:%S")
            )
        else:
            product_info = schemas.ProductDetailsFrontend(
                id=product.id,
                name=product.name,
                brands=product.brands if product.brands else "Unknown",
                barcode=product.barcode,
                imageUrl=product.image_url,
                categories=product.categories if product.categories else "Unknown",
                isReviewed=False,
                userRating=None,
                userNotes=None,
                aiHealthSummary=product.ai_health_summary if product.ai_health_summary else "The image does not contain a product ingredient table to analyze for dietary preferences.",
                aiHealthConclusion=product.ai_health_conclusion if product.ai_health_conclusion else "unknown",
                dateScanned=product.last_updated.strftime("%Y-%m-%d, %H:%M:%S"),
                dateReviewed=None
            )
        product_details.append(product_info)
    return Response(code=200, data=product_details, msg="Products fetched successfully")
    
@router.get("/{product_id}", response_model=Response[schemas.ProductDetailsFrontend])
def get_product(product_id: int, db: Session = Depends(get_db),current_user: models.User = Depends(get_current_user)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        return response.not_found(msg="Product not found",code=404)
    user_id = current_user.id
    review = db.query(models.Review).filter(models.Review.product_id == product_id, models.Review.user_id == user_id).first()
    product_details = None
    if review:
        product_details = schemas.ProductDetailsFrontend(
            id=product.id,
            name=product.name,
            brands=product.brands if product.brands else "Unknown",
            barcode=product.barcode,
            imageUrl=product.image_url,
            categories=product.categories if product.categories else "Unknown",
            isReviewed=True,
            userRating=review.rating,
            userNotes=review.note,
            aiHealthSummary=product.ai_health_summary if product.ai_health_summary else "The image does not contain a product ingredient table to analyze for dietary preferences.",
            aiHealthConclusion=product.ai_health_conclusion if product.ai_health_conclusion else "unknown",
            dateScanned=product.last_updated.strftime("%Y-%m-%d, %H:%M:%S"),
            dateReviewed=review.updated_at.strftime("%Y-%m-%d, %H:%M:%S")
        )
    else:
        product_details = schemas.ProductDetailsFrontend(
            id=product.id,
            name=product.name,
            brands=product.brands if product.brands else "Unknown",
            barcode=product.barcode,
            imageUrl=product.image_url,
            categories=product.categories if product.categories else "Unknown",
            isReviewed=False,
            userRating=None,
            userNotes=None,
            aiHealthSummary=product.ai_health_summary if product.ai_health_summary else "The image does not contain a product ingredient table to analyze for dietary preferences.",
            aiHealthConclusion=product.ai_health_conclusion if product.ai_health_conclusion else "unknown",
            dateScanned=product.last_updated.strftime("%Y-%m-%d, %H:%M:%S"),
            dateReviewed=None
        )
    return Response(code=200, data=product_details, msg="Product fetched successfully")

@router.post("/", response_model=Response[schemas.ProductOut])
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(
        name=product.name,
        generic_name=product.genericName,
        ingredients=product.ingredients,
        categories=product.categories,
        brands=product.brands,
        image_url=product.imageUrl
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    product_info = schemas.ProductOut(
        id=db_product.id,
        name=db_product.name,
        genericName=db_product.generic_name,
        ingredients=db_product.ingredients,
        categories=db_product.categories,
        brands=db_product.brands,
        imageUrl=db_product.image_url,
        imageEmbedding=db_product.image_embedding,
        lastUpdated=db_product.last_updated.strftime("%Y-%m-%d, %H:%M:%S"),
        aiHealthSummary=db_product.ai_health_summary if db_product.ai_health_summary else "The image does not contain a product ingredient table to analyze for dietary preferences.",
        aiHealthConclusion=db_product.ai_health_conclusion if db_product.ai_health_conclusion else "unknown",
    )
    return Response(code=200, data=product_info, msg="Product created successfully")

@router.post("/image", response_model=Response[schemas.ProductDetailsFrontend])
def add_by_image(request: schemas.ProductImageRequest,  db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    base64image = request.base64image
    embedding = services.get_image_embedding(base64image)
    product = services.most_similar_img(embedding, db)
    
    if product:
        print(f"Most similar product id: {product.id}, name: {product.name}")
        user_id = current_user.id
        review = db.query(models.Review).filter(models.Review.product_id == product.id, models.Review.user_id == user_id).first()
        product_details = services.generate_ProductDetailsFrontend(product, review)
        return Response(code=200, data=product_details, msg="Product fetched successfully")
    else:
        image_url = services.upload_image_to_bucket(base64image)
        product_name, product_manufacturer, product_description = services.get_AI_product_info(base64image)
        
        
        db_product = models.Product(
            name=product_name,
            image_url=image_url,
            image_embedding=embedding,
            brands=[product_manufacturer],
            ai_health_summary=product_description,
            ai_health_conclusion="unknown",
        )
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        history = models.History(
            product_id=db_product.id,
            user_id=current_user.id,
            scanned_at=datetime.utcnow()
        )
        db.add(history)
        db.commit()
        product_details = schemas.ProductDetailsFrontend(
            id=db_product.id,
            name=db_product.name,
            brands=product_manufacturer,
            barcode=db_product.barcode,
            imageUrl=image_url,
            categories=None,
            isReviewed=False,
            userRating=None,
            userNotes=None,
            aiHealthSummary=product_description,
            aiHealthConclusion="unknown",
            dateScanned=db_product.last_updated.strftime("%Y-%m-%d, %H:%M:%S"),
            dateReviewed=None
        )
        return Response(code=200, data=product_details, msg="Product fetched successfully")


@router.get("/currentuser/list/products", response_model=Response[List[schemas.ProductDetailsFrontend]])
def get_current_user_products(db: Session = Depends(get_db),current_user: models.User = Depends(get_current_user)):
    history = db.query(models.History).filter(models.History.user_id == current_user.id).all()
    product_details = []
    for record in history:
        product = record.product
        review = db.query(models.Review).filter(models.Review.product_id == product.id, models.Review.user_id == current_user.id).first()
        product_details.append(schemas.ProductDetailsFrontend(
            id=product.id,
            name=product.name,
            brands=product.brands if product.brands else "Unknown",
            barcode=product.barcode,
            imageUrl=product.image_url,
            categories=product.categories if product.categories else "Unknown",
            isReviewed=bool(review),
            userRating=review.rating if review else None,
            userNotes=review.note if review else None,
            aiHealthSummary=product.ai_health_summary if product.ai_health_summary else "The image does not contain a product ingredient table to analyze for dietary preferences.",
            aiHealthConclusion=product.ai_health_conclusion if product.ai_health_conclusion else "unknown",
            dateScanned=product.last_updated.strftime("%Y-%m-%d, %H:%M:%S"),
            dateReviewed=review.updated_at.strftime("%Y-%m-%d, %H:%M:%S") if review else None
        ))
    
    return Response(code=200, data=product_details, msg="Products fetched successfully")

# @router.patch("/{product_id}", response_model=Response[schemas.ProductOut])
# def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
#     db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
#     if not db_product:
#         return response.not_found(msg="Product not found",code=404)
#     for field, value in product.dict(exclude_unset=True).items():
#         setattr(db_product, field, value)
#     db.commit()
#     return Response(code=200, data=db_product, msg="Product updated successfully")

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        return response.not_found(msg="Product not found",code=404)
    db.delete(db_product)
    db.commit()
    return Response(code=200,data=None, msg="Product deleted successfully")

@router.get("/product/{barcode}", response_model=Response[schemas.ProductDetailsThroughBarcodeOut])
def get_product_by_barcode(
    barcode: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # First check if product exists in database
    product = db.query(models.Product).filter(models.Product.barcode == barcode).first()
    is_in_history = False
    
    # Check if product is in history
    if product:
        is_in_history = db.query(models.History).filter(models.History.product_id == product.id, models.History.user_id == current_user.id).first() is not None
        
    if product and is_in_history:
        # Get user's review if exists
        review = db.query(models.Review).filter(
            models.Review.product_id == product.id, 
            models.Review.user_id == current_user.id
        ).first()
        
        product_info = schemas.ProductDetailsThroughBarcodeOut(
            id=product.id,
            name=product.name,
            barcode=barcode,
            brands=product.brands if product.brands else "Unknown",
            categories=product.categories if product.categories else "Unknown",
            imageUrl = product.image_url,
            # imageIngredientsUrl = None,
            # imageNutritionUrl = None,
            isReviewed = review is not None,
            dateScanned = product.last_updated.strftime("%Y-%m-%d, %H:%M:%S"),
            likesCount = review.likes_count if review else 0,
            aiHealthSummary = product.ai_health_summary if product.ai_health_summary else "The image does not contain a product ingredient table to analyze for dietary preferences.",
            aiHealthConclusion = product.ai_health_conclusion if product.ai_health_conclusion else "unknown",
        )
        
        return Response(
            code=200,
            data=product_info,
            msg="Product fetched successfully"
        )

    # If product not in DB, fetch from OpenFoodFacts
    OPEN_FOOD_FACTS_URL = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
    response_off = requests.get(OPEN_FOOD_FACTS_URL)
    
    if response_off.status_code != 200:
        return response.not_found(msg="Product not found", code=404)
    
    data = response_off.json()
    product_data = data.get("product", {})
    print("product_data", product_data)
    if not product_data:
        return response.not_found(msg="Product not found", code=404)
    
    # Process OpenFoodFacts data
    image_ingredients_url = product_data.get("image_ingredients_url")
    image_nutrition_url = product_data.get("image_nutrition_url")
    
    
    # Get AI health analysis if ingredients image available
    conclusion = "unknown"
    summary = "The image does not contain a product ingredient table to analyze for dietary preferences."
    
    if image_ingredients_url:
        base64_image = services.image_url_to_base64(image_ingredients_url)
        health_flags = [flag.health_flag.name for flag in current_user.user_health_flags]
        conclusion, summary = services.get_AI_health_suggestion(base64_image, health_flags)

    # Create new product in database
    new_product = models.Product(
        barcode=barcode,
        image_url=product_data.get("image_url"),
        name=product_data.get("product_name"),
        generic_name=product_data.get("generic_name"),
        ingredients=json.dumps(product_data.get("ingredients")),
        categories=product_data.get("categories") if product_data.get("categories") else "Unknown",
        brands=product_data.get("brands") if product_data.get("brands") else "Unknown",
        ai_health_summary=summary,
        ai_health_conclusion=conclusion,
        last_updated=datetime.utcnow()
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    # Add to user's scan history
    if not is_in_history:
        history = models.History(
            product_id=new_product.id,
            user_id=current_user.id,
            scanned_at=datetime.utcnow()
        )
        db.add(history)
        db.commit()
        
    return Response(
        code=200,
        data=schemas.ProductDetailsThroughBarcodeOut(
            id=new_product.id,
            name=new_product.name,
            barcode=barcode,
            brands=product_data.get("brands"),
            categories=product_data.get("categories"),
            imageUrl=new_product.image_url,
            imageIngredientsUrl=image_ingredients_url,
            imageNutritionUrl=image_nutrition_url,
            isReviewed=False,
            dateScanned=new_product.last_updated.strftime("%Y-%m-%d, %H:%M:%S"),
            likesCount=0,
            aiHealthSummary=summary,
            aiHealthConclusion=conclusion,
        ),
        msg="Product fetched successfully"
    )

@router.post("/health_suggestion", response_model=Response[schemas.ProductDetailsFrontend])
def update_ai_health_suggestion(
    request: schemas.ProductAISuggestionRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    product = db.query(models.Product).filter(models.Product.id == request.productId).first()
    if not product:
        return response.not_found(msg="Product not found", code=404)

    health_flags = current_user.user_health_flags
    health_flags = [flag.health_flag.name for flag in health_flags]
    conclusion, summary = services.get_AI_health_suggestion(request.base64Image, health_flags)

    product.ai_health_summary = summary
    product.ai_health_conclusion = conclusion
    product.last_updated = datetime.utcnow()
    db.commit()
    db.refresh(product)

    review = db.query(models.Review).filter(
        models.Review.product_id == product.id,
        models.Review.user_id == current_user.id
    ).first()

    product_details = schemas.ProductDetailsFrontend(
        id=product.id,
        name=product.name,
        brands=product.brands if product.brands else "Unknown",
        barcode=product.barcode,
        imageUrl=product.image_url,
        categories=product.categories if product.categories else "Unknown",
        isReviewed=bool(review),
        userRating=review.rating if review else None,
        userNotes=review.note if review else None,
        aiHealthSummary=summary if summary else "The image does not contain a product ingredient table to analyze for dietary preferences.",
        aiHealthConclusion=conclusion if conclusion else "unknown",
        dateScanned=product.last_updated.strftime("%Y-%m-%d, %H:%M:%S"),
        dateReviewed=review.note if review else None
    )

    return Response(code=200, data=product_details, msg="AI suggestion updated and product info returned")


from supabase import create_client, Client
import os
from dotenv import load_dotenv
from storage3.utils import StorageException
from app import models, schemas
from sqlalchemy.orm import Session
from sqlalchemy import text
import base64
import mimetypes
import requests
import uuid


load_dotenv() 

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
AI_SERVICE_URL = os.getenv("AI_SERVICE_URL")
IMG_BUCKET_NAME = os.getenv("IMG_BUCKET_NAME")


import base64
import re
import io


def base64_to_bytes(base64_str: str) -> bytes:
    # Remove data URL prefix if present
    match = re.match(r'data:image/(png|jpeg|jpg);base64,(.*)', base64_str)
    if match:
        base64_data = match.group(2)
    else:
        base64_data = base64_str

    return base64.b64decode(base64_data)
def base64_to_bytesio(base64_str: str) -> io.BytesIO:
    # Remove data URL prefix
    match = re.match(r'data:image/(png|jpeg|jpg);base64,(.*)', base64_str)
    if match:
        base64_data = match.group(2)
    else:
        base64_data = base64_str

    image_bytes = base64.b64decode(base64_data)
    return io.BytesIO(image_bytes)

def image_url_to_base64(image_url):
    response = requests.get(image_url)
    mime_type, _ = mimetypes.guess_type(image_url)
    
    if not mime_type:
        raise ValueError("Cannot determine the MIME type of the file")
    
    base64_string = base64.b64encode(response.content).decode("utf-8")
    
    data_uri = f"data:{mime_type};base64,{base64_string}"
    return data_uri


def encode_image_to_base64(image_path):
    mime_type, _ = mimetypes.guess_type(image_path)
    if not mime_type:
        raise ValueError("Cannot determine the MIME type of the file")

    # Read and encode image in base64
    with open(image_path, "rb") as img_file:
        base64_string = base64.b64encode(img_file.read()).decode("utf-8")

    # Format it with data URI scheme
    data_uri = f"data:{mime_type};base64,{base64_string}"
    return data_uri


def generate_unique_filename(extension: str = ".jpg", max_attempts: int = 10) -> str:
    filename = f"{uuid.uuid4().hex}{extension}"
    return filename
    
    # TODO: fix this
    for _ in range(max_attempts):
        filename = f"{uuid.uuid4().hex}{extension}"
        try:
            # Try to get metadata; if it exists, filename is taken
            supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
            supabase.storage.from_(IMG_BUCKET_NAME).get_metadata(filename)
        except Exception as e:
            if "object not found" in str(e).lower():
                return filename
    raise Exception("Unable to generate a unique filename after multiple attempts.")

def upload_image_to_bucket(image):
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        filename = generate_unique_filename()

        res = supabase.storage.from_(IMG_BUCKET_NAME).upload(filename, base64_to_bytes(image))
        

    except StorageException as e:
        raise Exception(f"Upload failed: {e.message}")

    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{IMG_BUCKET_NAME}/{filename}"
    return public_url


def most_similar_img(embedding, db: Session):
    threshold = 0.2
    query = text("""
        SELECT name, (image_embedding <=> CAST(:embedding AS vector)) AS distance
        FROM Products
        WHERE image_embedding IS NOT NULL;
    """)

    params = {
        "embedding": embedding
    }

    result = db.execute(query, params).mappings().all()
    print(f'result type: {type(result)}, result: {result}')
    query = text("""
        SELECT * FROM Products
        WHERE (image_embedding <=> CAST(:embedding AS vector)) < :threshold
        ORDER BY image_embedding <=> CAST(:embedding AS vector)
        LIMIT 1;
    """)

    params = {
        "embedding": embedding, 
        "threshold": threshold,
    }
    
    result = db.execute(query, params).mappings().fetchone()

    if result:
        print(f'result type: {type(result)}, result: {result}')
        return models.Product(**result)
    return None

def most_similar_img_for_user(
    embedding: str,
    current_user_id: int,
    db: Session
):
    threshold = 0.2
    
    query = text("""
        SELECT p.*
        FROM Products p
        JOIN History h ON p.id = h.product_id
        WHERE h.user_id = :current_user_id
          AND p.image_embedding IS NOT NULL
          AND (p.image_embedding <=> CAST(:embedding AS vector)) < :threshold
        ORDER BY (p.image_embedding <=> CAST(:embedding AS vector)) ASC
        LIMIT 1;
    """)

    params = {
        "embedding": embedding,
        "threshold": threshold,
        "current_user_id": current_user_id
    }
    
    result_row = db.execute(query, params).mappings().fetchone()

    if result_row:
        print(f'Most similar product for user {current_user_id} found: type: {type(result_row)}, result: {result_row}')
        return models.Product(**result_row)
    
    print(f'No product found for user {current_user_id} within the similarity threshold.')
    return None

import numpy as np

def normalize(vector):
    norm = np.linalg.norm(vector)
    if norm == 0:
        return vector
    return vector / norm


def get_image_embedding(base64image):
    # encoded_image = encode_image_to_base64(image_path)
    payload = {
        "image": base64image
    }

    headers = {
        "Content-Type": "application/json"
    }
    response = requests.post(f'{AI_SERVICE_URL}/image-encode', json=payload, headers=headers)
    if response.ok:
        # print("Success:", response.json())
        print("Success on image_encode_endpoint")
    else:
        print("Error:", response.status_code, response.text)
    embedding = response.json()["textDescriptionEmbedding"]

    return normalize(embedding).tolist()

def get_AI_product_info(base64image):
    payload = {
        "image": base64image
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.post(f'{AI_SERVICE_URL}/product-info', json=payload, headers=headers)
    if response.ok:
        # print("Success:", response.json())
        print("Success on image_encode_endpoint")
    else:
        print("Error:", response.status_code, response.text)
    return response.json()["response"]["productName"], response.json()["response"]["productManufacturer"], response.json()["response"]["productDescription"]

def get_AI_health_suggestion(base64image, health_flags):
    payload = {
        "image": base64image,
        "dietaryPref": ",".join(health_flags)
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.post(f'{AI_SERVICE_URL}/health-suggestion', json=payload, headers=headers)
    if response.ok:
        print("Success:", response.json())
        # print("Success on image_encode_endpoint")
    else:
        print("Error:", response.status_code, response.text)

    return response.json()["response"]["opinion"], response.json()["response"]["reason"],

if __name__ == '__main__':
    query_image_path = "./static/picture/test_images/ingredient/milk.png"
    # query_image_path = "C:\Users\user\家榆\LineYahoo\HackU\flavorpal-app\backend\static\picture\test_images\milk2.jpg"
    encoded_image = encode_image_to_base64(query_image_path)
    summary, reason = get_AI_health_suggestion(encoded_image, "peanut allergic")
    print(f'summary: {summary}, reason: {reason}')




def generate_ProductDetailsFrontend(product, review):
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
    return product_details
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from storage3.utils import StorageException
from app import schemas, models
from app.db.db_supabase import get_db
from fastapi import  Depends
from sqlalchemy import text
import base64
import mimetypes
import requests

load_dotenv() 

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def upload_image_to_bucket(image, bucket_name, file_name):
    try:
        res = supabase.storage.from_(bucket_name).upload(file_name, image)
    except StorageException as e:
        raise Exception(f"Upload failed: {e.message}")

    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket_name}/{file_name}"
    return public_url


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

def send_to_image_encode_endpoint(image_path, endpoint_url):
    encoded_image = encode_image_to_base64(image_path)
    payload = {
        "image": encoded_image
    }

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(endpoint_url, json=payload, headers=headers)
    if response.ok:
        print("Success:", response.json())
        # print("Success on image_encode_endpoint")
    else:
        print("Error:", response.status_code, response.text)
    return response.json()

def create_product(product: schemas.ProductCreate, db=Depends(get_db)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    return db_product

def most_similar_img(embedding, db):
    query = text("""
        SELECT * FROM Products
        ORDER BY image_embedding <-> (:embedding)::vector
        LIMIT 1;
    """)
    result = db.execute(query, {"embedding": embedding})
    return result.fetchone()


# Example usage
def test_encode_img():
    image_path = "static/picture/test_images/sprite.jpg" 
    endpoint_url = "https://flavorpal-ai.louishhy.com/image-encode" 
    send_to_image_encode_endpoint(image_path, endpoint_url)

def test_upload_image_to_bucket():
    file_path = "static/picture/test_images/sprite.jpg"
    bucket_name = "product-img"
    file_name = "sprite.jpg"

    # Upload to Supabase Storage
    with open(file_path, "rb") as f:
        image_url = upload_image_to_bucket(f, bucket_name, file_name)
    print(f'Successfully upload, image_url: {image_url}')


def test_create_product_with_embedding():
    image_path = "./static/picture/test_images/cola.jpg" 
    endpoint_url = "https://flavorpal-ai.louishhy.com/image-encode"
    product_name = "cola"
    image_url = "https://lsjrpoqmdydtndingyax.supabase.co/storage/v1/object/public/product-img//cola.jpg"
    response = send_to_image_encode_endpoint(image_path, endpoint_url)
    embedding = response["textDescriptionEmbedding"]

    product = schemas.ProductCreate(
            id="01303",
            name=product_name,
            image_url=image_url,
            image_embedding=embedding,
        )
    db = next(get_db())
    db_product = create_product(product, db)
    print("Inserted product with name:", db_product.name)

def test_most_similar_img():
    query_image_path = "./static/picture/test_images/milk2.jpg"
    endpoint_url = "https://flavorpal-ai.louishhy.com/image-encode"
    response = send_to_image_encode_endpoint(query_image_path, endpoint_url)
    embedding = response["textDescriptionEmbedding"]
    
    db = next(get_db())
    product = most_similar_img(embedding, db)

    if product:
        print(f"Most similar product id: {product.id}, name: {product.name}")
    else:
        print("No matching product found.")

if __name__ == '__main__':
    test_most_similar_img()
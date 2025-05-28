from supabase import create_client, Client
import os
from dotenv import load_dotenv
from storage3.utils import StorageException
from app import schemas, models
from app.db.db_supabase import get_db
from app.utils.ResponseResult import Response
from app.utils import response  
from sqlalchemy.orm import Session
from fastapi import  Depends
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

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# def upload_image_to_bucket(image, bucket_name, file_name):
#     try:
#         res = supabase.storage.from_(bucket_name).upload(file_name, image)
#     except StorageException as e:
#         raise Exception(f"Upload failed: {e.message}")

#     public_url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket_name}/{file_name}"
#     return public_url


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

# def send_to_image_encode_endpoint(image_path, endpoint_url):
#     encoded_image = encode_image_to_base64(image_path)
#     payload = {
#         "image": encoded_image
#     }

#     headers = {
#         "Content-Type": "application/json"
#     }

#     response = requests.post(endpoint_url, json=payload, headers=headers)
#     if response.ok:
#         print("Success:", response.json())
#         # print("Success on image_encode_endpoint")
#     else:
#         print("Error:", response.status_code, response.text)
#     return response.json()

# def create_product(product: schemas.ProductCreate, db=Depends(get_db)):
#     db_product = models.Product(**product.dict())
#     db.add(db_product)
#     db.commit()
#     return db_product





def generate_unique_filename(extension: str = ".jpg", max_attempts: int = 10) -> str:
    for _ in range(max_attempts):
        filename = f"{uuid.uuid4().hex}{extension}"
        try:
            # Try to get metadata; if it exists, filename is taken
            supabase.storage.from_(IMG_BUCKET_NAME).get_metadata(filename)
        except Exception as e:
            if "object not found" in str(e).lower():
                return filename
    raise Exception("Unable to generate a unique filename after multiple attempts.")

def upload_image_to_bucket(image):
    try:
        filename = generate_unique_filename()
        res = supabase.storage.from_(IMG_BUCKET_NAME).upload(filename, image)
    except StorageException as e:
        raise Exception(f"Upload failed: {e.message}")

    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{IMG_BUCKET_NAME}/{filename}"
    return public_url

# def most_similar_img(embedding, db: Session):
#     threshold = 0.2
#     query = text("""
#         SELECT * FROM Products
#         WHERE (image_embedding <-> (:embedding)::vector) < (:threshold)
#         ORDER BY image_embedding <-> (:embedding)::vector
#         LIMIT 1;
#                  SELECT * FROM Products
#     """)
#     # result = db.execute(query, {"embedding": embedding, "threshold": threshold})
#     product = db.query(models.Product).from_statement(query).params(embedding=embedding, threshold=threshold).first()
#     return product



def most_similar_img(embedding, db: Session):
    threshold = 0.2
    
    query = text("""
        SELECT * FROM Products
        WHERE (image_embedding <-> :embedding::vector) < :threshold
        ORDER BY image_embedding <-> :embedding::vector
        LIMIT 1;
    """)

    result = db.execute(query, {"embedding": embedding, "threshold": threshold}).fetchone()

    if result:
        # Assuming the result is a dictionary or tuple-like object, we can map it to a product object
        return models.Product(**result)  # Convert the result to a Product model object
    return None

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
    return response.json()["textDescriptionEmbedding"]

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
    return response.json()["productName"], response.json()["productManufacturer"], response.json()["productDescription"]


"""
Add-by-image,
Input:
base64image: string (this is for user taking picture of FRONT SIDE
1. Get embedding of query image (photo taken by user) from AI,
2. Check if similar product exist in the db,
3-1. If exist: return product information
3-2. If not: 
    1) save this image to the bucket and get img_url
    2) hit AI "Product information" to get product name/manufacturer
    3) save product information into RDB Products table 
return: Product information
"""
def add_by_image(base64image: str,  db: Session = Depends(get_db)):
    embedding = get_image_embedding(base64image)
    product = most_similar_img(embedding, db)
    
    if product:
        print(f"Most similar product id: {product.id}, name: {product.name}")
        return Response(code=200, data=product, msg="Product fetched successfully")
    else:
        image_url = upload_image_to_bucket(base64image)
        product_name, product_manufacturer, product_description = get_AI_product_info(base64image)
        product = schemas.ProductCreate(
            name=product_name,
            image_url=image_url,
            image_embedding=embedding,
            brands=[product_manufacturer]
        )
        db_product = models.Product(**product.dict())
        db.add(db_product)
        db.commit()
        return Response(code=200, data=product, msg="Product fetched successfully")


"""
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

"""



if __name__ == '__main__':
    image_path = "./static/picture/test_images/cola.jpg"
    encoded_image = encode_image_to_base64(image_path) 
    
    result = add_by_image(encoded_image)
    print(f"Fetched or created product: {result}")

    
    



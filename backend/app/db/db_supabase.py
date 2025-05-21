from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from sqlalchemy import text
from sqlalchemy.orm import declarative_base
from app import schemas, models
import datetime

<<<<<<< HEAD
load_dotenv() 
=======
load_dotenv()
>>>>>>> backend

USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
DBNAME = os.getenv("DBNAME")

DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

<<<<<<< HEAD
=======

>>>>>>> backend
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_exec():
    db = next(get_db())
    result = db.execute(text("SELECT 1")).scalar()
    print("Test SELECT 1 result:", result)

    # Example 2: List tables (useful to check access)
    tables = db.execute(text("""
                SELECT table_name FROM information_schema.tables
                WHERE table_schema = 'public';
            """)).fetchall()
    print("Accessible tables in 'public':", [t[0] for t in tables])
<<<<<<< HEAD

=======
>>>>>>> backend

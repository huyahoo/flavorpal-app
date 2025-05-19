* This backend project is built using FastAPI, SQLAlchemy, and Alembic for database migrations. Below is an overview of the directory structure and responsibilities:

## Project Structure

backend/
├── alembic/               # Alembic migration files
│   ├── versions/          # Auto-generated DB migration scripts
│   ├── env.py             # Alembic environment setup
│   └── script.py.mako     # Template for new migration scripts
│
├── app/                   # Main FastAPI application package
│   ├── core/              # Configuration, constants, settings
│   ├── crud/              # Database operation logic (CRUD functions)  
│   ├── db/                # Database initialization and session
│   ├── models/            # SQLAlchemy ORM models
│   ├── routers/           # API route definitions (User, Product, etc.)
│   ├── schemas/           # Pydantic schemas for request/response validation
│   ├── utils/             # Utility functions (e.g., hashing, common tools)
│   └── main.py            # FastAPI application entry point        

## Running the backend
Make sure you have Docker installed.

```bash
docker compose up --build
```

## Comments
My apologies — the current comments for individual methods are insufficient. I’ll be adding detailed explanations tomorrow.

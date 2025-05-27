from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, badges, users, history, products, reviews

app = FastAPI(title="FlavorPal API")

# --- CORS Middleware ---
origins = [
    "http://localhost:5173",
    "https://localhost:5173",
    "https://flavor-pal.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # List of origins that are allowed to make requests
    allow_credentials=True,    # Allow cookies to be included in requests
    allow_methods=["*"],         # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],         # Allow all headers
)

# Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(history.router)
app.include_router(products.router)
app.include_router(reviews.router)
app.include_router(badges.router)


@app.get("/")
def read_root():
    return {"msg": "Welcome to the API"}

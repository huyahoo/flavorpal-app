from fastapi import FastAPI
from app.routers import users, history, products, reviews

app = FastAPI()

# 注册路由模块
app.include_router(users.router)
app.include_router(history.router)
app.include_router(products.router)
app.include_router(reviews.router)


@app.get("/")
def read_root():
    return {"msg": "Welcome to the API"}

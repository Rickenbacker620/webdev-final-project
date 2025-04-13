from fastapi import APIRouter
from app.api.routes import auth, recipes

root_router = APIRouter()
root_router.include_router(auth.router, tags=["auth"], prefix="/auth")
root_router.include_router(recipes.router, tags=["recipes"], prefix="/recipes")
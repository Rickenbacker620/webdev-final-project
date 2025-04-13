# from contextlib import asynccontextmanager
# from fastapi import FastAPI

# from apis.auth import router as auth_router
# from apis.recipes import router as recipes_router
# from db import clear_db, create_db_and_tables, create_mock_data

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     await clear_db()
#     await create_db_and_tables()
#     await create_mock_data()
#     yield


# app = FastAPI(lifespan=lifespan)


# # Include routers
# app.include_router(auth_router, prefix="/auth", tags=["auth"])
# app.include_router(recipes_router, prefix="/recipes", tags=["recipes"])

# Models


# @app.get("/users")  # [Optional/Admin] Get all users (could be protected/limited)

# @app.delete("/users/{user_id}")  # Delete a user by ID (admin or self-action)

# # --- Recipes ---

# @app.get("/recipes")  # Get a list of all recipes (consider pagination, filters)

# @app.get("/recipes/{recipe_id}")  # Get details of a specific recipe

# @app.post("/recipes")  # Create a new recipe (auth required)

# # --- Recipe Likes ---

# @app.post("/recipes/{recipe_id}/likes")  # Like a recipe (idempotent)

# @app.delete("/recipes/{recipe_id}/likes")  # Unlike a recipe

# # --- Comments ---

# @app.post("/recipes/{recipe_id}/comment")  # Post a comment on a recipe

# @app.delete("/comments/{comment_id}")  # Delete a comment (owner or admin)

# # --- Recipe Lists (Bookmarks/Collections) ---

# @app.get("/recipe-lists")  # Get all lists created by the current user

# @app.post("/recipe-lists")  # Create a new recipe list (e.g., Favorites, To Try)

# @app.post("/recipe-lists/{recipe_list_id}/recipes")  # Add a recipe to a list

# @app.delete("/recipe-lists/{recipe_list_id}/recipes/{recipe_id}")  # Remove a recipe from a list

# @app.get("/recipe-lists/{recipe_list_id}/recipes")  # Get all recipes in a specific list

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.db import clear_db, create_db_and_tables, create_mock_data
from app.api import root_router


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


@asynccontextmanager
async def lifespan(app: FastAPI):
    await clear_db()
    await create_db_and_tables()
    await create_mock_data()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(root_router, prefix=settings.API_PREFIX)
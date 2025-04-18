from sqlmodel import SQLModel, Field
from datetime import datetime
from pydantic import BaseModel


# Pydantic model for external recipe reference
# This is NOT stored in our database
class Recipe(BaseModel):
    id: int  # ID from the external API
    # External API will provide other recipe details

class Comment(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    recipe_id: int  # External recipe ID, not a foreign key
    content: str
    created_at: datetime = Field(default_factory=datetime.now)

class RecipeLike(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    recipe_id: int  # External recipe ID, not a foreign key

class RecipeList(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    created_at: datetime = Field(default_factory=datetime.now)

class RecipeListItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    recipe_list_id: int = Field(foreign_key="recipelist.id")
    recipe_id: int  # External recipe ID, not a foreign key

# Recipe Stats model for returning recipe statistics
class RecipeStats(SQLModel):
    recipe_id: int
    likes_count: int
    comments_count: int
    user_liked: bool = False

class RecipeRead(SQLModel):
    id: int
    liked: bool = False

class RecipeUpdate(SQLModel):
    pass  # Not needed since we don't update recipes in our system

# User models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    role: str = Field(default="user")
    description: str | None = None  # Added to align with ER diagram
    created_at: datetime = Field(default_factory=datetime.now)  # Added to align with ER diagram

class UserCreate(SQLModel):
    username: str
    email: str
    password: str
    description: str | None = None

class UserRead(SQLModel):
    id: int
    username: str
    email: str
    role: str
    description: str | None = None
    created_at: datetime

class UserUpdate(SQLModel):
    email: str | None = None
    description: str | None = None
    password: str | None = None

from sqlmodel import SQLModel, Field
from datetime import datetime
from pydantic import BaseModel


class Recipe(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: str | None = None
    ingredients: str
    steps: str
    image_url: str | None = None
    created_at: datetime
    public: bool = Field(default=True)
    author_id: int = Field(foreign_key="user.id")

class Comment(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    recipe_id: int = Field(foreign_key="recipe.id")
    content: str
    created_at: datetime

class RecipeLike(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    recipe_id: int = Field(foreign_key="recipe.id")

class Tag(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)

class RecipeTag(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    tag_id: int = Field(foreign_key="tag.id")
    recipe_id: int = Field(foreign_key="recipe.id")

class RecipeList(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    created_at: datetime

class RecipeListItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    recipe_list_id: int = Field(foreign_key="recipelist.id")
    recipe_id: int = Field(foreign_key="recipe.id")

class RecipeCreate(SQLModel):
    title: str
    description: str | None = None
    ingredients: str
    steps: str
    image_url: str | None = None

class RecipeRead(SQLModel):
    id: int
    title: str
    description: str | None = None
    ingredients: str
    steps: str
    image_url: str | None = None
    created_at: datetime
    liked: bool = False
    author_id: int

class RecipeUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    ingredients: str | None = None
    steps: str | None = None
    image_url: str | None = None

# user.py

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
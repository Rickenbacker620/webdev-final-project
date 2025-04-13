
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from typing import AsyncGenerator

from app.models import User
from app.models import Recipe, Comment, RecipeLike, Tag, RecipeTag, RecipeList, RecipeListItem
from datetime import datetime
from passlib.context import CryptContext
from app.core.config import settings

engine = create_async_engine(settings.CONN_STR)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(engine) as session:
        yield session

async def create_mock_data():
    async with AsyncSession(engine) as session:
        # 👤 Create users
        user = User(
            username="regular_user",
            email="user@example.com",
            hashed_password=get_password_hash("password123"),
            role="user",
        )

        chef = User(
            username="chef_user",
            email="chef@example.com",
            hashed_password=get_password_hash("chefpassword"),
            role="chef",
        )

        session.add_all([user, chef])
        await session.flush()  # 确保 user.id, chef.id 可用
        await session.refresh(user)
        await session.refresh(chef)

        # 🍳 Recipes
        now = datetime.now()
        recipes_for_chef = [
            Recipe(title=f"Recipe{i+1} from chef", description=f"Description{i+1} from chef",
                   ingredients=f"Ingredients{i+1}", steps=f"Steps{i+1}", image_url="https://placehold.co/600x400",
                   created_at=now, author_id=chef.id)
            for i in range(3)
        ]
        recipes_for_user = [
            Recipe(title=f"Recipe{i+1} from user", description=f"Description{i+1} from user",
                   ingredients=f"Ingredients{i+1}", steps=f"Steps{i+1}",image_url="https://placehold.co/600x400",
                   created_at=now, author_id=user.id)
            for i in range(2)
        ]

        recipes_for_user[0].public = False

        all_recipes = recipes_for_chef + recipes_for_user
        session.add_all(all_recipes)
        await session.flush()
        for r in all_recipes:
            await session.refresh(r)

        # 💬 Comments
        comments = [
            Comment(user_id=user.id, recipe_id=recipes_for_chef[0].id, content="Great recipe!", created_at=now),
            Comment(user_id=chef.id, recipe_id=recipes_for_user[0].id, content="Easy to follow steps!", created_at=now),
        ]

        # 👍 Likes
        likes = [
            RecipeLike(user_id=user.id, recipe_id=recipes_for_chef[0].id),
            RecipeLike(user_id=chef.id, recipe_id=recipes_for_user[0].id),
        ]

        # 🏷️ Tags
        tags = [Tag(name=name) for name in ["Vegetarian", "Quick Meal", "Dessert"]]
        session.add_all(tags)
        await session.flush()
        for t in tags:
            await session.refresh(t)

        # 🔗 Tag associations
        recipe_tags = [
            RecipeTag(tag_id=tags[0].id, recipe_id=recipes_for_chef[0].id),
            RecipeTag(tag_id=tags[1].id, recipe_id=recipes_for_user[0].id),
        ]

        # 📋 Recipe List
        recipe_list = RecipeList(user_id=user.id, name="Favorites", created_at=now)
        session.add(recipe_list)
        await session.flush()
        await session.refresh(recipe_list)

        # 📥 Recipe list items
        recipe_list_items = [
            RecipeListItem(recipe_list_id=recipe_list.id, recipe_id=recipes_for_chef[0].id),
            RecipeListItem(recipe_list_id=recipe_list.id, recipe_id=recipes_for_user[0].id),
        ]

        # 💾 Final bulk insert
        session.add_all(comments + likes + recipe_tags + recipe_list_items)
        await session.commit()

async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    
async def clear_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
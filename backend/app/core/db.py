from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from typing import AsyncGenerator

from app.models import User
from app.models import Comment, RecipeLike, RecipeList, RecipeListItem
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
            hashed_password=get_password_hash("regularpass"),
            description="Just a regular user",
            role="user",
        )

        chef = User(
            username="chef_user",
            email="chef@example.com",
            hashed_password=get_password_hash("chefpass"),
            description="A passionate chef",
            role="chef",
        )

        admin = User(
            username="admin_user",
            email="admin@example.com",
            hashed_password=get_password_hash("adminpass"),
            description="The admin user",
            role="admin",
        )

        test_users = [
            User(
                username=f"test_user{i}",
                email=f"test{i}@email.com",
                hashed_password=get_password_hash(f"testpass{i}"),
                description=f"Test user {i}",
                role="user",
            )
            for i in range(1, 6)
        ]

        session.add_all([user, chef, admin, *test_users])
        await session.flush()  # ensure user.id, chef.id are available
        await session.refresh(user)
        await session.refresh(chef)

        # Define external recipe IDs for mock data
        # In a real app, these would be IDs from the external API
        recipe_ids = [52768, 53049]  

        now = datetime.now()
        
        # 💬 Comments
        comments = [
            Comment(user_id=user.id, recipe_id=recipe_ids[0], content="Great recipe!", created_at=now),
            Comment(user_id=chef.id, recipe_id=recipe_ids[1], content="Easy to follow steps!", created_at=now),
        ]

        # 👍 Likes
        likes = [
            RecipeLike(user_id=user.id, recipe_id=recipe_ids[0]),
            RecipeLike(user_id=chef.id, recipe_id=recipe_ids[1]),
        ]

        # 📋 Recipe List
        recipe_list = RecipeList(user_id=user.id, name="Favorites", created_at=now)
        session.add(recipe_list)
        await session.flush()
        await session.refresh(recipe_list)

        # 📥 Recipe list items
        recipe_list_items = [
            RecipeListItem(recipe_list_id=recipe_list.id, recipe_id=recipe_ids[0]),
            RecipeListItem(recipe_list_id=recipe_list.id, recipe_id=recipe_ids[1]),
        ]

        # 💾 Final bulk insert
        session.add_all(comments + likes + recipe_list_items)
        await session.commit()

async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    
async def clear_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
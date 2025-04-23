from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel
from sqlmodel import select, func

from app.api.deps import CurrentUser, CurrentUserNotRequired, SessionDep
from app.models import RecipeLike, Comment, RecipeStats, RecipeList, RecipeListItem, User

router = APIRouter()

# Get recipe likes count and comments count
@router.get("/{recipe_id}/stats", response_model=RecipeStats)
async def get_recipe_details(
    recipe_id: int,
    current_user: CurrentUserNotRequired,
    session: SessionDep
):
    # Count likes for the recipe
    likes_count_result = await session.exec(
        select(func.count()).where(RecipeLike.recipe_id == recipe_id)
    )
    likes_count = likes_count_result.one()

    # Count comments for the recipe
    comments_count_result = await session.exec(
        select(func.count()).where(Comment.recipe_id == recipe_id)
    )
    comments_count = comments_count_result.one()

    return RecipeStats(
        recipe_id=recipe_id,
        likes_count=likes_count,
        comments_count=comments_count
    )

@router.get("/liked-recipes/{user_id}")
async def get_liked_recipes(current_user: CurrentUser, session: SessionDep, user_id: int):
    liked_recipes = await session.exec(
        select(RecipeLike)
        .where(RecipeLike.user_id == user_id)
    )

    liked_recipes_ids = set(
        recipe_like.recipe_id
        for recipe_like in liked_recipes.all()
    )

    return liked_recipes_ids

@router.post("/{recipe_id}/like", status_code=204)
async def like_recipe(recipe_id: int, current_user: CurrentUser, session: SessionDep):
    # We don't need to check if the recipe exists in our database anymore
    # since recipes come from an external API
    
    existing_like = await session.exec(
        select(RecipeLike).where(
            RecipeLike.recipe_id == recipe_id,
            RecipeLike.user_id == current_user.id
        )
    )
    existing_like_instance = existing_like.first()  # Fetch the first result immediately

    if existing_like_instance:
        # Remove existing like
        await session.delete(existing_like_instance)
    else:
        new_like = RecipeLike(user_id=current_user.id, recipe_id=recipe_id)
        session.add(new_like)
    await session.commit()

@router.get("/{recipe_id}/like")
async def get_like_status(
    recipe_id: int,
    current_user: CurrentUser,
    session: SessionDep
):
    print(current_user.id)
    # Check if the user has liked the recipe
    like_status = await session.exec(
        select(RecipeLike).where(
            RecipeLike.recipe_id == recipe_id,
            RecipeLike.user_id == current_user.id
        )
    )
    is_liked = like_status.first() is not None

    return {"is_liked": is_liked}

# Create a new recipe-list
@router.post("/recipe-lists")
async def create_recipe_list(
    recipe_list_name: Annotated[str, Body()],
    current_user: CurrentUser,
    session: SessionDep
):
    # Create a new RecipeList entry
    new_recipe_list = RecipeList(user_id=current_user.id, name=recipe_list_name)
    session.add(new_recipe_list)
    await session.commit()
    await session.refresh(new_recipe_list)

    return new_recipe_list

# Get all recipe-lists created by me
@router.get("/recipe-lists")
async def get_recipe_list(
    current_user: CurrentUser,
    session: SessionDep
):
    # Query all RecipeLists for the current user
    recipe_lists = await session.exec(
        select(RecipeList).where(RecipeList.user_id == current_user.id)
    )

    return recipe_lists.all()

# Get all recipes in a recipe-list
@router.get("/recipe-lists/{recipe_list_id}")
async def get_recipes_in_list(
    recipe_list_id: int,
    current_user: CurrentUser,
    session: SessionDep
):
    # Query all RecipeListItems for the given recipe_list_id
    recipe_list_items = await session.exec(
        select(RecipeListItem).where(RecipeListItem.recipe_list_id == recipe_list_id)
    )

    return recipe_list_items.all()

# Add a recipe to a recipe-list
@router.post("/recipe-lists/{recipe_list_id}")
async def add_recipe_to_list(
    recipe_id: Annotated[int, Body()],
    recipe_list_id: int,
    current_user: CurrentUser,
    session: SessionDep
):
    # Create a new RecipeListItem entry
    new_recipe_list_item = RecipeListItem(recipe_list_id=recipe_list_id, recipe_id=recipe_id)
    session.add(new_recipe_list_item)
    await session.commit()
    await session.refresh(new_recipe_list_item)

    return new_recipe_list_item

# Remove a recipe from a recipe-list
@router.delete("/recipe-lists/{recipe_list_id}/{recipe_id}")
async def remove_recipe_from_list(
    recipe_id: int,
    recipe_list_id: int,
    current_user: CurrentUser,
    session: SessionDep
):
    # Query the RecipeListItem to delete
    recipe_list_item = await session.exec(
        select(RecipeListItem).where(
            RecipeListItem.recipe_list_id == recipe_list_id,
            RecipeListItem.recipe_id == recipe_id
        )
    )
    recipe_list_item_instance = recipe_list_item.first()

    if not recipe_list_item_instance:
        raise HTTPException(status_code=404, detail="Recipe not found in the list")

    await session.delete(recipe_list_item_instance)
    await session.commit()

    return {"detail": "Recipe removed from the list"}

class CommentCreate(BaseModel):
    content: str

@router.post("/{recipe_id}/comments")
async def comment_on_recipe(
    recipe_id: int,
    comment: CommentCreate,
    current_user: CurrentUser,
    session: SessionDep
):
    # Create a new comment for the recipe
    new_comment = Comment(
        recipe_id=recipe_id,
        user_id=current_user.id,
        content=comment.content,
        created_at=datetime.utcnow()
    )
    session.add(new_comment)
    await session.commit()
    await session.refresh(new_comment)

    return new_comment

@router.get("/{recipe_id}/comments")
async def get_comments_on_recipe(
    recipe_id: int,
    current_user: CurrentUserNotRequired,
    session: SessionDep
):
    # Retrieve all comments for the given recipe
    comments = await session.exec(
        select(Comment, User.username).join(User, Comment.user_id == User.id).where(Comment.recipe_id == recipe_id)
    )

    return [
        {
            "id": comment.id,
            "content": comment.content,
            "created_at": comment.created_at,
            "username": username,
            "user_id": comment.user_id,
        }
        for comment, username in comments
    ]

@router.delete("/{recipe_id}/comments/{comment_id}")
async def delete_comment_on_recipe(
    recipe_id: int,
    comment_id: int,
    current_user: CurrentUser,
    session: SessionDep
):
    # Find the comment to delete
    comment = await session.exec(
        select(Comment).where(
            Comment.id == comment_id,
            Comment.recipe_id == recipe_id,
            Comment.user_id == current_user.id
        )
    )
    comment_instance = comment.first()

    if not comment_instance:
        raise HTTPException(status_code=404, detail="Comment not found or not authorized to delete")

    await session.delete(comment_instance)
    await session.commit()

    return {"detail": "Comment deleted successfully"}
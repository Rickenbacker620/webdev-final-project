from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import CurrentUser, CurrentUserNotRequired, SessionDep
from app.models import Recipe, RecipeCreate, RecipeRead, RecipeUpdate, RecipeLike

router = APIRouter()

async def get_recipes_with_liked(recipes: list[Recipe], current_user: CurrentUser, session: SessionDep):
    recipes_list = [
        RecipeRead.model_validate(recipe)
        for recipe in recipes.all()
    ]

    liked_recipes = await session.exec(
        select(RecipeLike).where(RecipeLike.user_id == current_user.id)
    )
    liked_recipes_ids = set(
        recipe_like.recipe_id
        for recipe_like in liked_recipes.all()
    )

    for recipe in recipes_list:
        recipe.liked = recipe.id in liked_recipes_ids
    return recipes_list



@router.get("", response_model=list[RecipeRead])
async def get_recipes(current_user: CurrentUserNotRequired, session: SessionDep):
    recipes_list = await session.exec(select(Recipe).where(Recipe.public))

    if current_user:
        recipes_list = await get_recipes_with_liked(recipes_list, current_user, session)

    return recipes_list

@router.get("/my-recipes", response_model=list[RecipeRead])
async def get_my_recipes(current_user: CurrentUser, session: SessionDep):
    recipes = await session.exec(select(Recipe).where(Recipe.author_id == current_user.id))

    my_recipes = await get_recipes_with_liked(recipes, current_user, session)

    return my_recipes

@router.get("/liked-recipes", response_model=list[RecipeRead])
async def get_liked_recipes(current_user: CurrentUser, session: SessionDep):
    liked_recipes = await session.exec(
        select(Recipe)
        .join(RecipeLike, RecipeLike.recipe_id == Recipe.id)
        .where(RecipeLike.user_id == current_user.id)
    )

    liked_recipes = [
        RecipeRead(**recipe.model_dump(), liked=True)
        for recipe in liked_recipes.all()
    ]

    return liked_recipes

@router.get("/{recipe_id}", response_model=RecipeRead)
async def get_recipe(recipe_id: int, session: SessionDep):
    recipe = await session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@router.post("/", response_model=RecipeRead)
async def create_recipe(recipe: RecipeCreate, session: SessionDep):
    new_recipe = Recipe.model_validate(recipe)
    session.add(new_recipe)
    await session.commit()
    await session.refresh(new_recipe)
    return new_recipe

@router.put("/{recipe_id}", response_model=RecipeRead)
async def update_recipe(recipe_id: int, recipe: RecipeUpdate, session: SessionDep):
    existing_recipe = await session.get(Recipe, recipe_id)
    if not existing_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    for key, value in recipe.model_dump(exclude_unset=True).items():
        setattr(existing_recipe, key, value)
    session.add(existing_recipe)
    await session.commit()
    await session.refresh(existing_recipe)
    return existing_recipe

@router.delete("/{recipe_id}", status_code=204)
async def delete_recipe(recipe_id: int, session: SessionDep):
    recipe = await session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    session.delete(recipe)
    await session.commit()

@router.post("/{recipe_id}/like", status_code=204)
async def like_recipe(recipe_id: int, current_user: CurrentUser, session: SessionDep):
    recipe = await session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

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
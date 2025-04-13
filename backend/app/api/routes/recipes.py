from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Recipe, RecipeCreate, RecipeRead, RecipeUpdate

router = APIRouter()

@router.get("/", response_model=list[RecipeRead])
async def get_recipes(session: SessionDep):
    recipes = await session.exec(select(Recipe).where(Recipe.public))
    return recipes.all()

@router.get("/my-recipes", response_model=list[RecipeRead])
async def get_my_recipes(current_user: CurrentUser, session: SessionDep):
    recipes = await session.exec(select(Recipe).where(Recipe.author_id == current_user.id))
    return recipes.all()

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
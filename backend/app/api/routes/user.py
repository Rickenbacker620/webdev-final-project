from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from app.api.deps import CurrentUser, SessionDep
from app.models import User, UserFollow, UserUpdate

router = APIRouter()

@router.post("/{user_id}/follow", status_code=204)
async def follow_user(user_id: int, current_user: CurrentUser, session: SessionDep):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself.")

    existing_follow = await session.exec(
        select(UserFollow).where(
            UserFollow.follower_id == current_user.id,
            UserFollow.followee_id == user_id
        )
    )
    if existing_follow.first():
        raise HTTPException(status_code=400, detail="You are already following this user.")

    new_follow = UserFollow(follower_id=current_user.id, followee_id=user_id)
    session.add(new_follow)
    await session.commit()

@router.delete("/{user_id}/follow", status_code=204)
async def unfollow_user(user_id: int, current_user: CurrentUser, session: SessionDep):
    follow = await session.exec(
        select(UserFollow).where(
            UserFollow.follower_id == current_user.id,
            UserFollow.followee_id == user_id
        )
    )
    follow_instance = follow.first()

    if not follow_instance:
        raise HTTPException(status_code=404, detail="You are not following this user.")

    await session.delete(follow_instance)
    await session.commit()

@router.get("/{user_id}/followers")
async def get_followers(user_id: int, session: SessionDep):
    followers = await session.exec(
        select(UserFollow).where(UserFollow.followee_id == user_id)
    )
    return [follow.follower_id for follow in followers.all()]

@router.get("/{user_id}/following")
async def get_following(user_id: int, session: SessionDep):
    following = await session.exec(
        select(UserFollow).where(UserFollow.follower_id == user_id)
    )
    return [follow.followee_id for follow in following.all()]

@router.get("/{user_id}")
async def get_user_profile(user_id: int, current_user: CurrentUser, session: SessionDep):
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if user.id == current_user.id:
        return user  # Return full profile for the current user

    # Return limited profile for other users
    return {
        "id": user.id,
        "username": user.username,
        "description": user.description,
    }

@router.put("/me")
async def update_user_profile(
    user_update: UserUpdate, current_user: CurrentUser, session: SessionDep
):
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, key, value)

    session.add(current_user)
    await session.commit()
    await session.refresh(current_user)
    return current_user
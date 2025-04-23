from fastapi import APIRouter, HTTPException
from sqlmodel import select
from app.api.deps import CurrentUser, SessionDep
from app.models import User, UserFollow, UserUpdate
from app.core.security import get_password_hash

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
    user = await session.get(User, current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    for key, value in user_update.model_dump(exclude_unset=True).items():
        if key == "password":
            # Handle password hashing
            user.hashed_password = get_password_hash(value)
            continue
        setattr(user, key, value)

    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

@router.get("/")
async def list_users(session: SessionDep):
    users = await session.exec(select(User))
    return users.all()

@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: int, current_user: CurrentUser, session: SessionDep):
    if current_user.role != "admin" and user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own account unless you are an admin.")

    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    await session.delete(user)
    await session.commit()
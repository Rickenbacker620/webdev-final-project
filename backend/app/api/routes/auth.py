from fastapi import Depends, HTTPException, status, APIRouter
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from typing import Annotated

from app.api.deps import CurrentUser, SessionDep, authenticate_user, get_user_by_username
from app.models import Token, User
from app.core.config import settings
from app.core.security import create_access_token, get_password_hash



router = APIRouter()

@router.post("/access-token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDep,
):
    user = await authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

@router.post("/signup")
async def signup(username: str, email: str, password: str, session: SessionDep):
    if await get_user_by_username(session, username):
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = get_password_hash(password)
    new_user = User(username=username, email=email, hashed_password=hashed_password)
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return {"message": "User created successfully", "user": new_user}

@router.get("/users/me", response_model=User)
async def read_users_me(
    current_user: CurrentUser
):
    return current_user
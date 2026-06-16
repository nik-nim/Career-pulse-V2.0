from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import create_access_token, verify_password, get_password_hash
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(
    email: str = Query(...),
    password: str = Query(...),
    full_name: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.email == email))
    if result.scalar_one_or_none():
        raise HTTPException(400, "Email already registered")
    user = User(email=email, full_name=full_name, hashed_password=get_password_hash(password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    token = create_access_token({"sub": user.id})
    return {"access_token": token, "user": {"id": user.id, "email": user.email, "full_name": user.full_name}}

@router.post("/login")
async def login(
    email: str = Query(...),
    password: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token({"sub": user.id})
    return {"access_token": token, "user": {"id": user.id, "email": user.email, "full_name": user.full_name}}
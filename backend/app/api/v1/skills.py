from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("/trending")
async def get_trending_skills():
    return {
        "trending": ["Python", "AWS", "Docker", "Kubernetes", "React", "TypeScript", "Machine Learning"]
    }
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.user import User, UserSkill
from app.schemas.user import UserResponse, UserSkillSchema
from app.api.deps import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/skills", response_model=UserSkillSchema)
async def add_skill(
    skill_data: UserSkillSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skill = UserSkill(
        user_id=current_user.id,
        skill_name=skill_data.skill_name,
        proficiency=skill_data.proficiency,
    )
    db.add(skill)
    await db.commit()
    await db.refresh(skill)
    return skill


@router.get("/skills", response_model=list[UserSkillSchema])
async def get_my_skills(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(UserSkill).where(UserSkill.user_id == current_user.id)
    )
    return result.scalars().all()
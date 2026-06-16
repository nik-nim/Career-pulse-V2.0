from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class UserSkillSchema(BaseModel):
    id: Optional[UUID] = None
    skill_name: str
    proficiency: float = 0.5
    endorsements: int = 0

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    industry: Optional[str] = None
    experience_level: Optional[str] = None
    skills: List[UserSkillSchema] = []

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict
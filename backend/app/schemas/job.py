from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class JobCreate(BaseModel):
    title: str
    company: str
    location: str
    category: Optional[str] = None
    description: Optional[str] = None
    required_skills: List[str] = []
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    source: Optional[str] = None
    source_url: Optional[str] = None


class JobResponse(BaseModel):
    id: UUID
    title: str
    company: str
    location: str
    category: Optional[str] = None
    required_skills: List[str] = []
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    posted_date: Optional[datetime] = None

    class Config:
        from_attributes = True
from pydantic import BaseModel
from typing import List, Optional


class MatchedSkill(BaseModel):
    job_skill: str
    user_skill: str
    similarity: float


class JobMatchScore(BaseModel):
    id: str
    title: str
    company: str
    location: str
    category: Optional[str] = None
    required_skills: List[str] = []
    match_score: float
    matched_skills: List[MatchedSkill] = []
    missing_skills: List[str] = []


class MatchResponse(BaseModel):
    total_jobs: int
    matched_jobs: List[dict]
    user_skills: List[str]
    user_id: str
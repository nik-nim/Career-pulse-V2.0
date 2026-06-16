from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.job import Job

router = APIRouter(prefix="/match", tags=["matching"])


@router.get("/jobs")
async def match_jobs(
    limit: int = Query(10),
    db: AsyncSession = Depends(get_db),
):
    query = select(Job).where(Job.is_active == True).limit(limit)
    result = await db.execute(query)
    jobs = result.scalars().all()

    matched = []
    for j in jobs:
        score = 50 + (len(j.required_skills or []) * 8)  # Simple scoring
        matched.append({
            "id": str(j.id),
            "title": j.title,
            "company": j.company,
            "location": j.location,
            "category": j.category,
            "salary_min": j.salary_min,
            "salary_max": j.salary_max,
            "match_score": min(score, 98),
            "matched_skills": [{"job_skill": s, "user_skill": s, "similarity": 0.9} for s in (j.required_skills or [])[:3]],
            "missing_skills": (j.required_skills or [])[3:],
        })

    matched.sort(key=lambda x: x["match_score"], reverse=True)
    return {"total_jobs": len(jobs), "matched_jobs": matched, "user_skills": ["Python", "React", "SQL"]}
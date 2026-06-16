from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.core.database import get_db
from app.models.job import Job
from app.services.job_scraper import JobScraper

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("")
async def get_jobs(category: Optional[str] = Query(None), limit: int = Query(50, le=100), db: AsyncSession = Depends(get_db)):
    query = select(Job).where(Job.is_active == True)
    if category and category != "all": query = query.where(Job.category == category)
    query = query.limit(limit)
    result = await db.execute(query)
    jobs = result.scalars().all()
    return [{"id": str(j.id), "title": j.title, "company": j.company, "location": j.location, "category": j.category, "salary_min": j.salary_min, "salary_max": j.salary_max, "required_skills": j.required_skills, "source": j.source} for j in jobs]

@router.post("/scrape")
async def scrape_jobs(role: str = Query("software engineer"), location: str = Query("india"), db: AsyncSession = Depends(get_db)):
    scraper = JobScraper()
    scraped = await scraper.scrape_indeed(role, location)
    if not scraped: scraped = await scraper.get_sample_jobs()
    for job_data in scraped:
        job = Job(**job_data)
        db.add(job)
    await db.commit()
    return {"message": f"Scraped {len(scraped)} jobs", "jobs": [{"title": j["title"], "company": j["company"], "location": j["location"]} for j in scraped]}
# backend/worker/tasks.py
from worker.celery_app import celery_app
from app.services.job_scraper import JobScraper
from app.core.database import async_session
from app.models.job import Job
import asyncio


@celery_app.task
def scrape_all_job_sources():
    """Periodic task to scrape jobs from all sources"""
    roles = ["software engineer", "data scientist", "devops engineer", "product manager"]
    locations = ["india", "bangalore", "hyderabad", "mumbai", "pune", "remote"]

    async def run():
        scraper = JobScraper()
        all_jobs = []

        for role in roles:
            for location in locations[:2]:  # Limit to avoid rate limiting
                jobs = await scraper.scrape_adzuna(role, location)
                all_jobs.extend(jobs)

        # Save to database
        async with async_session() as session:
            for job_data in all_jobs:
                job = Job(**job_data)
                session.add(job)
            await session.commit()

    asyncio.run(run())
    return f"Scraped {len(all_jobs)} jobs"


@celery_app.task
def cleanup_expired_jobs():
    """Remove jobs older than 30 days"""
    from datetime import datetime, timedelta

    async def run():
        async with async_session() as session:
            from sqlalchemy import update
            cutoff = datetime.utcnow() - timedelta(days=30)
            await session.execute(
                update(Job).where(Job.posted_date < cutoff).values(is_active=False)
            )
            await session.commit()

    asyncio.run(run())
    return "Expired jobs cleaned up"
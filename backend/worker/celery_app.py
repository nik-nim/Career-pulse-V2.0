# backend/worker/celery_app.py
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "careerpulse",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    beat_schedule={
        "scrape-jobs-every-6-hours": {
            "task": "worker.tasks.scrape_all_job_sources",
            "schedule": 6 * 60 * 60,  # 6 hours
        },
        "cleanup-expired-jobs-daily": {
            "task": "worker.tasks.cleanup_expired_jobs",
            "schedule": 24 * 60 * 60,  # 24 hours
        },
    },
)
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Float, Text, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(300), index=True)
    company: Mapped[str] = mapped_column(String(200), index=True)
    location: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(100), index=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    required_skills = mapped_column(JSON, default=list)
    salary_min: Mapped[float] = mapped_column(Float, nullable=True)
    salary_max: Mapped[float] = mapped_column(Float, nullable=True)
    salary_currency: Mapped[str] = mapped_column(String(10), default="INR")
    source: Mapped[str] = mapped_column(String(50), nullable=True)
    source_url: Mapped[str] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Boolean, Text, Float, ForeignKey, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    hashed_password: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    headline: Mapped[str] = mapped_column(String(200), nullable=True)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    location: Mapped[str] = mapped_column(String(200), nullable=True)
    experience_years: Mapped[int] = mapped_column(Integer, default=0)
    education: Mapped[str] = mapped_column(String(500), nullable=True)
    target_role: Mapped[str] = mapped_column(String(200), nullable=True)
    target_salary: Mapped[float] = mapped_column(Float, nullable=True)
    resume_text: Mapped[str] = mapped_column(Text, nullable=True)
    linkedin_url: Mapped[str] = mapped_column(String(255), nullable=True)
    github_url: Mapped[str] = mapped_column(String(255), nullable=True)
    portfolio_url: Mapped[str] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="user", cascade="all, delete-orphan")
    daily_logs = relationship("DailyLog", back_populates="user", cascade="all, delete-orphan")

class UserSkill(Base):
    __tablename__ = "user_skills"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    skill_name: Mapped[str] = mapped_column(String(100))
    proficiency: Mapped[int] = mapped_column(Integer, default=50)
    user = relationship("User", back_populates="skills")

class Application(Base):
    __tablename__ = "applications"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    job_title: Mapped[str] = mapped_column(String(300))
    company: Mapped[str] = mapped_column(String(200))
    location: Mapped[str] = mapped_column(String(200), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="Applied")
    applied_date: Mapped[str] = mapped_column(String(50))
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    user = relationship("User", back_populates="applications")

class Interview(Base):
    __tablename__ = "interviews"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    company: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(200))
    date: Mapped[str] = mapped_column(String(50))
    time: Mapped[str] = mapped_column(String(20), nullable=True)
    type: Mapped[str] = mapped_column(String(50), default="Technical")
    status: Mapped[str] = mapped_column(String(50), default="Scheduled")
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    user = relationship("User", back_populates="interviews")

class DailyLog(Base):
    __tablename__ = "daily_logs"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"))
    date: Mapped[str] = mapped_column(String(50))
    applications_count: Mapped[int] = mapped_column(Integer, default=0)
    interviews_count: Mapped[int] = mapped_column(Integer, default=0)
    practice_hours: Mapped[float] = mapped_column(Float, default=0.0)
    mood: Mapped[str] = mapped_column(String(50), nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    user = relationship("User", back_populates="daily_logs")
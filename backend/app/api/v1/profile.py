from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.core.database import get_db
from app.models.user import User, UserSkill, Application, Interview, DailyLog
from app.api.deps import get_current_user
from app.services.email_service import EmailService
from datetime import date

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("")
async def get_profile(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not current_user: raise HTTPException(401, "Login required")
    result = await db.execute(select(UserSkill).where(UserSkill.user_id == current_user.id))
    skills = [{"id": s.id, "skill_name": s.skill_name, "proficiency": s.proficiency} for s in result.scalars().all()]
    return {
        "id": current_user.id, "email": current_user.email, "full_name": current_user.full_name,
        "headline": current_user.headline, "bio": current_user.bio, "phone": current_user.phone,
        "location": current_user.location, "experience_years": current_user.experience_years,
        "education": current_user.education, "target_role": current_user.target_role,
        "target_salary": current_user.target_salary, "linkedin_url": current_user.linkedin_url,
        "github_url": current_user.github_url, "portfolio_url": current_user.portfolio_url, "skills": skills,
    }

@router.put("")
async def update_profile(
    full_name: Optional[str] = Query(None), headline: Optional[str] = Query(None),
    bio: Optional[str] = Query(None), phone: Optional[str] = Query(None),
    location: Optional[str] = Query(None), experience_years: Optional[int] = Query(None),
    education: Optional[str] = Query(None), target_role: Optional[str] = Query(None),
    target_salary: Optional[float] = Query(None), linkedin_url: Optional[str] = Query(None),
    github_url: Optional[str] = Query(None), portfolio_url: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db),
):
    if not current_user: raise HTTPException(401, "Login required")
    if full_name is not None: current_user.full_name = full_name
    if headline is not None: current_user.headline = headline
    if bio is not None: current_user.bio = bio
    if phone is not None: current_user.phone = phone
    if location is not None: current_user.location = location
    if experience_years is not None: current_user.experience_years = experience_years
    if education is not None: current_user.education = education
    if target_role is not None: current_user.target_role = target_role
    if target_salary is not None: current_user.target_salary = target_salary
    if linkedin_url is not None: current_user.linkedin_url = linkedin_url
    if github_url is not None: current_user.github_url = github_url
    if portfolio_url is not None: current_user.portfolio_url = portfolio_url
    await db.commit()
    return {"message": "Profile updated"}

@router.post("/skills")
async def add_skill(skill_name: str = Query(...), proficiency: int = Query(50),
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not current_user: raise HTTPException(401, "Login required")
    skill = UserSkill(user_id=current_user.id, skill_name=skill_name, proficiency=proficiency)
    db.add(skill)
    await db.commit()
    return {"message": "Skill added", "id": skill.id}

@router.delete("/skills/{skill_id}")
async def delete_skill(skill_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not current_user: raise HTTPException(401, "Login required")
    result = await db.execute(select(UserSkill).where(UserSkill.id == skill_id, UserSkill.user_id == current_user.id))
    skill = result.scalar_one_or_none()
    if skill:
        await db.delete(skill)
        await db.commit()
    return {"message": "Skill deleted"}

@router.get("/applications")
async def get_applications(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not current_user: raise HTTPException(401, "Login required")
    result = await db.execute(select(Application).where(Application.user_id == current_user.id).order_by(Application.applied_date.desc()))
    return [{"id": a.id, "job_title": a.job_title, "company": a.company, "location": a.location, "status": a.status, "applied_date": a.applied_date, "notes": a.notes} for a in result.scalars().all()]

@router.post("/applications")
async def add_application(
    job_title: str = Query(...), company: str = Query(...), location: str = Query(""),
    status: str = Query("Applied"), notes: str = Query(""), applied_date: str = Query(""),
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not current_user: raise HTTPException(401, "Login required")
    app = Application(user_id=current_user.id, job_title=job_title, company=company, location=location, status=status, notes=notes, applied_date=applied_date or str(date.today()))
    db.add(app)
    await db.commit()
    return {"message": "Application added", "id": app.id}

@router.put("/applications/{app_id}")
async def update_application(app_id: str, status: str = Query(...), current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not current_user: raise HTTPException(401, "Login required")
    result = await db.execute(select(Application).where(Application.id == app_id, Application.user_id == current_user.id))
    app = result.scalar_one_or_none()
    if app:
        app.status = status
        await db.commit()
    return {"message": "Updated"}

@router.get("/interviews")
async def get_interviews(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not current_user: raise HTTPException(401, "Login required")
    result = await db.execute(select(Interview).where(Interview.user_id == current_user.id))
    return [{"id": i.id, "company": i.company, "role": i.role, "date": i.date, "time": i.time, "type": i.type, "status": i.status, "notes": i.notes} for i in result.scalars().all()]

@router.post("/interviews")
async def add_interview(
    company: str = Query(...), role: str = Query(...), date: str = Query(...),
    time: str = Query(""), type: str = Query("Technical"),
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not current_user: raise HTTPException(401, "Login required")
    interview = Interview(user_id=current_user.id, company=company, role=role, date=date, time=time, type=type)
    db.add(interview)
    await db.commit()
    return {"message": "Interview scheduled", "id": interview.id}

@router.get("/daily-logs")
async def get_daily_logs(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not current_user: raise HTTPException(401, "Login required")
    result = await db.execute(select(DailyLog).where(DailyLog.user_id == current_user.id).order_by(DailyLog.date.desc()).limit(30))
    return [{"id": d.id, "date": d.date, "applications_count": d.applications_count, "interviews_count": d.interviews_count, "practice_hours": d.practice_hours, "mood": d.mood, "notes": d.notes} for d in result.scalars().all()]

@router.post("/daily-logs")
async def add_daily_log(
    applications_count: int = Query(0), interviews_count: int = Query(0),
    practice_hours: float = Query(0.0), mood: str = Query(""), notes: str = Query(""),
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not current_user: raise HTTPException(401, "Login required")
    log = DailyLog(user_id=current_user.id, date=str(date.today()), applications_count=applications_count, interviews_count=interviews_count, practice_hours=practice_hours, mood=mood, notes=notes)
    db.add(log)
    await db.commit()
    return {"message": "Log saved"}

@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user: raise HTTPException(401, "Login required")
    content = (await file.read()).decode('utf-8', errors='ignore')
    
    keywords = ['Python', 'Java', 'React', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 
                'JavaScript', 'TypeScript', 'Node.js', 'MongoDB', 'PostgreSQL', 'Git', 'Agile',
                'C++', 'C#', 'Angular', 'Vue', 'Django', 'Flask', 'FastAPI', 'TensorFlow', 'PyTorch']
    found_skills = [kw for kw in keywords if kw.lower() in content.lower()]
    
    current_user.resume_text = content[:5000]
    await db.commit()
    
    for skill_name in found_skills:
        existing = await db.execute(select(UserSkill).where(UserSkill.user_id == current_user.id, UserSkill.skill_name == skill_name))
        if not existing.scalar_one_or_none():
            db.add(UserSkill(user_id=current_user.id, skill_name=skill_name, proficiency=60))
    await db.commit()
    
    return {"message": "Resume uploaded", "skills_found": found_skills, "skills_count": len(found_skills)}

@router.post("/notify/application")
async def notify_application(
    job_title: str = Query(...), company: str = Query(...),
    current_user: User = Depends(get_current_user)):
    await EmailService.send_application_confirmation(current_user.email, job_title, company)
    return {"message": "Notification sent (check server logs)"}

@router.post("/notify/daily-summary")
async def notify_daily_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DailyLog).where(DailyLog.user_id == current_user.id, DailyLog.date == str(date.today())))
    today = result.scalar_one_or_none()
    stats = {"apps": today.applications_count if today else 0, "interviews": today.interviews_count if today else 0, "hours": today.practice_hours if today else 0}
    await EmailService.send_daily_summary(current_user.email, stats)
    return {"message": "Daily summary sent (check server logs)"}
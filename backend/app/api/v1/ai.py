from fastapi import APIRouter, Query, Depends
import random
from typing import Optional
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/ai", tags=["AI"])

COVER_TEMPLATES = [
    "Dear Hiring Manager,\n\nI'm excited to apply for {role} at {company}. With my background and passion, I'd be a great fit.\n\nI look forward to contributing to {company}'s success.\n\nBest regards",
    "To the {company} Team,\n\nI'm writing to express interest in the {role} position. My skills align perfectly with your needs.\n\nThank you for your consideration.\n\nSincerely",
]

QUESTIONS = {
    "Technical": [
        "Explain a challenging technical problem you solved.",
        "How do you stay updated with technology trends?",
        "Describe your experience with system design.",
        "How do you handle code reviews?",
        "Explain a time you optimized performance.",
    ],
    "Behavioral": [
        "Tell me about yourself.",
        "Describe a conflict with a coworker and how you resolved it.",
        "Where do you see yourself in 5 years?",
        "What's your greatest weakness?",
        "Why should we hire you?",
    ],
    "HR": [
        "Why are you leaving your current role?",
        "What salary do you expect?",
        "When can you start?",
        "What do you know about our company?",
        "Do you have any questions for us?",
    ],
}

@router.post("/cover-letter")
async def cover_letter(role: str = Query("Software Engineer"), company: str = Query("Tech Corp")):
    return {"cover_letter": random.choice(COVER_TEMPLATES).format(role=role, company=company)}

@router.get("/interview-questions")
async def interview_questions(type: str = Query("Technical"), count: int = Query(5)):
    pool = QUESTIONS.get(type, QUESTIONS["Technical"])
    return {"questions": random.sample(pool, min(count, len(pool)))}

@router.get("/mock-interview")
async def mock_interview(role: str = Query("Software Engineer")):
    technical = random.sample(QUESTIONS["Technical"], 2)
    behavioral = random.sample(QUESTIONS["Behavioral"], 2)
    return {"role": role, "technical": technical, "behavioral": behavioral, "tips": ["Research the company", "Prepare STAR answers", "Have questions ready", "Dress professionally"]}

@router.get("/resume-tips")
async def resume_tips():
    return {"tips": ["Use action verbs", "Quantify achievements", "Keep it 1-2 pages", "Tailor to each job", "Proofread carefully", "Include keywords from JD"]}
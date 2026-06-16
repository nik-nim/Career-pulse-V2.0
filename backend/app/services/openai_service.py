# backend/app/services/openai_service.py
from typing import Dict, List, Optional
from openai import AsyncOpenAI

from app.core.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None


class OpenAIService:
    """AI-powered career services"""

    @staticmethod
    async def parse_resume(resume_text: str) -> Dict:
        """Extract skills, experience, education from resume"""
        if not client:
            return {"error": "OpenAI API key not configured"}

        prompt = f"""
        Parse this resume and extract structured data.
        Return JSON with: full_name, email, phone, skills (list), 
        experience_years, education_level, current_role, target_roles (list), 
        industries (list), key_achievements (list of 3).

        Resume:
        {resume_text[:4000]}
        """

        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        return eval(response.choices[0].message.content)

    @staticmethod
    async def generate_cover_letter(
        user_name: str,
        job_title: str,
        company: str,
        skills: List[str],
        job_description: str
    ) -> str:
        """Generate personalized cover letter"""
        if not client:
            return "OpenAI API key not configured"

        prompt = f"""
        Write a professional cover letter for {user_name} applying for {job_title} at {company}.
        Skills: {', '.join(skills)}
        Job description: {job_description[:1000]}
        Keep it concise (250 words), highlight 3 key skills matching the role.
        """

        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500,
        )
        return response.choices[0].message.content

    @staticmethod
    async def generate_interview_questions(
        role: str,
        skills: List[str],
        difficulty: str = "medium"
    ) -> List[Dict]:
        """Generate role-specific interview questions"""
        if not client:
            return []

        prompt = f"""
        Generate 5 {difficulty} difficulty interview questions for a {role} position.
        Required skills: {', '.join(skills)}
        Include: technical questions, behavioral questions, and scenario-based.
        Return as JSON array with: question, type, expected_answer_hint.
        """

        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.5,
        )
        return eval(response.choices[0].message.content).get("questions", [])
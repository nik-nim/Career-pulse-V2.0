import asyncio
from app.core.database import engine, Base, async_session
from app.models.job import Job

JOBS = [
    {"title": "Software Engineer", "company": "Google", "location": "Bangalore", "category": "Software Dev", "salary_min": 18, "salary_max": 35, "required_skills": ["Python", "Java", "System Design"]},
    {"title": "Data Scientist", "company": "Microsoft", "location": "Hyderabad", "category": "Data Science", "salary_min": 15, "salary_max": 30, "required_skills": ["Python", "ML", "SQL"]},
    {"title": "Frontend Developer", "company": "Flipkart", "location": "Bangalore", "category": "Software Dev", "salary_min": 10, "salary_max": 20, "required_skills": ["React", "TypeScript", "CSS"]},
    {"title": "DevOps Engineer", "company": "Amazon", "location": "Chennai", "category": "DevOps", "salary_min": 15, "salary_max": 28, "required_skills": ["Docker", "Kubernetes", "AWS"]},
    {"title": "ML Engineer", "company": "OpenAI", "location": "Remote", "category": "AI/ML", "salary_min": 25, "salary_max": 50, "required_skills": ["Python", "PyTorch", "Transformers"]},
    {"title": "Product Manager", "company": "Swiggy", "location": "Bangalore", "category": "Product", "salary_min": 20, "salary_max": 40, "required_skills": ["Agile", "User Research"]},
    {"title": "UX Designer", "company": "Adobe", "location": "Noida", "category": "Design", "salary_min": 12, "salary_max": 25, "required_skills": ["Figma", "User Testing"]},
    {"title": "Cloud Architect", "company": "AWS", "location": "Mumbai", "category": "Cloud", "salary_min": 25, "salary_max": 50, "required_skills": ["AWS", "Terraform"]},
    {"title": "Network Engineer", "company": "Cisco", "location": "Bangalore", "category": "Networking", "salary_min": 12, "salary_max": 22, "required_skills": ["BGP", "OSPF"]},
    {"title": "Security Analyst", "company": "Palo Alto", "location": "Pune", "category": "Security", "salary_min": 10, "salary_max": 20, "required_skills": ["SIEM", "Firewalls"]},
]

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session() as session:
        for j in JOBS:
            session.add(Job(**j))
        await session.commit()
        print(f"✅ Seeded {len(JOBS)} jobs")

if __name__ == "__main__":
    asyncio.run(seed())
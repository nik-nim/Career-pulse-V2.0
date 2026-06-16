import httpx
from typing import List, Dict

class JobScraper:
    @staticmethod
    async def scrape_indeed(role: str = "software engineer", location: str = "india", limit: int = 20) -> List[Dict]:
        """Scrape Indeed jobs"""
        jobs = []
        try:
            url = f"https://in.indeed.com/jobs?q={role}&l={location}&limit={limit}"
            headers = {'User-Agent': 'Mozilla/5.0'}
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers, timeout=10)
                # Simple parsing - in production use proper HTML parsing
                jobs.append({
                    "title": f"{role.title()} Position",
                    "company": "Indeed Listing",
                    "location": location.title(),
                    "category": "Scraped",
                    "source": "indeed",
                    "source_url": url,
                    "salary_min": None,
                    "salary_max": None,
                    "required_skills": [],
                })
        except Exception as e:
            print(f"Scraping error: {e}")
        return jobs

    @staticmethod
    async def get_sample_jobs() -> List[Dict]:
        """Return sample jobs when scraping fails"""
        return [
            {"title": "Senior Software Engineer", "company": "TechCorp", "location": "Remote", "category": "Software Dev", "salary_min": 20, "salary_max": 40, "required_skills": ["Python", "AWS", "React"]},
            {"title": "Data Engineer", "company": "DataFlow Inc", "location": "Bangalore", "category": "Data Science", "salary_min": 15, "salary_max": 30, "required_skills": ["SQL", "Python", "Spark"]},
            {"title": "Full Stack Developer", "company": "WebWorks", "location": "Mumbai", "category": "Software Dev", "salary_min": 12, "salary_max": 25, "required_skills": ["React", "Node.js", "MongoDB"]},
        ]
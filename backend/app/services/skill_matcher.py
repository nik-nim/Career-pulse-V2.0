# backend/app/services/skill_matcher.py
import numpy as np
from typing import List, Dict
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load model once (singleton)
model = SentenceTransformer('all-MiniLM-L6-v2')


class SkillMatcher:
    """AI-powered skill matching engine"""

    @staticmethod
    def encode_skills(skills: List[str]) -> np.ndarray:
        """Convert skill list to embeddings"""
        return model.encode(skills)

    @staticmethod
    def calculate_match_score(
        user_skills: List[str],
        job_skills: List[str],
        user_experience: float = 1.0
    ) -> Dict:
        """Calculate match percentage between user and job"""
        if not job_skills:
            return {"score": 0, "matched": [], "missing": job_skills}

        user_embeddings = SkillMatcher.encode_skills(user_skills)
        job_embeddings = SkillMatcher.encode_skills(job_skills)

        # Cosine similarity matrix
        similarity_matrix = cosine_similarity(user_embeddings, job_embeddings)

        matched_skills = []
        missing_skills = []
        match_scores = []

        for i, job_skill in enumerate(job_skills):
            best_match = similarity_matrix[:, i].max()
            best_user_skill = user_skills[similarity_matrix[:, i].argmax()]

            if best_match > 0.6:  # Threshold
                matched_skills.append({
                    "job_skill": job_skill,
                    "user_skill": best_user_skill,
                    "similarity": round(float(best_match), 2)
                })
                match_scores.append(best_match)
            else:
                missing_skills.append(job_skill)

        if match_scores:
            base_score = np.mean(match_scores) * 100
        else:
            base_score = 0

        # Boost based on experience
        final_score = min(98, base_score * (0.8 + 0.2 * user_experience))

        return {
            "score": round(final_score, 1),
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "total_job_skills": len(job_skills),
            "matched_count": len(matched_skills)
        }

    @staticmethod
    def recommend_jobs(
        user_skills: List[str],
        jobs: List[Dict],
        top_n: int = 10
    ) -> List[Dict]:
        """Rank jobs by match score"""
        scored_jobs = []
        for job in jobs:
            result = SkillMatcher.calculate_match_score(
                user_skills,
                job.get("required_skills", [])
            )
            job["match_score"] = result["score"]
            job["matched_skills"] = result["matched_skills"]
            job["missing_skills"] = result["missing_skills"]
            scored_jobs.append(job)

        scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)
        return scored_jobs[:top_n]

    @staticmethod
    def suggest_skill_gaps(
        user_skills: List[str],
        target_role_skills: Dict[str, List[str]]
    ) -> List[Dict]:
        """Suggest skills to learn based on target roles"""
        all_gaps = []
        for role, required_skills in target_role_skills.items():
            result = SkillMatcher.calculate_match_score(user_skills, required_skills)
            for skill in result["missing_skills"]:
                all_gaps.append({
                    "skill": skill,
                    "role": role,
                    "demand_score": result["score"]
                })

        # Remove duplicates, sort by demand
        unique_gaps = {}
        for gap in all_gaps:
            if gap["skill"] not in unique_gaps:
                unique_gaps[gap["skill"]] = gap

        return sorted(unique_gaps.values(), key=lambda x: x["demand_score"], reverse=True)
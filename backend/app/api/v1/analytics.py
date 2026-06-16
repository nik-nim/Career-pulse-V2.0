from fastapi import APIRouter, Depends
from app.api.deps import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview")
async def get_analytics_overview(current_user=Depends(get_current_user)):
    return {
        "total_applications": 0,
        "interviews_scheduled": 0,
        "offers_received": 0,
        "profile_views": 0,
    }
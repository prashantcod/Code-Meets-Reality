from fastapi import APIRouter
from services.ai_service import get_ai_content, get_practice_problem

router = APIRouter()

@router.get("/{topic}")
async def ai_content(topic: str):
    return get_ai_content(topic)

@router.get("/practice")
async def ai_practice():
    return get_practice_problem()
from fastapi import APIRouter, Request
from services.ai_service import get_real_world_mapping, get_interactive_demo

router = APIRouter()

@router.post("")
async def real_world(request: Request):
    data = await request.json()
    code = data.get("code", "")
    return get_real_world_mapping(code)

@router.post("/demo")
async def real_world_demo(request: Request):
    data = await request.json()
    code = data.get("code", "")
    return get_interactive_demo(code)
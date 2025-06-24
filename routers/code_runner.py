from fastapi import APIRouter, Request
from services.code_service import run_code

router = APIRouter()

@router.post("/run")
async def code_run(request: Request):
    data = await request.json()
    code = data.get("code", "")
    return run_code(code)
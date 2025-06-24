from fastapi import APIRouter
from services.debugger_service import log_event

router = APIRouter()

@router.post("")
async def debugger_log(event: dict):
    log_event(event)
    return {"status": "logged"}
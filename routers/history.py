from fastapi import APIRouter

router = APIRouter()

@router.get("")
async def get_history():
    # Placeholder: return empty history
    return {"history": []}
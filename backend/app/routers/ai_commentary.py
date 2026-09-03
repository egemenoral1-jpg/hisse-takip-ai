from fastapi import APIRouter, HTTPException
from app.services.gemini_service import get_ai_commentary

router = APIRouter(prefix="/ai", tags=["ai"])

@router.get("/{symbol}/commentary")
def read_commentary(symbol: str):
    try:
        data = get_ai_commentary(symbol)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
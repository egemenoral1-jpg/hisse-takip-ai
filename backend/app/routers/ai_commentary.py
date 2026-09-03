from fastapi import APIRouter, HTTPException
from app.services.gemini_service import get_ai_commentary

router = APIRouter(prefix="/ai", tags=["ai"])

@router.get("/{symbol}/commentary")
def read_commentary(symbol: str):
    try:
        data = get_ai_commentary(symbol)
        return data
    except Exception as e:
        error_text = str(e)
        if "429" in error_text or "quota" in error_text.lower():
            raise HTTPException(
                status_code=429,
                detail="AI yorum kotasi doldu, birazdan tekrar deneyin"
            )
        raise HTTPException(status_code=500, detail=error_text)
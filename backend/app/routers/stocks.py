from fastapi import APIRouter, HTTPException
from app.services.stock_data import get_stock_price

router = APIRouter(prefix="/stocks", tags=["stocks"])

@router.get("/{symbol}")
def read_stock(symbol: str):
    data = get_stock_price(symbol)
    if data is None:
        raise HTTPException(status_code=404, detail="Hisse bulunamadi")
    return data
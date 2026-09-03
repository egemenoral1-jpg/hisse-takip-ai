from fastapi import APIRouter, HTTPException
from app.services.stock_data import get_stock_price

router = APIRouter(prefix="/stocks", tags=["stocks"])

@router.get("/{symbol}")
def read_stock(symbol: str):
    data = get_stock_price(symbol)
    if data is None:
        raise HTTPException(status_code=404, detail="Hisse bulunamadi")
    return data 
from app.services.stock_data import get_stock_price, get_stock_history

@router.get("/{symbol}/history")
def read_stock_history(symbol: str, range: str = "1a"):
    data = get_stock_history(symbol, range)
    if data is None:
        raise HTTPException(status_code=404, detail="Veri bulunamadi veya gecersiz aralik")
    return data
from app.services.risk_engine import calculate_risk

@router.get("/{symbol}/risk")
def read_stock_risk(symbol: str, range: str = "1a"):
    data = calculate_risk(symbol, range)
    if data is None:
        raise HTTPException(status_code=404, detail="Risk hesaplanamadi")
    return data
from fastapi import APIRouter, HTTPException
from app.services.stock_data import (
    get_stock_price,
    get_stock_history,
    get_market_status,
    get_52_week_range,
)
from app.services.risk_engine import calculate_risk

router = APIRouter(prefix="/stocks", tags=["stocks"])


@router.get("/{symbol}")
def read_stock(symbol: str):
    data = get_stock_price(symbol)
    if data is None:
        raise HTTPException(status_code=404, detail="Hisse bulunamadi")
    return data


@router.get("/{symbol}/history")
def read_stock_history(symbol: str, range: str = "1a"):
    data = get_stock_history(symbol, range)
    if data is None:
        raise HTTPException(status_code=404, detail="Veri bulunamadi veya gecersiz aralik")
    return data


@router.get("/{symbol}/risk")
def read_stock_risk(symbol: str, range: str = "1a"):
    data = calculate_risk(symbol, range)
    if data is None:
        raise HTTPException(status_code=404, detail="Risk hesaplanamadi")
    return data


@router.get("/market/status")
def read_market_status():
    return get_market_status()


@router.get("/{symbol}/52week")
def read_52_week_range(symbol: str):
    data = get_52_week_range(symbol)
    if data is None:
        raise HTTPException(status_code=404, detail="Veri bulunamadi")
    return data
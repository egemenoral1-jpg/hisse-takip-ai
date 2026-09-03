import yfinance as yf
from datetime import datetime
from zoneinfo import ZoneInfo


def get_market_status():
    ny_time = datetime.now(ZoneInfo("America/New_York"))
    is_weekday = ny_time.weekday() < 5
    market_open = ny_time.replace(hour=9, minute=30, second=0, microsecond=0)
    market_close = ny_time.replace(hour=16, minute=0, second=0, microsecond=0)
    is_open = is_weekday and market_open <= ny_time <= market_close

    return {
        "is_open": is_open,
        "ny_time": ny_time.strftime("%H:%M")
    }


def get_stock_price(symbol: str):
    stock = yf.Ticker(symbol)
    info = stock.history(period="5d")

    if info.empty:
        return None

    last_price = info["Close"].iloc[-1]
    prev_price = info["Close"].iloc[-2] if len(info) >= 2 else last_price

    change = last_price - prev_price
    change_percent = (change / prev_price) * 100 if prev_price != 0 else 0

    return {
        "symbol": symbol,
        "price": round(last_price, 2),
        "change": round(change, 2),
        "change_percent": round(change_percent, 2)
    }


RANGE_MAP = {
    "24s": {"period": "1d", "interval": "5m"},
    "1h": {"period": "5d", "interval": "15m"},
    "1a": {"period": "1mo", "interval": "1d"},
    "3a": {"period": "3mo", "interval": "1d"},
    "6a": {"period": "6mo", "interval": "1d"},
    "12a": {"period": "1y", "interval": "1d"},
}


def get_stock_history(symbol: str, range_key: str):
    settings = RANGE_MAP.get(range_key)
    if settings is None:
        return None

    stock = yf.Ticker(symbol)
    data = stock.history(period=settings["period"], interval=settings["interval"])

    if data.empty:
        return None

    result = []
    for timestamp, row in data.iterrows():
        result.append({
            "time": timestamp.isoformat(),
            "open": round(row["Open"], 2),
            "high": round(row["High"], 2),
            "low": round(row["Low"], 2),
            "close": round(row["Close"], 2),
        })

    return result


def get_52_week_range(symbol: str):
    stock = yf.Ticker(symbol)
    data = stock.history(period="1y")

    if data.empty:
        return None

    week_52_high = round(data["High"].max(), 2)
    week_52_low = round(data["Low"].min(), 2)
    current_price = round(data["Close"].iloc[-1], 2)

    return {
        "symbol": symbol,
        "week_52_high": week_52_high,
        "week_52_low": week_52_low,
        "current_price": current_price
    }
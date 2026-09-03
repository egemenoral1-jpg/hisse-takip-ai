import yfinance as yf

def get_stock_price(symbol: str):
    stock = yf.Ticker(symbol)
    info = stock.history(period="1d")

    if info.empty:
        return None

    last_price = info["Close"].iloc[-1]

    return {
        "symbol": symbol,
        "price": round(last_price, 2)
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
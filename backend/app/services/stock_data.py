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
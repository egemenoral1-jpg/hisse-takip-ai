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
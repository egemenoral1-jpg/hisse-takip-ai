import numpy as np
from app.services.stock_data import get_stock_history

def calculate_risk(symbol: str, range_key: str):
    history = get_stock_history(symbol, range_key)
    if not history or len(history) < 2:
        return None

    prices = [point["close"] for point in history]

    returns = []
    for i in range(1, len(prices)):
        daily_return = (prices[i] - prices[i - 1]) / prices[i - 1]
        returns.append(daily_return)

    daily_volatility = np.std(returns)
    annual_volatility = daily_volatility * np.sqrt(252)

    daily_risk_percentage = round(daily_volatility * 100, 2)
    annual_risk_percentage = round(annual_volatility * 100, 2)

    if daily_risk_percentage < 2.5:
        risk_level = "Dusuk"
        comment = "Bu donemde fiyat hareketleri nispeten sakin. Ancak piyasa kosullari degisirse (faiz karari, sirket haberi) risk hizla artabilir."
    elif daily_risk_percentage < 5:
        risk_level = "Orta"
        comment = "Fiyat orta duzeyde dalgalanma gosteriyor. Genel piyasa yonu bu hisseyi de etkileyebilir, ozellikle kotu bilancolar riski artirir."
    else:
        risk_level = "Yuksek"
        comment = "Bu donemde belirgin fiyat dalgalanmalari var. Kisa vadede sert hareketler beklenebilir, dikkatli olunmali."

    return {
        "symbol": symbol,
        "range": range_key,
        "daily_risk_percentage": daily_risk_percentage,
        "annual_risk_percentage": annual_risk_percentage,
        "risk_level": risk_level,
        "comment": comment
    }
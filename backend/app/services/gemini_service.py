import json
import time
import google.generativeai as genai
from app.core.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

CACHE_DURATION_SECONDS = 6 * 60 * 60  # 6 saat
_commentary_cache = {}

def get_ai_commentary(symbol: str):
    now = time.time()

    cached = _commentary_cache.get(symbol)
    if cached and (now - cached["timestamp"] < CACHE_DURATION_SECONDS):
        return cached["data"]

    model = genai.GenerativeModel("gemini-3.6-flash")

    prompt = f"""
{symbol} hissesi hakkinda bir analiz hazirla.

Su formatta, SADECE gecerli JSON olarak cevap ver, baska hicbir metin ekleme:

{{
  "positive_points": ["madde 1", "madde 2", "madde 3"],
  "negative_points": ["madde 1", "madde 2", "madde 3"],
  "prediction": "AI'nin kisa tahmin metni (yatirim tavsiyesi degil, sadece degerlendirme)",
  "prediction_risk": "Dusuk" | "Orta" | "Yuksek"
}}

Kurallar:
- positive_points: sirketle ilgili bilinen olumlu yonler/gelismeler (2-4 madde)
- negative_points: sirketle ilgili bilinen olumsuz yonler/riskler (2-4 madde)
- prediction: Kesinlikle yatirim tavsiyesi VERME, sadece "genel tabloya gore sirketin durumu su yonde ilerliyor gibi gorunuyor" tarzinda bilgilendirici bir tahmin
- prediction_risk: bu tahminin ne kadar belirsiz/riskli oldugu
- Turkce yaz
"""

    response = model.generate_content(prompt)

    text = response.text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    data = json.loads(text)

    result = {
        "symbol": symbol,
        "positive_points": data.get("positive_points", []),
        "negative_points": data.get("negative_points", []),
        "prediction": data.get("prediction", ""),
        "prediction_risk": data.get("prediction_risk", "Orta"),
    }

    _commentary_cache[symbol] = {"timestamp": now, "data": result}

    return result
import google.generativeai as genai
from app.core.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

def get_ai_commentary(symbol: str):
    model = genai.GenerativeModel("gemini-3.6-flash")

    prompt = f"""
Sen bir finansal analiz asistanisin. {symbol} hissesi hakkinda kisa, tarafsiz bir yorum yaz.

Yorumun sunlari icermeli:
- Sirketin genel durumu ve sektorel konumu hakkinda 2-3 cumlelik kisa bir ozet
- Son donemde one cikan onemli gelismeler (varsa)
- Yatirim tavsiyesi VERME, sadece bilgilendirici ol

Turkce yaz, 4-5 cumleyi gecme, resmi ama anlasilir bir dil kullan.
"""

    response = model.generate_content(prompt)

    return {
        "symbol": symbol,
        "commentary": response.text
    }
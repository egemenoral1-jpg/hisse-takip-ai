from fastapi import FastAPI
from app.routers import stocks

app = FastAPI(title="Hisse Takip AI")

app.include_router(stocks.router)

@app.get("/")
def root():
    return {"message": "Hisse Takip AI backend calisiyor"}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import stocks, ai_commentary

app = FastAPI(title="Hisse Takip AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stocks.router)
app.include_router(ai_commentary.router)

@app.get("/")
def root():
    return {"message": "Hisse Takip AI backend calisiyor"}
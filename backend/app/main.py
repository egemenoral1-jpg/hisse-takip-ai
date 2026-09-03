from fastapi import FastAPI

app = FastAPI(title="Hisse Takip AI")

@app.get("/")
def root():
    return {"message": "Hisse Takip AI backend calisiyor"}
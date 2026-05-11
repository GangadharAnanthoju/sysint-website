from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import logging
from sysint_agent import ask

app = FastAPI(title="SysInt AI Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://sysintinc.com",
        "https://www.sysintinc.com",
        "https://ambitious-ocean-005d6090f.7.azurestaticapps.net",
        "http://localhost:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://127.0.0.1:3000",
        "null",
    ],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class ChatRequest(BaseModel):
    message: str
    history: list = []


class ChatResponse(BaseModel):
    reply: str


@app.get("/")
def health():
    return {"status": "ok", "service": "SysInt AI Agent"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    logging.info(f"Chat: {payload.message[:60]}")
    reply = ask(payload.message, payload.history)
    return ChatResponse(reply=reply)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)

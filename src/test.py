# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    prompt: str
    history: List[Message]

class StandardResponse(BaseModel):
    status_code: int
    status_message: str
    data: Any


@app.post("/chat", response_model=StandardResponse)
async def chat_endpoint(req: ChatRequest):
    try:
        user_message = req.prompt.lower()

        if "hello" in user_message or "hi" in user_message:
            reply = "Hello 👋 How can I help you today?"
        elif "hr" in user_message:
            reply = "You can contact HR at hr@company.com"
        elif "it" in user_message:
            reply = "For IT support, please submit a ticket."
        else:
            reply = f"I don't have an answer for '{req.prompt}' yet, but I'm learning."

        return {
            "status_code": 200,
            "status_message": "Chat response generated successfully",
            "data": {
                "reply": reply
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status_code": 500,
                "status_message": "Internal Server Error",
                "data": str(e),
            },
        )

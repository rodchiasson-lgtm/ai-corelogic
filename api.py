from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os

# Import the Claude agent
from ai_agent_claude import ClaudeAIAgent

app = FastAPI(
    title="AI-CoreLogic Claude Agent API",
    description="API for interacting with the Claude-powered AI agent",
    version="1.0.0"
)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the agent
agent = ClaudeAIAgent(db_path="agent_memory.db")

class ChatRequest(BaseModel):
    message: str
    session_id: str = "web_session"

class ChatResponse(BaseModel):
    response: str
    session_id: str

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "agent": agent.name,
        "message": "AI-CoreLogic Claude Agent API is running."
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a message to the agent and get a response."""
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    try:
        # Process the input through the agent
        response_text = agent.process_input(request.message, request.session_id)
        
        return ChatResponse(
            response=response_text,
            session_id=request.session_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")

@app.delete("/api/chat/{session_id}")
async def clear_history(session_id: str):
    """Clear the conversation history for a specific session."""
    try:
        agent.clear_history(session_id)
        return {"status": "success", "message": f"History cleared for session {session_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing history: {str(e)}")

@app.get("/api/chat/{session_id}/history")
async def get_history(session_id: str):
    """Get the conversation history for a specific session."""
    try:
        history = agent.get_history(session_id)
        return {"session_id": session_id, "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving history: {str(e)}")

if __name__ == "__main__":
    # Run the API server
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting API server on port {port}...")
    uvicorn.run("api:app", host="0.0.0.0", port=port, reload=True)

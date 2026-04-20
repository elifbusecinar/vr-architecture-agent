from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .workflow import lang_graph_app
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="VR Architecture Crew AI Service")

class AuditRequest(BaseModel):
    model_metadata: str

@app.post("/audit")
async def run_audit(request: AuditRequest):
    try:
        # Check for API Key
        if not os.getenv("GOOGLE_API_KEY") and not os.getenv("OPENAI_API_KEY"):
            raise HTTPException(status_code=500, detail="Missing API Key in environment")

        # Initialize and kickoff the graph workflow
        initial_state = {
            "model_metadata": request.model_metadata,
            "iterations": 0
        }
        
        # Run the graph
        final_state = lang_graph_app.invoke(initial_state)
        
        return {
            "status": "success",
            "audit_report": final_state["audit_report"],
            "iterations": final_state["iterations"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def home():
    return {"message": "VR Architecture Crew AI Service is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

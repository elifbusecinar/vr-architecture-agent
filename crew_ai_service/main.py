from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from crew import VRArcCrew
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

        input_data = {
            'model_metadata': request.model_metadata
        }
        
        # Initialize and kickoff the crew
        vr_crew = VRArcCrew().crew()
        result = vr_crew.kickoff(inputs=input_data)
        
        return {
            "status": "success",
            "audit_report": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def home():
    return {"message": "VR Architecture Crew AI Service is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

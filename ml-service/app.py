from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np

app = FastAPI()

# In a real app, you would load a serialized model
model = IsolationForest(contamination=0.1, random_state=42)
# Initialize with some dummy data to avoid errors
dummy_data = np.random.rand(100, 5)
model.fit(dummy_data)

class LoginEvent(BaseModel):
    riskScore: int
    hourOfDay: int
    dayOfWeek: int
    isNewDevice: int
    isNewLocation: int

@app.post("/analyze")
async def analyze_login(event: LoginEvent):
    # Features: [riskScore, hourOfDay, dayOfWeek, isNewDevice, isNewLocation]
    features = np.array([[
        event.riskScore / 100.0, 
        event.hourOfDay / 24.0, 
        event.dayOfWeek / 7.0, 
        event.isNewDevice, 
        event.isNewLocation
    ]])
    
    # decision_function returns the anomaly score (lower is more anomalous)
    anomaly_score = model.decision_function(features)[0]
    
    # Scale to 0-100 (higher means more anomalous)
    # Mapping -0.5 (very anomalous) to 100, 0.5 (normal) to 0
    risk_contribution = int(max(0, min(100, (0.5 - anomaly_score) * 100)))
    
    return {
        "anomalyScore": anomaly_score,
        "mlRiskContribution": risk_contribution,
        "isAnomaly": bool(risk_contribution > 50)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)

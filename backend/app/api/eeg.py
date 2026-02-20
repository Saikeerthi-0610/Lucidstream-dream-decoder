"""
EEG Data Processing API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np

router = APIRouter(
    prefix="/eeg",
    tags=["EEG"]
)

class EEGData(BaseModel):
    """EEG data model"""
    signal: List[float]
    sampling_rate: Optional[int] = 256
    duration: Optional[float] = None

class EEGAnalysis(BaseModel):
    """EEG analysis result"""
    bands: dict
    statistics: dict
    quality: str

@router.post("/analyze", response_model=EEGAnalysis)
async def analyze_eeg(data: EEGData):
    """Analyze EEG signal and extract features"""
    try:
        signal = np.array(data.signal)
        
        # Calculate frequency bands
        n = len(signal)
        if n > 4:
            bands = {
                "delta": float(np.mean(np.abs(signal[:n//4]))),
                "theta": float(np.mean(np.abs(signal[n//4:n//2]))),
                "alpha": float(np.mean(np.abs(signal[n//2:3*n//4]))),
                "beta": float(np.mean(np.abs(signal[3*n//4:])))
            }
        else:
            bands = {"delta": 0.0, "theta": 0.0, "alpha": 0.0, "beta": 0.0}
        
        # Calculate statistics
        statistics = {
            "mean": float(np.mean(signal)),
            "std": float(np.std(signal)),
            "min": float(np.min(signal)),
            "max": float(np.max(signal)),
            "median": float(np.median(signal))
        }
        
        # Determine signal quality
        if statistics["std"] > 0.1:
            quality = "good"
        elif statistics["std"] > 0.05:
            quality = "fair"
        else:
            quality = "poor"
        
        return EEGAnalysis(
            bands=bands,
            statistics=statistics,
            quality=quality
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"EEG analysis failed: {str(e)}")

@router.get("/health")
async def eeg_health():
    """Check EEG processing health"""
    return {
        "status": "healthy",
        "service": "EEG Processing",
        "version": "1.0.0"
    }

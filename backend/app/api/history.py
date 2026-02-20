from fastapi import APIRouter
from app.db.session import SessionLocal
from app.db.models import Prediction
import asyncio
from typing import List, Dict, Any

router = APIRouter(
    prefix="/history",
    tags=["History"]
)

# Cache for faster loading
_history_cache = None
_cache_timestamp = 0

def get_sample_dreams() -> List[Dict[str, Any]]:
    """Fast sample dreams data"""
    return [
        {
            "id": 1,
            "dream": "Exploration of an ancient library beneath the ocean. Strong alpha waves detected during REM phase.",
            "confidence": 87,
            "date": "2024-02-03",
            "type": "Water Dream",
            "intensity": "HIGH INTENSITY",
            "intensityColor": "#ff6b6b"
        },
        {
            "id": 2,
            "dream": "Standard memory consolidation during deep sleep. Higher theta activity noted in prefrontal cortex.",
            "confidence": 73,
            "date": "2024-02-02", 
            "type": "REM Stage",
            "intensity": "MODERATE INTENSITY",
            "intensityColor": "#4ecdc4"
        },
        {
            "id": 3,
            "dream": "Rapid pulse and beta wave spikes. Correlated with physiological stress response patterns.",
            "confidence": 92,
            "date": "2024-02-01",
            "type": "Nightmare",
            "intensity": "EXTREME INTENSITY", 
            "intensityColor": "#ff4757"
        }
    ]

async def get_database_history():
    """Get history from database asynchronously"""
    try:
        db = SessionLocal()
        try:
            predictions = db.query(Prediction).order_by(Prediction.id.desc()).limit(3).all()
            if predictions:
                return [
                    {
                        "id": p.id,
                        "dream": p.dream,
                        "confidence": int(p.confidence * 100) if p.confidence < 1 else int(p.confidence),
                        "date": "2024-02-03",  # You can add date field to model later
                        "type": p.dream,
                        "intensity": "MODERATE INTENSITY",
                        "intensityColor": "#4ecdc4"
                    }
                    for p in predictions
                ]
        finally:
            db.close()
    except Exception as e:
        print(f"Database error: {e}")
    
    return None

@router.get("/")
async def get_history():
    """Fast history endpoint with caching"""
    global _history_cache, _cache_timestamp
    
    # Return cached data if recent (within 30 seconds)
    import time
    current_time = time.time()
    if _history_cache and (current_time - _cache_timestamp) < 30:
        return _history_cache
    
    # Try to get from database quickly
    try:
        # Set a timeout for database query
        db_history = await asyncio.wait_for(get_database_history(), timeout=2.0)
        if db_history:
            _history_cache = db_history
            _cache_timestamp = current_time
            return db_history
    except asyncio.TimeoutError:
        print("Database query timeout, using sample data")
    except Exception as e:
        print(f"Database error: {e}")
    
    # Fallback to sample data
    sample_data = get_sample_dreams()
    _history_cache = sample_data
    _cache_timestamp = current_time
    return sample_data

@router.get("/recent")
async def get_recent_history():
    """Get recent history quickly"""
    return get_sample_dreams()

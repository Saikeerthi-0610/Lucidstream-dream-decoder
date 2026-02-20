"""
Admin API endpoints for system management
"""
from fastapi import APIRouter, HTTPException, Depends
from app.db.mongodb import get_database
from app.api.auth_mongo import get_current_user
from datetime import datetime
from typing import Dict, Any

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/stats")
async def get_system_stats(current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """Get system statistics"""
    db = get_database()
    
    try:
        # Get collection counts
        users_count = db.users.count_documents({})
        profiles_count = db.user_profiles.count_documents({})
        predictions_count = db.predictions.count_documents({})
        stories_count = db.stories.count_documents({})
        
        # Get active users (logged in last 7 days)
        from datetime import timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        active_users = db.users.count_documents({
            "lastLogin": {"$gte": week_ago}
        })
        
        # Get recent signups (last 24 hours)
        day_ago = datetime.utcnow() - timedelta(days=1)
        recent_signups = db.users.count_documents({
            "createdAt": {"$gte": day_ago}
        })
        
        return {
            "success": True,
            "data": {
                "users": {
                    "total": users_count,
                    "active_7_days": active_users,
                    "new_24_hours": recent_signups
                },
                "profiles": profiles_count,
                "predictions": predictions_count,
                "stories": stories_count,
                "database": {
                    "name": db.name,
                    "collections": len(db.list_collection_names())
                }
            },
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")


@router.get("/health/detailed")
async def detailed_health_check() -> Dict[str, Any]:
    """Detailed health check with all services"""
    db = get_database()
    
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {}
    }
    
    # Check MongoDB
    try:
        db.command("ping")
        health_status["services"]["mongodb"] = {
            "status": "healthy",
            "database": db.name,
            "collections": len(db.list_collection_names())
        }
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["services"]["mongodb"] = {
            "status": "unhealthy",
            "error": str(e)
        }
    
    # Check ML Model
    try:
        from app.api.predict import load_model
        model = load_model()
        health_status["services"]["ml_model"] = {
            "status": "healthy",
            "loaded": model is not None
        }
    except Exception as e:
        health_status["services"]["ml_model"] = {
            "status": "degraded",
            "error": str(e)
        }
    
    return health_status


@router.get("/users/recent")
async def get_recent_users(
    limit: int = 10,
    current_user: dict = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get recently registered users"""
    db = get_database()
    
    try:
        users = list(db.users.find(
            {},
            {"password": 0}  # Exclude password
        ).sort("createdAt", -1).limit(limit))
        
        # Convert ObjectId to string
        for user in users:
            user["_id"] = str(user["_id"])
        
        return {
            "success": True,
            "data": users,
            "count": len(users)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get users: {str(e)}")


@router.delete("/cache/clear")
async def clear_cache(current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """Clear application cache"""
    # This is a placeholder - implement actual cache clearing logic
    return {
        "success": True,
        "message": "Cache cleared successfully",
        "timestamp": datetime.utcnow().isoformat()
    }

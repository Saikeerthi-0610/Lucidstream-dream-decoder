from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.db.mongodb import connect_to_mongo, close_mongo_connection
from app.api import auth_mongo as auth, health, predict, stories, history, eeg, oauth, admin, dream_image
from app.middleware.logging import LoggingMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Create FastAPI app with enhanced metadata
app = FastAPI(
    title="🌙 Dream Decoder API",
    description="AI-powered dream analysis and prediction system with MongoDB",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {"name": "authentication", "description": "User authentication and authorization"},
        {"name": "Health", "description": "System health checks"},
        {"name": "Predictions", "description": "Dream prediction and analysis"},
        {"name": "Stories", "description": "Community dream stories"},
        {"name": "History", "description": "User dream history"},
        {"name": "EEG", "description": "EEG data processing"},
        {"name": "oauth", "description": "OAuth authentication (Google, GitHub)"},
        {"name": "Admin", "description": "Admin and system management"},
    ]
)

# Add custom middleware
app.add_middleware(LoggingMiddleware)
app.add_middleware(RateLimitMiddleware, requests_per_minute=100)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event - Connect to MongoDB
@app.on_event("startup")
async def startup_db_client():
    connect_to_mongo()
    print("=" * 60)
    print("🚀 Dream Decoder API Started")
    print("=" * 60)
    print("✅ MongoDB Connected")
    print("✅ All Services Running")
    print(f"📚 API Docs: http://localhost:8000/docs")
    print(f"🔍 Health Check: http://localhost:8000/health")
    print("=" * 60)

# Shutdown event - Close MongoDB connection
@app.on_event("shutdown")
async def shutdown_db_client():
    close_mongo_connection()
    print("👋 Application shutdown gracefully")

# Include routers
app.include_router(auth.router)
app.include_router(health.router)
app.include_router(predict.router)
app.include_router(stories.router)
app.include_router(history.router)
app.include_router(eeg.router)
app.include_router(oauth.router)
app.include_router(admin.router)
app.include_router(dream_image.router)

# Root endpoint with beautiful response
@app.get("/", tags=["Root"])
async def root():
    """Welcome endpoint with API information"""
    return {
        "message": "🌙 Welcome to Dream Decoder API",
        "version": "2.0.0",
        "status": "running",
        "database": "MongoDB",
        "features": [
            "🔐 JWT Authentication",
            "🧠 AI Dream Prediction",
            "📊 EEG Analysis",
            "📖 Community Stories",
            "📈 User History",
            "🔗 OAuth Integration (Google, GitHub)",
            "⚡ Rate Limiting",
            "📝 Request Logging"
        ],
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "auth": "/auth",
            "predict": "/predict",
            "stories": "/stories",
            "history": "/history",
            "eeg": "/eeg",
            "admin": "/admin"
        },
        "links": {
            "documentation": "http://localhost:8000/docs",
            "health_check": "http://localhost:8000/health",
            "admin_stats": "http://localhost:8000/admin/stats"
        }
    }

# Custom 404 handler
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "message": "🔍 Endpoint not found",
            "path": str(request.url.path),
            "suggestion": "Check /docs for available endpoints"
        }
    )

# Custom 500 handler
@app.exception_handler(500)
async def server_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "⚠️ Internal server error",
            "suggestion": "Please try again later or contact support"
        }
    )

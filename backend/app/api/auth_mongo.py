"""
Authentication API with MongoDB
"""
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from app.db.mongodb import get_database, USERS_COLLECTION, USER_PROFILES_COLLECTION
from app.db.mongo_models import user_helper, user_profile_helper
import hashlib
import jwt
from datetime import datetime, timedelta
from typing import Optional
import os
import json

router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Pydantic models
class UserSignup(BaseModel):
    fullName: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfileData(BaseModel):
    dreamerHandle: str
    bio: Optional[str] = None
    totalDreams: int = 0
    totalAnalyses: int = 0

class UserResponse(BaseModel):
    id: int
    fullName: str
    email: str
    createdAt: datetime
    isActive: bool
    profileCompleted: bool
    profile: Optional[UserProfileData] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Helper functions
def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_next_user_id(db) -> int:
    """Get next available user ID"""
    last_user = db[USERS_COLLECTION].find_one(sort=[("user_id", -1)])
    return (last_user["user_id"] + 1) if last_user else 1

def create_user_profile(db, user_id: int, full_name: str):
    """Create a user profile"""
    base_handle = full_name.split()[0] if full_name else "Dreamer"
    dreamer_handle = f"{base_handle}_{user_id}"
    
    profile = {
        "userId": user_id,
        "dreamerHandle": dreamer_handle,
        "bio": f"Welcome to the dreamscape, {full_name}! 🌙",
        "totalDreams": 0,
        "totalAnalyses": 0,
        "joinedAt": datetime.utcnow(),
        "preferences": {
            "theme": "dark",
            "notifications": True,
            "autoSync": True,
            "realTimeStream": False
        }
    }
    
    db[USER_PROFILES_COLLECTION].insert_one(profile)
    return profile

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    db = get_database()
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db[USERS_COLLECTION].find_one({"user_id": user_id})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_helper(user)

# Authentication endpoints
@router.post("/signup", response_model=Token)
async def signup(user_data: UserSignup):
    """Create new user account with complete profile"""
    db = get_database()
    
    # Check if user already exists
    existing_user = db[USERS_COLLECTION].find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Get next user ID
    user_id = get_next_user_id(db)
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = {
        "user_id": user_id,
        "fullName": user_data.fullName,
        "email": user_data.email,
        "password": hashed_password,
        "createdAt": datetime.utcnow(),
        "isActive": True,
        "profileCompleted": True,
        "lastLogin": datetime.utcnow()
    }
    
    db[USERS_COLLECTION].insert_one(new_user)
    
    # Create user profile
    profile = create_user_profile(db, user_id, user_data.fullName)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user_id)}, expires_delta=access_token_expires
    )
    
    # Prepare profile data
    profile_data = UserProfileData(
        dreamerHandle=profile["dreamerHandle"],
        bio=profile["bio"],
        totalDreams=profile["totalDreams"],
        totalAnalyses=profile["totalAnalyses"]
    )
    
    user_response = UserResponse(
        id=user_id,
        fullName=new_user["fullName"],
        email=new_user["email"],
        createdAt=new_user["createdAt"],
        isActive=new_user["isActive"],
        profileCompleted=new_user["profileCompleted"],
        profile=profile_data
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login user"""
    db = get_database()
    
    user = db[USERS_COLLECTION].find_one({"email": user_data.email})
    
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    db[USERS_COLLECTION].update_one(
        {"user_id": user["user_id"]},
        {"$set": {"lastLogin": datetime.utcnow()}}
    )
    
    # Get user profile
    profile = db[USER_PROFILES_COLLECTION].find_one({"userId": user["user_id"]})
    profile_data = None
    if profile:
        profile_data = UserProfileData(
            dreamerHandle=profile.get("dreamerHandle", "Dreamer"),
            bio=profile.get("bio"),
            totalDreams=profile.get("totalDreams", 0),
            totalAnalyses=profile.get("totalAnalyses", 0)
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["user_id"])}, expires_delta=access_token_expires
    )
    
    user_response = UserResponse(
        id=user["user_id"],
        fullName=user["fullName"],
        email=user["email"],
        createdAt=user["createdAt"],
        isActive=user["isActive"],
        profileCompleted=user["profileCompleted"],
        profile=profile_data
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@router.get("/providers")
async def get_providers():
    """Get available OAuth providers"""
    google_id = os.getenv("GOOGLE_CLIENT_ID", "")
    github_id = os.getenv("GITHUB_CLIENT_ID", "")
    
    # Check if credentials are set and not placeholder values
    google_configured = bool(google_id and not google_id.startswith("YOUR_"))
    github_configured = bool(github_id and not github_id.startswith("YOUR_"))
    
    return {
        "google": google_configured,
        "github": github_configured
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information with profile"""
    db = get_database()
    
    # Get user profile
    profile = db[USER_PROFILES_COLLECTION].find_one({"userId": current_user["id"]})
    profile_data = None
    if profile:
        profile_data = UserProfileData(
            dreamerHandle=profile.get("dreamerHandle", "Dreamer"),
            bio=profile.get("bio"),
            totalDreams=profile.get("totalDreams", 0),
            totalAnalyses=profile.get("totalAnalyses", 0)
        )
    
    return UserResponse(
        id=current_user["id"],
        fullName=current_user["fullName"],
        email=current_user["email"],
        createdAt=current_user["createdAt"],
        isActive=current_user["isActive"],
        profileCompleted=current_user["profileCompleted"],
        profile=profile_data
    )

@router.post("/logout")
async def logout():
    """Logout user (client-side token removal)"""
    return {
        "message": "Successfully logged out",
        "status": "success"
    }

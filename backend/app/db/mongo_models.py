"""
MongoDB Models (Pydantic schemas for validation)
"""
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, Dict, Any, Annotated
from datetime import datetime
from bson import ObjectId


class PyObjectId(str):
    """Custom ObjectId type for Pydantic v2"""
    
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ])
        ])

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)


class UserModel(BaseModel):
    """User model for MongoDB"""
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: int = Field(..., description="Unique user ID")
    fullName: str = Field(..., min_length=1, max_length=100)
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="Hashed password")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    isActive: bool = Field(default=True)
    profileCompleted: bool = Field(default=True)
    lastLogin: Optional[datetime] = None


class UserProfileModel(BaseModel):
    """User profile model for MongoDB"""
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    userId: int = Field(..., description="Reference to user ID")
    dreamerHandle: str = Field(default="Dreamer", max_length=50)
    bio: Optional[str] = Field(None, max_length=500)
    totalDreams: int = Field(default=0)
    totalAnalyses: int = Field(default=0)
    joinedAt: datetime = Field(default_factory=datetime.utcnow)
    preferences: Optional[Dict[str, Any]] = Field(default_factory=dict)


class PredictionModel(BaseModel):
    """Prediction model for MongoDB"""
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    prediction_id: int = Field(..., description="Unique prediction ID")
    userId: Optional[int] = Field(None, description="User who made the prediction")
    dream: str = Field(..., description="Dream description")
    prediction: str = Field(..., description="Predicted dream type")
    confidence: float = Field(..., ge=0, le=1, description="Prediction confidence")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    eeg_data: Optional[Dict[str, Any]] = None


class StoryModel(BaseModel):
    """Story model for MongoDB"""
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    story_id: int = Field(..., description="Unique story ID")
    author: Optional[str] = Field(None, max_length=100)
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    likes: int = Field(default=0)
    views: int = Field(default=0)


class DreamHistoryModel(BaseModel):
    """Dream history model for MongoDB"""
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    userId: int = Field(..., description="User ID")
    dream_description: str = Field(..., description="Dream description")
    prediction: str = Field(..., description="Predicted dream type")
    confidence: float = Field(..., ge=0, le=1)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    notes: Optional[str] = None
    tags: Optional[list] = Field(default_factory=list)


# Helper functions for converting between models and dicts
def user_helper(user) -> dict:
    """Convert user document to dict"""
    return {
        "id": user.get("user_id"),
        "fullName": user.get("fullName"),
        "email": user.get("email"),
        "password": user.get("password"),
        "createdAt": user.get("createdAt"),
        "isActive": user.get("isActive", True),
        "profileCompleted": user.get("profileCompleted", True),
        "lastLogin": user.get("lastLogin"),
    }


def user_profile_helper(profile) -> dict:
    """Convert user profile document to dict"""
    return {
        "userId": profile.get("userId"),
        "dreamerHandle": profile.get("dreamerHandle", "Dreamer"),
        "bio": profile.get("bio"),
        "totalDreams": profile.get("totalDreams", 0),
        "totalAnalyses": profile.get("totalAnalyses", 0),
        "joinedAt": profile.get("joinedAt"),
        "preferences": profile.get("preferences", {}),
    }


def prediction_helper(prediction) -> dict:
    """Convert prediction document to dict"""
    return {
        "id": prediction.get("prediction_id"),
        "userId": prediction.get("userId"),
        "dream": prediction.get("dream"),
        "prediction": prediction.get("prediction"),
        "confidence": prediction.get("confidence"),
        "created_at": prediction.get("created_at"),
        "eeg_data": prediction.get("eeg_data"),
    }


def story_helper(story) -> dict:
    """Convert story document to dict"""
    return {
        "id": story.get("story_id"),
        "author": story.get("author"),
        "title": story.get("title"),
        "content": story.get("content"),
        "created_at": story.get("created_at"),
        "likes": story.get("likes", 0),
        "views": story.get("views", 0),
    }

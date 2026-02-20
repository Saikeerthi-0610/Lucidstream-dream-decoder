from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fullName = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
    isActive = Column(Boolean, default=True)
    profileCompleted = Column(Boolean, default=True)
    lastLogin = Column(DateTime, nullable=True)

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, nullable=False)
    dreamerHandle = Column(String, nullable=True, default="Dreamer")
    bio = Column(String, nullable=True)
    totalDreams = Column(Integer, default=0)
    totalAnalyses = Column(Integer, default=0)
    joinedAt = Column(DateTime, default=datetime.utcnow)
    preferences = Column(String, nullable=True)  # JSON string for user preferences

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    dream = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)

class Story(Base):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    author = Column(String, nullable=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(String, nullable=True)

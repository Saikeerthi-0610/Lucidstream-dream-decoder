"""
MongoDB Database Configuration and Connection
"""
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from typing import Optional

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dream_decoder")

# Async MongoDB client for FastAPI
async_client: Optional[AsyncIOMotorClient] = None
async_db = None

# Sync MongoDB client for non-async operations
sync_client: Optional[MongoClient] = None
sync_db = None


def connect_to_mongo():
    """Connect to MongoDB (sync)"""
    global sync_client, sync_db
    try:
        sync_client = MongoClient(MONGODB_URL)
        sync_db = sync_client[DATABASE_NAME]
        # Test connection
        sync_client.server_info()
        print(f"✅ Connected to MongoDB: {DATABASE_NAME}")
        
        # Create indexes
        create_indexes()
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise


def close_mongo_connection():
    """Close MongoDB connection (sync)"""
    global sync_client
    if sync_client:
        sync_client.close()
        print("🔌 MongoDB connection closed")


async def connect_to_mongo_async():
    """Connect to MongoDB (async)"""
    global async_client, async_db
    try:
        async_client = AsyncIOMotorClient(MONGODB_URL)
        async_db = async_client[DATABASE_NAME]
        # Test connection
        await async_client.server_info()
        print(f"✅ Connected to MongoDB (async): {DATABASE_NAME}")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB (async): {e}")
        raise


async def close_mongo_connection_async():
    """Close MongoDB connection (async)"""
    global async_client
    if async_client:
        async_client.close()
        print("🔌 MongoDB connection closed (async)")


def get_database():
    """Get sync database instance"""
    global sync_client, sync_db
    if sync_db is None:
        # Auto-connect if not connected
        connect_to_mongo()
    return sync_db


async def get_database_async():
    """Get async database instance"""
    return async_db


def create_indexes():
    """Create database indexes for better performance"""
    if sync_db is None:
        print("⚠️ Cannot create indexes: database not connected")
        return
        
    try:
        # Users collection indexes
        try:
            sync_db.users.create_index("email", unique=True)
        except Exception as e:
            print(f"⚠️ Email index: {e}")
            
        try:
            sync_db.users.create_index("user_id", unique=True)
        except Exception as e:
            print(f"⚠️ User ID index: {e}")
        
        # User profiles collection indexes
        try:
            sync_db.user_profiles.create_index("userId", unique=True)
        except Exception as e:
            print(f"⚠️ Profile userId index: {e}")
            
        try:
            sync_db.user_profiles.create_index("dreamerHandle")
        except Exception as e:
            print(f"⚠️ Profile handle index: {e}")
        
        # Predictions collection indexes
        try:
            sync_db.predictions.create_index("userId")
            sync_db.predictions.create_index("created_at")
        except Exception as e:
            print(f"⚠️ Predictions indexes: {e}")
        
        # Stories collection indexes
        try:
            sync_db.stories.create_index("author")
            sync_db.stories.create_index("created_at")
        except Exception as e:
            print(f"⚠️ Stories indexes: {e}")
        
        print("✅ Database indexes created")
        
    except Exception as e:
        print(f"⚠️ Error creating indexes: {e}")


# Collection names
USERS_COLLECTION = "users"
USER_PROFILES_COLLECTION = "user_profiles"
PREDICTIONS_COLLECTION = "predictions"
STORIES_COLLECTION = "stories"
DREAM_HISTORY_COLLECTION = "dream_history"

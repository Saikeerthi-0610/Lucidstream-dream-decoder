"""
Migration script to move data from SQLite to MongoDB
"""
import sqlite3
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.mongodb import connect_to_mongo, get_database, USERS_COLLECTION, USER_PROFILES_COLLECTION, PREDICTIONS_COLLECTION, STORIES_COLLECTION


def migrate_sqlite_to_mongo():
    """Migrate all data from SQLite to MongoDB"""
    
    # Check if SQLite database exists
    if not os.path.exists('dreams.db'):
        print("❌ SQLite database 'dreams.db' not found!")
        print("   Make sure you're running this from the backend directory")
        return
    
    # Connect to SQLite
    print("📂 Connecting to SQLite database...")
    sqlite_conn = sqlite3.connect('dreams.db')
    sqlite_conn.row_factory = sqlite3.Row
    cursor = sqlite_conn.cursor()
    
    # Connect to MongoDB
    print("🍃 Connecting to MongoDB...")
    try:
        connect_to_mongo()
        db = get_database()
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        print("   Make sure MongoDB is running and MONGODB_URL is set in .env")
        return
    
    print("\n🔄 Starting migration...\n")
    
    # Migrate Users
    print("👥 Migrating users...")
    try:
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        
        migrated_users = 0
        for user in users:
            user_doc = {
                "user_id": user['id'],
                "fullName": user['fullName'],
                "email": user['email'],
                "password": user['password'],
                "createdAt": datetime.fromisoformat(user['createdAt'].replace('Z', '+00:00')) if user['createdAt'] else datetime.utcnow(),
                "isActive": bool(user['isActive']),
                "profileCompleted": bool(user['profileCompleted']),
                "lastLogin": datetime.fromisoformat(user['lastLogin'].replace('Z', '+00:00')) if user['lastLogin'] else None
            }
            
            result = db[USERS_COLLECTION].update_one(
                {"user_id": user['id']},
                {"$set": user_doc},
                upsert=True
            )
            
            if result.upserted_id or result.modified_count:
                migrated_users += 1
        
        print(f"   ✅ Migrated {migrated_users} users")
    except Exception as e:
        print(f"   ⚠️ Error migrating users: {e}")
    
    # Migrate User Profiles
    print("📝 Migrating user profiles...")
    try:
        cursor.execute("SELECT * FROM user_profiles")
        profiles = cursor.fetchall()
        
        migrated_profiles = 0
        for profile in profiles:
            # Parse preferences JSON
            preferences = {}
            if profile['preferences']:
                try:
                    import json
                    preferences = json.loads(profile['preferences'])
                except:
                    preferences = {}
            
            profile_doc = {
                "userId": profile['userId'],
                "dreamerHandle": profile['dreamerHandle'] or "Dreamer",
                "bio": profile['bio'],
                "totalDreams": profile['totalDreams'] or 0,
                "totalAnalyses": profile['totalAnalyses'] or 0,
                "joinedAt": datetime.fromisoformat(profile['joinedAt'].replace('Z', '+00:00')) if profile['joinedAt'] else datetime.utcnow(),
                "preferences": preferences
            }
            
            result = db[USER_PROFILES_COLLECTION].update_one(
                {"userId": profile['userId']},
                {"$set": profile_doc},
                upsert=True
            )
            
            if result.upserted_id or result.modified_count:
                migrated_profiles += 1
        
        print(f"   ✅ Migrated {migrated_profiles} user profiles")
    except Exception as e:
        print(f"   ⚠️ Error migrating user profiles: {e}")
    
    # Migrate Predictions
    print("🔮 Migrating predictions...")
    try:
        cursor.execute("SELECT * FROM predictions")
        predictions = cursor.fetchall()
        
        migrated_predictions = 0
        for pred in predictions:
            pred_doc = {
                "prediction_id": pred['id'],
                "dream": pred['dream'],
                "prediction": pred.get('dream', 'Unknown'),  # Assuming dream field contains prediction
                "confidence": pred['confidence'],
                "created_at": datetime.utcnow(),
                "userId": None  # SQLite schema doesn't have userId
            }
            
            result = db[PREDICTIONS_COLLECTION].update_one(
                {"prediction_id": pred['id']},
                {"$set": pred_doc},
                upsert=True
            )
            
            if result.upserted_id or result.modified_count:
                migrated_predictions += 1
        
        print(f"   ✅ Migrated {migrated_predictions} predictions")
    except Exception as e:
        print(f"   ⚠️ Error migrating predictions: {e}")
    
    # Migrate Stories
    print("📖 Migrating stories...")
    try:
        cursor.execute("SELECT * FROM stories")
        stories = cursor.fetchall()
        
        migrated_stories = 0
        for story in stories:
            story_doc = {
                "story_id": story['id'],
                "author": story['author'],
                "title": story['title'],
                "content": story['content'],
                "created_at": datetime.fromisoformat(story['created_at']) if story.get('created_at') else datetime.utcnow(),
                "likes": 0,
                "views": 0
            }
            
            result = db[STORIES_COLLECTION].update_one(
                {"story_id": story['id']},
                {"$set": story_doc},
                upsert=True
            )
            
            if result.upserted_id or result.modified_count:
                migrated_stories += 1
        
        print(f"   ✅ Migrated {migrated_stories} stories")
    except Exception as e:
        print(f"   ⚠️ Error migrating stories: {e}")
    
    # Close connections
    sqlite_conn.close()
    
    print("\n🎉 Migration completed successfully!")
    print("\n📊 Summary:")
    print(f"   - Users: {migrated_users}")
    print(f"   - Profiles: {migrated_profiles}")
    print(f"   - Predictions: {migrated_predictions}")
    print(f"   - Stories: {migrated_stories}")
    print("\n💡 You can now start using MongoDB!")
    print("   Run: python -m uvicorn app.main:app --reload")


if __name__ == "__main__":
    print("=" * 60)
    print("  SQLite to MongoDB Migration Tool")
    print("=" * 60)
    print()
    
    response = input("⚠️  This will migrate data from SQLite to MongoDB.\n   Continue? (yes/no): ")
    
    if response.lower() in ['yes', 'y']:
        migrate_sqlite_to_mongo()
    else:
        print("❌ Migration cancelled")

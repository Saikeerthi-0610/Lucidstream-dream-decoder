"""
Debug script to test signup and see exact error
"""
import sys
sys.path.insert(0, 'backend')

from app.db.mongodb import get_database, USERS_COLLECTION, USER_PROFILES_COLLECTION
from app.api.auth_mongo import hash_password, create_user_profile, get_next_user_id
from datetime import datetime

try:
    print("1. Getting database...")
    db = get_database()
    print(f"   ✓ Database: {db.name}")
    
    print("\n2. Getting next user ID...")
    user_id = get_next_user_id(db)
    print(f"   ✓ Next ID: {user_id}")
    
    print("\n3. Creating test user...")
    test_user = {
        "user_id": user_id,
        "fullName": "Debug Test",
        "email": f"debug{user_id}@test.com",
        "password": hash_password("test123"),
        "createdAt": datetime.utcnow(),
        "isActive": True,
        "profileCompleted": True,
        "lastLogin": datetime.utcnow()
    }
    print(f"   ✓ User data created")
    
    print("\n4. Inserting into database...")
    result = db[USERS_COLLECTION].insert_one(test_user)
    print(f"   ✓ Inserted with ID: {result.inserted_id}")
    
    print("\n5. Creating user profile...")
    profile = create_user_profile(db, user_id, "Debug Test")
    print(f"   ✓ Profile created: {profile['dreamerHandle']}")
    
    print("\n✅ SUCCESS! Signup logic works!")
    print(f"\nCreated user: {test_user['email']}")
    print(f"User ID: {user_id}")
    
    # Cleanup
    print("\n6. Cleaning up test data...")
    db[USERS_COLLECTION].delete_one({"user_id": user_id})
    db[USER_PROFILES_COLLECTION].delete_one({"userId": user_id})
    print("   ✓ Cleaned up")
    
except Exception as e:
    print(f"\n❌ ERROR: {type(e).__name__}")
    print(f"   Message: {str(e)}")
    import traceback
    print("\nFull traceback:")
    traceback.print_exc()

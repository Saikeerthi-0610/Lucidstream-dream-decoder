"""
Quick test script to verify backend is working
"""
import sys
import os

print("=" * 60)
print("  Backend Configuration Test")
print("=" * 60)
print()

# Test 1: Check Python version
print("✓ Python version:", sys.version.split()[0])

# Test 2: Check required packages
print("\n📦 Checking required packages...")
required_packages = [
    "fastapi",
    "uvicorn",
    "pymongo",
    "motor",
    "pyjwt",
    "httpx"
]

missing_packages = []
for package in required_packages:
    try:
        __import__(package)
        print(f"  ✓ {package}")
    except ImportError:
        print(f"  ✗ {package} - MISSING")
        missing_packages.append(package)

if missing_packages:
    print(f"\n❌ Missing packages: {', '.join(missing_packages)}")
    print(f"   Install with: pip install {' '.join(missing_packages)}")
else:
    print("\n✅ All required packages installed!")

# Test 3: Check .env file
print("\n📄 Checking .env file...")
if os.path.exists(".env"):
    print("  ✓ .env file exists")
    with open(".env", "r") as f:
        content = f.read()
        if "MONGODB_URL" in content:
            print("  ✓ MONGODB_URL configured")
        else:
            print("  ⚠️  MONGODB_URL not found in .env")
        
        if "JWT_SECRET_KEY" in content:
            print("  ✓ JWT_SECRET_KEY configured")
else:
    print("  ✗ .env file not found")

# Test 4: Check MongoDB connection
print("\n🍃 Testing MongoDB connection...")
try:
    from dotenv import load_dotenv
    load_dotenv()
    
    from app.db.mongodb import connect_to_mongo, get_database
    connect_to_mongo()
    db = get_database()
    
    # Test connection
    collections = db.list_collection_names()
    print(f"  ✓ Connected to MongoDB")
    print(f"  ✓ Database: {db.name}")
    if collections:
        print(f"  ✓ Collections: {', '.join(collections)}")
    else:
        print(f"  ℹ️  No collections yet (will be created automatically)")
    
except Exception as e:
    print(f"  ✗ MongoDB connection failed: {e}")
    print(f"     Make sure MongoDB is running and MONGODB_URL is correct in .env")

# Test 5: Check API modules
print("\n🔌 Checking API modules...")
api_modules = [
    "app.api.auth_mongo",
    "app.api.health",
    "app.api.predict",
    "app.api.stories",
    "app.api.history",
    "app.api.eeg",
    "app.api.oauth"
]

for module in api_modules:
    try:
        __import__(module)
        print(f"  ✓ {module}")
    except Exception as e:
        print(f"  ✗ {module} - ERROR: {e}")

print("\n" + "=" * 60)
print("  Test Complete!")
print("=" * 60)
print("\n💡 To start the backend:")
print("   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
print()

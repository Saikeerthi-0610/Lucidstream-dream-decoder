# 🍃 MongoDB Setup Guide

## Overview
This guide will help you set up MongoDB for your Dream Decoder application and migrate from SQLite.

---

## 📦 Step 1: Install MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended for Production)

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free (no credit card required)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0 Sandbox)
   - Select a cloud provider and region (closest to you)
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `dream_admin`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string:
     ```
     mongodb+srv://dream_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password

### Option B: Local MongoDB (Development)

#### Windows:
1. Download: https://www.mongodb.com/try/download/community
2. Run installer (choose "Complete" installation)
3. Install as Windows Service
4. MongoDB will run on: `mongodb://localhost:27017`

#### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

---

## 🔧 Step 2: Install Python Dependencies

```bash
cd backend
pip install pymongo motor dnspython
```

Or install all requirements:
```bash
pip install -r requirements.txt
```

---

## ⚙️ Step 3: Configure MongoDB Connection

Update your `backend/.env` file:

### For MongoDB Atlas (Cloud):
```env
MONGODB_URL=mongodb+srv://dream_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=dream_decoder
```

### For Local MongoDB:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=dream_decoder
```

---

## 🔄 Step 4: Update Main Application

Update `backend/app/main.py` to use MongoDB:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.mongodb import connect_to_mongo, close_mongo_connection
from app.api import auth_mongo, health, predict, stories, history, eeg, oauth

app = FastAPI(title="Dream Decoder API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_db_client():
    connect_to_mongo()
    print("🚀 Application started with MongoDB")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_db_client():
    close_mongo_connection()
    print("👋 Application shutdown")

# Include routers
app.include_router(auth_mongo.router)
app.include_router(health.router)
app.include_router(predict.router)
app.include_router(stories.router)
app.include_router(history.router)
app.include_router(eeg.router)
app.include_router(oauth.router)

@app.get("/")
async def root():
    return {"message": "Dream Decoder API with MongoDB", "status": "running"}
```

---

## 🚀 Step 5: Start the Application

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
✅ Connected to MongoDB: dream_decoder
✅ Database indexes created
🚀 Application started with MongoDB
```

---

## 📊 Step 6: Verify MongoDB Connection

### Using MongoDB Compass (GUI):
1. Download: https://www.mongodb.com/try/download/compass
2. Connect using your connection string
3. You should see the `dream_decoder` database

### Using MongoDB Shell:
```bash
mongosh "mongodb://localhost:27017"
use dream_decoder
show collections
```

---

## 🔄 Migrating Data from SQLite (Optional)

If you have existing data in SQLite, here's how to migrate:

### 1. Export SQLite Data

Create `backend/migrate_to_mongo.py`:

```python
import sqlite3
from app.db.mongodb import connect_to_mongo, get_database, USERS_COLLECTION, USER_PROFILES_COLLECTION
from datetime import datetime

def migrate_sqlite_to_mongo():
    # Connect to SQLite
    sqlite_conn = sqlite3.connect('dreams.db')
    sqlite_conn.row_factory = sqlite3.Row
    cursor = sqlite_conn.cursor()
    
    # Connect to MongoDB
    connect_to_mongo()
    db = get_database()
    
    print("🔄 Starting migration...")
    
    # Migrate Users
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    
    for user in users:
        user_doc = {
            "user_id": user['id'],
            "fullName": user['fullName'],
            "email": user['email'],
            "password": user['password'],
            "createdAt": datetime.fromisoformat(user['createdAt']) if user['createdAt'] else datetime.utcnow(),
            "isActive": bool(user['isActive']),
            "profileCompleted": bool(user['profileCompleted']),
            "lastLogin": datetime.fromisoformat(user['lastLogin']) if user['lastLogin'] else None
        }
        db[USERS_COLLECTION].update_one(
            {"user_id": user['id']},
            {"$set": user_doc},
            upsert=True
        )
    
    print(f"✅ Migrated {len(users)} users")
    
    # Migrate User Profiles
    cursor.execute("SELECT * FROM user_profiles")
    profiles = cursor.fetchall()
    
    for profile in profiles:
        profile_doc = {
            "userId": profile['userId'],
            "dreamerHandle": profile['dreamerHandle'],
            "bio": profile['bio'],
            "totalDreams": profile['totalDreams'],
            "totalAnalyses": profile['totalAnalyses'],
            "joinedAt": datetime.fromisoformat(profile['joinedAt']) if profile['joinedAt'] else datetime.utcnow(),
            "preferences": eval(profile['preferences']) if profile['preferences'] else {}
        }
        db[USER_PROFILES_COLLECTION].update_one(
            {"userId": profile['userId']},
            {"$set": profile_doc},
            upsert=True
        )
    
    print(f"✅ Migrated {len(profiles)} user profiles")
    
    sqlite_conn.close()
    print("🎉 Migration completed!")

if __name__ == "__main__":
    migrate_sqlite_to_mongo()
```

### 2. Run Migration

```bash
cd backend
python migrate_to_mongo.py
```

---

## 🧪 Testing MongoDB

### Test User Creation:
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login:
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📈 MongoDB Collections Structure

### users
```json
{
  "user_id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "createdAt": "2024-01-01T00:00:00",
  "isActive": true,
  "profileCompleted": true,
  "lastLogin": "2024-01-01T00:00:00"
}
```

### user_profiles
```json
{
  "userId": 1,
  "dreamerHandle": "John_1",
  "bio": "Welcome to the dreamscape!",
  "totalDreams": 0,
  "totalAnalyses": 0,
  "joinedAt": "2024-01-01T00:00:00",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

---

## 🔒 Security Best Practices

1. **Never commit credentials**
   - Add `.env` to `.gitignore`
   - Use environment variables in production

2. **Use strong passwords**
   - For MongoDB users
   - For JWT secret keys

3. **Restrict network access**
   - In production, whitelist only your server IPs
   - Don't use "Allow Access from Anywhere"

4. **Enable authentication**
   - Always use username/password for MongoDB
   - Use SSL/TLS in production

---

## ❌ Troubleshooting

### Error: "ServerSelectionTimeoutError"
**Solution:**
- Check MongoDB is running: `mongosh` or check MongoDB Compass
- Verify connection string in `.env`
- Check firewall/network settings

### Error: "Authentication failed"
**Solution:**
- Verify username and password in connection string
- Check database user has correct permissions
- Make sure you replaced `<password>` with actual password

### Error: "Database not found"
**Solution:**
- MongoDB creates databases automatically
- Just start using it, it will be created
- Check `DATABASE_NAME` in `.env`

### Error: "Module not found: pymongo"
**Solution:**
```bash
pip install pymongo motor dnspython
```

---

## 🌐 Production Deployment

### Environment Variables:
```env
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=dream_decoder_prod
JWT_SECRET_KEY=super-secret-key-change-this
```

### MongoDB Atlas Settings:
- Enable backup
- Set up monitoring alerts
- Configure proper user roles
- Whitelist only production IPs

---

## 📞 Need Help?

- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB University (Free): https://university.mongodb.com/
- Community Forums: https://www.mongodb.com/community/forums/

---

## ✅ Success Checklist

- [ ] MongoDB installed/Atlas cluster created
- [ ] Python dependencies installed (`pymongo`, `motor`)
- [ ] `.env` file updated with MongoDB URL
- [ ] Application starts without errors
- [ ] Can create new users
- [ ] Can login successfully
- [ ] Data persists after restart

If all checked ✅, MongoDB is working! 🎉

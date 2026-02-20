# 🚀 MongoDB Quick Start (5 Minutes)

## Option 1: MongoDB Atlas (Cloud - Easiest)

### 1. Create Free Account
Go to: https://www.mongodb.com/cloud/atlas/register

### 2. Create Cluster
- Click "Build a Database"
- Choose **FREE** tier
- Click "Create"

### 3. Create User
- Username: `dream_admin`
- Password: (generate and save it)
- Click "Create User"

### 4. Allow Access
- Click "Add IP Address"
- Click "Allow Access from Anywhere"
- Click "Confirm"

### 5. Get Connection String
- Click "Connect" → "Connect your application"
- Copy the string:
```
mongodb+srv://dream_admin:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Update `.env`
```env
MONGODB_URL=mongodb+srv://dream_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=dream_decoder
```

### 7. Install Dependencies
```bash
cd backend
pip install pymongo motor dnspython
```

### 8. Update `main.py`
Replace the auth import:
```python
from app.api import auth_mongo as auth  # Changed from auth
```

Add MongoDB connection:
```python
from app.db.mongodb import connect_to_mongo, close_mongo_connection

@app.on_event("startup")
async def startup():
    connect_to_mongo()

@app.on_event("shutdown")
async def shutdown():
    close_mongo_connection()
```

### 9. Start Backend
```bash
python -m uvicorn app.main:app --reload
```

### 10. Test
Go to: http://localhost:5173/login
Create an account and login!

---

## Option 2: Local MongoDB

### 1. Install MongoDB
**Windows:** Download from https://www.mongodb.com/try/download/community

**Mac:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 2. Update `.env`
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=dream_decoder
```

### 3. Follow steps 7-10 from Option 1 above

---

## ✅ Verify It's Working

You should see in terminal:
```
✅ Connected to MongoDB: dream_decoder
✅ Database indexes created
```

---

## 🔄 Migrate Existing Data (Optional)

If you have SQLite data:
```bash
cd backend
python migrate_to_mongo.py
```

---

## 📞 Issues?

Check `MONGODB_SETUP.md` for detailed troubleshooting.

---

That's it! MongoDB is ready! 🎉

# Fix Backend Connection Error

## The Problem

The error "Cannot connect to server" appears because:
1. The backend needs to be restarted after adding the dream_image module
2. OR there's an internal server error in the signup endpoint

## Quick Fix (2 Steps)

### Step 1: Stop the Backend

In the terminal where the backend is running:
- Press `Ctrl + C` to stop it

### Step 2: Start the Backend Again

```bash
cd backend
python -m uvicorn app.main:app --reload
```

Wait for this message:
```
✅ MongoDB Connected
✅ All Services Running
📚 API Docs: http://localhost:8000/docs
```

### Step 3: Test

```bash
# Test health endpoint
curl http://localhost:8000/health

# Should return:
# {"status":"ok","db":true,"model":true}
```

## If That Doesn't Work

### Check MongoDB is Running

```bash
# Check if MongoDB is running
mongosh --eval "db.version()"
```

If MongoDB is not running:

**Windows**:
```bash
# Start MongoDB service
net start MongoDB
```

**Or start manually**:
```bash
mongod --dbpath C:\data\db
```

### Check for Import Errors

```bash
cd backend
python -c "from app.api import dream_image; print('OK')"
```

Should print: `OK`

If you see an error, the dream_image module has a problem.

## Alternative: Use Without Dream Image

If you want to use the app without the dream image feature temporarily:

### Edit `backend/app/main.py`

Remove the dream_image import and router:

```python
# Change this line:
from app.api import auth_mongo as auth, health, predict, stories, history, eeg, oauth, admin, dream_image

# To this:
from app.api import auth_mongo as auth, health, predict, stories, history, eeg, oauth, admin

# And remove this line:
app.include_router(dream_image.router)
```

Then restart the backend.

## Common Issues

### Issue 1: Port 8000 Already in Use

```bash
# Windows: Find and kill process on port 8000
netstat -ano | findstr :8000
# Note the PID (last column)
taskkill /PID <PID> /F
```

### Issue 2: MongoDB Not Connected

Check `.env` file has:
```bash
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=dream_decoder
```

### Issue 3: Missing Dependencies

```bash
cd backend
pip install httpx python-multipart
```

## Test Signup After Fix

1. Go to `http://localhost:5173/signup`
2. Fill in the form
3. Click "Begin Journey"
4. Should work now!

## Still Having Issues?

Check the backend terminal for error messages. The error will show exactly what's wrong.

Common errors:
- `ModuleNotFoundError` → Missing dependency, run `pip install <module>`
- `Connection refused` → MongoDB not running
- `Port already in use` → Kill the process on port 8000

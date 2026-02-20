# 🚀 Quick Google OAuth Setup

## Current Status
❌ Google OAuth is **NOT configured** (using placeholder values)

## What You Need to Do

### 1️⃣ Get Google OAuth Credentials (5 minutes)

**Go to:** https://console.cloud.google.com/apis/credentials

**Steps:**
1. Create a new project (or select existing)
2. Click "CREATE CREDENTIALS" → "OAuth client ID"
3. If prompted, configure consent screen first:
   - App name: `Dream Decoder`
   - Your email for support
   - Click through the steps
4. Choose "Web application"
5. Add these URIs:
   - **Authorized JavaScript origins**: `http://localhost:5173`
   - **Authorized redirect URIs**: `http://localhost:8000/auth/google/callback`
6. Click "Create"
7. **COPY** the Client ID and Client Secret

### 2️⃣ Update Your `.env` File

**File location:** `backend/.env`

**Replace these lines:**
```env
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
```

**With your actual credentials:**
```env
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_actual_secret_here
```

### 3️⃣ Restart Backend

Stop your backend server (Ctrl+C) and start it again:

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4️⃣ Test It!

1. Go to: http://localhost:5173/login
2. Click "Continue with Google"
3. Sign in with your Google account
4. ✅ You should be logged in!

---

## 📸 Visual Guide

### Step 1: Google Cloud Console
![Create Credentials](https://console.cloud.google.com/apis/credentials)

### Step 2: Configure OAuth Client
```
Application type: Web application
Name: Dream Decoder

Authorized JavaScript origins:
  http://localhost:5173

Authorized redirect URIs:
  http://localhost:8000/auth/google/callback
```

### Step 3: Copy Credentials
You'll see a popup with:
- **Client ID**: `xxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxx`

Copy both!

---

## ⚠️ Common Issues

### Issue: "redirect_uri_mismatch"
**Fix:** Make sure the redirect URI in Google Console is exactly:
```
http://localhost:8000/auth/google/callback
```
(No trailing slash, no typos)

### Issue: Still seeing "not configured" error
**Fix:** 
1. Check that you saved the `.env` file
2. Make sure you restarted the backend
3. Verify the Client ID doesn't start with "YOUR_"

### Issue: "Access blocked"
**Fix:** 
1. Go to OAuth consent screen
2. Add your email as a test user
3. Or publish the app (for production)

---

## 🎯 Quick Checklist

Before testing, verify:
- [ ] Created OAuth Client ID in Google Cloud Console
- [ ] Added redirect URI: `http://localhost:8000/auth/google/callback`
- [ ] Copied Client ID to `backend/.env`
- [ ] Copied Client Secret to `backend/.env`
- [ ] Saved the `.env` file
- [ ] Restarted the backend server
- [ ] Backend is running on port 8000
- [ ] Frontend is running on port 5173

If all checked ✅, Google login will work!

---

## 📞 Still Need Help?

Check the detailed guide: `OAUTH_SETUP_GUIDE.md`

Or check backend logs for specific error messages.

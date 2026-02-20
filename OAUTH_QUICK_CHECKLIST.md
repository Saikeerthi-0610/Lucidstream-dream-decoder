# ✅ Google OAuth Quick Checklist

## Before You Start
- [ ] Have a Google account
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173

---

## Setup Steps (10 minutes)

### 1. Google Cloud Console
- [ ] Go to https://console.cloud.google.com/
- [ ] Create new project: "Dream Decoder"
- [ ] Select the project

### 2. Enable API
- [ ] Go to APIs & Services → Library
- [ ] Search "Google+ API" or "People API"
- [ ] Click ENABLE

### 3. OAuth Consent Screen
- [ ] Go to OAuth consent screen
- [ ] Choose "External"
- [ ] App name: "Dream Decoder"
- [ ] Add your email
- [ ] Add scopes: email, profile, openid
- [ ] Add yourself as test user
- [ ] Save

### 4. Create Credentials
- [ ] Go to Credentials
- [ ] CREATE CREDENTIALS → OAuth client ID
- [ ] Type: Web application
- [ ] Name: "Dream Decoder Web Client"
- [ ] Authorized JavaScript origins:
  - [ ] `http://localhost:5173`
  - [ ] `http://localhost:8000`
- [ ] Authorized redirect URIs:
  - [ ] `http://localhost:8000/auth/google/callback`
- [ ] Click CREATE

### 5. Copy Credentials
- [ ] Copy Client ID (looks like: xxx.apps.googleusercontent.com)
- [ ] Copy Client Secret (looks like: GOCSPX-xxx)
- [ ] Save them somewhere safe

### 6. Update Backend
- [ ] Open `backend/.env`
- [ ] Paste Client ID into `GOOGLE_CLIENT_ID=`
- [ ] Paste Client Secret into `GOOGLE_CLIENT_SECRET=`
- [ ] Save file (Ctrl+S)

### 7. Restart Backend
- [ ] Stop backend (Ctrl+C)
- [ ] Start again: `python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- [ ] Check for errors

### 8. Test
- [ ] Go to http://localhost:5173/login
- [ ] Click Google button
- [ ] Login with your Google account
- [ ] Should redirect back and login successfully

---

## ⚠️ Common Mistakes

- ❌ Forgot to restart backend
- ❌ Redirect URI has trailing slash
- ❌ Didn't add self as test user
- ❌ Client ID still says "YOUR_GOOGLE_CLIENT_ID_HERE"
- ❌ Didn't save .env file

---

## 🎯 The Exact Redirect URI

**MUST BE EXACTLY THIS:**
```
http://localhost:8000/auth/google/callback
```

**NOT:**
- ❌ `http://localhost:8000/auth/google/callback/` (trailing slash)
- ❌ `https://localhost:8000/auth/google/callback` (https)
- ❌ `http://localhost:5173/auth/google/callback` (wrong port)

---

## 🐛 Quick Troubleshooting

**Error: "redirect_uri_mismatch"**
→ Check redirect URI in Google Console matches exactly

**Error: "Access blocked"**
→ Add yourself as test user in OAuth consent screen

**Error: "Google login is not configured"**
→ Check .env file and restart backend

**Button doesn't show**
→ Refresh page, check browser console

---

## ✅ Success!

When it works, you'll:
1. Click Google button
2. See Google login page
3. Select your account
4. Get redirected back
5. Be logged in automatically

---

## 📞 Need Help?

Check the detailed guide: `GOOGLE_OAUTH_COMPLETE_GUIDE.md`

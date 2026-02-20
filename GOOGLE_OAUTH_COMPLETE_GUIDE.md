 # 🔐 Complete Google OAuth Setup Guide (100% Free)

## ⏱️ Time Required: 5-10 minutes

---

## 📋 What You'll Need
- A Google account (Gmail)
- Your backend running on `http://localhost:8000`
- Your frontend running on `http://localhost:5173`

---

## 🚀 Step-by-Step Setup

### **STEP 1: Go to Google Cloud Console**

1. Open your browser
2. Go to: **https://console.cloud.google.com/**
3. Sign in with your Google account

**What you'll see:**
- Google Cloud Console dashboard
- Blue navigation bar at the top
- "Select a project" dropdown

---

### **STEP 2: Create a New Project**

1. Click the **project dropdown** at the top (next to "Google Cloud")
2. Click **"NEW PROJECT"** button (top right of the popup)

**Fill in the form:**
- **Project name**: `Dream Decoder` (or any name you like)
- **Organization**: Leave as "No organization"
- Click **"CREATE"** button

**Wait 10-30 seconds** for the project to be created.

---

### **STEP 3: Select Your New Project**

1. Click the **project dropdown** again
2. Find and click on **"Dream Decoder"** (your new project)
3. You should now see "Dream Decoder" in the top bar

---

### **STEP 4: Enable Google+ API (Required)**

1. In the left sidebar, click **"APIs & Services"**
2. Click **"Library"**
3. In the search box, type: **"Google+ API"** or **"People API"**
4. Click on **"Google+ API"** from the results
5. Click the blue **"ENABLE"** button
6. Wait for it to enable (5-10 seconds)

**Alternative:** You can also enable "Google People API" - either works!

---

### **STEP 5: Configure OAuth Consent Screen**

1. In the left sidebar, click **"OAuth consent screen"**

**Choose User Type:**
- Select **"External"** (this is free and works for anyone)
- Click **"CREATE"**

**Fill in App Information:**

**Page 1 - OAuth consent screen:**
- **App name**: `Dream Decoder`
- **User support email**: Your email (select from dropdown)
- **App logo**: (Optional - skip for now)
- **Application home page**: `http://localhost:5173`
- **Application privacy policy link**: (Optional - skip)
- **Application terms of service link**: (Optional - skip)
- **Authorized domains**: Leave empty for now
- **Developer contact information**: Your email

Click **"SAVE AND CONTINUE"**

**Page 2 - Scopes:**
- Click **"ADD OR REMOVE SCOPES"**
- Find and check these scopes:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
  - `openid`
- Click **"UPDATE"**
- Click **"SAVE AND CONTINUE"**

**Page 3 - Test users:**
- Click **"+ ADD USERS"**
- Enter your email address (the one you'll use to test)
- Click **"ADD"**
- Click **"SAVE AND CONTINUE"**

**Page 4 - Summary:**
- Review everything
- Click **"BACK TO DASHBOARD"**

---

### **STEP 6: Create OAuth Client ID**

1. In the left sidebar, click **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**

**Configure the OAuth client:**

**Application type:**
- Select **"Web application"**

**Name:**
- Enter: `Dream Decoder Web Client`

**Authorized JavaScript origins:**
- Click **"+ ADD URI"**
- Enter: `http://localhost:5173`
- Click **"+ ADD URI"** again
- Enter: `http://localhost:8000`

**Authorized redirect URIs:**
- Click **"+ ADD URI"**
- Enter: `http://localhost:8000/auth/google/callback`
- ⚠️ **IMPORTANT**: Make sure there's NO trailing slash!
- ⚠️ **IMPORTANT**: Must be exactly: `http://localhost:8000/auth/google/callback`

Click **"CREATE"**

---

### **STEP 7: Copy Your Credentials**

**A popup will appear with your credentials:**

1. **Client ID**: 
   - Looks like: `123456789-abc123def456.apps.googleusercontent.com`
   - Click the **copy icon** to copy it
   - **SAVE THIS SOMEWHERE SAFE!**

2. **Client Secret**:
   - Looks like: `GOCSPX-abc123def456ghi789`
   - Click the **copy icon** to copy it
   - **SAVE THIS SOMEWHERE SAFE!**

Click **"OK"** to close the popup.

**💡 Tip:** You can always find these again by clicking on your OAuth client in the Credentials page.

---

### **STEP 8: Update Your Backend .env File**

1. Open your project in your code editor
2. Open the file: `backend/.env`
3. Find these lines:

```env
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
```

4. Replace them with your actual credentials:

```env
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456ghi789
```

5. **SAVE THE FILE** (Ctrl+S or Cmd+S)

**Your complete .env should look like:**

```env
# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here-change-this-in-production

# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=dream_decoder

# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456ghi789
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# GitHub OAuth Configuration (optional)
GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID_HERE
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET_HERE
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

### **STEP 9: Restart Your Backend**

**IMPORTANT:** You MUST restart the backend for changes to take effect!

1. **Stop the backend:**
   - Go to the terminal where backend is running
   - Press `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac)

2. **Start it again:**
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Check the output:**
   - You should see: `✅ Connected to MongoDB`
   - No errors about OAuth

---

### **STEP 10: Test Google Login**

1. **Open your app:** http://localhost:5173/login

2. **Click the Google icon button**

3. **You should see:**
   - Redirect to Google's login page
   - "Dream Decoder wants to access your Google Account"
   - Your email listed

4. **Click your email**

5. **Click "Continue"** or "Allow"

6. **You should be:**
   - Redirected back to your app
   - Automatically logged in
   - Taken to the dashboard/decode page

---

## ✅ Success Checklist

Before testing, make sure:

- [ ] Created Google Cloud project
- [ ] Enabled Google+ API or People API
- [ ] Configured OAuth consent screen
- [ ] Added yourself as a test user
- [ ] Created OAuth Client ID
- [ ] Added redirect URI: `http://localhost:8000/auth/google/callback`
- [ ] Copied Client ID and Client Secret
- [ ] Updated `backend/.env` with real credentials
- [ ] Saved the `.env` file
- [ ] Restarted the backend server
- [ ] Backend is running on port 8000
- [ ] Frontend is running on port 5173
- [ ] No errors in backend console

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem:** The redirect URI doesn't match.

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Click on your OAuth client
3. Check "Authorized redirect URIs"
4. Make sure it's exactly: `http://localhost:8000/auth/google/callback`
5. No trailing slash!
6. No extra spaces!
7. Click "SAVE"

---

### Error: "Access blocked: This app's request is invalid"

**Problem:** OAuth consent screen not configured properly.

**Solution:**
1. Go to OAuth consent screen
2. Make sure you added yourself as a test user
3. Make sure app status is "Testing"
4. Add your email to test users

---

### Error: "Google login is not configured"

**Problem:** Backend doesn't have the credentials.

**Solution:**
1. Check `backend/.env` file
2. Make sure Client ID doesn't start with "YOUR_"
3. Make sure you saved the file
4. Restart the backend server

---

### Error: "Cannot connect to server"

**Problem:** Backend is not running.

**Solution:**
1. Start the backend:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
2. Check it's running on port 8000

---

### Button doesn't appear

**Problem:** Frontend can't detect OAuth is configured.

**Solution:**
1. Check backend is running
2. Open browser console (F12)
3. Check for errors
4. Try refreshing the page
5. Clear browser cache

---

## 🎯 Quick Reference

### Important URLs:
- **Google Cloud Console**: https://console.cloud.google.com/
- **Your App Login**: http://localhost:5173/login
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Important Files:
- **Backend Config**: `backend/.env`
- **OAuth Backend**: `backend/app/api/oauth.py`
- **Login Page**: `frontend/src/pages/Login.jsx`

### Redirect URI (MUST BE EXACT):
```
http://localhost:8000/auth/google/callback
```

---

## 💡 Pro Tips

1. **Save Your Credentials**: Keep Client ID and Secret in a safe place
2. **Test User**: Add your email as a test user in OAuth consent screen
3. **Clear Cache**: If button doesn't appear, clear browser cache
4. **Check Console**: Always check browser console (F12) for errors
5. **Restart Backend**: Always restart after changing `.env`

---

## 🎉 What Happens When It Works

1. Click Google button → Redirects to Google
2. Select your account → Shows permission screen
3. Click "Continue" → Redirects back to your app
4. Automatically logged in → Taken to dashboard
5. Your account is created in MongoDB
6. You can login with Google anytime!

---

## 📞 Still Having Issues?

### Check These:

1. **Backend Console**: Look for error messages
2. **Browser Console**: Press F12, check Console tab
3. **Network Tab**: Check if API calls are failing
4. **.env File**: Make sure credentials are correct
5. **Redirect URI**: Must match exactly in Google Console

### Common Mistakes:

- ❌ Forgot to restart backend
- ❌ Trailing slash in redirect URI
- ❌ Didn't add self as test user
- ❌ Client ID starts with "YOUR_"
- ❌ Didn't save .env file
- ❌ Backend not running

---

## 🎊 Congratulations!

Once you see the Google login working, you've successfully:
- ✅ Set up Google Cloud project (FREE)
- ✅ Configured OAuth (FREE)
- ✅ Integrated Google login (FREE)
- ✅ Users can now sign in with Google!

**Everything is 100% FREE!** Google Cloud's OAuth is completely free for any number of users.

---

## 📸 Visual Checklist

When you're done, you should have:

1. **Google Cloud Console**:
   - Project created ✓
   - API enabled ✓
   - OAuth consent configured ✓
   - Credentials created ✓

2. **Your Code**:
   - `.env` updated ✓
   - Backend restarted ✓
   - No errors in console ✓

3. **Your App**:
   - Google button visible ✓
   - Clicking redirects to Google ✓
   - Can login successfully ✓

---

Need help? Check the error messages and refer to the troubleshooting section above!

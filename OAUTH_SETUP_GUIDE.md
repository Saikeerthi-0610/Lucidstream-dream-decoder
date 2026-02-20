# OAuth Authentication Setup Guide

## 🚀 Quick Start - Google OAuth Setup

Follow these steps to enable Google login in your application:

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click the project dropdown at the top
   - Click "New Project"
   - Name it: `Dream Decoder` (or any name you prefer)
   - Click "Create"
   - Wait for the project to be created (takes a few seconds)

### Step 2: Enable Google OAuth API

1. **Enable Required APIs**
   - In the left sidebar, go to: **APIs & Services** → **Library**
   - Search for: `Google+ API` or `People API`
   - Click on it and press **Enable**
   - Wait for it to enable

### Step 3: Create OAuth Credentials

1. **Go to Credentials Page**
   - In the left sidebar: **APIs & Services** → **Credentials**
   - Click the blue **+ CREATE CREDENTIALS** button at the top
   - Select **OAuth client ID**

2. **Configure OAuth Consent Screen** (if prompted)
   - Click **Configure Consent Screen**
   - Choose **External** (unless you have a Google Workspace)
   - Click **Create**
   - Fill in required fields:
     - **App name**: `Dream Decoder`
     - **User support email**: Your email
     - **Developer contact email**: Your email
   - Click **Save and Continue**
   - Skip "Scopes" (click **Save and Continue**)
   - Skip "Test users" (click **Save and Continue**)
   - Click **Back to Dashboard**

3. **Create OAuth Client ID**
   - Go back to: **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Choose **Application type**: `Web application`
   - **Name**: `Dream Decoder Web Client`
   
4. **Configure Authorized URIs**
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:8000/auth/google/callback
     ```
   - Click **Create**

5. **Copy Your Credentials**
   - A popup will show your credentials
   - **Copy the Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
   - **Copy the Client Secret** (looks like: `GOCSPX-xxxxx`)
   - Keep these safe!

### Step 4: Add Credentials to Your Backend

1. **Open the `.env` file**
   - Location: `backend/.env`
   
2. **Replace the placeholder values**:
   ```env
   GOOGLE_CLIENT_ID=paste-your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
   GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
   ```

3. **Save the file**

### Step 5: Restart Your Backend Server

1. **Stop the backend** (if running)
   - Press `Ctrl+C` in the terminal

2. **Start it again**:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Step 6: Test Google Login

1. **Open your app**: http://localhost:5173/login
2. **Click "Continue with Google"**
3. **Sign in with your Google account**
4. **Authorize the app**
5. **You should be logged in!** ✅

---

## 🔧 GitHub OAuth Setup (Optional)

### Step 1: Create GitHub OAuth App

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/developers
   - Click **OAuth Apps** → **New OAuth App**

2. **Fill in the form**:
   - **Application name**: `Dream Decoder`
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:8000/auth/github/callback`
   - Click **Register application**

3. **Generate Client Secret**:
   - Click **Generate a new client secret**
   - Copy both **Client ID** and **Client Secret**

### Step 2: Add to Backend

Update `backend/.env`:
```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
```

### Step 3: Restart Backend & Test

Same as Google OAuth steps 5-6 above.

---

## 📋 Complete `.env` File Example

Your `backend/.env` should look like this:

```env
# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# GitHub OAuth Configuration  
GITHUB_CLIENT_ID=Iv1.abcdefghijklmnop
GITHUB_CLIENT_SECRET=abcdefghijklmnopqrstuvwxyz1234567890abcd
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

## ❌ Troubleshooting

### Error: "Google OAuth is not configured"
**Solution**: 
- Make sure you've added the credentials to `backend/.env`
- Restart the backend server
- Check that the Client ID doesn't start with "YOUR_"

### Error: "redirect_uri_mismatch"
**Solution**:
- Go back to Google Cloud Console → Credentials
- Edit your OAuth Client ID
- Make sure redirect URI is exactly: `http://localhost:8000/auth/google/callback`
- No trailing slash, no extra spaces

### Error: "Access blocked: This app's request is invalid"
**Solution**:
- Make sure you've enabled the Google+ API or People API
- Check that your OAuth consent screen is configured
- Add your email as a test user if the app is not published

### Error: "Failed to get user info"
**Solution**:
- Check backend logs for detailed error
- Verify the Client Secret is correct
- Make sure the API is enabled in Google Cloud Console

### Backend not detecting credentials
**Solution**:
- Check the `.env` file is in the `backend/` folder
- Make sure there are no extra spaces in the credentials
- Restart the backend completely (stop and start again)

---

## 🌐 Production Deployment

When deploying to production (e.g., Heroku, AWS, Vercel):

### 1. Update Google Cloud Console
- Add production URLs to authorized origins:
  ```
  https://yourdomain.com
  ```
- Add production callback URL:
  ```
  https://api.yourdomain.com/auth/google/callback
  ```

### 2. Update Environment Variables
```env
GOOGLE_REDIRECT_URI=https://api.yourdomain.com/auth/google/callback
FRONTEND_URL=https://yourdomain.com
JWT_SECRET_KEY=use-a-strong-random-secret-key-here
```

### 3. Security Checklist
- ✅ Use HTTPS in production
- ✅ Generate a strong JWT secret key
- ✅ Never commit `.env` to git
- ✅ Use environment variables in your hosting platform
- ✅ Publish your OAuth consent screen (or keep it in testing mode)

---

## 🔐 How OAuth Works

```
User clicks "Continue with Google"
    ↓
Frontend redirects to: /auth/google/authorize
    ↓
Backend redirects to: Google's login page
    ↓
User logs in and authorizes the app
    ↓
Google redirects back to: /auth/google/callback?code=xxx
    ↓
Backend exchanges code for access token
    ↓
Backend fetches user info (email, name)
    ↓
Backend creates/finds user in database
    ↓
Backend generates JWT token
    ↓
Backend redirects to: frontend/auth/callback?token=xxx
    ↓
Frontend stores token and logs user in
    ↓
User is redirected to dashboard ✅
```

---

## 📞 Need Help?

If you're still having issues:

1. **Check backend logs** - They show detailed error messages
2. **Verify all URLs match exactly** - No typos, no trailing slashes
3. **Try incognito mode** - Clear cookies and cache
4. **Check the browser console** - Look for JavaScript errors

Common mistakes:
- ❌ Forgot to restart backend after adding credentials
- ❌ Typo in the redirect URI
- ❌ Didn't enable the Google+ API
- ❌ Client Secret has extra spaces

---

## ✅ Success Checklist

Before testing, make sure:
- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth Client ID created
- [ ] Redirect URI added: `http://localhost:8000/auth/google/callback`
- [ ] Credentials added to `backend/.env`
- [ ] Backend server restarted
- [ ] Frontend is running on `http://localhost:5173`
- [ ] Backend is running on `http://localhost:8000`

If all checked, Google login should work! 🎉

# OAuth Troubleshooting Guide - Dream Decoder

## Common Errors and Solutions

---

## Error: "Google login is not configured on this server"

### What This Means
✅ **Good news!** Your OAuth system is working correctly. This error appears when:
- Google credentials are not added to `.env` file
- Credentials are still set to placeholder values like `YOUR_GOOGLE_CLIENT_ID_HERE`

### The Fix

**Step 1: Get Google OAuth Credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select existing)
3. Click **Create Credentials** → **OAuth client ID**
4. Choose **Web application**
5. Configure:
   - **Authorized JavaScript origins**: `http://localhost:5173`
   - **Authorized redirect URIs**: `http://localhost:8000/auth/google/callback`
6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

**Step 2: Update `.env` File**

Edit `backend/.env`:

```bash
# Replace these lines:
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE

# With your actual credentials:
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-secret-here
```

**Step 3: Restart Backend**

```bash
# Stop the backend (Ctrl+C)
# Start it again
cd backend
python -m uvicorn app.main:app --reload
```

**Step 4: Test**

```bash
# Check provider status
curl http://localhost:8000/auth/providers

# Should now show:
{
  "google": true,  # ← Changed to true!
  "github": false,
  "facebook": false,
  "linkedin": false
}
```

Now click the Google button again - it should work!

---

## Error: "redirect_uri_mismatch"

### What This Means
The redirect URI in your code doesn't match what's configured in Google Cloud Console.

### The Fix

**Check Your Code:**
```python
# In backend/app/api/oauth.py
GOOGLE_REDIRECT_URI = "http://localhost:8000/auth/google/callback"
```

**Check Google Console:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click your OAuth client ID
3. Under **Authorized redirect URIs**, ensure you have:
   ```
   http://localhost:8000/auth/google/callback
   ```
4. Must match EXACTLY (no trailing slash, correct port)

**Common Mistakes:**
- ❌ `http://localhost:8000/auth/google/callback/` (trailing slash)
- ❌ `http://localhost:5173/auth/google/callback` (wrong port)
- ❌ `https://localhost:8000/auth/google/callback` (https instead of http)
- ✅ `http://localhost:8000/auth/google/callback` (correct!)

---

## Error: CORS Error / "Access-Control-Allow-Origin"

### What This Means
Your frontend is trying to make an AJAX request to the OAuth endpoint, but OAuth requires a full page redirect.

### The Fix

**❌ WRONG - Don't use axios/fetch:**
```javascript
// This will cause CORS error
axios.get('http://localhost:8000/auth/google/authorize')
```

**✅ CORRECT - Use window.location.href:**
```javascript
// This is what we implemented
window.location.href = 'http://localhost:8000/auth/google/authorize'
```

Your implementation already does this correctly in `Login.jsx`:
```javascript
const handleSocialLogin = async (provider) => {
  if (provider === 'Google') {
    window.location.href = `${API_BASE_URL}/auth/google/authorize`;
  }
};
```

---

## Error: "Invalid state token"

### What This Means
The state token used for security validation has expired or been tampered with.

### The Fix

**Common Causes:**
1. **Refreshing the callback page** - Don't refresh during OAuth flow
2. **Reusing old callback URL** - Each OAuth flow generates new state token
3. **Browser back button** - Don't use back button during OAuth

**Solution:**
- Start the OAuth flow again from the login page
- Don't bookmark or save callback URLs
- Clear browser cache if issue persists

---

## Error: "Email not provided by [Provider]"

### What This Means
The OAuth provider didn't return an email address.

### The Fix

**For Facebook:**
- Your app needs to request email permission
- May require app review by Facebook
- For development, add test users in Facebook App settings

**For GitHub:**
- User may have private email settings
- Our code handles this by requesting email separately
- Should work automatically

**For LinkedIn:**
- Email scope should be included by default
- Ensure "Sign In with LinkedIn" product is added to your app

---

## Error: Backend Won't Start

### What This Means
There's an issue with your backend configuration or dependencies.

### The Fix

**Check 1: Dependencies Installed**
```bash
cd backend
pip install -r requirements.txt
```

**Check 2: .env File Exists**
```bash
# Should exist in backend/ folder
ls backend/.env
```

**Check 3: Python Version**
```bash
python --version
# Should be Python 3.8 or higher
```

**Check 4: Port Not in Use**
```bash
# Check if port 8000 is already in use
# Windows:
netstat -ano | findstr :8000

# If in use, kill the process or use different port
python -m uvicorn app.main:app --reload --port 8001
```

**Check 5: Import Errors**
```bash
# Test if oauth.py has syntax errors
python -m py_compile backend/app/api/oauth.py
```

---

## Error: Token Not Stored / User Not Logged In

### What This Means
The JWT token isn't being saved to localStorage or the user session isn't persisting.

### The Fix

**Check 1: Browser localStorage Enabled**
```javascript
// Open browser console (F12)
localStorage.setItem('test', 'value')
localStorage.getItem('test')
// Should return 'value'
```

**Check 2: Callback Page Working**
- After OAuth, you should briefly see "Completing authentication..."
- Check browser console for errors
- Verify token is in URL: `/auth/callback?token=xxx`

**Check 3: Token Storage Code**
```javascript
// In OAuthCallback.jsx - this should run
localStorage.setItem('token', token);
localStorage.setItem('authToken', token);
```

**Check 4: Verify Token Stored**
```javascript
// Open browser console after login
localStorage.getItem('token')
localStorage.getItem('authToken')
// Both should return JWT token string
```

---

## Error: "Cannot connect to server"

### What This Means
Frontend can't reach the backend.

### The Fix

**Check 1: Backend Running**
```bash
# Should see:
# INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Check 2: Correct URL**
```javascript
// In frontend/src/api/auth.js
const API_BASE_URL = 'http://localhost:8000';
// Must match backend port
```

**Check 3: Test Backend**
```bash
curl http://localhost:8000/auth/providers
# Should return JSON response
```

**Check 4: Firewall/Antivirus**
- May be blocking local connections
- Temporarily disable to test
- Add exception for ports 8000 and 5173

---

## Error: Duplicate Users Created

### What This Means
Multiple user accounts are being created for the same person.

### The Fix

**Check Database:**
```bash
# For MongoDB
mongosh
use dream_decoder
db.users.find({email: "test@gmail.com"})

# Should only return 1 user
```

**Our Implementation:**
The code already handles this correctly:
```python
# In oauth.py - find_or_create_user()
user = db.query(User).filter(User.email == email).first()
if user:
    # Update existing user
else:
    # Create new user
```

If you're seeing duplicates:
1. Check if emails are different (case sensitivity)
2. Verify database connection is working
3. Check for errors in backend logs

---

## Error: "Session not persisting" (Passport.js specific)

### What This Means
This error is for Node.js/Passport.js implementations. **Your app uses FastAPI, not Passport.js**, so this doesn't apply.

### Your Implementation
You're using JWT tokens, not sessions:
- Token stored in localStorage
- Token sent with each request
- No session middleware needed

---

## Debugging Checklist

### ✅ Pre-Flight Checks

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] `.env` file exists in `backend/` folder
- [ ] At least one provider has real credentials (not placeholders)
- [ ] MongoDB running (if using MongoDB)

### ✅ OAuth Flow Checks

- [ ] Click button redirects to backend
- [ ] Backend redirects to provider (Google/GitHub/etc.)
- [ ] Provider shows authorization page
- [ ] After authorization, redirects back to app
- [ ] Briefly see "Completing authentication..."
- [ ] Redirected to `/decode` page
- [ ] User is logged in

### ✅ Token Checks

- [ ] Token in URL after OAuth: `/auth/callback?token=xxx`
- [ ] Token stored in localStorage
- [ ] Token included in API requests
- [ ] Protected routes accessible

---

## Quick Debug Commands

```bash
# 1. Check provider status
curl http://localhost:8000/auth/providers

# 2. Check if backend is running
curl http://localhost:8000/health

# 3. Check environment variables loaded
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('GOOGLE_CLIENT_ID'))"

# 4. Test OAuth endpoint (should redirect)
curl -I http://localhost:8000/auth/google/authorize

# 5. Check backend logs
# Look in terminal where uvicorn is running
```

---

## Browser Console Debugging

Open browser console (F12) and run:

```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('token'));

// Check if user data exists
console.log('User:', localStorage.getItem('user'));

// Test API connection
fetch('http://localhost:8000/auth/providers')
  .then(r => r.json())
  .then(d => console.log('Providers:', d));

// Clear everything and try again
localStorage.clear();
location.reload();
```

---

## Still Having Issues?

### Check These Files

1. **Backend OAuth Logic**: `backend/app/api/oauth.py`
2. **Backend Configuration**: `backend/.env`
3. **Frontend Login**: `frontend/src/pages/Login.jsx`
4. **Frontend Callback**: `frontend/src/pages/OAuthCallback.jsx`
5. **Backend Logs**: Terminal where uvicorn is running

### Enable Verbose Logging

**Backend:**
```python
# In oauth.py, add more print statements
print(f"OAuth state: {state}")
print(f"User data: {user_data}")
print(f"Token generated: {jwt_token[:20]}...")
```

**Frontend:**
```javascript
// In Login.jsx
console.log('Redirecting to:', url);

// In OAuthCallback.jsx
console.log('Token received:', token);
console.log('Storing token...');
```

---

## Provider-Specific Issues

### Google
- **Issue**: "This app isn't verified"
  - **Fix**: Click "Advanced" → "Go to Dream Decoder (unsafe)" for development
  - For production, submit app for verification

### GitHub
- **Issue**: Email not returned
  - **Fix**: Code handles this automatically by requesting emails separately

### Facebook
- **Issue**: "Email permission required"
  - **Fix**: Add test users in Facebook App settings for development
  - For production, submit app for review

### LinkedIn
- **Issue**: "Product not added"
  - **Fix**: Add "Sign In with LinkedIn using OpenID Connect" product to your app

---

## Success Indicators

You'll know it's working when:

✅ No error message on login page
✅ Clicking button redirects to provider
✅ After authorization, redirected to `/decode`
✅ User name appears in header/navbar
✅ Can access protected routes
✅ Token exists in localStorage
✅ Backend logs show successful OAuth flow

---

## Need More Help?

1. Check backend logs for detailed error messages
2. Check browser console for frontend errors
3. Verify all redirect URIs match exactly
4. Test with `curl` to isolate issues
5. Review provider documentation:
   - [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
   - [GitHub OAuth Docs](https://docs.github.com/en/developers/apps/building-oauth-apps)
   - [Facebook Login Docs](https://developers.facebook.com/docs/facebook-login)
   - [LinkedIn OAuth Docs](https://learn.microsoft.com/en-us/linkedin/shared/authentication)

---

## Summary

Most OAuth errors are due to:
1. **Missing credentials** - Add real values to `.env`
2. **Mismatched redirect URIs** - Must match exactly
3. **Backend not running** - Start uvicorn
4. **Wrong request method** - Use window.location.href, not axios

Your implementation is solid - just needs real credentials to work!

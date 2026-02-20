# Complete OAuth Setup Guide for Dream Decoder

This guide covers setting up OAuth authentication for all four providers: Google, GitHub, Facebook, and LinkedIn.

## Overview

Your Dream Decoder app now supports multi-provider OAuth authentication. Users can sign in with:
- ✅ Google
- ✅ GitHub  
- ✅ Facebook
- ✅ LinkedIn

Each provider is **optional** - you can enable only the ones you want. If credentials are not configured, the buttons will still appear but redirect to an error page.

---

## Architecture

### Backend (FastAPI)
- **File**: `backend/app/api/oauth.py`
- **Endpoints**:
  - `/auth/google/authorize` & `/auth/google/callback`
  - `/auth/github/authorize` & `/auth/github/callback`
  - `/auth/facebook/authorize` & `/auth/facebook/callback`
  - `/auth/linkedin/authorize` & `/auth/linkedin/callback`
  - `/auth/providers` - Returns which providers are configured

### Frontend (React)
- **Login Page**: `frontend/src/pages/Login.jsx`
- **OAuth Callback**: `frontend/src/pages/OAuthCallback.jsx`
- **Auth Service**: `frontend/src/api/auth.js`

### Flow
1. User clicks "Continue with [Provider]" button
2. Frontend redirects to backend `/auth/{provider}/authorize`
3. Backend redirects to provider's OAuth page
4. User authorizes the app
5. Provider redirects back to backend `/auth/{provider}/callback`
6. Backend creates/finds user, generates JWT token
7. Backend redirects to frontend `/auth/callback?token={jwt}`
8. Frontend stores token and redirects to `/decode`

---

## 1. Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API" (or "Google Identity")

### Step 2: Create OAuth Credentials
1. Navigate to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Choose **Web application**
4. Configure:
   - **Name**: Dream Decoder
   - **Authorized JavaScript origins**: `http://localhost:5173`
   - **Authorized redirect URIs**: `http://localhost:8000/auth/google/callback`
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### Step 3: Update .env
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

---

## 2. GitHub OAuth Setup

### Step 1: Register OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Dream Decoder
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:8000/auth/github/callback`
4. Click **Register application**

### Step 2: Generate Client Secret
1. Click **Generate a new client secret**
2. Copy the **Client ID** and **Client Secret**

### Step 3: Update .env
```bash
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
```

---

## 3. Facebook OAuth Setup

### Step 1: Create Facebook App
1. Go to [Meta for Developers](https://developers.facebook.com/apps/)
2. Click **Create App**
3. Choose **Consumer** as app type
4. Fill in app details and create

### Step 2: Add Facebook Login
1. In your app dashboard, click **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web** platform
4. Enter Site URL: `http://localhost:5173`

### Step 3: Configure OAuth Settings
1. Go to **Facebook Login** → **Settings**
2. Add to **Valid OAuth Redirect URIs**: `http://localhost:8000/auth/facebook/callback`
3. Save changes

### Step 4: Get App Credentials
1. Go to **Settings** → **Basic**
2. Copy **App ID** and **App Secret**

### Step 5: Update .env
```bash
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
FACEBOOK_REDIRECT_URI=http://localhost:8000/auth/facebook/callback
```

### Important Notes
- Facebook requires HTTPS in production
- You may need to submit your app for review to access email permissions
- For development, add test users in **Roles** → **Test Users**

---

## 4. LinkedIn OAuth Setup

### Step 1: Create LinkedIn App
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Click **Create app**
3. Fill in:
   - **App name**: Dream Decoder
   - **LinkedIn Page**: (Create a page if needed)
   - **App logo**: Upload your logo
4. Agree to terms and create

### Step 2: Add Sign In with LinkedIn
1. In your app, go to **Products** tab
2. Find **Sign In with LinkedIn using OpenID Connect**
3. Click **Request access** (usually auto-approved)

### Step 3: Configure OAuth Settings
1. Go to **Auth** tab
2. Add to **Authorized redirect URLs**: `http://localhost:8000/auth/linkedin/callback`
3. Save

### Step 4: Get Credentials
1. In **Auth** tab, copy:
   - **Client ID**
   - **Client Secret** (click "Show" to reveal)

### Step 5: Update .env
```bash
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:8000/auth/linkedin/callback
```

### Important Notes
- LinkedIn uses OpenID Connect (newer OAuth 2.0 standard)
- Requires verified LinkedIn Page for production
- Email scope is included by default

---

## Testing Your Setup

### 1. Start Backend
```bash
cd backend
python -m uvicorn app.main:app --reload
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Each Provider
1. Navigate to `http://localhost:5173/login`
2. Click each social login button
3. Authorize the app
4. Verify you're redirected to `/decode` page
5. Check that your user is created in the database

### 4. Check Provider Status
The backend exposes an endpoint to check which providers are configured:
```bash
curl http://localhost:8000/auth/providers
```

Response:
```json
{
  "google": true,
  "github": true,
  "facebook": false,
  "linkedin": false
}
```

---

## Production Deployment

### Update URLs
When deploying to production, update these in your `.env`:

```bash
# Backend URLs
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
GITHUB_REDIRECT_URI=https://yourdomain.com/auth/github/callback
FACEBOOK_REDIRECT_URI=https://yourdomain.com/auth/facebook/callback
LINKEDIN_REDIRECT_URI=https://yourdomain.com/auth/linkedin/callback

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

### Update Provider Settings
For each provider, add production URLs:
- **Google**: Add production redirect URI in Google Cloud Console
- **GitHub**: Add production callback URL in GitHub OAuth settings
- **Facebook**: Add production redirect URI (must be HTTPS)
- **LinkedIn**: Add production redirect URL

### Security Checklist
- ✅ Use HTTPS in production
- ✅ Keep client secrets secure (never commit to git)
- ✅ Use environment variables
- ✅ Implement rate limiting on OAuth endpoints
- ✅ Add CORS configuration for your domain
- ✅ Consider using Redis for state token storage (currently in-memory)

---

## Troubleshooting

### "OAuth not configured" Error
- Check that credentials are set in `.env`
- Restart backend after updating `.env`
- Verify credentials are not empty strings

### "Invalid redirect URI" Error
- Ensure redirect URI in code matches provider settings exactly
- Check for trailing slashes
- Verify protocol (http vs https)

### "Email not provided" Error
- **Facebook**: Request email permission in app review
- **GitHub**: User may have private email - code handles this
- **LinkedIn**: Email scope should be included by default

### State Token Invalid
- State tokens expire after use (security feature)
- Don't refresh the callback page
- Clear browser cache if issues persist

### User Already Exists
- OAuth users are matched by email
- If email exists, user is logged in (not created)
- Password field is set to `oauth_{provider}_{id}` for OAuth users

---

## Code Structure

### Backend OAuth Handler
```python
# backend/app/api/oauth.py
- generate_state_token() - Security token generation
- find_or_create_user() - User management
- {provider}_authorize() - Initiate OAuth flow
- {provider}_callback() - Handle OAuth response
```

### Frontend Integration
```javascript
// frontend/src/pages/Login.jsx
- handleSocialLogin() - Redirect to backend OAuth endpoint
- Error handling for each provider
- Loading states

// frontend/src/pages/OAuthCallback.jsx
- Receives token from backend
- Stores in localStorage
- Redirects to app
```

---

## Next Steps

1. **Enable desired providers** by adding credentials to `.env`
2. **Test each provider** in development
3. **Customize user experience** (profile pictures, additional data)
4. **Add provider icons** to user profiles
5. **Implement account linking** (allow users to connect multiple providers)
6. **Add email verification** for non-OAuth signups

---

## Support

If you encounter issues:
1. Check backend logs for detailed error messages
2. Verify all redirect URIs match exactly
3. Ensure provider apps are in correct mode (development/production)
4. Check that all required scopes are requested

For provider-specific issues, consult their documentation:
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Docs](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Facebook Login Docs](https://developers.facebook.com/docs/facebook-login)
- [LinkedIn OAuth Docs](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)

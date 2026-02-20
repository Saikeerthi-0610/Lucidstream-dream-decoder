# OAuth Quick Start - Dream Decoder

Quick reference for setting up OAuth providers. See `OAUTH_COMPLETE_SETUP.md` for detailed instructions.

## ✅ Current Status

Your app is **ready** for OAuth! All code is implemented. You just need to add credentials.

## 🚀 Quick Setup (Choose Your Providers)

### Google OAuth (5 minutes)
```bash
# 1. Visit: https://console.cloud.google.com/apis/credentials
# 2. Create OAuth Client ID (Web application)
# 3. Add redirect URI: http://localhost:8000/auth/google/callback
# 4. Copy credentials to .env:

GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
```

### GitHub OAuth (3 minutes)
```bash
# 1. Visit: https://github.com/settings/developers
# 2. New OAuth App
# 3. Callback URL: http://localhost:8000/auth/github/callback
# 4. Copy credentials to .env:

GITHUB_CLIENT_ID=your-github-id
GITHUB_CLIENT_SECRET=your-github-secret
```

### Facebook OAuth (10 minutes)
```bash
# 1. Visit: https://developers.facebook.com/apps/
# 2. Create App (Consumer type)
# 3. Add Facebook Login product
# 4. Valid OAuth Redirect: http://localhost:8000/auth/facebook/callback
# 5. Copy credentials to .env:

FACEBOOK_CLIENT_ID=your-app-id
FACEBOOK_CLIENT_SECRET=your-app-secret
```

### LinkedIn OAuth (7 minutes)
```bash
# 1. Visit: https://www.linkedin.com/developers/apps
# 2. Create app
# 3. Add "Sign In with LinkedIn" product
# 4. Redirect URL: http://localhost:8000/auth/linkedin/callback
# 5. Copy credentials to .env:

LINKEDIN_CLIENT_ID=your-linkedin-id
LINKEDIN_CLIENT_SECRET=your-linkedin-secret
```

## 📝 Configuration File

Edit `backend/.env`:

```bash
# Enable only the providers you want
# Leave others as YOUR_*_HERE to disable

# Google
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE

# GitHub
GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID_HERE
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET_HERE

# Facebook
FACEBOOK_CLIENT_ID=YOUR_FACEBOOK_APP_ID_HERE
FACEBOOK_CLIENT_SECRET=YOUR_FACEBOOK_APP_SECRET_HERE

# LinkedIn
LINKEDIN_CLIENT_ID=YOUR_LINKEDIN_CLIENT_ID_HERE
LINKEDIN_CLIENT_SECRET=YOUR_LINKEDIN_CLIENT_SECRET_HERE
```

## 🧪 Test It

```bash
# 1. Start backend
cd backend
python -m uvicorn app.main:app --reload

# 2. Start frontend (new terminal)
cd frontend
npm run dev

# 3. Visit http://localhost:5173/login
# 4. Click social login buttons
```

## 🔍 Check Provider Status

```bash
curl http://localhost:8000/auth/providers
```

Returns which providers are configured:
```json
{
  "google": true,
  "github": false,
  "facebook": false,
  "linkedin": false
}
```

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| "OAuth not configured" | Add credentials to `.env` and restart backend |
| "Invalid redirect URI" | Must match exactly in provider settings |
| "Email not provided" | Facebook requires app review for email access |
| Backend not starting | Check `.env` file exists in `backend/` folder |

## 📚 Files Modified

✅ Backend:
- `backend/app/api/oauth.py` - OAuth logic for all 4 providers
- `backend/.env` - Configuration (add your credentials here)

✅ Frontend:
- `frontend/src/pages/Login.jsx` - Social login buttons
- `frontend/src/pages/OAuthCallback.jsx` - Handles OAuth response

## 🎯 What Works Now

- ✅ Google OAuth (when configured)
- ✅ GitHub OAuth (when configured)
- ✅ Facebook OAuth (when configured)
- ✅ LinkedIn OAuth (when configured)
- ✅ Automatic user creation/login
- ✅ JWT token generation
- ✅ Secure state token validation
- ✅ Error handling for each provider
- ✅ Provider status checking

## 🔐 Security Features

- State tokens prevent CSRF attacks
- Secure token exchange
- JWT authentication
- Email-based user matching
- Provider-specific error handling

## 📖 Need More Help?

See `OAUTH_COMPLETE_SETUP.md` for:
- Detailed step-by-step instructions
- Screenshots and examples
- Production deployment guide
- Troubleshooting section
- Security best practices

# OAuth Quick Reference Card

## 🎯 One-Page Reference for Dream Decoder OAuth

---

## Setup Commands

```bash
# 1. Add credentials to backend/.env
# 2. Start backend
cd backend
python -m uvicorn app.main:app --reload

# 3. Start frontend (new terminal)
cd frontend
npm run dev

# 4. Test
curl http://localhost:8000/auth/providers
```

---

## Provider Credentials

| Provider | Get Credentials | Redirect URI |
|----------|----------------|--------------|
| **Google** | [console.cloud.google.com](https://console.cloud.google.com/apis/credentials) | `http://localhost:8000/auth/google/callback` |
| **GitHub** | [github.com/settings/developers](https://github.com/settings/developers) | `http://localhost:8000/auth/github/callback` |
| **Facebook** | [developers.facebook.com](https://developers.facebook.com/apps/) | `http://localhost:8000/auth/facebook/callback` |
| **LinkedIn** | [linkedin.com/developers](https://www.linkedin.com/developers/apps) | `http://localhost:8000/auth/linkedin/callback` |

---

## Environment Variables (.env)

```bash
# Required
JWT_SECRET_KEY=your-secret-key-here

# Optional - Add only providers you want
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

FACEBOOK_CLIENT_ID=xxx
FACEBOOK_CLIENT_SECRET=xxx

LINKEDIN_CLIENT_ID=xxx
LINKEDIN_CLIENT_SECRET=xxx

# URLs
FRONTEND_URL=http://localhost:5173
```

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/providers` | GET | Check which providers are configured |
| `/auth/google/authorize` | GET | Start Google OAuth |
| `/auth/google/callback` | GET | Handle Google callback |
| `/auth/github/authorize` | GET | Start GitHub OAuth |
| `/auth/github/callback` | GET | Handle GitHub callback |
| `/auth/facebook/authorize` | GET | Start Facebook OAuth |
| `/auth/facebook/callback` | GET | Handle Facebook callback |
| `/auth/linkedin/authorize` | GET | Start LinkedIn OAuth |
| `/auth/linkedin/callback` | GET | Handle LinkedIn callback |

---

## User Flow

```
User clicks button
    ↓
Frontend → Backend /auth/{provider}/authorize
    ↓
Backend → Provider OAuth page
    ↓
User authorizes
    ↓
Provider → Backend /auth/{provider}/callback
    ↓
Backend creates/finds user + generates JWT
    ↓
Backend → Frontend /auth/callback?token=xxx
    ↓
Frontend stores token → User logged in ✅
```

---

## Files Modified

### Backend
- ✅ `backend/app/api/oauth.py` - OAuth logic
- ✅ `backend/.env` - Configuration

### Frontend
- ✅ `frontend/src/pages/Login.jsx` - Login buttons
- ✅ `frontend/src/pages/OAuthCallback.jsx` - Token handler

---

## Testing

```bash
# Check provider status
curl http://localhost:8000/auth/providers

# Expected response
{
  "google": true,
  "github": false,
  "facebook": false,
  "linkedin": false
}
```

### Manual Test
1. Go to `http://localhost:5173/login`
2. Click social button
3. Authorize on provider
4. Should redirect to `/decode`
5. Check localStorage has token

---

## Common Issues

| Problem | Solution |
|---------|----------|
| "OAuth not configured" | Add credentials to `.env`, restart backend |
| "Invalid redirect URI" | Must match exactly in provider settings |
| "Email not provided" | Facebook needs app review |
| Backend won't start | Check `.env` exists in `backend/` |
| Token not stored | Check browser localStorage enabled |

---

## Security Checklist

- ✅ State tokens prevent CSRF
- ✅ JWT tokens expire in 30 min
- ✅ Secrets in `.env` (gitignored)
- ✅ HTTPS in production
- ✅ One-time state tokens

---

## Production Deployment

```bash
# Update .env for production
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
GITHUB_REDIRECT_URI=https://yourdomain.com/auth/github/callback
FACEBOOK_REDIRECT_URI=https://yourdomain.com/auth/facebook/callback
LINKEDIN_REDIRECT_URI=https://yourdomain.com/auth/linkedin/callback
FRONTEND_URL=https://yourdomain.com
```

**Don't forget:** Update redirect URIs in each provider's settings!

---

## Documentation Files

| File | Purpose |
|------|---------|
| `OAUTH_IMPLEMENTATION_SUMMARY.md` | Overview & summary |
| `OAUTH_COMPLETE_SETUP.md` | Detailed setup guide |
| `OAUTH_QUICK_START.md` | Fast setup reference |
| `OAUTH_FLOW_DIAGRAM.md` | Visual flow diagrams |
| `OAUTH_TESTING_CHECKLIST.md` | Testing guide |
| `OAUTH_QUICK_REFERENCE.md` | This file |

---

## Quick Debug

```bash
# Check backend logs
# Look for: "OAuth error: ..."

# Check frontend console (F12)
# Look for: network errors, token storage

# Check database
# Verify user created with correct email

# Check provider settings
# Verify redirect URIs match exactly
```

---

## Support Links

- **Google**: https://developers.google.com/identity/protocols/oauth2
- **GitHub**: https://docs.github.com/en/developers/apps/building-oauth-apps
- **Facebook**: https://developers.facebook.com/docs/facebook-login
- **LinkedIn**: https://learn.microsoft.com/en-us/linkedin/shared/authentication

---

## Status: ✅ READY TO USE

All code implemented. Just add credentials and test!

**Start here:** `OAUTH_QUICK_START.md`

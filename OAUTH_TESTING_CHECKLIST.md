# OAuth Testing Checklist

Use this checklist to verify your OAuth implementation is working correctly.

## Pre-Testing Setup

### ✅ Backend Setup
- [ ] Backend `.env` file exists in `backend/` folder
- [ ] At least one provider has credentials configured
- [ ] JWT_SECRET_KEY is set in `.env`
- [ ] MongoDB is running (if using MongoDB)
- [ ] Backend dependencies installed: `pip install -r requirements.txt`

### ✅ Frontend Setup
- [ ] Frontend dependencies installed: `npm install`
- [ ] Frontend configured to point to `http://localhost:8000`

### ✅ Start Services
```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## Test 1: Provider Status Check

### API Test
```bash
curl http://localhost:8000/auth/providers
```

**Expected Response:**
```json
{
  "google": true,    // or false if not configured
  "github": false,
  "facebook": false,
  "linkedin": false
}
```

### Checklist
- [ ] Endpoint returns 200 OK
- [ ] Configured providers show `true`
- [ ] Unconfigured providers show `false`

---

## Test 2: Google OAuth (if configured)

### Manual Test
1. [ ] Navigate to `http://localhost:5173/login`
2. [ ] Click "Continue with Google" button
3. [ ] Redirected to Google login page
4. [ ] Google shows "Dream Decoder wants to access..."
5. [ ] Click "Allow"
6. [ ] Redirected back to app
7. [ ] Briefly see "Completing authentication..." message
8. [ ] Redirected to `/decode` page
9. [ ] User is logged in (check header/navbar)

### Database Check
```bash
# Check user was created
# For SQLite:
sqlite3 backend/dreams.db "SELECT * FROM users WHERE email='your-google-email@gmail.com';"

# For MongoDB:
mongosh
use dream_decoder
db.users.find({email: "your-google-email@gmail.com"})
```

### Checklist
- [ ] User created in database
- [ ] Email matches Google account
- [ ] `fullName` populated
- [ ] `isActive` is true
- [ ] `lastLogin` timestamp set
- [ ] Token stored in localStorage
- [ ] Can access protected routes

---

## Test 3: GitHub OAuth (if configured)

### Manual Test
1. [ ] Navigate to `http://localhost:5173/login`
2. [ ] Click GitHub icon button
3. [ ] Redirected to GitHub authorization page
4. [ ] GitHub shows "Authorize Dream Decoder"
5. [ ] Click "Authorize"
6. [ ] Redirected back to app
7. [ ] Redirected to `/decode` page
8. [ ] User is logged in

### Checklist
- [ ] User created/logged in
- [ ] Email from GitHub account
- [ ] Name or username populated
- [ ] Token stored correctly

---

## Test 4: Facebook OAuth (if configured)

### Manual Test
1. [ ] Navigate to `http://localhost:5173/login`
2. [ ] Click Facebook icon button
3. [ ] Redirected to Facebook login
4. [ ] Facebook shows "Dream Decoder wants to..."
5. [ ] Click "Continue"
6. [ ] Redirected back to app
7. [ ] Redirected to `/decode` page
8. [ ] User is logged in

### Checklist
- [ ] User created/logged in
- [ ] Email from Facebook account
- [ ] Name populated
- [ ] Token stored correctly

### Note
If email is not provided, you may need to:
- Add test users in Facebook App settings
- Submit app for review to access email permission

---

## Test 5: LinkedIn OAuth (if configured)

### Manual Test
1. [ ] Navigate to `http://localhost:5173/login`
2. [ ] Click LinkedIn icon button
3. [ ] Redirected to LinkedIn authorization
4. [ ] LinkedIn shows "Sign in to Dream Decoder"
5. [ ] Click "Allow"
6. [ ] Redirected back to app
7. [ ] Redirected to `/decode` page
8. [ ] User is logged in

### Checklist
- [ ] User created/logged in
- [ ] Email from LinkedIn account
- [ ] Name populated
- [ ] Token stored correctly

---

## Test 6: Error Handling

### Test Unconfigured Provider
1. [ ] Remove credentials for a provider from `.env`
2. [ ] Restart backend
3. [ ] Click that provider's button
4. [ ] Should see error: "{Provider} login is not configured"

### Test Invalid State Token
1. [ ] Start OAuth flow
2. [ ] Manually modify state parameter in callback URL
3. [ ] Should see error message

### Test Network Error
1. [ ] Stop backend
2. [ ] Try to login
3. [ ] Should see connection error

### Checklist
- [ ] Errors display user-friendly messages
- [ ] No sensitive information exposed
- [ ] User can try again after error

---

## Test 7: Existing User Login

### Test Flow
1. [ ] Create account via OAuth (e.g., Google)
2. [ ] Logout
3. [ ] Login again with same provider
4. [ ] Should login to existing account (not create new)

### Database Check
```bash
# Verify only one user with that email exists
# SQLite:
sqlite3 backend/dreams.db "SELECT COUNT(*) FROM users WHERE email='test@gmail.com';"
# Should return: 1

# MongoDB:
db.users.countDocuments({email: "test@gmail.com"})
# Should return: 1
```

### Checklist
- [ ] No duplicate users created
- [ ] `lastLogin` timestamp updated
- [ ] User data preserved from first login

---

## Test 8: Token Persistence

### Test Flow
1. [ ] Login via OAuth
2. [ ] Close browser tab
3. [ ] Open new tab to `http://localhost:5173`
4. [ ] Should still be logged in
5. [ ] Navigate to protected route (e.g., `/decode`)
6. [ ] Should have access

### Browser DevTools Check
```javascript
// Open browser console
localStorage.getItem('token')
localStorage.getItem('authToken')
localStorage.getItem('user')
// All should return values
```

### Checklist
- [ ] Token persists across page reloads
- [ ] Token persists across browser tabs
- [ ] Protected routes accessible with token
- [ ] Logout clears token

---

## Test 9: Multiple Providers Same Email

### Test Flow
1. [ ] Login with Google (email: test@gmail.com)
2. [ ] Logout
3. [ ] Login with GitHub (same email: test@gmail.com)
4. [ ] Should login to same account

### Checklist
- [ ] Same user account used
- [ ] No duplicate users created
- [ ] User can login with either provider

---

## Test 10: Security Checks

### State Token Security
- [ ] State token is random (32+ characters)
- [ ] State token used only once
- [ ] State token expires after use
- [ ] Cannot reuse old state token

### Token Security
- [ ] JWT token has expiration (30 min)
- [ ] Client secret never exposed to frontend
- [ ] Tokens stored securely in localStorage
- [ ] HTTPS used in production

### Redirect URI Security
- [ ] Redirect URIs match exactly in provider settings
- [ ] No open redirects possible
- [ ] Callback validates state before processing

---

## Test 11: Production Readiness

### Environment Variables
- [ ] All secrets in `.env` file
- [ ] `.env` in `.gitignore`
- [ ] `.env.example` has placeholders only
- [ ] Production URLs configured separately

### Provider Settings
- [ ] Production redirect URIs added to each provider
- [ ] HTTPS redirect URIs for production
- [ ] Apps set to production mode (not development)
- [ ] Rate limiting configured

### Error Logging
- [ ] Backend logs OAuth errors
- [ ] Errors don't expose sensitive data
- [ ] Failed attempts logged for monitoring

---

## Test 12: User Experience

### Loading States
- [ ] Button shows loading state during OAuth
- [ ] Callback page shows "Completing authentication..."
- [ ] No blank screens during flow

### Error Messages
- [ ] Errors are user-friendly
- [ ] Errors suggest next steps
- [ ] Technical details hidden from users

### Navigation
- [ ] Successful login redirects to `/decode`
- [ ] Failed login stays on `/login` with error
- [ ] Can retry after error

---

## Troubleshooting Common Issues

### Issue: "OAuth not configured" error
**Solution:**
- Check `.env` file has credentials
- Restart backend after updating `.env`
- Verify credentials are not empty strings

### Issue: "Invalid redirect URI" error
**Solution:**
- Check redirect URI in code matches provider settings exactly
- No trailing slashes
- Correct protocol (http vs https)

### Issue: "Email not provided" error
**Solution:**
- Facebook: Request email permission in app review
- GitHub: Code handles private emails
- LinkedIn: Email should be included by default

### Issue: User not created in database
**Solution:**
- Check database connection
- Verify database migrations run
- Check backend logs for errors

### Issue: Token not stored
**Solution:**
- Check browser localStorage not disabled
- Verify callback page receives token
- Check for JavaScript errors in console

---

## Success Criteria

Your OAuth implementation is working correctly if:

✅ All configured providers allow login
✅ Users are created/found correctly
✅ JWT tokens are generated and stored
✅ Protected routes are accessible after login
✅ Errors are handled gracefully
✅ No duplicate users created
✅ Security measures in place
✅ User experience is smooth

---

## Performance Benchmarks

Expected response times:
- Provider status check: < 50ms
- OAuth redirect: < 100ms
- Token exchange: < 2s (depends on provider)
- User creation: < 500ms
- Total login flow: 3-10s (mostly user interaction)

---

## Next Steps After Testing

Once all tests pass:

1. **Document your setup** - Note which providers you enabled
2. **Set up monitoring** - Track OAuth success/failure rates
3. **Configure production** - Add production URLs to providers
4. **Test in production** - Verify HTTPS redirects work
5. **Add analytics** - Track which providers users prefer
6. **Consider enhancements**:
   - Profile pictures from OAuth
   - Account linking (multiple providers per user)
   - Remember last used provider
   - Social sharing features

---

## Support Resources

- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **GitHub OAuth**: https://docs.github.com/en/developers/apps/building-oauth-apps
- **Facebook Login**: https://developers.facebook.com/docs/facebook-login
- **LinkedIn OAuth**: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication

For issues, check:
1. Backend logs (`uvicorn` output)
2. Browser console (F12)
3. Network tab (F12 → Network)
4. Provider developer console logs

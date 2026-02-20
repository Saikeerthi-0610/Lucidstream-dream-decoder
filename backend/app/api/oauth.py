"""
OAuth Authentication Implementation for Google and GitHub
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User, UserProfile
from app.api.auth import create_access_token, create_user_profile, UserResponse, UserProfileData, Token
from datetime import datetime, timedelta
import os
import httpx
import secrets
from typing import Optional

router = APIRouter(prefix="/auth", tags=["oauth"])

# OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/google/callback")

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "")
GITHUB_REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:8000/auth/github/callback")

FACEBOOK_CLIENT_ID = os.getenv("FACEBOOK_CLIENT_ID", "")
FACEBOOK_CLIENT_SECRET = os.getenv("FACEBOOK_CLIENT_SECRET", "")
FACEBOOK_REDIRECT_URI = os.getenv("FACEBOOK_REDIRECT_URI", "http://localhost:8000/auth/facebook/callback")

LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID", "")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET", "")
LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI", "http://localhost:8000/auth/linkedin/callback")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Store state tokens temporarily (in production, use Redis or database)
oauth_states = {}

# Provider readiness flags
GOOGLE_CONFIGURED = bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET)
GITHUB_CONFIGURED = bool(GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET)
FACEBOOK_CONFIGURED = bool(FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET)
LINKEDIN_CONFIGURED = bool(LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET)

@router.get("/providers")
async def get_oauth_providers():
    """Expose which OAuth providers are configured"""
    return {
        "google": GOOGLE_CONFIGURED,
        "github": GITHUB_CONFIGURED,
        "facebook": FACEBOOK_CONFIGURED,
        "linkedin": LINKEDIN_CONFIGURED
    }

def generate_state_token():
    """Generate a random state token for OAuth security"""
    return secrets.token_urlsafe(32)

def find_or_create_user(db: Session, email: str, full_name: str, provider: str, provider_id: str):
    """Find existing user or create new one from OAuth data"""
    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    
    if user:
        # Update last login
        user.lastLogin = datetime.utcnow()
        db.commit()
        db.refresh(user)
    else:
        # Create new user
        user = User(
            fullName=full_name,
            email=email,
            password=f"oauth_{provider}_{provider_id}",  # OAuth users don't have passwords
            createdAt=datetime.utcnow(),
            isActive=True,
            profileCompleted=True,
            lastLogin=datetime.utcnow()
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Create user profile
        create_user_profile(db, user.id, user.fullName)
    
    return user

# ==================== GOOGLE OAUTH ====================

@router.get("/google/authorize")
async def google_authorize():
    """Initiate Google OAuth flow"""
    if not (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET):
        error_url = f"{FRONTEND_URL}/login?error=google_oauth_not_configured"
        return RedirectResponse(url=error_url)
    
    # Generate state token for security
    state = generate_state_token()
    oauth_states[state] = {"provider": "google", "timestamp": datetime.utcnow()}
    
    # Build Google OAuth URL
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={GOOGLE_REDIRECT_URI}&"
        "response_type=code&"
        "scope=openid email profile&"
        f"state={state}&"
        "access_type=offline&"
        "prompt=consent"
    )
    
    return RedirectResponse(url=google_auth_url)

@router.get("/google/callback")
async def google_callback(code: str, state: str, db: Session = Depends(get_db)):
    """Handle Google OAuth callback"""
    # Verify state token
    if state not in oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state token")
    
    # Remove used state token
    del oauth_states[state]
    
    try:
        # Exchange authorization code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "redirect_uri": GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code"
                }
            )
            
            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get access token from Google")
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            # Get user info from Google
            user_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if user_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get user info from Google")
            
            user_data = user_response.json()
            
            # Extract user information
            email = user_data.get("email")
            name = user_data.get("name", email.split("@")[0])
            google_id = user_data.get("id")
            
            # Find or create user
            user = find_or_create_user(db, email, name, "google", google_id)
            
            # Create JWT token
            access_token_expires = timedelta(minutes=30)
            jwt_token = create_access_token(
                data={"sub": str(user.id)}, 
                expires_delta=access_token_expires
            )
            
            # Redirect to frontend with token
            redirect_url = f"{FRONTEND_URL}/auth/callback?token={jwt_token}&provider=google"
            return RedirectResponse(url=redirect_url)
            
    except Exception as e:
        print(f"Google OAuth error: {str(e)}")
        error_url = f"{FRONTEND_URL}/login?error=google_auth_failed"
        return RedirectResponse(url=error_url)

# ==================== GITHUB OAUTH ====================

@router.get("/github/authorize")
async def github_authorize():
    """Initiate GitHub OAuth flow"""
    if not (GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET):
        error_url = f"{FRONTEND_URL}/login?error=github_oauth_not_configured"
        return RedirectResponse(url=error_url)
    
    # Generate state token for security
    state = generate_state_token()
    oauth_states[state] = {"provider": "github", "timestamp": datetime.utcnow()}
    
    # Build GitHub OAuth URL
    github_auth_url = (
        "https://github.com/login/oauth/authorize?"
        f"client_id={GITHUB_CLIENT_ID}&"
        f"redirect_uri={GITHUB_REDIRECT_URI}&"
        "scope=user:email&"
        f"state={state}"
    )
    
    return RedirectResponse(url=github_auth_url)

@router.get("/github/callback")
async def github_callback(code: str, state: str, db: Session = Depends(get_db)):
    """Handle GitHub OAuth callback"""
    # Verify state token
    if state not in oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state token")
    
    # Remove used state token
    del oauth_states[state]
    
    try:
        # Exchange authorization code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    "code": code,
                    "client_id": GITHUB_CLIENT_ID,
                    "client_secret": GITHUB_CLIENT_SECRET,
                    "redirect_uri": GITHUB_REDIRECT_URI
                },
                headers={"Accept": "application/json"}
            )
            
            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get access token from GitHub")
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            # Get user info from GitHub
            user_response = await client.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/json"
                }
            )
            
            if user_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get user info from GitHub")
            
            user_data = user_response.json()
            
            # Get user email (might need separate request)
            email = user_data.get("email")
            if not email:
                email_response = await client.get(
                    "https://api.github.com/user/emails",
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Accept": "application/json"
                    }
                )
                if email_response.status_code == 200:
                    emails = email_response.json()
                    primary_email = next((e for e in emails if e.get("primary")), None)
                    email = primary_email.get("email") if primary_email else emails[0].get("email")
            
            # Extract user information
            name = user_data.get("name") or user_data.get("login", email.split("@")[0])
            github_id = str(user_data.get("id"))
            
            # Find or create user
            user = find_or_create_user(db, email, name, "github", github_id)
            
            # Create JWT token
            access_token_expires = timedelta(minutes=30)
            jwt_token = create_access_token(
                data={"sub": str(user.id)}, 
                expires_delta=access_token_expires
            )
            
            # Redirect to frontend with token
            redirect_url = f"{FRONTEND_URL}/auth/callback?token={jwt_token}&provider=github"
            return RedirectResponse(url=redirect_url)
            
    except Exception as e:
        print(f"GitHub OAuth error: {str(e)}")
        error_url = f"{FRONTEND_URL}/login?error=github_auth_failed"
        return RedirectResponse(url=error_url)

# ==================== FACEBOOK OAUTH ====================

@router.get("/facebook/authorize")
async def facebook_authorize():
    """Initiate Facebook OAuth flow"""
    if not (FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET):
        error_url = f"{FRONTEND_URL}/login?error=facebook_oauth_not_configured"
        return RedirectResponse(url=error_url)
    
    # Generate state token for security
    state = generate_state_token()
    oauth_states[state] = {"provider": "facebook", "timestamp": datetime.utcnow()}
    
    # Build Facebook OAuth URL
    facebook_auth_url = (
        "https://www.facebook.com/v18.0/dialog/oauth?"
        f"client_id={FACEBOOK_CLIENT_ID}&"
        f"redirect_uri={FACEBOOK_REDIRECT_URI}&"
        "scope=email,public_profile&"
        f"state={state}"
    )
    
    return RedirectResponse(url=facebook_auth_url)

@router.get("/facebook/callback")
async def facebook_callback(code: str, state: str, db: Session = Depends(get_db)):
    """Handle Facebook OAuth callback"""
    # Verify state token
    if state not in oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state token")
    
    # Remove used state token
    del oauth_states[state]
    
    try:
        # Exchange authorization code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.get(
                "https://graph.facebook.com/v18.0/oauth/access_token",
                params={
                    "code": code,
                    "client_id": FACEBOOK_CLIENT_ID,
                    "client_secret": FACEBOOK_CLIENT_SECRET,
                    "redirect_uri": FACEBOOK_REDIRECT_URI
                }
            )
            
            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get access token from Facebook")
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            # Get user info from Facebook
            user_response = await client.get(
                "https://graph.facebook.com/me",
                params={
                    "fields": "id,name,email",
                    "access_token": access_token
                }
            )
            
            if user_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get user info from Facebook")
            
            user_data = user_response.json()
            
            # Extract user information
            email = user_data.get("email")
            if not email:
                raise HTTPException(status_code=400, detail="Email not provided by Facebook")
            
            name = user_data.get("name", email.split("@")[0])
            facebook_id = user_data.get("id")
            
            # Find or create user
            user = find_or_create_user(db, email, name, "facebook", facebook_id)
            
            # Create JWT token
            access_token_expires = timedelta(minutes=30)
            jwt_token = create_access_token(
                data={"sub": str(user.id)}, 
                expires_delta=access_token_expires
            )
            
            # Redirect to frontend with token
            redirect_url = f"{FRONTEND_URL}/auth/callback?token={jwt_token}&provider=facebook"
            return RedirectResponse(url=redirect_url)
            
    except Exception as e:
        print(f"Facebook OAuth error: {str(e)}")
        error_url = f"{FRONTEND_URL}/login?error=facebook_auth_failed"
        return RedirectResponse(url=error_url)

# ==================== LINKEDIN OAUTH ====================

@router.get("/linkedin/authorize")
async def linkedin_authorize():
    """Initiate LinkedIn OAuth flow"""
    if not (LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET):
        error_url = f"{FRONTEND_URL}/login?error=linkedin_oauth_not_configured"
        return RedirectResponse(url=error_url)
    
    # Generate state token for security
    state = generate_state_token()
    oauth_states[state] = {"provider": "linkedin", "timestamp": datetime.utcnow()}
    
    # Build LinkedIn OAuth URL
    linkedin_auth_url = (
        "https://www.linkedin.com/oauth/v2/authorization?"
        f"client_id={LINKEDIN_CLIENT_ID}&"
        f"redirect_uri={LINKEDIN_REDIRECT_URI}&"
        "response_type=code&"
        "scope=openid profile email&"
        f"state={state}"
    )
    
    return RedirectResponse(url=linkedin_auth_url)

@router.get("/linkedin/callback")
async def linkedin_callback(code: str, state: str, db: Session = Depends(get_db)):
    """Handle LinkedIn OAuth callback"""
    # Verify state token
    if state not in oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state token")
    
    # Remove used state token
    del oauth_states[state]
    
    try:
        # Exchange authorization code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://www.linkedin.com/oauth/v2/accessToken",
                data={
                    "code": code,
                    "client_id": LINKEDIN_CLIENT_ID,
                    "client_secret": LINKEDIN_CLIENT_SECRET,
                    "redirect_uri": LINKEDIN_REDIRECT_URI,
                    "grant_type": "authorization_code"
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get access token from LinkedIn")
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            # Get user info from LinkedIn (using OpenID Connect userinfo endpoint)
            user_response = await client.get(
                "https://api.linkedin.com/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if user_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get user info from LinkedIn")
            
            user_data = user_response.json()
            
            # Extract user information
            email = user_data.get("email")
            if not email:
                raise HTTPException(status_code=400, detail="Email not provided by LinkedIn")
            
            name = user_data.get("name", email.split("@")[0])
            linkedin_id = user_data.get("sub")  # OpenID Connect subject identifier
            
            # Find or create user
            user = find_or_create_user(db, email, name, "linkedin", linkedin_id)
            
            # Create JWT token
            access_token_expires = timedelta(minutes=30)
            jwt_token = create_access_token(
                data={"sub": str(user.id)}, 
                expires_delta=access_token_expires
            )
            
            # Redirect to frontend with token
            redirect_url = f"{FRONTEND_URL}/auth/callback?token={jwt_token}&provider=linkedin"
            return RedirectResponse(url=redirect_url)
            
    except Exception as e:
        print(f"LinkedIn OAuth error: {str(e)}")
        error_url = f"{FRONTEND_URL}/login?error=linkedin_auth_failed"
        return RedirectResponse(url=error_url)

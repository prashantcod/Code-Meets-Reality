from fastapi import APIRouter, Request, Response, HTTPException, Depends
from fastapi.responses import RedirectResponse
import os
import pyjwt as jwt
import time
import uuid

router = APIRouter()

# Constants
REPL_ID = os.environ.get('REPL_ID', 'no-repl-id')
ISSUER_URL = os.environ.get('ISSUER_URL', 'https://replit.com/oidc')

# Session storage
sessions = {}

def get_current_user(request: Request):
    """Get current user from cookies or return None"""
    session_id = request.cookies.get('session_id')
    if not session_id or session_id not in sessions:
        return None
    return sessions[session_id]

@router.get('/login')
async def login(request: Request):
    """Start Replit OAuth flow"""
    # Generate state parameters for security
    state = str(uuid.uuid4())
    
    # Store state in a cookie that we can verify later
    auth_state_cookie = f"auth_state={state}; Path=/; HttpOnly; SameSite=Lax"
    
    # Generate redirect URI
    callback_url = str(request.url_for('callback'))
    
    # Generate authorization URL
    auth_url = (
        f"{ISSUER_URL}/auth?"
        f"client_id={REPL_ID}&"
        f"response_type=code&"
        f"state={state}&"
        f"scope=openid profile email offline_access&"
        f"redirect_uri={callback_url}&"
        f"prompt=login consent"
    )
    
    # Redirect to authorization URL with Set-Cookie header
    response = RedirectResponse(url=auth_url)
    response.headers["Set-Cookie"] = auth_state_cookie
    return response

@router.get('/callback')
async def callback(request: Request, code: str = None, state: str = None):
    """Handle OAuth callback"""
    # Get the state from cookie and validate it
    cookie_state = request.cookies.get('auth_state')
    if not state or not cookie_state or state != cookie_state:
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    
    # Exchange code for tokens
    if not code:
        raise HTTPException(status_code=400, detail="No authorization code provided")
    
    # In a real app, we would exchange the code for tokens here
    # For this demo, we'll simulate a successful login
    
    # Create session
    session_id = str(uuid.uuid4())
    user = {
        'id': f"user_{uuid.uuid4().hex[:8]}",
        'username': f"user_{uuid.uuid4().hex[:8]}",
        'email': f"user_{uuid.uuid4().hex[:8]}@example.com",
        'is_authenticated': True
    }
    sessions[session_id] = user
    
    # Set session cookie and redirect
    response = RedirectResponse(url='/')
    response.set_cookie(key="session_id", value=session_id, httponly=True, samesite="lax")
    
    # Clear the auth state cookie
    response.delete_cookie(key="auth_state")
    
    return response

@router.get('/logout')
async def logout(request: Request):
    """Log out the user"""
    session_id = request.cookies.get('session_id')
    if session_id and session_id in sessions:
        del sessions[session_id]
    
    response = RedirectResponse(url='/')
    response.delete_cookie(key="session_id")
    return response

@router.get('/me')
async def me(request: Request):
    """Get current user info"""
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

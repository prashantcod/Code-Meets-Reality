"""
Enhanced authentication demo template for the Code Meets Reality platform.
This file contains an advanced HTML template for authentication-related code examples
with a working sign-up and sign-in functionality that matches our Tokyo-night-dark theme.
"""

import re
import importlib.util
import json

def get_auth_demo_html(code):
    """
    Generate an authentication demo HTML based on code.
    Returns a login demo HTML with interactive authentication logic that
    matches our Tokyo-night-dark theme with neon green accents.
    
    Args:
        code: The user's code (not used in this implementation)
        
    Returns:
        str: HTML for an interactive authentication demo
    """
    
    # Extract username/password if present
    # Look for username variables in the code
    username = "admin"  # default
    username_pattern = re.compile(r'username\s*=\s*[\'"]([^\'"]+)[\'"]|user\s*=\s*[\'"]([^\'"]+)[\'"]', re.IGNORECASE)
    username_match = username_pattern.search(code)
    if username_match:
        extracted_username = username_match.group(1) or username_match.group(2)
        if extracted_username:
            username = extracted_username
    
    # Look for password variables in the code
    password = "password123"  # default
    password_pattern = re.compile(r'password\s*=\s*[\'"]([^\'"]+)[\'"]|pwd\s*=\s*[\'"]([^\'"]+)[\'"]', re.IGNORECASE)
    password_match = password_pattern.search(code)
    if password_match:
        extracted_password = password_match.group(1) or password_match.group(2)
        if extracted_password:
            password = extracted_password

    # Creation of demo HTML with Tokyo-night-dark theme and neon green accents
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            :root {{
                --primary-bg: #1a1b26;
                --secondary-bg: #24283b;
                --primary-text: #c0caf5;
                --secondary-text: #a9b1d6;
                --accent-color: #1DB954;
                --error-color: #f7768e;
                --success-color: #9ece6a;
                --border-color: #414868;
                --input-bg: #1f2335;
                --card-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
                --btn-shadow: 0 4px 12px rgba(29, 185, 84, 0.4);
            }}
            body, html {{
                margin: 0;
                padding: 0;
                height: 100%;
                font-family: 'Segoe UI', Arial, sans-serif;
                background-color: var(--primary-bg);
                color: var(--primary-text);
            }}
            .container {{
                max-width: 450px;
                margin: 0 auto;
                padding: 20px;
            }}
            .auth-container {{
                background-color: var(--secondary-bg);
                border-radius: 16px;
                padding: 30px;
                box-shadow: var(--card-shadow);
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(65, 72, 104, 0.6);
            }}
            .tab-header {{
                display: flex;
                margin-bottom: 25px;
                position: relative;
                z-index: 1;
            }}
            .tab-header button {{
                flex: 1;
                background: none;
                border: none;
                padding: 12px;
                color: var(--secondary-text);
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }}
            .tab-header button.active {{
                color: var(--accent-color);
            }}
            .tab-header::after {{
                content: '';
                position: absolute;
                bottom: 0;
                height: 3px;
                width: 50%;
                background-color: var(--accent-color);
                transition: all 0.3s ease;
                left: 0;
                border-radius: 10px;
                box-shadow: 0 0 10px var(--accent-color);
            }}
            .tab-header.signup::after {{
                left: 50%;
            }}
            .form-group {{
                margin-bottom: 20px;
            }}
            .form-group label {{
                display: block;
                margin-bottom: 8px;
                color: var(--secondary-text);
                font-weight: 500;
            }}
            .input-wrap {{
                position: relative;
            }}
            .form-control {{
                width: 100%;
                padding: 14px;
                background-color: var(--input-bg);
                border: 1px solid var(--border-color);
                border-radius: 10px;
                color: var(--primary-text);
                font-size: 14px;
                transition: all 0.3s ease;
                box-sizing: border-box;
            }}
            .form-control:focus {{
                border-color: var(--accent-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(29, 185, 84, 0.25);
            }}
            .toggle-password {{
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: var(--secondary-text);
                cursor: pointer;
            }}
            .btn {{
                width: 100%;
                padding: 14px;
                border: none;
                border-radius: 10px;
                background-color: var(--accent-color);
                color: black;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 16px;
                box-shadow: var(--btn-shadow);
                position: relative;
                overflow: hidden;
            }}
            .btn:hover {{
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(29, 185, 84, 0.5);
            }}
            .btn:active {{
                transform: translateY(1px);
                box-shadow: 0 2px 8px rgba(29, 185, 84, 0.3);
            }}
            .btn::after {{
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
                transform: rotate(45deg);
                opacity: 0;
                transition: opacity 0.3s;
            }}
            .btn:hover::after {{
                opacity: 1;
            }}
            .form-footer {{
                text-align: center;
                margin-top: 20px;
                font-size: 14px;
                color: var(--secondary-text);
            }}
            .form-footer a {{
                color: var(--accent-color);
                text-decoration: none;
                font-weight: 500;
                transition: all 0.2s;
            }}
            .form-footer a:hover {{
                text-decoration: underline;
                color: #25df65;
            }}
            .tabs-content {{
                position: relative;
                overflow: hidden;
                height: auto;
            }}
            .tab-content {{
                transition: all 0.3s ease;
            }}
            #signup-content {{
                display: none;
            }}
            .checkbox-group {{
                display: flex;
                align-items: center;
                margin-bottom: 20px;
            }}
            .checkbox-group input {{
                margin-right: 10px;
                accent-color: var(--accent-color);
                width: 18px;
                height: 18px;
            }}
            .checkbox-group label {{
                margin-bottom: 0;
                font-size: 14px;
            }}
            .forgot-password {{
                text-align: right;
                margin-bottom: 20px;
            }}
            .forgot-password a {{
                color: var(--accent-color);
                font-size: 14px;
                text-decoration: none;
                transition: all 0.2s;
            }}
            .forgot-password a:hover {{
                text-decoration: underline;
                color: #25df65;
            }}
            .spinner {{
                display: inline-block;
                width: 18px;
                height: 18px;
                border: 2px solid rgba(0, 0, 0, 0.3);
                border-radius: 50%;
                border-top-color: rgba(0, 0, 0, 0.8);
                animation: spin 1s ease-in-out infinite;
                margin-right: 10px;
                vertical-align: -4px;
            }}
            @keyframes spin {{
                to {{ transform: rotate(360deg); }}
            }}
            .alert {{
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                font-size: 14px;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }}
            .alert.show {{
                opacity: 1;
                transform: translateY(0);
            }}
            .alert-error {{
                background-color: rgba(247, 118, 142, 0.1);
                border-left: 4px solid var(--error-color);
                color: var(--error-color);
            }}
            .alert-success {{
                background-color: rgba(158, 206, 106, 0.1);
                border-left: 4px solid var(--success-color);
                color: var(--success-color);
            }}
            .alert-icon {{
                margin-right: 10px;
                flex-shrink: 0;
            }}
            .password-strength {{
                margin-top: 10px;
                height: 5px;
                border-radius: 10px;
                background-color: var(--border-color);
                overflow: hidden;
            }}
            .password-strength-bar {{
                height: 100%;
                width: 0;
                border-radius: 10px;
                transition: all 0.3s ease;
                box-shadow: 0 0 8px rgba(29, 185, 84, 0.3);
            }}
            .stats-container {{
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin-top: 25px;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.5s ease;
            }}
            .stats-container.show {{
                opacity: 1;
                transform: translateY(0);
            }}
            .stat-card {{
                background-color: var(--input-bg);
                border-radius: 10px;
                padding: 15px;
                text-align: center;
                border: 1px solid var(--border-color);
                transition: all 0.3s ease;
            }}
            .stat-card:hover {{
                transform: translateY(-3px);
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
                border-color: var(--accent-color);
            }}
            .stat-card h4 {{
                margin: 0 0 5px 0;
                color: var(--accent-color);
                font-size: 14px;
            }}
            .stat-card .value {{
                font-size: 24px;
                font-weight: 600;
                color: white;
            }}
            .login-activity {{
                margin-top: 25px;
                background-color: var(--input-bg);
                border-radius: 10px;
                padding: 15px;
                border: 1px solid var(--border-color);
                display: none;
            }}
            .login-activity.show {{
                display: block;
                animation: fadeIn 0.5s ease forwards;
            }}
            .login-activity h4 {{
                margin: 0 0 15px 0;
                color: white;
                font-size: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }}
            .login-activity .record {{
                padding: 10px 0;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
            }}
            .login-activity .record:last-child {{
                border-bottom: none;
            }}
            .login-activity .record .date {{
                color: var(--secondary-text);
            }}
            .login-activity .record .status {{
                display: flex;
                align-items: center;
                gap: 5px;
            }}
            .login-activity .record .status.success {{
                color: var(--success-color);
            }}
            .login-activity .record .status.failed {{
                color: var(--error-color);
            }}
            .dashboard-nav {{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid var(--border-color);
            }}
            .dashboard-nav .user-info {{
                display: flex;
                align-items: center;
                gap: 12px;
            }}
            .dashboard-nav .avatar {{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: var(--accent-color);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: black;
                box-shadow: 0 2px 8px rgba(29, 185, 84, 0.4);
            }}
            .dashboard-nav .user-name {{
                font-weight: 600;
                color: white;
            }}
            .dashboard-nav .logout-btn {{
                background: none;
                border: none;
                color: var(--secondary-text);
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: all 0.2s;
            }}
            .dashboard-nav .logout-btn:hover {{
                color: var(--accent-color);
            }}
            @keyframes fadeIn {{
                from {{ opacity: 0; transform: translateY(10px); }}
                to {{ opacity: 1; transform: translateY(0); }}
            }}
            /* Glow effects and glass morphism */
            .auth-container::before {{
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(29, 185, 84, 0.08) 0%, rgba(29, 185, 84, 0) 70%);
                transform: rotate(45deg);
                pointer-events: none;
            }}
            #dashboard {{
                display: none;
            }}
            .dashboard-header {{
                font-size: 22px;
                font-weight: 600;
                margin-bottom: 20px;
                color: white;
                display: flex;
                align-items: center;
                gap: 10px;
            }}
            .dashboard-header svg {{
                color: var(--accent-color);
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div id="login-signup" class="auth-container">
                <div class="tab-header">
                    <button id="login-tab" class="active">Log In</button>
                    <button id="signup-tab">Sign Up</button>
                </div>
                
                <div class="tabs-content">
                    <div id="login-content" class="tab-content">
                        <div id="login-alert" class="alert" role="alert"></div>
                        
                        <div class="form-group">
                            <label for="login-username">Username</label>
                            <div class="input-wrap">
                                <input type="text" id="login-username" class="form-control" placeholder="Enter your username" value="{username}">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <div class="input-wrap">
                                <input type="password" id="login-password" class="form-control" placeholder="Enter your password">
                                <button type="button" class="toggle-password" id="toggle-login-password">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div class="checkbox-group">
                            <input type="checkbox" id="remember-me">
                            <label for="remember-me">Remember me</label>
                        </div>
                        
                        <div class="forgot-password">
                            <a href="#">Forgot password?</a>
                        </div>
                        
                        <button id="login-button" class="btn">Log In</button>
                        
                        <div class="form-footer">
                            Don't have an account? <a href="#" id="to-signup">Sign up</a>
                        </div>
                    </div>
                    
                    <div id="signup-content" class="tab-content">
                        <div id="signup-alert" class="alert" role="alert"></div>
                        
                        <div class="form-group">
                            <label for="signup-email">Email</label>
                            <div class="input-wrap">
                                <input type="email" id="signup-email" class="form-control" placeholder="Enter your email">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="signup-username">Username</label>
                            <div class="input-wrap">
                                <input type="text" id="signup-username" class="form-control" placeholder="Choose a username">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="signup-password">Password</label>
                            <div class="input-wrap">
                                <input type="password" id="signup-password" class="form-control" placeholder="Create a password">
                                <button type="button" class="toggle-password" id="toggle-signup-password">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="password-strength">
                                <div class="password-strength-bar" id="password-strength-bar"></div>
                            </div>
                        </div>
                        
                        <div class="checkbox-group">
                            <input type="checkbox" id="terms">
                            <label for="terms">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
                        </div>
                        
                        <button id="signup-button" class="btn">Create Account</button>
                        
                        <div class="form-footer">
                            Already have an account? <a href="#" id="to-login">Log in</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Dashboard View (after successful login) -->
            <div id="dashboard" class="auth-container">
                <div class="dashboard-nav">
                    <div class="user-info">
                        <div class="avatar" id="user-avatar"></div>
                        <div class="user-name" id="user-display-name"></div>
                    </div>
                    <button class="logout-btn" id="logout-btn">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                    </button>
                </div>
                
                <div class="dashboard-header">
                    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    Welcome to Your Dashboard
                </div>
                
                <div class="stats-container" id="stats-container">
                    <div class="stat-card">
                        <h4>Login Attempts</h4>
                        <div class="value">23</div>
                    </div>
                    <div class="stat-card">
                        <h4>Last Login</h4>
                        <div class="value">Today</div>
                    </div>
                    <div class="stat-card">
                        <h4>Security Score</h4>
                        <div class="value">87%</div>
                    </div>
                    <div class="stat-card">
                        <h4>Active Sessions</h4>
                        <div class="value">1</div>
                    </div>
                </div>
                
                <div class="login-activity" id="login-activity">
                    <h4>
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Recent Login Activity
                    </h4>
                    <div class="record">
                        <div class="device">Chrome on Windows</div>
                        <div class="date">Today, 6:04 AM</div>
                        <div class="status success">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Success
                        </div>
                    </div>
                    <div class="record">
                        <div class="device">Safari on macOS</div>
                        <div class="date">Yesterday, 8:15 PM</div>
                        <div class="status success">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Success
                        </div>
                    </div>
                    <div class="record">
                        <div class="device">Unknown device</div>
                        <div class="date">May 7, 2:30 AM</div>
                        <div class="status failed">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Failed
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            // Toggle between login and signup tabs
            const loginTab = document.getElementById('login-tab');
            const signupTab = document.getElementById('signup-tab');
            const loginContent = document.getElementById('login-content');
            const signupContent = document.getElementById('signup-content');
            const tabHeader = document.querySelector('.tab-header');
            const toSignup = document.getElementById('to-signup');
            const toLogin = document.getElementById('to-login');
            // These constants need to be defined before the functions that use them
            const loginSignupContainer = document.getElementById('login-signup');
            const dashboardContainer = document.getElementById('dashboard');
            
            function showLogin() {
                document.getElementById('login-tab').classList.add('active');
                document.getElementById('signup-tab').classList.remove('active');
                document.getElementById('login-content').style.display = 'block';
                document.getElementById('signup-content').style.display = 'none';
                document.querySelector('.tab-header').classList.remove('signup');
            }
            
            function showSignup() {
                document.getElementById('signup-tab').classList.add('active');
                document.getElementById('login-tab').classList.remove('active');
                document.getElementById('signup-content').style.display = 'block';
                document.getElementById('login-content').style.display = 'none';
                document.querySelector('.tab-header').classList.add('signup');
            }
            
            document.getElementById('login-tab').addEventListener('click', showLogin);
            document.getElementById('signup-tab').addEventListener('click', showSignup);
            document.getElementById('to-signup').addEventListener('click', (e) => {
                e.preventDefault();
                showSignup();
            });
            document.getElementById('to-login').addEventListener('click', (e) => {
                e.preventDefault();
                showLogin();
            });
            
            // Toggle password visibility
            const toggleLoginPassword = document.getElementById('toggle-login-password');
            const loginPassword = document.getElementById('login-password');
            const toggleSignupPassword = document.getElementById('toggle-signup-password');
            const signupPassword = document.getElementById('signup-password');
            
            function togglePasswordVisibility(passwordInput, toggleButton) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleButton.innerHTML = `
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        </svg>
                    `;
                } else {
                    passwordInput.type = 'password';
                    toggleButton.innerHTML = `
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    `;
                }
            }
            
            toggleLoginPassword.addEventListener('click', () => {
                togglePasswordVisibility(loginPassword, toggleLoginPassword);
            });
            
            toggleSignupPassword.addEventListener('click', () => {
                togglePasswordVisibility(signupPassword, toggleSignupPassword);
            });
            
            // Password strength meter
            const passwordStrengthBar = document.getElementById('password-strength-bar');
            
            signupPassword.addEventListener('input', function() {
                const password = this.value;
                let strength = 0;
                
                if (password.length >= 8) strength += 25;
                if (password.match(/[A-Z]/)) strength += 25;
                if (password.match(/[0-9]/)) strength += 25;
                if (password.match(/[^A-Za-z0-9]/)) strength += 25;
                
                passwordStrengthBar.style.width = strength + '%';
                
                if (strength <= 25) {
                    passwordStrengthBar.style.backgroundColor = '#f7768e'; // Weak
                } else if (strength <= 50) {
                    passwordStrengthBar.style.backgroundColor = '#ff9e64'; // Medium
                } else if (strength <= 75) {
                    passwordStrengthBar.style.backgroundColor = '#e0af68'; // Good
                } else {
                    passwordStrengthBar.style.backgroundColor = '#9ece6a'; // Strong
                }
            });
            
            // Login and dashboard functionality
            const loginButton = document.getElementById('login-button');
            const loginAlert = document.getElementById('login-alert');
            const loginUsername = document.getElementById('login-username');
            const userAvatar = document.getElementById('user-avatar');
            const userDisplayName = document.getElementById('user-display-name');
            const statsContainer = document.getElementById('stats-container');
            const loginActivity = document.getElementById('login-activity');
            const logoutBtn = document.getElementById('logout-btn');
            
            loginButton.addEventListener('click', function() {
                // Show loading state
                this.innerHTML = '<span class="spinner"></span>Logging in...';
                this.disabled = true;
                
                // Hide any existing alerts
                loginAlert.classList.remove('show');
                
                // Simulate API call
                setTimeout(() => {
                    const username = loginUsername.value;
                    const password = loginPassword.value;
                    
                    // Reset button
                    this.innerHTML = 'Log In';
                    this.disabled = false;
                    
                    // Simple validation
                    if (!username || !password) {
                        showAlert(loginAlert, 'error', 'Please enter both username and password.');
                        return;
                    }
                    
                    // Check credentials (using extracted credentials from the original code)
                    if (username === '{username}' && password === '{password}') {{
                        showAlert(loginAlert, 'success', 'Login successful! Loading dashboard...');
                        
                        // Show dashboard after a delay
                        setTimeout(() => {
                            // Hide login form and show dashboard
                            loginSignupContainer.style.display = 'none';
                            dashboardContainer.style.display = 'block';
                            
                            // Set user info
                            userAvatar.textContent = username.charAt(0).toUpperCase();
                            userDisplayName.textContent = username;
                            
                            // Animate in dashboard elements
                            setTimeout(() => {
                                statsContainer.classList.add('show');
                                
                                setTimeout(() => {
                                    loginActivity.classList.add('show');
                                }, 300);
                            }, 200);
                        }, 1000);
                    } else {
                        showAlert(loginAlert, 'error', 'Invalid username or password. Please try again.');
                    }
                }, 1500);
            });
            
            // Signup logic
            const signupButton = document.getElementById('signup-button');
            const signupAlert = document.getElementById('signup-alert');
            const signupUsername = document.getElementById('signup-username');
            const signupEmail = document.getElementById('signup-email');
            const termsCheckbox = document.getElementById('terms');
            
            signupButton.addEventListener('click', function() {
                // Show loading state
                this.innerHTML = '<span class="spinner"></span>Creating account...';
                this.disabled = true;
                
                // Hide any existing alerts
                signupAlert.classList.remove('show');
                
                // Simulate API call
                setTimeout(() => {
                    const email = signupEmail.value;
                    const username = signupUsername.value;
                    const password = signupPassword.value;
                    
                    // Reset button
                    this.innerHTML = 'Create Account';
                    this.disabled = false;
                    
                    // Simple validation
                    if (!email || !username || !password) {
                        showAlert(signupAlert, 'error', 'Please fill in all fields.');
                        return;
                    }
                    
                    if (!validateEmail(email)) {
                        showAlert(signupAlert, 'error', 'Please enter a valid email address.');
                        return;
                    }
                    
                    if (password.length < 8) {
                        showAlert(signupAlert, 'error', 'Password must be at least 8 characters long.');
                        return;
                    }
                    
                    if (!termsCheckbox.checked) {
                        showAlert(signupAlert, 'error', 'You must agree to the Terms of Service and Privacy Policy.');
                        return;
                    }
                    
                    // Success - in a real app, you would send this to your server
                    showAlert(signupAlert, 'success', 'Account created successfully! You can now log in.');
                    
                    // Reset form
                    signupEmail.value = '';
                    signupUsername.value = '';
                    signupPassword.value = '';
                    passwordStrengthBar.style.width = '0';
                    termsCheckbox.checked = false;
                    
                    // Switch to login tab after successful signup
                    setTimeout(() => {
                        showLogin();
                    }, 2000);
                }, 1500);
            });
            
            // Logout functionality
            logoutBtn.addEventListener('click', function() {
                // Hide dashboard and show login form
                dashboardContainer.style.display = 'none';
                loginSignupContainer.style.display = 'block';
                
                // Reset stats display
                statsContainer.classList.remove('show');
                loginActivity.classList.remove('show');
                
                // Show success message
                showAlert(loginAlert, 'success', 'You have been logged out successfully.');
            });
            
            // Helper function to show alerts
            function showAlert(alertElement, type, message) {
                alertElement.className = 'alert';
                alertElement.classList.add('show');
                
                if (type === 'error') {
                    alertElement.classList.add('alert-error');
                    alertElement.innerHTML = `
                        <div class="alert-icon">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>${message}</div>
                    `;
                } else if (type === 'success') {
                    alertElement.classList.add('alert-success');
                    alertElement.innerHTML = `
                        <div class="alert-icon">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>${message}</div>
                    `;
                }
            }
            
            // Validate email format
            function validateEmail(email) {
                const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{{1,3}}\.[0-9]{{1,3}}\.[0-9]{{1,3}}\.[0-9]{{1,3}}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{{2,}}))$/;
                return re.test(String(email).toLowerCase());
            }
            
            // Form validation - realtime feedback
            const loginForm = document.getElementById('login-content');
            loginForm.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    loginButton.click();
                }
            });
            
            const signupForm = document.getElementById('signup-content');
            signupForm.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    signupButton.click();
                }
            });
        </script>
    </body>
    </html>
    """
    
    # Replace curly braces in JavaScript portions to avoid f-string issues
    html_content = html_content.replace('{{', '{').replace('}}', '}')
    
    # Set actual credentials for the demo
    html_content = html_content.replace('{username}', username)
    html_content = html_content.replace('{password}', password)
    
    return html_content

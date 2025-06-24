/**
 * If-Else Login Demo
 * This standalone module provides a specialized login/signup demo for if-else statements
 */

// User Authentication System Python code for the real-world example
export const IF_ELSE_REAL_WORLD_CODE = `# User Authentication System with if-else statements
from flask import Flask, request, redirect, render_template, session, flash
import re

app = Flask(__name__)
app.secret_key = "your_secret_key"

# Simple user database (in real world, this would be a database)
users = {
    "user@example.com": {"password": "securepass123", "name": "Test User"}
}

@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        
        # Check if email exists
        if email in users:
            # Check if password matches
            if password == users[email]["password"]:
                # Authentication successful
                session["user"] = email
                flash("Login successful!")
                return redirect("/dashboard")
            else:
                # Password incorrect
                error = "Incorrect password"
        else:
            # Email not found
            error = "Email not registered"
    
    # If GET request or authentication failed, show login form
    return render_template("login.html", error=error)

@app.route("/signup", methods=["GET", "POST"])
def signup():
    error = None
    
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        confirm = request.form.get("confirm_password")
        name = request.form.get("name")
        
        # Validate email format
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            error = "Invalid email format"
        # Check if all fields are provided
        elif not all([email, password, confirm, name]):
            error = "All fields are required"
        # Check if email is already registered
        elif email in users:
            error = "Email already registered"
        # Check if passwords match
        elif password != confirm:
            error = "Passwords do not match"
        # Check password length
        elif len(password) < 8:
            error = "Password must be at least 8 characters"
        else:
            # Create new user
            users[email] = {"password": password, "name": name}
            session["user"] = email
            flash("Account created successfully!")
            return redirect("/dashboard")
    
    # If GET request or validation failed, show signup form
    return render_template("signup.html", error=error)

@app.route("/dashboard")
def dashboard():
    # Check if user is logged in
    if "user" not in session:
        flash("Please log in to access the dashboard")
        return redirect("/login")
    
    # Get user data from "database"
    user_email = session["user"]
    user_data = users.get(user_email, {})
    
    return render_template("dashboard.html", user_name=user_data.get("name", "User"))

@app.route("/logout")
def logout():
    # Remove user from session
    session.pop("user", None)
    flash("You have been logged out")
    return redirect("/login")`;

// HTML for the authentication demo with styling included
export const IF_ELSE_DEMO_HTML = `
<div class="auth-demo">
  <div class="auth-container">
    <div class="auth-tabs">
      <button class="auth-tab active" data-tab="login">Login</button>
      <button class="auth-tab" data-tab="signup">Sign Up</button>
    </div>
    
    <div class="auth-form login-form active">
      <h2>Login</h2>
      <div class="form-group">
        <label for="login-email">Email:</label>
        <input type="email" id="login-email" placeholder="Enter your email">
      </div>
      <div class="form-group">
        <label for="login-password">Password:</label>
        <input type="password" id="login-password" placeholder="Enter your password">
      </div>
      <div class="error-message" id="login-error"></div>
      <button class="submit-btn" id="login-btn">Login</button>
    </div>
    
    <div class="auth-form signup-form">
      <h2>Create Account</h2>
      <div class="form-group">
        <label for="signup-name">Full Name:</label>
        <input type="text" id="signup-name" placeholder="Enter your name">
      </div>
      <div class="form-group">
        <label for="signup-email">Email:</label>
        <input type="email" id="signup-email" placeholder="Enter your email">
      </div>
      <div class="form-group">
        <label for="signup-password">Password:</label>
        <input type="password" id="signup-password" placeholder="Create a password">
        <div class="password-strength"></div>
      </div>
      <div class="form-group">
        <label for="signup-confirm">Confirm Password:</label>
        <input type="password" id="signup-confirm" placeholder="Confirm your password">
      </div>
      <div class="error-message" id="signup-error"></div>
      <button class="submit-btn" id="signup-btn">Create Account</button>
    </div>
  </div>
</div>

<style>
.auth-demo {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 100%;
  padding: 20px;
  color: #eee;
}

.auth-container {
  background-color: #1a1b26;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  max-width: 400px;
  margin: 0 auto;
}

.auth-tabs {
  display: flex;
  background-color: #24283b;
}

.auth-tab {
  background: none;
  border: none;
  color: #a9b1d6;
  cursor: pointer;
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  padding: 15px;
  transition: all 0.3s ease;
}

.auth-tab.active {
  background-color: #1a1b26;
  color: #7aa2f7;
  border-bottom: 3px solid #7aa2f7;
}

.auth-form {
  display: none;
  padding: 20px;
}

.auth-form.active {
  display: block;
}

.auth-form h2 {
  color: #c0caf5;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #a9b1d6;
}

.form-group input {
  background-color: #24283b;
  border: 1px solid #414868;
  border-radius: 5px;
  color: #c0caf5;
  font-size: 14px;
  padding: 10px 15px;
  width: 100%;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #7aa2f7;
  outline: none;
}

.submit-btn {
  background-color: #7aa2f7;
  border: none;
  border-radius: 5px;
  color: #1a1b26;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  padding: 12px;
  width: 100%;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #8eb2ff;
}

.error-message {
  color: #f7768e;
  font-size: 14px;
  margin-bottom: 15px;
  min-height: 20px;
}

.password-strength {
  height: 5px;
  margin-top: 5px;
  width: 100%;
  background-color: #414868;
  border-radius: 3px;
  overflow: hidden;
}
</style>`;

// Simple if-else code example for the code editor
export const IF_ELSE_CODE_EXAMPLE = `# Basic if-else statement example
user_age = 25
is_student = True

if user_age < 18:
    print("Access denied: Must be 18 or older")
elif user_age >= 18 and user_age < 65:
    if is_student:
        print("Adult student discount applied")
    else:
        print("Regular adult rate applied")
else:
    print("Senior discount applied")
`;

// Function to initialize the auth demo functionality
export function initializeIfElseAuthDemo() {
  console.log("Initializing if-else auth demo");
  
  // Delay execution slightly to ensure DOM is fully available
  setTimeout(() => {
    // Update the code editor with the if-else example
    if (window.editor && window.editor.setValue) {
      window.editor.setValue(IF_ELSE_CODE_EXAMPLE);
    }
    
    // Update real-world code panel with authentication example
    const realWorldPanel = document.getElementById('realworld-code-root');
    if (realWorldPanel) {
      const content = realWorldPanel.querySelector('.panel-content');
      if (content) {
        const language = document.getElementById('language-selector')?.value || 'python';
        
        content.innerHTML = `
          <h3>User Authentication System</h3>
          <p>This login/signup system uses if-else statements to validate user credentials and handle different authentication scenarios.</p>
          <div class="code-block">
            <pre><code class="language-${language}">${IF_ELSE_REAL_WORLD_CODE}</code></pre>
          </div>
          <button id="open-gui-demo" class="primary-button">
            <i data-feather="monitor"></i>
            Open GUI Demo
          </button>
        `;
        
        // Apply syntax highlighting
        if (window.hljs) {
          document.querySelectorAll('pre code').forEach((block) => {
            window.hljs.highlightBlock(block);
          });
        }
        
        // Initialize feather icons
        if (window.feather) {
          window.feather.replace();
        }
        
        // Add click handler to the open GUI demo button
        const demoButton = content.querySelector('#open-gui-demo');
        if (demoButton) {
          demoButton.addEventListener('click', () => {
            console.log("Open GUI Demo button clicked - showing login/signup demo");
            // Try to use the global openGuiDemo function if available
            if (typeof window.openGuiDemo === 'function') {
              console.log("Using global openGuiDemo function");
              window.openGuiDemo();
            } else {
              console.log("Fallback to direct demo display");
              // Direct fallback implementation
              const demoContainer = document.getElementById('interactive-demo-container');
              if (demoContainer) {
                // Show the container
                demoContainer.classList.remove('hidden');
                
                // Update content if needed
                const demoContent = demoContainer.querySelector('.panel-content');
                if (demoContent) {
                  // Set the HTML content
                  demoContent.innerHTML = IF_ELSE_DEMO_HTML;
                  
                  // Initialize the demo functionality
                  initializeAuthDemoFunctionality(demoContent);
                }
              }
            }
          });
        }
      }
    }
    
    // Initialize the auth demo content in the dedicated section
    const guiDemoRoot = document.getElementById('gui-demo-root');
    if (guiDemoRoot) {
      const guiContent = guiDemoRoot.querySelector('.panel-content');
      if (guiContent) {
        guiContent.innerHTML = IF_ELSE_DEMO_HTML;
        initializeAuthDemoFunctionality(guiContent);
      }
    }
  }, 100);
}

// Export function to make it available outside
export function initializeAuthDemoFunctionality(container) {
  // Tab switching
  const tabs = container.querySelectorAll('.auth-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      // Update active tab
      container.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Show selected form
      container.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
      });
      container.querySelector('.' + tabName + '-form').classList.add('active');
    });
  });
  
  // Login form handling
  const loginBtn = container.querySelector('#login-btn');
  const loginEmail = container.querySelector('#login-email');
  const loginPassword = container.querySelector('#login-password');
  const loginError = container.querySelector('#login-error');
  
  if (loginBtn && loginEmail && loginPassword && loginError) {
    loginBtn.addEventListener('click', function() {
      loginError.textContent = '';
      
      // Simple validation to demonstrate if-else logic
      if (!loginEmail.value) {
        loginError.textContent = 'Please enter your email';
      } else if (!loginPassword.value) {
        loginError.textContent = 'Please enter your password';
      } else if (loginEmail.value === 'user@example.com' && loginPassword.value === 'securepass123') {
        loginError.style.color = '#9ece6a';
        loginError.textContent = 'Login successful!';
        setTimeout(() => {
          alert('Login successful! Welcome back, Test User.');
        }, 500);
      } else if (loginEmail.value === 'user@example.com') {
        loginError.textContent = 'Incorrect password';
      } else {
        loginError.textContent = 'Email not registered';
      }
    });
  }
  
  // Signup form handling
  const signupBtn = container.querySelector('#signup-btn');
  const signupName = container.querySelector('#signup-name');
  const signupEmail = container.querySelector('#signup-email');
  const signupPassword = container.querySelector('#signup-password');
  const signupConfirm = container.querySelector('#signup-confirm');
  const signupError = container.querySelector('#signup-error');
  const passwordStrength = container.querySelector('.password-strength');
  
  if (signupPassword && passwordStrength) {
    // Password strength indicator
    signupPassword.addEventListener('input', function() {
      const password = this.value;
      let strength = 0;
      
      if (password.length >= 8) strength += 25;
      if (password.match(/[A-Z]/)) strength += 25;
      if (password.match(/[0-9]/)) strength += 25;
      if (password.match(/[^A-Za-z0-9]/)) strength += 25;
      
      passwordStrength.style.width = strength + '%';
      
      if (strength < 25) {
        passwordStrength.style.backgroundColor = '#f7768e';
      } else if (strength < 50) {
        passwordStrength.style.backgroundColor = '#e0af68';
      } else if (strength < 75) {
        passwordStrength.style.backgroundColor = '#ff9e64';
      } else {
        passwordStrength.style.backgroundColor = '#9ece6a';
      }
    });
  }
  
  if (signupBtn && signupName && signupEmail && signupPassword && signupConfirm && signupError) {
    signupBtn.addEventListener('click', function() {
      signupError.textContent = '';
      
      // Simple validation to demonstrate if-else logic
      if (!signupName.value) {
        signupError.textContent = 'Please enter your name';
      } else if (!signupEmail.value) {
        signupError.textContent = 'Please enter your email';
      } else if (!signupEmail.value.includes('@')) {
        signupError.textContent = 'Please enter a valid email';
      } else if (!signupPassword.value) {
        signupError.textContent = 'Please create a password';
      } else if (signupPassword.value.length < 8) {
        signupError.textContent = 'Password must be at least 8 characters';
      } else if (!signupConfirm.value) {
        signupError.textContent = 'Please confirm your password';
      } else if (signupPassword.value !== signupConfirm.value) {
        signupError.textContent = 'Passwords do not match';
      } else if (signupEmail.value === 'user@example.com') {
        signupError.textContent = 'Email already registered';
      } else {
        signupError.style.color = '#9ece6a';
        signupError.textContent = 'Account created successfully!';
        setTimeout(() => {
          alert('Account created successfully! Welcome, ' + signupName.value);
        }, 500);
      }
    });
  }
}
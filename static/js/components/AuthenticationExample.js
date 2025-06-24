/**
 * Authentication Example Code Component
 * This file provides a set of authentication code examples that can be used to test the auth demo GUI
 */

export function getAuthenticationExamples() {
    return {
        python: {
            "simple_login": `# Simple Login Example
def authenticate_user(username, password):
    """
    Authenticate a user with username and password
    """
    # In real applications, use password hashing and secure storage
    valid_credentials = {
        "admin": "password123",
        "user1": "securepass",
        "guest": "welcome2024"
    }
    
    if username in valid_credentials and valid_credentials[username] == password:
        return {
            "success": True,
            "message": "Authentication successful",
            "user_data": {
                "username": username,
                "role": "admin" if username == "admin" else "user"
            }
        }
    else:
        return {
            "success": False,
            "message": "Invalid username or password"
        }

# Example usage
result = authenticate_user("admin", "password123")
if result["success"]:
    print(f"Welcome, {result['user_data']['username']}!")
    print(f"Role: {result['user_data']['role']}")
else:
    print(result["message"])`,

            "token_auth": `# Token-based Authentication Example
import hashlib
import time
import secrets

class TokenAuthenticator:
    """Simple token-based authentication system"""
    
    def __init__(self):
        self.users = {
            "user@example.com": "mysecretpassword",
            "admin@example.com": "adminpassword"
        }
        self.active_tokens = {}  # {token: (user_email, expiry_time)}
        
    def login(self, email, password):
        """Authenticate user and generate token"""
        if email in self.users and self.users[email] == password:
            # Generate a secure token
            token = secrets.token_hex(16)
            # Store token with 24-hour expiry
            expiry = time.time() + (24 * 60 * 60)
            self.active_tokens[token] = (email, expiry)
            return {
                "success": True,
                "token": token,
                "expires": expiry
            }
        return {
            "success": False,
            "message": "Invalid email or password"
        }
    
    def verify_token(self, token):
        """Verify if a token is valid"""
        if token in self.active_tokens:
            email, expiry = self.active_tokens[token]
            if time.time() < expiry:
                return {
                    "success": True,
                    "email": email
                }
            else:
                # Token expired
                del self.active_tokens[token]
        return {
            "success": False,
            "message": "Invalid or expired token"
        }
    
    def logout(self, token):
        """Invalidate a token"""
        if token in self.active_tokens:
            del self.active_tokens[token]
            return {"success": True}
        return {
            "success": False,
            "message": "Token not found"
        }

# Example usage
auth = TokenAuthenticator()
login_result = auth.login("user@example.com", "mysecretpassword")

if login_result["success"]:
    user_token = login_result["token"]
    print(f"Login successful! Token: {user_token}")
    
    # Verify the token
    verify_result = auth.verify_token(user_token)
    if verify_result["success"]:
        print(f"Token valid for user: {verify_result['email']}")
    
    # Logout
    auth.logout(user_token)
    print("User logged out successfully!")
else:
    print(login_result["message"])`,
        },
        
        javascript: {
            "simple_login": `// Simple Login Example
function authenticateUser(username, password) {
  // In real applications, use password hashing and secure storage
  const validCredentials = {
    "admin": "password123",
    "user1": "securepass",
    "guest": "welcome2024"
  };
  
  if (validCredentials[username] === password) {
    return {
      success: true,
      message: "Authentication successful",
      userData: {
        username: username,
        role: username === "admin" ? "admin" : "user"
      }
    };
  } else {
    return {
      success: false,
      message: "Invalid username or password"
    };
  }
}

// Example usage
const result = authenticateUser("admin", "password123");
if (result.success) {
  console.log(`Welcome, ${result.userData.username}!`);
  console.log(`Role: ${result.userData.role}`);
} else {
  console.log(result.message);
}`,

            "jwt_auth": `// JWT Authentication Example
class JWTAuthenticator {
  constructor() {
    this.users = {
      "user@example.com": "mysecretpassword",
      "admin@example.com": "adminpassword"
    };
    this.secretKey = "your-secret-key-would-be-much-longer-in-production";
  }
  
  // Simplified JWT generation (for demonstration only)
  generateToken(email, expiresIn = '24h') {
    // In a real implementation, use a proper JWT library
    const header = { alg: "HS256", typ: "JWT" };
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiryTime = issuedAt + (60 * 60 * 24); // 24 hours
    
    const payload = {
      email: email,
      iat: issuedAt,
      exp: expiryTime
    };
    
    // This is a simplified example - not actual JWT encoding
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = "simulated-signature"; // In real apps, this would be cryptographically signed
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
  
  login(email, password) {
    if (this.users[email] === password) {
      const token = this.generateToken(email);
      return {
        success: true,
        token: token
      };
    }
    
    return {
      success: false,
      message: "Invalid email or password"
    };
  }
  
  verifyToken(token) {
    try {
      // In a real app, you'd verify the signature here
      const parts = token.split('.');
      if (parts.length !== 3) return { success: false, message: "Invalid token format" };
      
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp < currentTime) {
        return { success: false, message: "Token expired" };
      }
      
      return {
        success: true,
        email: payload.email
      };
    } catch (error) {
      return {
        success: false,
        message: "Token verification failed"
      };
    }
  }
}

// Example usage
const auth = new JWTAuthenticator();
const loginResult = auth.login("user@example.com", "mysecretpassword");

if (loginResult.success) {
  console.log("Login successful!");
  console.log("JWT Token:", loginResult.token);
  
  // Verify the token
  const verifyResult = auth.verifyToken(loginResult.token);
  if (verifyResult.success) {
    console.log(`Token valid for user: ${verifyResult.email}`);
  } else {
    console.log(verifyResult.message);
  }
} else {
  console.log(loginResult.message);
}`
        },
        
        java: {
            "simple_login": `// Simple Login Example in Java
import java.util.HashMap;
import java.util.Map;

public class SimpleAuthenticator {
    private Map<String, String> validCredentials;
    
    public SimpleAuthenticator() {
        // In real applications, use password hashing and secure storage
        validCredentials = new HashMap<>();
        validCredentials.put("admin", "password123");
        validCredentials.put("user1", "securepass");
        validCredentials.put("guest", "welcome2024");
    }
    
    public AuthResult authenticate(String username, String password) {
        if (validCredentials.containsKey(username) && 
            validCredentials.get(username).equals(password)) {
            
            String role = "user";
            if (username.equals("admin")) {
                role = "admin";
            }
            
            return new AuthResult(true, "Authentication successful", username, role);
        } else {
            return new AuthResult(false, "Invalid username or password", null, null);
        }
    }
    
    // Inner class for authentication result
    public class AuthResult {
        private boolean success;
        private String message;
        private String username;
        private String role;
        
        public AuthResult(boolean success, String message, String username, String role) {
            this.success = success;
            this.message = message;
            this.username = username;
            this.role = role;
        }
        
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public String getUsername() { return username; }
        public String getRole() { return role; }
    }
    
    public static void main(String[] args) {
        SimpleAuthenticator auth = new SimpleAuthenticator();
        
        // Test with valid credentials
        AuthResult result = auth.authenticate("admin", "password123");
        
        if (result.isSuccess()) {
            System.out.println("Welcome, " + result.getUsername() + "!");
            System.out.println("Role: " + result.getRole());
        } else {
            System.out.println(result.getMessage());
        }
    }
}`
        }
    };
}

export function insertAuthenticationExample(editor, language) {
    const examples = getAuthenticationExamples();
    const languageExamples = examples[language];
    
    if (!languageExamples) {
        console.error(`No authentication examples available for ${language}`);
        return;
    }
    
    // Default to simple login example
    const exampleCode = languageExamples.simple_login;
    
    if (editor && exampleCode) {
        // If using CodeMirror
        if (editor.setValue) {
            editor.setValue(exampleCode);
        } 
        // If using Monaco or other editor
        else if (editor.getModel && editor.getModel().setValue) {
            editor.getModel().setValue(exampleCode);
        }
        // Fallback for other editor types
        else {
            console.warn("Unknown editor type, couldn't set authentication example code");
        }
    }
}
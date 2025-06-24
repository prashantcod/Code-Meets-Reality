// Function to update the code editor with an authentication example
export function loadAuthExample() {
    if (window.editor) {
        const authCode = `# Simple user authentication system

# User credentials store (in a real system, this would be a database with hashed passwords)
users = {
    "admin": "password123",
    "john": "secure456",
    "sarah": "test789"
}

def authenticate_user(username, password):
    """
    Authenticate a user with their username and password
    
    Args:
        username: The username to check
        password: The password to verify
        
    Returns:
        bool: True if authentication successful, False otherwise
    """
    # Check if the username exists
    if username not in users:
        print(f"User '{username}' not found")
        return False
    
    # Check if the password matches
    if users[username] != password:
        print(f"Incorrect password for user '{username}'")
        return False
    
    # Authentication successful
    print(f"User '{username}' authenticated successfully")
    return True

def login():
    """Interactive login function"""
    username = input("Username: ")
    password = input("Password: ")
    
    # Try to authenticate
    success = authenticate_user(username, password)
    
    if success:
        print("Login successful! Welcome to the system.")
        return True
    else:
        print("Login failed. Please try again.")
        return False

# Example usage
if __name__ == "__main__":
    # Test valid credentials
    print("Testing with valid credentials:")
    authenticate_user("admin", "password123")
    
    # Test invalid credentials
    print("\\nTesting with invalid credentials:")
    authenticate_user("admin", "wrongpassword")
    
    # Test non-existent user
    print("\\nTesting with non-existent user:")
    authenticate_user("unknown", "password123")`;

        window.editor.setValue(authCode);
        
        // Trigger the interactive demo update
        if (typeof updateInteractiveDemo === 'function') {
            updateInteractiveDemo(authCode);
        }
    }
}

// For backward compatibility with non-module environments
window.loadAuthExample = loadAuthExample;
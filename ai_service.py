from typing import Dict, Optional, List, Any, Tuple
import random
import json
import os
import re
import importlib.util
# Only import additional packages conditionally to avoid startup errors

def check_openai_api_key() -> bool:
    """
    Check if a valid OpenAI API key is available.
    
    Returns:
        bool: True if a valid API key is available, False otherwise
    """
    import os
    
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key or len(api_key.strip()) < 30:
        print("OpenAI API key is missing or invalid")
        return False
    
    # Attempt to make a minimal API call to verify the key works
    try:
        import importlib.util
        
        # Try to import openai
        spec = importlib.util.find_spec("openai")
        if spec is None:
            print("OpenAI package is not installed")
            return False
            
        # Check if the key works by making a simple models list request
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        # Make a minimal API call - using models.list is lightweight
        response = client.models.list()
        if response:
            print("OpenAI API key is valid and working")
            return True
        else:
            print("OpenAI API key validation failed")
            return False
    except Exception as e:
        # Check for quota errors specifically
        error_str = str(e)
        if "quota" in error_str.lower() or "insufficient_quota" in error_str:
            print(f"API quota exceeded. Please update your OpenAI API key or subscription.")
            # Still return True since the key is technically valid, just out of quota
            return True
        else:
            print(f"Error validating OpenAI API key: {error_str}")
            return False
    
    print("OpenAI API key is configured and available")
    return True

def get_ai_response(question: str, code: Optional[str] = None, language: str = "python", concept: str = "general") -> str:
    """
    Get response from AI to user's coding question using OpenAI.
    
    Args:
        question: The user's question
        code: The code context (optional)
        language: The programming language
        concept: The coding concept being discussed
        
    Returns:
        str: The AI's response
    """
    try:
        # Prepare context for the prompt
        context = get_concept_context(concept)
        
        # Build the base prompt
        prompt = f"""
        You are a helpful coding tutor focused on {concept} concepts in {language}.
        
        Context: {context}
        
        User's question: {question}
        """
        
        # Add code context if available
        if code:
            prompt += f"""
            
            User's code:
            ```{language}
            {code}
            ```
            
            Help the user understand their code or answer their question in the context of this code.
            """
            
        # Try using OpenAI API
        try:
            # Import required modules
            import os
            from openai import OpenAI
            
            # Check if API key is available
            if not check_openai_api_key():
                raise ValueError("OpenAI API key not found or invalid")
                
            # Initialize OpenAI client
            client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
            print("OpenAI API key is valid and working")
            
            # Make the API call
            # using the ChatCompletion API with gpt-4o model which was released May 13, 2024
            # do not change this unless explicitly requested by the user
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": prompt}],
                temperature=0.5,
                max_tokens=800
            )
            
            # Return the assistant's response
            return response.choices[0].message.content
            
        except Exception as openai_error:
            # Log the error
            print(f"Error using OpenAI API: {openai_error}")
            print("Falling back to rule-based responses")
            
            # Fallback to rule-based response
            return get_fallback_ai_response(question, code, language, concept)
            
    except Exception as e:
        print(f"Error generating AI response: {e}")
        return "I'm having trouble processing your question right now. Please try again later."


def get_concept_context(concept: str) -> str:
    """
    Get contextual information about a coding concept.
    
    Args:
        concept: The coding concept
        
    Returns:
        str: Contextual information about the concept
    """
    contexts = {
        "general": "This is a general coding playground where you can experiment with any programming concept.",
        "if-else": "If-else statements are conditional expressions that allow your program to make decisions. They execute different blocks of code based on whether a condition evaluates to true or false.",
        "functions": "Functions are reusable blocks of code that perform specific tasks. They help organize code, promote reusability, and can accept parameters and return values.",
        "loops": "Loops are control structures that repeat a block of code until a certain condition is met. Common types include for loops and while loops.",
        "classes": "Classes are blueprints for creating objects in object-oriented programming. They encapsulate data (attributes) and behavior (methods).",
        "variables": "Variables are containers for storing data values. They have a name, a value, and a type.",
        "arrays": "Arrays are collections of items stored at contiguous memory locations. They allow for efficient data storage and access.",
        "strings": "Strings are sequences of characters used to represent text. They can be manipulated with various operations like concatenation, slicing, and formatting.",
        "recursion": "Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem.",
        "data-structures": "Data structures are specialized formats for organizing, processing, retrieving and storing data. Examples include arrays, linked lists, stacks, queues, trees, and graphs.",
        "algorithms": "Algorithms are step-by-step procedures for solving problems or accomplishing tasks. They can be analyzed for efficiency in terms of time and space complexity."
    }
    return contexts.get(concept, contexts["general"])
    
def get_concept_examples(concept: str, language: str = "python") -> Dict[str, str]:
    """
    Get AI-generated code examples for a specific programming concept.
    
    Args:
        concept: The programming concept (if-else, loops, functions, etc.)
        language: The programming language (default is python)
        
    Returns:
        dict: AI-generated code examples and description
    """
    try:
        if not check_openai_api_key():
            return {
                "title": f"{concept.capitalize()} in {language.capitalize()}",
                "description": "API key not available. This is a placeholder description.",
                "code": "# Example code would appear here when API is configured",
                "explanation": "Explanation would be shown here"
            }
            
        concept_map = {
            "if-else": "conditional statements (if-else)",
            "loops": "loops (for and while loops)",
            "functions": "functions and function parameters",
            "oops": "object-oriented programming (classes and objects)",
            "recursion": "recursion and recursive functions",
            "data-structures": "basic data structures (lists, dictionaries, sets, etc.)"
        }
        
        concept_desc = concept_map.get(concept, concept)
            
        # Define system message for the AI
        system_message = """You are an expert programming teacher who creates clear, educational code examples.
        Provide well-commented code examples that help beginners understand programming concepts easily."""
        
        # Create a detailed user message for the specific concept
        user_message = f"""Create an educational code example for {concept_desc} in {language}.
        
        Please structure your response as follows (in JSON format):
        {{
            "title": "A clear, descriptive title for this code example",
            "description": "A beginner-friendly explanation of this concept (2-3 sentences)",
            "code": "A well-commented code example showing the concept in action",
            "explanation": "A line-by-line explanation of what the code is doing and why"
        }}
        
        Make the code example:
        1. Simple enough for complete beginners to understand
        2. Include many helpful comments
        3. Show practical, real-world usage (not just abstract examples)
        4. Be 15-30 lines of code (not including comments)
        
        Ensure your response is valid JSON that can be parsed with json.loads().
        """
        
        # Get response from OpenAI
        from openai import OpenAI
        import os
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-4o",  # the newest OpenAI model is "gpt-4o" which was released May 13, 2024
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            response_format={"type": "json_object"},
            temperature=0.7
        )
        
        # Extract and parse the JSON response
        response_text = response.choices[0].message.content
        content = json.loads(response_text)
        
        return content
    except Exception as e:
        print(f"Error generating concept examples: {e}")
        return {
            "title": f"{concept.capitalize()} in {language.capitalize()}",
            "description": "Sorry, I couldn't generate examples for this concept right now.",
            "code": "# Example code would appear here",
            "explanation": "Explanation would be shown here"
        }


def get_ai_content(topic):
    """
    Get AI-generated content about a coding topic.
    
    Args:
        topic: The coding topic
        
    Returns:
        dict: AI-generated content with title, description, example, etc.
    """
    # Simple manually curated content for key topics
    topics = {
        "if-else": {
            "title": "Conditional Logic with If-Else",
            "description": "If-else statements allow your program to make decisions based on conditions.",
            "example": "temperature = 25\n\nif temperature > 30:\n    print('It\'s hot today!')\nelif temperature > 20:\n    print('It\'s a nice day!')\nelse:\n    print('It\'s a bit cold today.')",
            "real_world": "Conditional logic is extensively used in e-commerce for determining shipping costs, applying discounts, or managing user access control.",
            "dry_run": "This code will print 'It\'s a nice day!' since the temperature is 25, which is greater than 20 but not greater than 30."
        },
        "loops": {
            "title": "Iterations with Loops",
            "description": "Loops are used to execute a block of code repeatedly based on a condition.",
            "example": "# Processing a list of numbers\nnumbers = [1, 2, 3, 4, 5]\ntotal = 0\n\nfor num in numbers:\n    total += num\n    print(f'Running total: {total}')",
            "real_world": "Loops are fundamental in data processing, where they're used to iterate through datasets for analysis, transformation, or validation.",
            "dry_run": "This code will print the running total at each step, finally reaching 15 after adding all numbers in the list."
        },
        "functions": {
            "title": "Code Reusability with Functions",
            "description": "Functions allow you to group code into reusable blocks that perform specific tasks.",
            "example": "def calculate_area(length, width):\n    return length * width\n\n# Calculate the area of different rooms\nliving_room = calculate_area(5, 4)\nkitchen = calculate_area(3, 3)\n\nprint(f'Living room area: {living_room} m²')\nprint(f'Kitchen area: {kitchen} m²')",
            "real_world": "Functions form the basis of modular programming in production systems, facilitating maintenance, testing, and collaborative development.",
            "dry_run": "This code calculates and displays the areas of two rooms: the living room (20 m²) and the kitchen (9 m²)."
        },
        "classes": {
            "title": "Object-Oriented Programming with Classes",
            "description": "Classes are blueprints for creating objects that encapsulate data and behavior.",
            "example": "class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n        \n    def deposit(self, amount):\n        self.balance += amount\n        return self.balance\n    \n    def withdraw(self, amount):\n        if amount <= self.balance:\n            self.balance -= amount\n            return True\n        return False\n\n# Create and use an account\naccount = BankAccount('Alice', 100)\naccount.deposit(50)\nprint(f'Balance: ${account.balance}')",
            "real_world": "Classes are essential in enterprise software where they model business entities like customers, orders, and products with their attributes and behaviors.",
            "dry_run": "This code creates a bank account for Alice with $100, deposits $50, and then displays the new balance of $150."
        }
    }
    return topics.get(topic, {
        "title": "Coding Concepts",
        "description": "Select a specific topic from the sidebar to see detailed content.",
        "example": "# Example code will appear here\nprint('Select a topic to see examples')",
        "real_world": "Programming concepts have countless applications in real-world software systems.",
        "dry_run": "Select a topic to see execution details."
    })


def get_practice_problem():
    """
    Get a practice problem related to the current context.
    
    Returns:
        dict: A practice problem
    """
    problems = [
        {
            "title": "Practice: Sum of Numbers",
            "problem": "Write a function that calculates the sum of all numbers from 1 to n."
        },
        {
            "title": "Practice: Palindrome Checker",
            "problem": "Write a function that checks if a given string is a palindrome."
        },
        {
            "title": "Practice: FizzBuzz",
            "problem": "Write a program that prints numbers from 1 to 100, but for multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', and for multiples of both print 'FizzBuzz'."
        },
        {
            "title": "Practice: Character Counter",
            "problem": "Write a function that counts the occurrence of each character in a string."
        },
        {
            "title": "Practice: If-Else",
            "problem": "Write a function that checks if a number is even or odd."
        }
    ]
    return random.choice(problems)


def get_real_world_mapping(code: str) -> Dict[str, str]:
    """
    Generate a real-world code example for the user's code using OpenAI.
    This function dynamically generates professional-grade examples based on the user's code pattern.
    
    Args:
        code: The user's code
        
    Returns:
        dict: Dictionary with real-world code mapping including title, description and real_world_code
    """
    import os
    from openai import OpenAI
    
    if not code or len(code.strip()) < 10:
        return {
            "title": "Real-World Code Example", 
            "description": "Write some code to see a real-world example.",
            "real_world_code": "# Write code in the editor to see a real-world example"
        }
    
    # Try using OpenAI API, with fallbacks if it fails
    try:
        print(f"Using OpenAI API to generate real-world example for code snippet of length {len(code)}")
        
        # Check if API key exists and is properly formatted
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key or len(api_key.strip()) < 30:
            print("Invalid or missing OpenAI API key")
            raise ValueError("Invalid OpenAI API key format. Please check your API key.")
        
        client = OpenAI(api_key=api_key)
        
        # Prepare the prompt
        prompt = f"""
        Analyze the following user code and create a professional-grade real-world example that shows how similar patterns
        are used in production applications. The example should be educational and demonstrate best practices.

        USER CODE:
        ```python
        {code}
        ```

        Generate a response in JSON format with the following fields:
        1. title: A concise title for the real-world application (e.g., "API Authentication System")
        2. description: A brief description of how this pattern is used in professional settings
        3. real_world_code: A clean, well-commented code example showing the pattern in a professional context

        Only include the JSON object in your response, nothing else.
        """
        
        # Make the API call
        # using the ChatCompletion API with gpt-4o model which was released May 13, 2024
        # do not change this unless explicitly requested by the user
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=1000
        )
        
        # Parse the response
        result = json.loads(response.choices[0].message.content)
        
        print(f"Successfully generated real-world example: {result.get('title', 'Unknown')}")
        
        return {
            "title": result.get("title", "Real-World Application"),
            "description": result.get("description", "How this code applies to professional settings."),
            "real_world_code": result.get("real_world_code", "# No code generated")
        }
    
    except Exception as e:
        error_message = str(e)
        print(f"Error using OpenAI API: {error_message}")
        
        # Check for specific error conditions
        if "insufficient_quota" in error_message or "exceeded your current quota" in error_message:
            print("API quota exceeded. Please update your OpenAI API key or subscription.")
            # Add a custom message in the return value to indicate quota issues
            fallback_result = get_fallback_example(code)
            fallback_result["title"] = "API Quota Exceeded - Using Fallback Example"
            fallback_result["description"] += "\n\nNote: This example was generated using fallback content because the OpenAI API quota has been exceeded. Please update your API key for AI-generated examples."
            return fallback_result
        
        print("Falling back to pattern-based examples")
        
        # Fallback to pattern-based responses if API fails
        if "class" in code:
            return {
                "title": "Business Domain Model",
                "description": "Production applications use domain models to represent business entities.",
                "real_world_code": "class Product:\n    def __init__(self, id, name, price, category_id):\n        self.id = id\n        self.name = name\n        self.price = price\n        self.category_id = category_id\n        self.is_active = True\n        self.inventory_count = 0\n        \n    def apply_discount(self, percentage):\n        self.price = round(self.price * (1 - percentage/100), 2)\n        return self.price\n        \n    def restock(self, quantity):\n        self.inventory_count += quantity\n        if not self.is_active and self.inventory_count > 0:\n            self.is_active = True"
            }
        elif "if" in code and "else" in code:
            return {
                "title": "Data Validation Pipeline",
                "description": "Conditional logic is often used for data validation and processing in ETL jobs.",
                "real_world_code": "def validate_customer_data(customer):\n    validation_errors = []\n    \n    if not customer.get('email'):\n        validation_errors.append('Email is required')\n    elif not is_valid_email(customer['email']):\n        validation_errors.append('Email format is invalid')\n        \n    if not customer.get('name'):\n        validation_errors.append('Name is required')\n    \n    if customer.get('age') is not None:\n        if not isinstance(customer['age'], int):\n            validation_errors.append('Age must be a number')\n        elif customer['age'] < 18:\n            validation_errors.append('Customer must be at least 18 years old')\n    \n    return {\n        'is_valid': len(validation_errors) == 0,\n        'errors': validation_errors\n    }"
            }
        elif "for" in code or "while" in code:
            return {
                "title": "Data Processing Pipeline",
                "description": "Loops are extensively used in data processing workflows for batch operations.",
                "real_world_code": "def process_transaction_batch(transactions):\n    processed_count = 0\n    failed_count = 0\n    results = []\n    \n    for transaction in transactions:\n        try:\n            # Validate transaction\n            if not is_valid_transaction(transaction):\n                raise ValueError(f\"Invalid transaction format: {transaction['id']}\")\n                \n            # Process based on transaction type\n            if transaction['type'] == 'purchase':\n                result = process_purchase(transaction)\n            elif transaction['type'] == 'refund':\n                result = process_refund(transaction)\n            elif transaction['type'] == 'adjustment':\n                result = process_adjustment(transaction)\n            else:\n                raise ValueError(f\"Unknown transaction type: {transaction['type']}\")\n                \n            # Record success\n            processed_count += 1\n            results.append({\n                'transaction_id': transaction['id'],\n                'status': 'success',\n                'result': result\n            })\n            \n        except Exception as e:\n            # Record failure\n            failed_count += 1\n            logger.error(f\"Failed to process transaction {transaction.get('id')}: {str(e)}\")\n            results.append({\n                'transaction_id': transaction.get('id', 'unknown'),\n                'status': 'error',\n                'error': str(e)\n            })\n    \n    return {\n        'processed_count': processed_count,\n        'failed_count': failed_count,\n        'results': results\n    }"
            }
        else:
            return {
                "title": "API Endpoint Handler",
                "description": "Professional applications use structured code organization for API endpoints.",
                "real_world_code": "def handle_customer_request(request_data):\n    # Input validation\n    validation_result = validate_customer_request(request_data)\n    if not validation_result['is_valid']:\n        return {\n            'status': 'error',\n            'code': 'VALIDATION_ERROR',\n            'message': 'Invalid request data',\n            'details': validation_result['errors']\n        }\n    \n    # Process the request based on operation type\n    operation = request_data.get('operation')\n    customer_id = request_data.get('customer_id')\n    \n    try:\n        if operation == 'get_profile':\n            result = customer_service.get_customer_profile(customer_id)\n        elif operation == 'update_profile':\n            result = customer_service.update_customer_profile(\n                customer_id, request_data.get('profile_data', {})\n            )\n        elif operation == 'get_orders':\n            result = order_service.get_customer_orders(\n                customer_id, \n                limit=request_data.get('limit', 10),\n                offset=request_data.get('offset', 0)\n            )\n        else:\n            return {\n                'status': 'error',\n                'code': 'UNSUPPORTED_OPERATION',\n                'message': f'Operation not supported: {operation}'\n            }\n        \n        return {\n            'status': 'success',\n            'data': result\n        }\n        \n    except CustomerNotFoundError:\n        return {\n            'status': 'error',\n            'code': 'CUSTOMER_NOT_FOUND',\n            'message': f'Customer not found: {customer_id}'\n        }\n    except Exception as e:\n        logger.error(f'Error processing customer request: {str(e)}')\n        return {\n            'status': 'error',\n            'code': 'INTERNAL_ERROR',\n            'message': 'An unexpected error occurred'\n        }"
            }


def fix_common_demo_issues(html_content: str) -> str:
    """
    Fix common issues with interactive demos, such as missing JavaScript functions.
    
    Args:
        html_content: The HTML content of the demo
        
    Returns:
        str: Fixed HTML content
    """
    print("Applying common demo fixes...")
    
    # Fix grade calculator issues
    html_content = fix_grade_calculator_demo(html_content)
    
    # Fix timer issues
    html_content = fix_timer_functions(html_content)
    
    # Ensure demos have auto-run functionality
    html_content = add_auto_run_functionality(html_content)
    
    return html_content


def add_auto_run_functionality(html_content: str) -> str:
    """
    Add window.onload handler to auto-execute initial functionality.
    Also fix common function issues in JS demos by adding missing function implementations.
    Adds success messages and notifications for better user feedback.
    
    Args:
        html_content: The HTML content of the demo
        
    Returns:
        str: Fixed HTML content with auto-run functionality and success notifications
    """
    print("Adding auto-run and fixing function references...")
    
    # Check for common function references that are not implemented
    missing_functions = []
    common_functions = {
        'calculateAverage': html_content.find('calculateAverage') >= 0 and html_content.find('function calculateAverage') < 0,
        'calculateFactorial': html_content.find('calculateFactorial') >= 0 and html_content.find('function calculateFactorial') < 0,
        'startTimer': html_content.find('startTimer') >= 0 and html_content.find('function startTimer') < 0,
        'calculate': html_content.find('calculate(') >= 0 and html_content.find('function calculate') < 0,
        'generateOutput': html_content.find('generateOutput') >= 0 and html_content.find('function generateOutput') < 0,
        'processInput': html_content.find('processInput') >= 0 and html_content.find('function processInput') < 0,
        'updateDisplay': html_content.find('updateDisplay') >= 0 and html_content.find('function updateDisplay') < 0,
        'validateForm': html_content.find('validateForm') >= 0 and html_content.find('function validateForm') < 0,
    }
    
    # Build implementations for missing functions
    function_implementations = ""
    
    if common_functions['calculateFactorial']:
        function_implementations += """
        // Auto-generated factorial calculation function
        function calculateFactorial(n) {
            // Input validation - handle string inputs
            n = parseInt(n);
            
            // Handle edge cases
            if (isNaN(n)) return "Invalid input";
            if (n < 0) return "Invalid input (negative)";
            if (n === 0) return 1;
            
            // Calculate factorial
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            
            return result;
        }
        
        // Display factorial result
        function displayFactorialResult() {
            const input = document.getElementById('number') ? 
                          document.getElementById('number').value : 
                          document.querySelector('input[type="number"]').value || 5;
            
            const result = calculateFactorial(input);
            
            // Find where to display the result
            const resultElement = document.getElementById('result') || 
                                 document.getElementById('factorial-result') ||
                                 document.querySelector('.result');
            
            if (resultElement) {
                resultElement.textContent = `Factorial: ${result}`;
                resultElement.style.color = '#1DB954';
            }
        }
        """
    
    if common_functions['calculate']:
        function_implementations += """
        // Auto-generated general calculation function
        function calculate() {
            // Try to find input elements
            const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
            const resultDisplay = document.getElementById('result') || 
                                document.querySelector('.result') || 
                                document.querySelector('[id$="result"]');
            
            if (inputs.length === 0 || !resultDisplay) return;
            
            // Look for specific calculators based on page content
            const pageContent = document.body.innerHTML.toLowerCase();
            
            let result = null;
            
            // Check if this might be a BMI calculator
            if (pageContent.includes('bmi') || pageContent.includes('body mass')) {
                const height = parseFloat(inputs[0].value) || 175;
                const weight = parseFloat(inputs[1].value) || 70;
                result = (weight / ((height/100) * (height/100))).toFixed(2);
                resultDisplay.textContent = `BMI: ${result}`;
            }
            // Check if this might be a temperature converter
            else if (pageContent.includes('temperature') || pageContent.includes('celsius') || pageContent.includes('fahrenheit')) {
                const temp = parseFloat(inputs[0].value) || 20;
                const isCelsius = pageContent.indexOf('celsius') < pageContent.indexOf('fahrenheit');
                
                if (isCelsius) {
                    result = ((temp * 9/5) + 32).toFixed(2);
                    resultDisplay.textContent = `${temp}°C = ${result}°F`;
                } else {
                    result = ((temp - 32) * 5/9).toFixed(2);
                    resultDisplay.textContent = `${temp}°F = ${result}°C`;
                }
            } 
            // Default to basic arithmetic if not a specific calculator
            else {
                let total = 0;
                if (inputs.length >= 2) {
                    const num1 = parseFloat(inputs[0].value) || 0;
                    const num2 = parseFloat(inputs[1].value) || 0;
                    
                    if (pageContent.includes('multiply') || pageContent.includes('product')) {
                        result = num1 * num2;
                    } else if (pageContent.includes('divide') || pageContent.includes('quotient')) {
                        result = num1 / num2;
                    } else if (pageContent.includes('subtract') || pageContent.includes('difference')) {
                        result = num1 - num2;
                    } else {
                        result = num1 + num2;
                    }
                    
                    resultDisplay.textContent = `Result: ${result}`;
                }
            }
            
            // Highlight the result with a visual effect
            resultDisplay.style.color = '#1DB954';
            resultDisplay.style.fontWeight = 'bold';
        }
        """
    
    if common_functions['generateOutput']:
        function_implementations += """
        // Auto-generated function to handle output generation
        function generateOutput() {
            // Find input elements
            const textInput = document.querySelector('textarea') || 
                            document.querySelector('input[type="text"]') ||
                            document.getElementById('input');
            
            // Find output container
            const outputElement = document.getElementById('output') || 
                                document.querySelector('.output') ||
                                document.getElementById('result') ||
                                document.querySelector('.result');
            
            if (!textInput || !outputElement) return;
            
            const inputValue = textInput.value || textInput.placeholder || "Sample input text";
            
            // Determine what to do based on page content
            const pageContent = document.body.innerHTML.toLowerCase();
            
            if (pageContent.includes('count word') || pageContent.includes('word count')) {
                // Word counter
                const wordCount = inputValue.split(/\\s+/).filter(word => word.length > 0).length;
                outputElement.textContent = `Word count: ${wordCount}`;
            } 
            else if (pageContent.includes('reverse')) {
                // Text reverser
                outputElement.textContent = inputValue.split('').reverse().join('');
            }
            else if (pageContent.includes('uppercase') || pageContent.includes('lowercase')) {
                // Case converter
                if (pageContent.indexOf('uppercase') < pageContent.indexOf('lowercase')) {
                    outputElement.textContent = inputValue.toUpperCase();
                } else {
                    outputElement.textContent = inputValue.toLowerCase();
                }
            }
            else {
                // Generic output
                outputElement.textContent = `Output: ${inputValue}`;
            }
            
            // Highlight the output
            outputElement.style.color = '#1DB954';
            outputElement.style.fontWeight = 'bold';
        }
        """
    
    if common_functions['processInput']:
        function_implementations += """
        // Auto-generated function to process user inputs
        function processInput() {
            const inputs = document.querySelectorAll('input, textarea, select');
            const resultElement = document.getElementById('result') || 
                                document.querySelector('.result') ||
                                document.getElementById('output') ||
                                document.querySelector('.output');
            
            if (!resultElement) return;
            
            // Get all input values
            const values = Array.from(inputs).map(input => input.value || input.placeholder || "");
            
            // Determine what to display based on page content
            const pageContent = document.body.innerHTML.toLowerCase();
            
            if (values.length > 0) {
                if (pageContent.includes('form') && pageContent.includes('submit')) {
                    resultElement.innerHTML = `
                        <div style="padding: 15px; background-color: #1a1b26; border-left: 4px solid #1DB954; margin-top: 20px;">
                            <h3 style="color: #1DB954; margin-top: 0;">Form Submission Successful</h3>
                            <p>Thank you for your submission. We've received the following information:</p>
                            <ul style="color: #c0caf5;">
                                ${values.map((val, i) => `<li><strong>${inputs[i].placeholder || 'Field ' + (i+1)}:</strong> ${val}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                } else {
                    resultElement.textContent = `Processed input: ${values.join(', ')}`;
                    resultElement.style.color = '#1DB954';
                }
            }
        }
        """
    
    if common_functions['updateDisplay']:
        function_implementations += """
        // Auto-generated function to update display elements
        function updateDisplay() {
            const inputs = document.querySelectorAll('input, select, textarea');
            const displayElement = document.getElementById('display') || 
                                document.querySelector('.display') ||
                                document.getElementById('output') ||
                                document.querySelector('.output') ||
                                document.getElementById('result') ||
                                document.querySelector('.result');
            
            if (!displayElement) return;
            
            // Get all input values
            const values = Array.from(inputs).map(input => input.value || input.placeholder || "");
            
            if (values.length > 0) {
                // Check if this is likely a visual display demo
                if (displayElement.tagName === 'CANVAS') {
                    // Draw something on the canvas
                    const ctx = displayElement.getContext('2d');
                    ctx.clearRect(0, 0, displayElement.width, displayElement.height);
                    
                    const value = parseFloat(values[0]) || 50;
                    const percentage = value / 100;
                    
                    // Draw progress bar
                    ctx.fillStyle = '#24283b';
                    ctx.fillRect(0, 0, displayElement.width, displayElement.height);
                    
                    ctx.fillStyle = '#1DB954';
                    ctx.fillRect(0, 0, displayElement.width * percentage, displayElement.height);
                    
                    // Add text
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '14px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${value}%`, displayElement.width/2, displayElement.height/2 + 5);
                } else {
                    // Text-based display
                    displayElement.textContent = `Display updated: ${values.join(', ')}`;
                    displayElement.style.color = '#1DB954';
                }
            }
        }
        """
    
    if common_functions['validateForm']:
        function_implementations += """
        // Auto-generated form validation function
        function validateForm() {
            const form = document.querySelector('form');
            const inputs = form ? form.querySelectorAll('input, select, textarea') : document.querySelectorAll('input, select, textarea');
            const resultElement = document.getElementById('validation-result') || 
                                document.getElementById('result') ||
                                document.querySelector('.result');
            
            // Reset any previous validation styling
            inputs.forEach(input => {
                input.style.borderColor = '';
                const errorLabel = input.parentNode.querySelector('.error-message');
                if (errorLabel) errorLabel.remove();
            });
            
            let isValid = true;
            let errorMessages = [];
            
            // Validate each input
            inputs.forEach(input => {
                // Skip submit buttons or hidden fields
                if (input.type === 'submit' || input.type === 'button' || input.type === 'hidden') return;
                
                let fieldName = input.placeholder || input.name || 'Field';
                let errorMessage = null;
                
                // Required field validation
                if (input.hasAttribute('required') && !input.value.trim()) {
                    errorMessage = `${fieldName} is required`;
                }
                // Email validation
                else if (input.type === 'email' && input.value && !/^\\S+@\\S+\\.\\S+$/.test(input.value)) {
                    errorMessage = `Please enter a valid email address`;
                }
                // Number validation
                else if (input.type === 'number') {
                    const value = parseFloat(input.value);
                    const min = parseFloat(input.min);
                    const max = parseFloat(input.max);
                    
                    if (input.value && isNaN(value)) {
                        errorMessage = `${fieldName} must be a number`;
                    } else if (!isNaN(min) && value < min) {
                        errorMessage = `${fieldName} cannot be less than ${min}`;
                    } else if (!isNaN(max) && value > max) {
                        errorMessage = `${fieldName} cannot be greater than ${max}`;
                    }
                }
                
                // If there's an error, highlight the field and show message
                if (errorMessage) {
                    isValid = false;
                    errorMessages.push(errorMessage);
                    
                    // Highlight the input
                    input.style.borderColor = '#ff5555';
                    
                    // Add error message below the input
                    const errorLabel = document.createElement('div');
                    errorLabel.className = 'error-message';
                    errorLabel.textContent = errorMessage;
                    errorLabel.style.color = '#ff5555';
                    errorLabel.style.fontSize = '12px';
                    errorLabel.style.marginTop = '5px';
                    input.parentNode.appendChild(errorLabel);
                }
            });
            
            // Show overall validation result if element exists
            if (resultElement) {
                if (isValid) {
                    resultElement.innerHTML = `
                        <div style="padding: 10px; background-color: rgba(29, 185, 84, 0.1); border-left: 3px solid #1DB954; margin-top: 15px;">
                            <p style="color: #1DB954; margin: 0;">Form is valid! Ready to submit.</p>
                        </div>
                    `;
                } else {
                    resultElement.innerHTML = `
                        <div style="padding: 10px; background-color: rgba(255, 85, 85, 0.1); border-left: 3px solid #ff5555; margin-top: 15px;">
                            <p style="color: #ff5555; margin: 0 0 5px 0;">Please fix the following errors:</p>
                            <ul style="color: #ff5555; margin: 0; padding-left: 20px;">
                                ${errorMessages.map(msg => `<li>${msg}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                }
            }
            
            return isValid;
        }
        """
    
    # Add notification system
    notification_system = """
    // Add notification system for success messages
    function createNotificationSystem() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                max-width: 300px;
            `;
            document.body.appendChild(container);
        }
        
        // Define showNotification function
        window.showNotification = function(message, type = 'success') {
            const container = document.getElementById('notification-container');
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            
            // Set styles based on type
            let bgColor = '#1DB954';
            let textColor = '#fff';
            let icon = '✓';
            
            if (type === 'error') {
                bgColor = '#ff5555';
                icon = '✕';
            } else if (type === 'info') {
                bgColor = '#7aa2f7';
                icon = 'ℹ';
            }
            
            notification.style.cssText = `
                background-color: ${bgColor};
                color: ${textColor};
                border-radius: 8px;
                padding: 12px 16px;
                margin-bottom: 10px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                opacity: 0;
                transform: translateX(50px);
                transition: all 0.3s ease;
                max-width: 100%;
                font-family: 'Segoe UI', Arial, sans-serif;
            `;
            
            // Add icon
            const iconSpan = document.createElement('span');
            iconSpan.style.cssText = `
                font-size: 18px;
                margin-right: 10px;
                font-weight: bold;
            `;
            iconSpan.textContent = icon;
            
            // Add message
            const messageSpan = document.createElement('span');
            messageSpan.textContent = message;
            
            // Assemble notification
            notification.appendChild(iconSpan);
            notification.appendChild(messageSpan);
            container.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 10);
            
            // Automatically remove after delay
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(50px)';
                
                // Remove from DOM after animation
                setTimeout(() => {
                    container.removeChild(notification);
                }, 300);
            }, 5000);
            
            return notification;
        };
        
        // Define showSuccessMessage function for easy success messages
        window.showSuccessMessage = function(message) {
            return showNotification(message, 'success');
        };
        
        // Define showErrorMessage function for error messages
        window.showErrorMessage = function(message) {
            return showNotification(message, 'error');
        };
        
        // Define showAchievement function for special achievements
        window.showAchievement = function(title, message) {
            const container = document.getElementById('notification-container');
            
            // Create achievement notification
            const achievement = document.createElement('div');
            achievement.className = 'achievement';
            achievement.style.cssText = `
                background-color: #24283b;
                color: #fff;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 15px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                border-left: 4px solid #1DB954;
                opacity: 0;
                transform: translateX(50px);
                transition: all 0.3s ease;
                max-width: 100%;
                font-family: 'Segoe UI', Arial, sans-serif;
            `;
            
            // Add trophy icon
            const icon = document.createElement('div');
            icon.innerHTML = '🏆';
            icon.style.cssText = `
                font-size: 24px;
                margin-bottom: 8px;
                color: #1DB954;
            `;
            
            // Add title
            const titleElem = document.createElement('h3');
            titleElem.textContent = title;
            titleElem.style.cssText = `
                margin: 0 0 5px 0;
                font-size: 16px;
                color: #1DB954;
            `;
            
            // Add message
            const messageElem = document.createElement('p');
            messageElem.textContent = message;
            messageElem.style.cssText = `
                margin: 0;
                font-size: 14px;
                color: #c0caf5;
            `;
            
            // Assemble achievement
            achievement.appendChild(icon);
            achievement.appendChild(titleElem);
            achievement.appendChild(messageElem);
            container.appendChild(achievement);
            
            // Animate in
            setTimeout(() => {
                achievement.style.opacity = '1';
                achievement.style.transform = 'translateX(0)';
            }, 10);
            
            // Automatically remove after longer delay (achievements are special)
            setTimeout(() => {
                achievement.style.opacity = '0';
                achievement.style.transform = 'translateX(50px)';
                
                // Remove from DOM after animation
                setTimeout(() => {
                    container.removeChild(achievement);
                }, 500);
            }, 7000);
            
            return achievement;
        };
    }
    
    // Automatically call showSuccessMessage or showAchievement when certain actions are performed
    function enhanceButtonClicks() {
        const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
        buttons.forEach(button => {
            // Skip if already enhanced
            if (button.dataset.enhanced) return;
            
            // Get the original click handler
            const originalOnClick = button.onclick;
            
            // Set a new click handler
            button.onclick = function(event) {
                // Call the original handler if it exists
                let result = true;
                if (originalOnClick) {
                    result = originalOnClick.call(this, event);
                }
                
                // Only show success if the original handler didn't return false
                if (result !== false) {
                    // Get button text to customize message
                    const buttonText = button.textContent || button.value || 'Action';
                    
                    // Show appropriate success message based on button text
                    if (buttonText.toLowerCase().includes('calculate') || 
                        buttonText.toLowerCase().includes('compute')) {
                        showSuccessMessage('Calculation completed successfully!');
                    } else if (buttonText.toLowerCase().includes('add') || 
                               buttonText.toLowerCase().includes('create')) {
                        showSuccessMessage('Item added successfully!');
                    } else if (buttonText.toLowerCase().includes('save') || 
                               buttonText.toLowerCase().includes('update')) {
                        showSuccessMessage('Changes saved successfully!');
                    } else if (buttonText.toLowerCase().includes('submit') || 
                               buttonText.toLowerCase().includes('send')) {
                        showSuccessMessage('Form submitted successfully!');
                    } else if (buttonText.toLowerCase().includes('delete') || 
                               buttonText.toLowerCase().includes('remove')) {
                        showSuccessMessage('Item removed successfully!');
                    } else {
                        showSuccessMessage('Action completed successfully!');
                    }
                    
                    // 25% chance to show an achievement when buttons are clicked
                    if (Math.random() < 0.25) {
                        showAchievement('Concept Mastered!', 'You\'ve successfully demonstrated your understanding of this concept.');
                    }
                }
                
                return result;
            };
            
            // Mark as enhanced
            button.dataset.enhanced = 'true';
        });
    }
    """
    
    # Add auto-run functionality
    auto_run_js = """
    // Add auto-run functionality
    window.onload = function() {
        console.log("Auto-running demo initialization...");
        
        // Initialize the notification system
        createNotificationSystem();
        
        // Run any existing init function if available
        if (typeof initDemo === 'function') {
            try {
                initDemo();
            } catch (e) {
                console.error("Error in initDemo:", e);
            }
        }
        
        // Try to auto-execute commonly used functions
        const commonFunctions = [
            'calculateFactorial', 'startTimer', 'calculateAverage', 'processInput', 
            'runSimulation', 'updateChart', 'updateDisplay', 'visualize',
            'calculate', 'update', 'showResult', 'generateOutput', 'runExample',
            'displayFactorialResult', 'updateTimer', 'validateForm'
        ];
        
        // Try to call common functions that might exist
        let functionCalled = false;
        for (const funcName of commonFunctions) {
            if (typeof window[funcName] === 'function') {
                console.log(`Auto-executing function: ${funcName}`);
                try {
                    window[funcName]();
                    functionCalled = true;
                    
                    // Show success message for auto-executed function
                    if (window.showSuccessMessage) {
                        setTimeout(() => {
                            window.showSuccessMessage(`Auto-initialized ${funcName.replace(/([A-Z])/g, ' $1').toLowerCase()} successfully!`);
                        }, 1000);
                    }
                } catch (e) {
                    console.error(`Error auto-executing ${funcName}:`, e);
                }
            }
        }
        
        // If no functions were called, look for form inputs and populate with default values
        if (!functionCalled) {
            const inputs = document.querySelectorAll('input[type="number"]');
            inputs.forEach(input => {
                if (!input.value) {
                    if (input.placeholder) {
                        input.value = input.placeholder;
                    } else if (input.min && input.max) {
                        input.value = Math.floor((parseInt(input.min) + parseInt(input.max)) / 2);
                    } else {
                        input.value = 10; // Default value
                    }
                }
            });
            
            // Try to call the functions again now that we have values
            for (const funcName of commonFunctions) {
                if (typeof window[funcName] === 'function') {
                    try {
                        window[funcName]();
                        functionCalled = true;
                        
                        // Show success message for auto-executed function
                        if (window.showSuccessMessage) {
                            setTimeout(() => {
                                window.showSuccessMessage(`Auto-initialized ${funcName.replace(/([A-Z])/g, ' $1').toLowerCase()} successfully!`);
                            }, 1000);
                        }
                    } catch (e) {
                        console.error(`Error in retry of ${funcName}:`, e);
                    }
                }
            }
        }
        
        // Simulate clicks on primary action buttons if no function was executed
        if (!functionCalled) {
            setTimeout(() => {
                // Find any buttons that might be primary action buttons
                const actionButtons = document.querySelectorAll(
                    'button.primary, button.action, button.run, button.calculate, button.start, ' +
                    'button:not([class]), input[type="button"], input[type="submit"]'
                );
                
                if (actionButtons.length > 0) {
                    console.log("Auto-clicking primary action button");
                    try {
                        actionButtons[0].click();
                    } catch (e) {
                        console.error("Error auto-clicking button:", e);
                    }
                }
            }, 300);
        }
        
        // Enhance button clicks to show success messages
        setTimeout(() => {
            enhanceButtonClicks();
        }, 500);
        
        // Show initial achievement for loading the demo
        if (window.showAchievement) {
            setTimeout(() => {
                window.showAchievement('Demo Loaded!', 'You\'re now exploring an interactive demonstration of this coding concept.');
            }, 2000);
        }
    };
    """
    
    # Combine all JS implementations with notification system and auto-run
    all_js = function_implementations + notification_system + auto_run_js
    
    # Check if we need to add/replace window.onload
    if "window.onload" in html_content:
        # Replace existing window.onload function
        html_content = re.sub(
            r'window\.onload\s*=\s*function\s*\(\s*\)\s*\{[^}]*\}',
            'window.onload = function() { console.log("Auto-running enhanced initialization..."); /* Replaced by improved auto-run */ }',
            html_content
        )
    
    # Add our JavaScript implementations
    if "</script>" in html_content:
        # Add before the last closing script tag
        last_script_index = html_content.rfind("</script>")
        html_content = html_content[:last_script_index] + all_js + html_content[last_script_index:]
    else:
        # Add a new script tag
        html_content += f"\n<script>{all_js}</script>"
    
    return html_content


def fix_timer_functions(html_content: str) -> str:
    """
    Fix common issues with timer/countdown demos, particularly the missing startTimer function.
    
    Args:
        html_content: The HTML content of the demo
        
    Returns:
        str: Fixed HTML content
    """
    print("Checking for timer function issues...")
    
    # Check if we have a reference to startTimer but no function definition
    if "startTimer" in html_content and "function startTimer" not in html_content:
        print("Adding missing startTimer function...")
        
        # Add the missing startTimer function
        start_timer_js = """
        // Timer variables
        let timerInterval;
        let timerSeconds = 60;
        let originalTimerSeconds = 60;
        
        function startTimer() {
            // Clear any existing interval
            if (timerInterval) {
                clearInterval(timerInterval);
            }
            
            // Find timer elements
            const timerElement = document.getElementById('timer') || 
                                 document.querySelector('.timer') ||
                                 document.querySelector('[id$="timer"]') ||
                                 document.querySelector('[class$="timer"]');
                                 
            const progressElement = document.getElementById('timer-progress') || 
                                    document.querySelector('.progress-bar') ||
                                    document.querySelector('[class$="progress"]');
            
            // Get duration from input if available
            const durationInput = document.getElementById('duration') ||
                                  document.querySelector('[id$="duration"]') ||
                                  document.querySelector('input[type="number"]');
            
            if (durationInput && !isNaN(parseInt(durationInput.value))) {
                timerSeconds = parseInt(durationInput.value);
                originalTimerSeconds = timerSeconds;
            }
            
            // Update UI immediately
            updateTimerDisplay(timerElement, progressElement);
            
            // Set interval for countdown
            timerInterval = setInterval(() => {
                if (timerSeconds <= 0) {
                    clearInterval(timerInterval);
                    if (typeof timerComplete === 'function') {
                        timerComplete();
                    } else {
                        // Default completion behavior
                        if (timerElement) {
                            timerElement.textContent = "Time's up!";
                            timerElement.style.color = "#ff9e64";
                        }
                    }
                } else {
                    timerSeconds--;
                    updateTimerDisplay(timerElement, progressElement);
                }
            }, 1000);
        }
        
        function updateTimerDisplay(timerElement, progressElement) {
            if (timerElement) {
                const minutes = Math.floor(timerSeconds / 60);
                const seconds = timerSeconds % 60;
                timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (progressElement) {
                const percentage = (timerSeconds / originalTimerSeconds) * 100;
                progressElement.style.width = `${percentage}%`;
            }
        }
        
        function resetTimer() {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
            timerSeconds = originalTimerSeconds;
            
            const timerElement = document.getElementById('timer') || 
                                 document.querySelector('.timer') ||
                                 document.querySelector('[id$="timer"]') ||
                                 document.querySelector('[class$="timer"]');
                                 
            const progressElement = document.getElementById('timer-progress') || 
                                    document.querySelector('.progress-bar') ||
                                    document.querySelector('[class$="progress"]');
                                    
            updateTimerDisplay(timerElement, progressElement);
        }
        
        function pauseTimer() {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }
        """
        
        # Insert the function either before the closing script tag or add a new script tag
        if "</script>" in html_content:
            # Add before the last closing script tag
            last_script_index = html_content.rfind("</script>")
            html_content = html_content[:last_script_index] + start_timer_js + html_content[last_script_index:]
        else:
            # Add a new script tag
            html_content += f"<script>{start_timer_js}</script>"
    
    # Fix the Start Timer button
    if "startTimer" in html_content:
        # Using BeautifulSoup would be ideal, but for simplicity we'll use string replacement
        html_content = html_content.replace('id="start-timer"', 'id="start-timer" onclick="startTimer()"')
        html_content = html_content.replace('id="startTimer"', 'id="startTimer" onclick="startTimer()"')
        html_content = html_content.replace('class="start-timer"', 'class="start-timer" onclick="startTimer()"')
        
        # Find any Start Timer button and add onclick handler if missing
        timer_btn_patterns = [
            '<button[^>]*>\\s*Start\\s*Timer\\s*</button>',
            '<button[^>]*>\\s*Start\\s*</button>',
            '<button[^>]*>\\s*Begin\\s*Countdown\\s*</button>',
            '<button[^>]*>\\s*Start\\s*Countdown\\s*</button>'
        ]
        
        for pattern in timer_btn_patterns:
            btn_matches = re.finditer(pattern, html_content, re.IGNORECASE)
            for match in btn_matches:
                btn_html = match.group(0)
                # Check if it already has an onclick
                if 'onclick' not in btn_html:
                    fixed_btn = btn_html.replace('<button', '<button onclick="startTimer()"', 1)
                    html_content = html_content.replace(btn_html, fixed_btn)
    
    return html_content


def fix_grade_calculator_demo(html_content: str) -> str:
    """
    Fix common issues with grade calculator demos, particularly the missing calculateAverage function.
    
    Args:
        html_content: The HTML content of the demo
        
    Returns:
        str: Fixed HTML content
    """
    # Check if this is a grade calculator demo
    if not any(term in html_content.lower() for term in ["grade", "average", "calculator", "calculate average", "grading", "student grade"]):
        return html_content
        
    print("Applying grade calculator demo fixes...")
    
    # Check for common grading function references
    needs_calculate_grades = "calculateGrades" in html_content and "function calculateGrades" not in html_content
    needs_calculate_average = "calculateAverage" in html_content and "function calculateAverage" not in html_content
    
    # Add required functions
    functions_to_add = ""
    
    if needs_calculate_grades:
        functions_to_add += """
        function calculateGrades() {
            // Get all student inputs
            const studentRows = document.querySelectorAll('.student-row, .grade-row, tr');
            const results = [];
            
            // Process each student's score
            studentRows.forEach(row => {
                // Look for score input
                const nameElement = row.querySelector('.student-name') || 
                                  row.querySelector('[id$="name"]') ||
                                  row.querySelector('input[placeholder*="name" i]') ||
                                  row.querySelector('td:first-child') ||
                                  row.querySelector('div:first-child');
                
                const scoreElement = row.querySelector('input[type="number"]') || 
                                  row.querySelector('.score-input') ||
                                  row.querySelector('[id$="score"]') ||
                                  row.querySelector('input[placeholder*="score" i]');
                
                const gradeOutputElement = row.querySelector('.grade-result') || 
                                        row.querySelector('[id$="grade"]') ||
                                        row.querySelector('.grade') ||
                                        row.querySelector('td:last-child') ||
                                        row.querySelector('div:last-child');
                
                if (scoreElement && gradeOutputElement) {
                    // Get student name
                    let studentName = "Student";
                    if (nameElement) {
                        studentName = nameElement.tagName === 'INPUT' ? 
                                      nameElement.value || nameElement.placeholder || "Student" :
                                      nameElement.textContent || "Student";
                    }
                    
                    // Get score
                    const score = parseFloat(scoreElement.value) || 0;
                    
                    // Calculate grade based on score
                    let grade = "F";
                    if (score >= 90) {
                        grade = "A";
                    } else if (score >= 80) {
                        grade = "B";
                    } else if (score >= 70) {
                        grade = "C";
                    } else if (score >= 60) {
                        grade = "D";
                    }
                    
                    // Display grade
                    gradeOutputElement.textContent = grade;
                    
                    // Style the grade
                    if (grade === "A") {
                        gradeOutputElement.style.color = "#1DB954"; // Green for A
                    } else if (grade === "B") {
                        gradeOutputElement.style.color = "#7dcfff"; // Blue for B
                    } else if (grade === "C") {
                        gradeOutputElement.style.color = "#e0af68"; // Orange for C
                    } else if (grade === "D") {
                        gradeOutputElement.style.color = "#f7768e"; // Pink for D
                    } else {
                        gradeOutputElement.style.color = "#ff5555"; // Red for F
                    }
                    
                    // Add to results
                    results.push({ name: studentName, score: score, grade: grade });
                }
            });
            
            // Show success message
            if (window.showSuccessMessage && results.length > 0) {
                window.showSuccessMessage("Grades calculated successfully!");
                
                // 30% chance to show achievement
                if (Math.random() < 0.3 && window.showAchievement) {
                    window.showAchievement(
                        "Grading Mastered!", 
                        "You've successfully applied a grading system to evaluate performance."
                    );
                }
            }
            
            return results;
        }
        """
    
    if needs_calculate_average:
        functions_to_add += """
        function calculateAverage() {
            // Get all the input values
            const inputs = document.querySelectorAll('input[type="number"]');
            let sum = 0;
            let count = 0;
            
            // Sum up all valid input values
            inputs.forEach(input => {
                const value = parseFloat(input.value);
                if (!isNaN(value)) {
                    sum += value;
                    count++;
                }
            });
            
            // Calculate the average
            const average = count > 0 ? sum / count : 0;
            
            // Display the result
            const resultElement = document.getElementById('average-result') || 
                                document.querySelector('.result') ||
                                document.querySelector('[id$="result"]') ||
                                document.querySelector('[id$="average"]') ||
                                document.querySelector('[class$="result"]') ||
                                document.querySelector('[class$="average"]');
            
            if (resultElement) {
                resultElement.textContent = average.toFixed(2);
                resultElement.style.color = "#1DB954";
                resultElement.style.fontWeight = "bold";
            }
            
            // Update the progress bar if it exists
            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                const percentage = Math.min(100, (average / 100) * 100);
                progressBar.style.width = `${percentage}%`;
            }
            
            // Show success message
            if (window.showSuccessMessage) {
                window.showSuccessMessage("Average calculated successfully!");
                
                // 30% chance to show achievement
                if (Math.random() < 0.3 && window.showAchievement) {
                    window.showAchievement(
                        "Calculation Mastered!", 
                        "You've successfully calculated an average value!"
                    );
                }
            }
            
            return average;
        }
        """
    
    # Add the functions to the HTML
    if functions_to_add:
        if "</script>" in html_content:
            # Add before the last closing script tag
            last_script_index = html_content.rfind("</script>")
            html_content = html_content[:last_script_index] + functions_to_add + html_content[last_script_index:]
        else:
            # Add a new script tag
            html_content += f"<script>{functions_to_add}</script>"
    
    # Fix button click handlers for calculateGrades
    if needs_calculate_grades:
        html_content = html_content.replace('id="calculate-grades"', 'id="calculate-grades" onclick="calculateGrades()"')
        html_content = html_content.replace('id="calculateGrades"', 'id="calculateGrades" onclick="calculateGrades()"')
        html_content = html_content.replace('class="calculate-grades"', 'class="calculate-grades" onclick="calculateGrades()"')
        
        # Find any Calculate Grades button and add onclick handler if missing
        calculate_btn_patterns = [
            '<button[^>]*>\\s*Calculate\\s*Grades\\s*</button>',
            '<button[^>]*>\\s*Grade\\s*</button>',
            '<button[^>]*>\\s*Compute\\s*Grades\\s*</button>',
            '<button[^>]*>\\s*Assign\\s*Grades\\s*</button>'
        ]
        
        for pattern in calculate_btn_patterns:
            btn_matches = re.finditer(pattern, html_content, re.IGNORECASE)
            for match in btn_matches:
                btn_html = match.group(0)
                # Check if it already has an onclick
                if 'onclick' not in btn_html:
                    fixed_btn = btn_html.replace('<button', '<button onclick="calculateGrades()"', 1)
                    html_content = html_content.replace(btn_html, fixed_btn)
    
    # Fix button click handlers for calculateAverage
    if needs_calculate_average:
        html_content = html_content.replace('id="calculate-average"', 'id="calculate-average" onclick="calculateAverage()"')
        html_content = html_content.replace('id="calculateAverage"', 'id="calculateAverage" onclick="calculateAverage()"')
        html_content = html_content.replace('class="calculate-average"', 'class="calculate-average" onclick="calculateAverage()"')
        
        # Find any Calculate Average button and add onclick handler if missing
        calculate_btn_patterns = [
            '<button[^>]*>\\s*Calculate\\s*Average\\s*</button>',
            '<button[^>]*>\\s*Calculate\\s*</button>',
            '<button[^>]*>\\s*Compute\\s*Average\\s*</button>'
        ]
        
        for pattern in calculate_btn_patterns:
            btn_matches = re.finditer(pattern, html_content, re.IGNORECASE)
            for match in btn_matches:
                btn_html = match.group(0)
                # Check if it already has an onclick
                if 'onclick' not in btn_html:
                    fixed_btn = btn_html.replace('<button', '<button onclick="calculateAverage()"', 1)
                    html_content = html_content.replace(btn_html, fixed_btn)
    
    return html_content


def get_fallback_example(code: str) -> Dict[str, str]:
    """
    Provide fallback code examples when OpenAI API is unavailable
    
    Args:
        code: The user's code
        
    Returns:
        dict: Dictionary with fallback example
    """
    # Determine the type of code and return appropriate fallback
    if "class" in code:
        return {
            "title": "Business Domain Model",
            "description": "Production applications use domain models to represent business entities.",
            "real_world_code": "class Product:\n    def __init__(self, id, name, price, category_id):\n        self.id = id\n        self.name = name\n        self.price = price\n        self.category_id = category_id\n        self.is_active = True\n        self.inventory_count = 0\n        \n    def apply_discount(self, percentage):\n        self.price = round(self.price * (1 - percentage/100), 2)\n        return self.price\n        \n    def restock(self, quantity):\n        self.inventory_count += quantity\n        if not self.is_active and self.inventory_count > 0:\n            self.is_active = True"
        }
    elif "if" in code and "else" in code:
        return {
            "title": "Data Validation Pipeline",
            "description": "Conditional logic is often used for data validation and processing in ETL jobs.",
            "real_world_code": "def validate_customer_data(customer):\n    validation_errors = []\n    \n    if not customer.get('email'):\n        validation_errors.append('Email is required')\n    elif not is_valid_email(customer['email']):\n        validation_errors.append('Email format is invalid')\n        \n    if not customer.get('name'):\n        validation_errors.append('Name is required')\n    \n    if customer.get('age') is not None:\n        if not isinstance(customer['age'], int):\n            validation_errors.append('Age must be a number')\n        elif customer['age'] < 18:\n            validation_errors.append('Customer must be at least 18 years old')\n    \n    return {\n        'is_valid': len(validation_errors) == 0,\n        'errors': validation_errors\n    }"
        }
    elif "for" in code or "while" in code:
        return {
            "title": "Data Processing Pipeline",
            "description": "Loops are extensively used in data processing workflows for batch operations.",
            "real_world_code": "def process_transaction_batch(transactions):\n    processed_count = 0\n    failed_count = 0\n    results = []\n    \n    for transaction in transactions:\n        try:\n            # Validate transaction\n            if not is_valid_transaction(transaction):\n                raise ValueError(f\"Invalid transaction format: {transaction['id']}\")\n                \n            # Process based on transaction type\n            if transaction['type'] == 'purchase':\n                result = process_purchase(transaction)\n            elif transaction['type'] == 'refund':\n                result = process_refund(transaction)\n            elif transaction['type'] == 'adjustment':\n                result = process_adjustment(transaction)\n            else:\n                raise ValueError(f\"Unknown transaction type: {transaction['type']}\")\n                \n            # Record success\n            processed_count += 1\n            results.append({\n                'transaction_id': transaction['id'],\n                'status': 'success',\n                'result': result\n            })\n            \n        except Exception as e:\n            # Record failure\n            failed_count += 1\n            logger.error(f\"Failed to process transaction {transaction.get('id')}: {str(e)}\")\n            results.append({\n                'transaction_id': transaction.get('id', 'unknown'),\n                'status': 'error',\n                'error': str(e)\n            })\n    \n    return {\n        'processed_count': processed_count,\n        'failed_count': failed_count,\n        'results': results\n    }"
        }
    else:
        return {
            "title": "API Endpoint Handler",
            "description": "Professional applications use structured code organization for API endpoints.",
            "real_world_code": "def handle_customer_request(request_data):\n    # Input validation\n    validation_result = validate_customer_request(request_data)\n    if not validation_result['is_valid']:\n        return {\n            'status': 'error',\n            'code': 'VALIDATION_ERROR',\n            'message': 'Invalid request data',\n            'details': validation_result['errors']\n        }\n    \n    # Process the request based on operation type\n    operation = request_data.get('operation')\n    customer_id = request_data.get('customer_id')\n    \n    try:\n        if operation == 'get_profile':\n            result = customer_service.get_customer_profile(customer_id)\n        elif operation == 'update_profile':\n            result = customer_service.update_customer_profile(\n                customer_id, request_data.get('profile_data', {})\n            )\n        elif operation == 'get_orders':\n            result = order_service.get_customer_orders(\n                customer_id, \n                limit=request_data.get('limit', 10),\n                offset=request_data.get('offset', 0)\n            )\n        else:\n            return {\n                'status': 'error',\n                'code': 'UNSUPPORTED_OPERATION',\n                'message': f'Operation not supported: {operation}'\n            }\n        \n        return {\n            'status': 'success',\n            'data': result\n        }\n        \n    except CustomerNotFoundError:\n        return {\n            'status': 'error',\n            'code': 'CUSTOMER_NOT_FOUND',\n            'message': f'Customer not found: {customer_id}'\n        }\n    except Exception as e:\n        logger.error(f'Error processing customer request: {str(e)}')\n        return {\n            'status': 'error',\n            'code': 'INTERNAL_ERROR',\n            'message': 'An unexpected error occurred'\n        }"
        }

def get_interactive_demo(code: str, language: str = "python") -> Dict[str, str]:
    """
    Generate an interactive demo HTML based on the user's code.
    Use the real-world code examples to create practical, domain-specific demos.
    
    Args:
        code: The user's code
        language: The programming language (default is python)
        
    Returns:
        dict: Dictionary with contextually relevant interactive elements
    """
    import os
    from openai import OpenAI
    
    if not code or len(code.strip()) < 10:
        return {
            "demo_html": "<div style='padding:15px; text-align:center;'>Write some code to see an interactive demo based on real-world usage scenarios.</div>"
        }
    
    # Try using OpenAI API, with fallbacks if it fails
    try:
        print(f"Using OpenAI API to generate interactive demo for code snippet of length {len(code)}")
        
        # Check if API key exists and is properly formatted
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key or len(api_key.strip()) < 30:
            print("Invalid or missing OpenAI API key for interactive demo")
            raise ValueError("Invalid OpenAI API key format. Please check your API key.")
            
        # Initialize OpenAI client
        client = OpenAI(api_key=api_key)
        
        # Check if code is authentication-related
        is_auth_related = any(word in code.lower() for word in ['login', 'password', 'authenticate', 'credentials', 'signup', 'sign up', 'sign in', 'signin', 'oauth', 'jwt'])
        
        # Use our specialized auth demo template for authentication-related code
        if is_auth_related:
            try:
                # Import auth_demo_template module
                import auth_demo_template
                
                # Use the specialized authentication demo template
                auth_html = auth_demo_template.get_auth_demo_html(code)
                return {"demo_html": auth_html}
            except Exception as e:
                print(f"Error generating authentication demo from template: {e}")
                # Fall back to OpenAI prompt if template fails
            
            # Default OpenAI prompt for auth demos if template fails
            prompt = f"""
            Create an interactive HTML demo of a modern authentication interface based on the following user code.
            
            USER CODE:
            ```python
            {code}
            ```
            
            Create a sophisticated, production-quality login/authentication form with these features:
            1. Clean, modern UI with a dark theme and neon green accents (#1DB954)
            2. Username and password fields with proper validation
            3. A submit button with loading state animation
            4. Proper error handling and success states
            5. Interactive feedback when submitting credentials
            6. Simulated authentication that mimics the behavior in the code
            
            Additional specifications:
            - Implement a glass-morphism aesthetic with subtle blur effects
            - Include subtle animations for form submission and feedback
            - Add micro-interactions like button hover states and input focus effects
            - Show appropriate error messages for invalid inputs
            - Add a remember me checkbox and forgot password link (non-functional but styled)
            - Include a simulated "logged in" state that shows user profile info after successful login
            
            The HTML must be completely self-contained with all CSS and JavaScript embedded.
            Follow best practices for semantic HTML and accessibility.
            Make sure all interactive elements have proper contrast ratios.
            Do not require external libraries or dependencies.
            
            Output only the HTML code as a string that can be directly inserted into a webpage.
            """
        else:
            # Use the language parameter from the function arguments
            code_language = language.capitalize()
            
            prompt = f"""
            You are a helpful coding tutor AI. I will provide you with a code snippet in {code_language}. First, **describe a real-world use case or scenario** where this code's logic might be applied in practice (e.g., as part of a login form, calculator, game, etc.). Keep the explanation simple and clear for beginners. 

            Then, **write a complete interactive demo** in HTML, CSS, and JavaScript that implements the same logic. The demo should have input fields (such as text boxes or buttons) and show the output on the page. The JavaScript must mirror the original code's behavior but use only safe client-side operations (no `eval`, no server calls). 

            **Output format:** Two sections. First, a short paragraph under **"Real-World Example:"** describing the scenario. Second, under **"Interactive Demo:"** provide a single code block with the full HTML/CSS/JS code for the demo.
            
            USER CODE:
            ```python
            {code}
            ```
            
            **CRITICAL REQUIREMENTS: [READ CAREFULLY]**
            - THE DEMO MUST BE 100% FUNCTIONAL with ALL CODE INCLUDED - NO EXCEPTIONS
            - DO NOT REFERENCE ANY EXTERNAL FUNCTIONS WITHOUT IMPLEMENTING THEM
            - Every button click handler must be defined inline or in a <script> section
            - Check ALL function references - NEVER reference functions that aren't defined
            - VERIFY all JavaScript variables are properly declared and initialized
            - If you include a startTimer(), calculateAverage(), or any other function, YOU MUST IMPLEMENT IT FULLY
            - All referenced variables must be properly defined with appropriate scope
            - ALL USER INTERACTIONS must work out-of-box with no console errors
            
            **PYTHON SIMULATION REQUIREMENT:**
            - **CRITICALLY IMPORTANT: Create JavaScript functions that accurately simulate the Python code's behavior**
            - If the Python code has loops, create JavaScript functions that implement the same looping logic
            - If Python has conditionals, implement the same conditional logic in JavaScript 
            - Translate Python calculations directly to JavaScript equivalents
            - Simulate Python function behavior exactly in corresponding JavaScript functions
            - Use JavaScript arrays to simulate Python lists, JavaScript objects for Python dictionaries
            - EVERY feature from the Python code should have a working JavaScript equivalent
            
            **MANDATORY DESIGN REQUIREMENTS:** 
            The demo MUST strictly follow this design system:
            - Tokyo-night-dark theme with #1a1b26 as the main background color
            - Content areas and panels should use #24283b background color
            - Text should be light colored (#c0caf5 for regular text, #ffffff for headings)
            - Vibrant neon green (#1DB954) for buttons, highlights, and interactive elements
            - Input fields should have dark backgrounds (#1f2335) with light text
            - All user interface elements must have rounded corners (8px radius)
            - Use glass-morphism effects with subtle backdrop filters
            - Add subtle shadows to create depth (rgba(0,0,0,0.4) with 8px blur)
            - Include hover effects on interactive elements
            - Include at least one visual representation of the code's output (chart, progress bar, counter, animated visualization, etc.)
            
            **FUNCTIONAL REQUIREMENTS:** 
            The demo MUST be FULLY FUNCTIONAL and HIGHLY INTERACTIVE:
            1. Create a WORKING demonstration, not just visual mockups
            2. All code functionality must be completely implemented in JavaScript - include ALL required functions
            3. Demo MUST show actual computation/processing based on user inputs
            4. Include DEFAULT VALUES for all inputs so users can immediately see results
            5. All buttons must have WORKING event handlers that trigger actual operations
            6. CLEARLY DISPLAY OUTPUTS with visual highlighting when values change
            7. Include REAL-TIME UPDATES - changes should be immediately visible
            8. Implement at least 1-2 DYNAMIC VISUALIZATIONS that update as values change (charts, animations, etc.)
            9. Add helpful TOOLTIPS or instructions that explain how the demo works
            10. Include VALIDATION for inputs where appropriate with clear error states
            11. Use TRANSITIONS and ANIMATIONS to create a polished experience
            12. IMPLEMENT ALL REQUIRED JAVASCRIPT FUNCTIONS - for example if you refer to a function like startTimer(), you MUST include its implementation
            13. INCLUDE ALL NEEDED VARIABLES - define all variables that are referenced in your code
            14. TEST YOUR IMPLEMENTATION - make sure the demo will work when buttons are clicked
            15. ADD USER INSTRUCTIONS - provide clear instructions on how to use the demo at the top
            16. AUTO-RUN ON LOAD - The demo should automatically show results when the page loads without requiring user interaction
            17. SHOW INITIAL OUTPUT - Always display initial output values so users see results immediately
            18. USE WINDOW.ONLOAD - Run initial calculations and visualizations when page loads using window.onload
            19. AVOID EMPTY STATES - Never show empty result areas; always populate with initial values
            20. PREVENT UNDEFINED REFERENCES - Test all JS functions and variables thoroughly
            21. SHOW SUCCESS MESSAGES - Display clear success messages when users complete actions (e.g., "Task successfully added!", "Calculation complete!")
            22. ADD SUCCESS NOTIFICATIONS - Include a notification system that shows green success messages that appear and fade out after actions
            23. INCLUDE ACHIEVEMENT FEEDBACK - Give users positive feedback when they successfully demonstrate understanding of the concept
            24. IMPLEMENT SUCCESS STATE - Every demo must include a success/completion state that congratulates the user
            
            **TIMER OR COUNTDOWN DEMOS - IMPORTANT:**
            If the code involves timers, schedules, or countdowns:
            1. INCLUDE A COMPLETE startTimer() FUNCTION that properly handles all timer functionality
            2. Include startTimer(), pauseTimer(), resetTimer() functions that are fully implemented
            3. Implement timer display updating that shows minutes:seconds format
            4. Add progress bars or visual indicators that update as timer progresses
            5. Include callback functions for timer completion events
            
            **CALCULATOR DEMOS - IMPORTANT:**
            If creating a calculator or computation demo:
            1. INCLUDE A COMPLETE calculateAverage(), calculate(), or equivalent function
            2. Implement all computation logic needed for the calculations
            3. Add validation checks for input ranges and types
            4. Include visual feedback when calculations are performed
            5. Show detailed computation results with appropriate formatting
            
            **IMPLEMENTATION EXAMPLES:**
            - For math functions: interactive calculator with results visualization
            - For loops/lists: interactive data manipulation with visual representation of the list
            - For string operations: live text processing with before/after views
            - For conditionals: interactive decision tree or flowchart that highlights execution path
            - For user data: forms with validation and visual feedback
            
            The HTML should be self-contained with all CSS and JavaScript included.
            I REPEAT: This demo MUST ACTUALLY WORK and demonstrate real functionality with no reference errors.
            DOUBLE-CHECK all function and variable references for completeness before submission.
            """
        
        # Make the API call with OpenAI
        # using the ChatCompletion API with gpt-4o model which was released May 13, 2024
        # do not change this unless explicitly requested by the user
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500
        )
        
        # Get the content
        content = response.choices[0].message.content.strip()
        
        # Extract the real-world example and interactive demo
        real_world_example = ""
        demo_html = ""
        
        # Find the real-world example section
        if "Real-World Example:" in content:
            example_start = content.find("Real-World Example:") + len("Real-World Example:")
            example_end = content.find("Interactive Demo:", example_start)
            if example_end > example_start:
                real_world_example = content[example_start:example_end].strip()
        
        # Find the interactive demo section
        if "Interactive Demo:" in content:
            demo_start = content.find("Interactive Demo:") + len("Interactive Demo:")
            demo_html = content[demo_start:].strip()
            
            # If the demo HTML is wrapped in code blocks, remove them
            if demo_html.startswith("```html"):
                demo_html = demo_html.replace("```html", "", 1)
                if demo_html.endswith("```"):
                    demo_html = demo_html[:-3].strip()
            elif demo_html.startswith("```"):
                demo_html = demo_html.replace("```", "", 1)
                if demo_html.endswith("```"):
                    demo_html = demo_html[:-3].strip()
        
        # If we couldn't parse the sections properly, try to extract just the HTML
        if not demo_html:
            if "<html" in content:
                start_idx = content.find("<html")
                demo_html = content[start_idx:]
            elif "<!DOCTYPE" in content:
                start_idx = content.find("<!DOCTYPE")
                demo_html = content[start_idx:]
            elif "<div" in content:
                start_idx = content.find("<div")
                demo_html = content[start_idx:]
        
        # Add the real-world example as a header to the HTML if we found one
        if real_world_example and demo_html:
            real_world_div = f'''
            <div style="margin-bottom: 20px; padding: 15px; background-color: #24283b; border-left: 4px solid #1DB954; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                <h3 style="margin-top: 0; color: #1DB954; font-weight: 600; margin-bottom: 10px; font-family: 'Segoe UI', Arial, sans-serif;">Real-World Application</h3>
                <p style="margin: 0; line-height: 1.6; color: #c0caf5; font-family: 'Segoe UI', Arial, sans-serif;">{real_world_example}</p>
            </div>
            '''
            
            # Insert the real-world example div at the beginning of the body
            if "<body" in demo_html:
                body_start = demo_html.find("<body") + demo_html[demo_html.find("<body"):].find(">") + 1
                demo_html = demo_html[:body_start] + real_world_div + demo_html[body_start:]
            else:
                # Just prepend it if we can't find the body tag
                demo_html = real_world_div + demo_html
            
        # Apply common fixes to the demo
        demo_html = fix_common_demo_issues(demo_html)
        
        print(f"Successfully generated interactive demo HTML of length {len(demo_html)}")
        
        return {"demo_html": demo_html}
        
    except Exception as e:
        error_message = str(e)
        print(f"Error using OpenAI API for interactive demo: {error_message}")
        
        # Check for specific error conditions
        if "insufficient_quota" in error_message or "exceeded your current quota" in error_message:
            print("API quota exceeded. Please update your OpenAI API key or subscription.")
            return {
                "demo_html": f"""<div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background-color: #1a1b26; color: #c0caf5; border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); max-width: 500px; margin: 0 auto; text-align: center;">
                    <svg width="60" height="60" viewBox="0 0 24 24" style="margin: 0 auto 15px auto; display: block; color: #ff9e64;">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
                    </svg>
                    <h2 style="margin-bottom: 15px; color: #ffffff;">API Quota Exceeded</h2>
                    <p style="margin-bottom: 20px; line-height: 1.5;">
                        We're currently using a fallback demo because the OpenAI API quota has been exceeded. 
                        For AI-generated personalized interactive demos, please update your OpenAI API key.
                    </p>
                    <div style="background-color: #24283b; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #414868; text-align: left;">
                        <p style="margin-bottom: 10px; color: #a9b1d6; font-size: 14px;">
                            A new API key with available quota will enable:
                        </p>
                        <ul style="color: #a9b1d6; font-size: 14px; padding-left: 20px; margin-bottom: 0;">
                            <li style="margin-bottom: 5px;">Custom interactive demos based on your code</li>
                            <li style="margin-bottom: 5px;">Real-world example generation</li>
                            <li style="margin-bottom: 5px;">AI-powered coding assistance</li>
                        </ul>
                    </div>
                    <div style="padding-top: 10px;">
                        <button onclick="location.reload()" style="padding: 12px 20px; border: none; border-radius: 10px; background-color: #1DB954; color: black; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-size: 14px;">
                            Try Again
                        </button>
                    </div>
                </div>"""
            }
        
        print("Falling back to pattern-based demos")
    # Check for authentication-related code
    if "login" in code.lower() or "password" in code.lower() or "authenticate" in code.lower() or "credentials" in code.lower():
        try:
            # Try to use our custom auth demo template
            # Import the auth_demo_template module
            spec = importlib.util.spec_from_file_location("auth_demo_template", "auth_demo_template.py")
            auth_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(auth_module)
            
            # Use the get_auth_demo_html function from the imported module
            demo_html = auth_module.get_auth_demo_html(code)
            print("Using enhanced authentication demo template")
            return {"demo_html": demo_html}
        except Exception as e:
            print(f"Error using auth demo template: {e}, falling back to basic template")
            # Extract usernames and passwords from the code if they exist
            username_pattern = re.compile(r'username\s*=\s*[\'"]([^\'"]+)[\'"]|user\s*=\s*[\'"]([^\'"]+)[\'"]', re.IGNORECASE)
            password_pattern = re.compile(r'password\s*=\s*[\'"]([^\'"]+)[\'"]|pwd\s*=\s*[\'"]([^\'"]+)[\'"]', re.IGNORECASE)
            
            # Find any usernames/passwords in the code
            username_match = username_pattern.search(code)
            password_match = password_pattern.search(code)
            
            # Default credentials
            username = "admin"
            password = "password123"
            
            # Use credentials from code if found
            if username_match:
                extracted_username = username_match.group(1) or username_match.group(2)
                if extracted_username:
                    username = extracted_username
                    
            if password_match:
                extracted_password = password_match.group(1) or password_match.group(2)
                if extracted_password:
                    password = extracted_password
            
            return {
                "demo_html": f"""<div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background-color: #1a1b26; color: #c0caf5; border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); max-width: 500px; margin: 0 auto;">
                    <h2 style="text-align: center; margin-bottom: 20px; color: #ffffff;">Authentication Demo</h2>
                    
                    <div style="background-color: #24283b; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #414868;">
                        <div style="margin-bottom: 15px;">
                            <label for="username" style="display: block; margin-bottom: 8px; font-weight: 500; color: #a9b1d6;">Username</label>
                            <input type="text" id="username" value="" placeholder="Enter username" style="width: 100%; padding: 14px; border: 1px solid #414868; border-radius: 10px; background-color: #1f2335; color: #c0caf5; outline: none; transition: all 0.3s;">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label for="password" style="display: block; margin-bottom: 8px; font-weight: 500; color: #a9b1d6;">Password</label>
                            <div style="position: relative;">
                                <input type="password" id="password" value="" placeholder="Enter password" style="width: 100%; padding: 14px; border: 1px solid #414868; border-radius: 10px; background-color: #1f2335; color: #c0caf5; outline: none; transition: all 0.3s;">
                                <button onclick="togglePassword()" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #a9b1d6; cursor: pointer;">
                                    <svg id="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </button>
                            </div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-size: 14px;">
                            <div style="display: flex; align-items: center;">
                                <input type="checkbox" id="remember-me" style="margin-right: 8px; accent-color: #1DB954;">
                                <label for="remember-me" style="color: #a9b1d6;">Remember me</label>
                            </div>
                            <a href="#" style="color: #1DB954; text-decoration: none;">Forgot password?</a>
                        </div>
                        
                        <button onclick="attemptLogin()" id="login-btn" style="width: 100%; padding: 14px; border: none; border-radius: 10px; background-color: #1DB954; color: black; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-size: 16px;">
                            Log In
                        </button>
                    </div>
                    
                    <div id="auth-result" style="background-color: #24283b; padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #414868; min-height: 80px; display: none; text-align: center;">
                        <!-- Authentication result will appear here -->
                    </div>
                    
                    <div style="text-align: center; margin-top: 15px; font-size: 14px; color: #a9b1d6;">
                        Don't have an account? <a href="#" style="color: #1DB954; text-decoration: none; font-weight: 500;">Sign up</a>
                    </div>
                    
                    <script>
                        // Toggle password visibility
                        function togglePassword() {{
                            const passwordInput = document.getElementById('password');
                            const eyeIcon = document.getElementById('eye-icon');
                            
                            if (passwordInput.type === 'password') {{
                                passwordInput.type = 'text';
                                eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
                            }} else {{
                                passwordInput.type = 'password';
                                eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
                            }}
                        }}
                        
                        // Login function
                        function attemptLogin() {{
                            const username = document.getElementById('username').value;
                            const password = document.getElementById('password').value;
                            const authResult = document.getElementById('auth-result');
                            const loginBtn = document.getElementById('login-btn');
                            
                            // Show loading state
                            loginBtn.innerHTML = '<span class="spinner"></span>Logging in...';
                            loginBtn.disabled = true;
                            
                            // Reset auth result
                            authResult.style.display = 'none';
                            
                            // Simulate authentication process
                            setTimeout(function() {{
                                // Reset button
                                loginBtn.innerHTML = 'Log In';
                                loginBtn.disabled = false;
                                
                                // Validate credentials
                                if (username === '{username}' && password === '{password}') {{
                                    // Success
                                    authResult.className = 'auth-result success';
                                    authResult.style.backgroundColor = 'rgba(158, 206, 106, 0.1)';
                                    authResult.style.border = '1px solid #9ece6a';
                                    authResult.style.color = '#9ece6a';
                                    authResult.innerHTML = `
                                        <div style="font-size: 24px; margin-bottom: 10px;">✓</div>
                                        <div style="font-weight: 600; margin-bottom: 5px;">Authentication Successful!</div>
                                        <div>Welcome back, ${{username}}</div>
                                        <div style="font-size: 12px; opacity: 0.7; margin-top: 8px;">Session started at ${{new Date().toLocaleTimeString()}}</div>
                                    `;
                                }} else {{
                                    // Failure
                                    authResult.className = 'auth-result error';
                                    authResult.style.backgroundColor = 'rgba(247, 118, 142, 0.1)';
                                    authResult.style.border = '1px solid #f7768e';
                                    authResult.style.color = '#f7768e';
                                    authResult.innerHTML = `
                                        <div style="font-size: 24px; margin-bottom: 10px;">✕</div>
                                        <div style="font-weight: 600; margin-bottom: 5px;">Authentication Failed!</div>
                                        <div>Invalid username or password</div>
                                        <div style="font-size: 12px; opacity: 0.8; margin-top: 8px;">Hint: Use {username}/{password}</div>
                                    `;
                                }}
                                
                                authResult.style.display = 'block';
                            }}, 1500);
                        }}
                    
                    // Add animation styles
                    const styleEl = document.createElement('style');
                    styleEl.textContent = `
                        @keyframes spin {{
                            to {{ transform: rotate(360deg); }}
                        }}
                        #username:focus, #password:focus {{
                            border-color: #1DB954;
                            box-shadow: 0 0 0 2px rgba(29, 185, 84, 0.25);
                        }}
                        #login-btn:hover {{
                            background-color: #24D863;
                            transform: translateY(-2px);
                            box-shadow: 0 4px 8px rgba(29, 185, 84, 0.3);
                        }}
                    `;
                    document.head.appendChild(styleEl);
                </script>
            </div>"""
        }
    elif "class" in code:
        return {
            "demo_html": "<div style=\"padding:20px; border:1px solid #ddd; border-radius:8px\">\n                <h4>Object Creator</h4>\n                <div>\n                    <div style=\"margin-bottom:10px;\">\n                        <label>Object Name:</label>\n                        <input type=\"text\" id=\"obj-name\" value=\"MyObject\" style=\"margin-left:10px;\" />\n                    </div>\n                    <div style=\"margin-bottom:10px;\">\n                        <label>Property Name:</label>\n                        <input type=\"text\" id=\"obj-prop\" value=\"value\" style=\"margin-left:10px;\" />\n                    </div>\n                    <div style=\"margin-bottom:10px;\">\n                        <label>Property Value:</label>\n                        <input type=\"text\" id=\"obj-val\" value=\"true\" style=\"margin-left:10px;\" />\n                    </div>\n                    <button onclick=\"createSimpleObject()\" style=\"padding:8px 16px; background:#1DB954; color:black; border:none; border-radius:4px;\">Create Object</button>\n                </div>\n                <div id=\"obj-result\" style=\"margin-top:15px; padding:10px; background:#f5f5f5; border-radius:4px; font-family:monospace;\">\n                    Object will appear here\n                </div>\n                <script>\n                    function createSimpleObject() {\n                        const name = document.getElementById('obj-name').value || 'MyObject';\n                        const prop = document.getElementById('obj-prop').value || 'value';\n                        const val = document.getElementById('obj-val').value || 'true';\n                        const resultEl = document.getElementById('obj-result');\n                        \n                        resultEl.innerHTML = `const ${name} = {<br>    ${prop}: ${val},<br>    created: \"${new Date().toISOString()}\",<br>    toString() { return \"${name} object\"; }<br>}`;\n                    }\n                </script>\n            </div>"
        }
    elif "if" in code and "else" in code:
        return {
            "demo_html": "<div style=\"padding:20px; border:1px solid #ddd; border-radius:8px\">\n                <h4>Conditional Flow Simulator</h4>\n                <div>\n                    <label>Input value:</label>\n                    <input type=\"text\" id=\"simple-input\" placeholder=\"Enter a value\" style=\"margin-left:10px;\" />\n                    <button onclick=\"runSimpleCondition()\" style=\"margin-left:10px; padding:5px 10px; background:#4a6bdf; color:white; border:none; border-radius:4px;\">Test</button>\n                </div>\n                <div id=\"simple-result\" style=\"margin-top:15px; padding:10px; background:#f5f5f5; border-radius:4px;\">\n                    Enter a value and click Test\n                </div>\n                <script>\n                    function runSimpleCondition() {\n                        const input = document.getElementById('simple-input').value;\n                        const resultEl = document.getElementById('simple-result');\n                        \n                        if (!input) {\n                            resultEl.innerHTML = '<span style=\"color:red;\">Please enter a value!</span>';\n                        } else if (isNaN(input)) {\n                            resultEl.innerHTML = `<span style=\"color:blue;\">${input} is text - entered branch 1</span>`;\n                        } else if (Number(input) > 10) {\n                            resultEl.innerHTML = `<span style=\"color:green;\">${input} is greater than 10 - entered branch 2</span>`;\n                        } else {\n                            resultEl.innerHTML = `<span style=\"color:orange;\">${input} is a number <= 10 - entered branch 3</span>`;\n                        }\n                    }\n                </script>\n            </div>"
        }
    elif "for" in code or "while" in code:
        return {
            "demo_html": "<div style=\"padding:20px; border:1px solid #ddd; border-radius:8px\">\n                <h4>Loop Visualizer</h4>\n                <div>\n                    <div style=\"margin-bottom:10px;\">\n                        <label>Number of iterations:</label>\n                        <input type=\"number\" id=\"loop-count\" min=\"1\" max=\"20\" value=\"5\" style=\"margin-left:10px; width:60px;\" />\n                    </div>\n                    <div style=\"margin-bottom:10px;\">\n                        <label>Loop type:</label>\n                        <select id=\"loop-type\" style=\"margin-left:10px;\">\n                            <option value=\"for\">For Loop</option>\n                            <option value=\"while\">While Loop</option>\n                        </select>\n                    </div>\n                    <button onclick=\"visualizeLoop()\" style=\"padding:5px 10px; background:#4a6bdf; color:white; border:none; border-radius:4px;\">Run Loop</button>\n                </div>\n                <div id=\"loop-visualization\" style=\"margin-top:15px; padding:10px; background:#f5f5f5; border-radius:4px;\">\n                    Configure and run the loop\n                </div>\n                <script>\n                    function visualizeLoop() {\n                        const count = parseInt(document.getElementById('loop-count').value) || 5;\n                        const type = document.getElementById('loop-type').value;\n                        const visualEl = document.getElementById('loop-visualization');\n                        \n                        visualEl.innerHTML = `<div style=\"font-family:monospace; margin-bottom:10px;\">${type === 'for' ? \n                            `for (let i = 0; i < ${count}; i++) {<br>    // Loop body<br>}` : \n                            `let i = 0;<br>while (i < ${count}) {<br>    // Loop body<br>    i++;<br>}`\n                        }</div><div>Execution:</div>`;\n                        \n                        // Simulate loop execution with delays\n                        let i = 0;\n                        const interval = setInterval(() => {\n                            visualEl.innerHTML += `<div>Iteration ${i}: Processing item ${i}</div>`;\n                            i++;\n                            if (i >= count) {\n                                clearInterval(interval);\n                                visualEl.innerHTML += `<div style=\"margin-top:10px;\">Loop completed after ${count} iterations</div>`;\n                            }\n                        }, 500);\n                    }\n                </script>\n            </div>"
        }
    else:
        return {
            "demo_html": "<div style=\"padding:20px; border:1px solid #ddd; border-radius:8px\">\n                <h4>Code Execution Simulator</h4>\n                <div style=\"margin-bottom:15px;\">\n                    <p>This interactive demo simulates the execution of your code.</p>\n                </div>\n                <div style=\"display:flex; margin-bottom:15px;\">\n                    <div style=\"flex:1; margin-right:10px;\">\n                        <label>Input 1:</label>\n                        <input type=\"text\" id=\"input1\" value=\"Test\" style=\"display:block; margin-top:5px; width:100%;\" />\n                    </div>\n                    <div style=\"flex:1;\">\n                        <label>Input 2:</label>\n                        <input type=\"number\" id=\"input2\" value=\"42\" style=\"display:block; margin-top:5px; width:100%;\" />\n                    </div>\n                </div>\n                <button onclick=\"processInputs()\" style=\"padding:8px 16px; background:#4a6bdf; color:white; border:none; border-radius:4px;\">Process</button>\n                <div id=\"generic-result\" style=\"margin-top:15px; padding:10px; background:#f5f5f5; border-radius:4px;\">\n                    Results will appear here\n                </div>\n                <script>\n                    function processInputs() {\n                        const input1 = document.getElementById('input1').value;\n                        const input2 = parseInt(document.getElementById('input2').value);\n                        const resultEl = document.getElementById('generic-result');\n                        \n                        // Simulate processing\n                        resultEl.innerHTML = '<div>Processing...</div>';\n                        \n                        setTimeout(() => {\n                            resultEl.innerHTML = `\n                                <div style=\"margin-bottom:10px;\"><strong>Input Processing Results:</strong></div>\n                                <div>Text Input: \"${input1}\" (${input1.length} characters)</div>\n                                <div>Number Input: ${input2} (${input2 % 2 === 0 ? 'even' : 'odd'} number)</div>\n                                <div style=\"margin-top:10px;\">Combined Result: \"${input1}-${input2}\"</div>\n                                <div>Timestamp: ${new Date().toLocaleTimeString()}</div>\n                            `;\n                        }, 1000);\n                    }\n                </script>\n            </div>"
        }


def analyze_code_complexity(code: str, language: str = "python") -> Dict[str, Any]:
    """
    Analyze the complexity of code and provide explanations.
    
    Args:
        code: The code to analyze
        language: The programming language
        
    Returns:
        Dict: Analysis of code complexity with explanations
    """
    if not check_openai_api_key():
        return get_fallback_complexity_analysis(code, language)
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        
        # Define the prompt for OpenAI
        prompt = f"""
        Analyze the following {language} code for complexity and provide detailed explanations:
        
        ```{language}
        {code}
        ```
        
        Provide the following information in JSON format:
        1. complexity_score: A number from 1-10 rating the code's complexity (1 being very simple, 10 being extremely complex)
        2. complexity_factors: Array of factors that contribute to the complexity
        3. simplification_suggestions: Array of suggestions for simplifying the code
        4. explanation: A detailed explanation of why the code is complex or simple
        5. key_concepts: Array of programming concepts used in the code
        6. real_world_comparison: An analogy comparing the code's complexity to a real-world situation
        
        Return only valid JSON.
        """
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o",  # the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages=[
                {"role": "system", "content": "You are a code complexity analyzer providing detailed, educational explanations."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,  # Lower temperature for more consistent results
            response_format={"type": "json_object"}
        )
        
        # Parse the response
        content = response.choices[0].message.content
        
        # Extract JSON from response
        try:
            analysis = json.loads(content)
            return analysis
        except (json.JSONDecodeError, AttributeError) as json_err:
            print(f"Error parsing JSON from OpenAI response: {json_err}")
            return get_fallback_complexity_analysis(code, language)
            
    except Exception as e:
        print(f"Error analyzing code complexity with OpenAI: {e}")
        return get_fallback_complexity_analysis(code, language)

def get_fallback_complexity_analysis(code: str, language: str = "python") -> Dict[str, Any]:
    """
    Provide a fallback complexity analysis when OpenAI API is unavailable
    
    Args:
        code: The code to analyze
        language: The programming language
        
    Returns:
        Dict: Basic fallback analysis
    """
    # Count lines, indentation, and other basic metrics
    lines = code.strip().split('\n')
    line_count = len(lines)
    
    # Calculate indentation as a rough complexity metric
    max_indentation = 0
    for line in lines:
        if line.strip():  # Skip empty lines
            indentation = len(line) - len(line.lstrip())
            max_indentation = max(max_indentation, indentation // 4)
    
    # Basic complexity score based on lines and indentation
    complexity_score = min(10, 1 + (line_count // 10) + max_indentation)
    
    return {
        "complexity_score": complexity_score,
        "complexity_factors": ["Line count", "Indentation depth"],
        "simplification_suggestions": ["Consider breaking down long functions", "Use clear variable names"],
        "explanation": "This is a basic analysis without AI. The complexity is estimated based on line count and indentation depth.",
        "key_concepts": ["Basic programming constructs"],
        "real_world_comparison": "Like reading a recipe with multiple steps and ingredients."
    }

def get_fallback_ai_response(question: str, code: Optional[str] = None, language: str = "python", concept: str = "general") -> str:
    """
    Provides a fallback response when the OpenAI API is not available
    
    Args:
        question: The user's question
        code: The code context (optional)
        language: The programming language
        concept: The coding concept being discussed
        
    Returns:
        str: A fallback response
    """
    if "error" in question.lower() or "not working" in question.lower() or "fix" in question.lower():
        return "I see you're encountering an issue with your code. Let's troubleshoot step by step. First, check for syntax errors like missing parentheses, quotes, or indentation. Then verify your logic - are your conditions correct? For debugging, add print statements at key points to understand how your values change during execution."
    
    if "how" in question.lower() and "work" in question.lower():
        if concept == "if-else":
            return "Conditional statements work by evaluating a condition as either True or False. If the condition is True, the code in the 'if' block runs. If False, the code in the 'else' block runs. You can also add 'elif' statements for multiple conditions. This allows your program to make decisions based on different scenarios."
        elif concept == "functions":
            return "Functions in Python are defined with the 'def' keyword, followed by a name and parameters in parentheses. They encapsulate code you want to reuse. When you call a function, you provide arguments that match the parameters, and the function executes its code block. Functions can return values using the 'return' statement or None by default."
        elif concept == "loops":
            return "Loops let you execute code repeatedly. 'For' loops iterate over a sequence (like a list or range) a specific number of times. 'While' loops continue as long as a condition remains true. Use loops when you need to process items in a collection or repeat actions until a specific condition changes."
        
    if "example" in question.lower():
        if concept == "if-else":
            return "Here's an example of if-else in Python:\n\ndef check_temperature(temp):\n    if temp > 30:\n        return 'Hot'\n    elif temp > 20:\n        return 'Warm'\n    elif temp > 10:\n        return 'Cool'\n    else:\n        return 'Cold'\n\nprint(check_temperature(25))  # Prints: Warm"
        elif concept == "functions":
            return "Here's an example of a function in Python:\n\ndef calculate_discount(price, discount_rate):\n    # Calculate the final price after applying a discount\n    discount = price * discount_rate\n    final_price = price - discount\n    return final_price\n\n# Using the function\noriginal_price = 100\ndiscount_rate = 0.2  # 20% discount\nfinal_price = calculate_discount(original_price, discount_rate)\nprint(f'The final price is ${final_price}')  # Prints: The final price is $80.0"
    
    # General fallback for any other questions
    return "I'm here to help with your coding questions, but I'm currently working with limited functionality. I can provide basic guidance on common programming concepts like variables, loops, conditionals, functions, and classes. If you need more specific help, please provide code examples and clear questions about what you're trying to achieve."

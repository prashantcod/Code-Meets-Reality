import os
from openai import OpenAI

# Initialize OpenAI client
APIKEY = os.environ.get("OPENAI_API_KEY", "")
client = OpenAI(api_key=APIKEY)

def get_ai_content(topic: str):
    """
    Get AI-generated content about a coding topic.
    
    Args:
        topic: The coding topic (e.g., 'if-else', 'oops')
    
    Returns:
        dict: AI-generated content with title, description, example, etc.
    """
    # Here we would normally call OpenAI API
    # For demo purposes we return static data
    if topic == "if-else":
        return {
            "title": "If-Else Conditional Statements",
            "description": "Conditional statements allow you to execute different code blocks based on different conditions. They are fundamental building blocks in programming.",
            "example": """if condition:
    # code to execute if condition is True
else:
    # code to execute if condition is False""",
            "real_world": "<p>Used in authentication systems, form validation, and decision trees.</p>",
            "dry_run": """1. Evaluate the condition
2. If True, execute the 'if' block
3. If False, execute the 'else' block"""
        }
    elif topic == "oops":
        return {
            "title": "Object-Oriented Programming",
            "description": "OOP is a programming paradigm based on the concept of 'objects', which can contain data and code: data in the form of fields, and code in the form of procedures.",
            "example": """class Animal:
    def __init__(self, name):
        self.name = name
        
    def speak(self):
        pass
        
class Dog(Animal):
    def speak(self):
        return f"{self.name} says woof!""",
            "real_world": "<p>Used in GUI frameworks, game development, and enterprise applications.</p>",
            "dry_run": """1. Create a Dog instance with name 'Rex'
2. Call the speak() method
3. Output: 'Rex says woof!'"""
        }
    else:
        return {
            "title": "Coding Concept",
            "description": "This is a placeholder for content about this coding concept.",
            "example": "# Example code here",
            "real_world": "<p>Real-world applications go here.</p>",
            "dry_run": "Step by step execution would go here."
        }

def get_practice_problem():
    """
    Get a practice problem related to the current context.
    
    Returns:
        dict: A practice problem
    """
    return {
        "title": "Practice Challenge",
        "problem": "Write a function that checks if a given year is a leap year. A leap year is divisible by 4, but not by 100 unless it's also divisible by 400."
    }

def get_real_world_mapping(code: str):
    """
    Map beginner code to real-world code examples.
    
    Args:
        code: The user's code
        
    Returns:
        dict: Real-world code mapping
    """
    if not code or len(code.strip()) < 10:
        return {
            "title": "Real-World Code Example", 
            "description": "Write some code to see a real-world example.",
            "real_world_code": "# Write code in the editor to see a real-world example"
        }
        
    try:
        # Use OpenAI to generate a real-world example
        system_message = """You are an expert programming tutor. Given a code snippet, analyze its pattern 
        and provide a real-world professional code example that follows a similar pattern but in a 
        production context. Do not use basic examples like login systems unless the original code is 
        clearly about authentication. Be domain-specific and diverse in your examples."""
        
        user_message = f"Here's some user code:\n```\n{code}\n```\n\nProvide a real-world, professional-grade code example that follows a similar pattern or concept, but in a production context. The example should be specific and relate to the domain implied by the code (e.g., if it's data processing, show a real ETL pipeline; if it's a class, show a real business object model). DO NOT use basic login/authentication examples unless the code is specifically about that. Create a title and brief description for your example as well."
        
        response = client.chat.completions.create(
            model="gpt-4o",  # The newest OpenAI model is "gpt-4o" which was released May 13, 2024
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            response_format={"type": "json_object"},
            max_tokens=1200
        )
        
        response_text = response.choices[0].message.content
        
        # Try to parse the JSON response
        import json
        try:
            parsed = json.loads(response_text)
            # Ensure required fields exist
            if "title" not in parsed:
                parsed["title"] = "Real-World Code Example"
            if "description" not in parsed:
                parsed["description"] = "A professional implementation of a similar concept."
            if "real_world_code" not in parsed:
                # Extract code block if it exists
                import re
                code_blocks = re.findall(r'```(?:python|javascript|java)?\n(.+?)```', response_text, re.DOTALL)
                if code_blocks:
                    parsed["real_world_code"] = code_blocks[0]
                else:
                    parsed["real_world_code"] = "# No specific code example was generated"
            return parsed
        except json.JSONDecodeError:
            # If JSON parsing fails, try to extract information using regex
            import re
            title_match = re.search(r'Title:\s*(.+)', response_text)
            description_match = re.search(r'Description:\s*(.+)', response_text)
            code_blocks = re.findall(r'```(?:python|javascript|java)?\n(.+?)```', response_text, re.DOTALL)
            
            return {
                "title": title_match.group(1) if title_match else "Real-World Code Example",
                "description": description_match.group(1) if description_match else "A professional implementation of a similar concept.",
                "real_world_code": code_blocks[0] if code_blocks else "# No specific code example was generated"
            }
    except Exception as e:
        print(f"Error generating real-world example: {e}")
        # Fallback to pattern-based examples with informative description
        if "class" in code:
            return {
                "title": "E-commerce Product System",
                "description": "The object-oriented approach is commonly used in e-commerce systems for product management.",
                "real_world_code": """class Product:
    def __init__(self, id, name, price, category_id):
        self.id = id
        self.name = name
        self.price = price
        self.category_id = category_id
        self.is_active = True
        self.inventory_count = 0
        
    def apply_discount(self, percentage):
        self.price = round(self.price * (1 - percentage/100), 2)
        return self.price
        
    def restock(self, quantity):
        self.inventory_count += quantity
        if not self.is_active and self.inventory_count > 0:
            self.is_active = True"""
            }
        elif "if" in code and "else" in code:
            return {
                "title": "Data Processing Pipeline",
                "description": "Conditional logic in real-world systems is often used for data validation and processing.",
                "real_world_code": """def validate_customer_data(customer):
    validation_errors = []
    
    if not customer.get('email'):
        validation_errors.append('Email is required')
    elif not is_valid_email(customer['email']):
        validation_errors.append('Email format is invalid')
        
    if not customer.get('name'):
        validation_errors.append('Name is required')
    
    if customer.get('age') is not None:
        if not isinstance(customer['age'], int):
            validation_errors.append('Age must be a number')
        elif customer['age'] < 18:
            validation_errors.append('Customer must be at least 18 years old')
    
    return {
        'is_valid': len(validation_errors) == 0,
        'errors': validation_errors
    }"""
            }
        elif "for" in code or "while" in code:
            return {
                "title": "ETL Data Processing Pipeline",
                "description": "Loops are fundamental in data engineering for batch processing operations.",
                "real_world_code": """def process_transaction_batch(transactions):
    processed_count = 0
    failed_count = 0
    results = []
    
    for transaction in transactions:
        try:
            # Validate transaction
            if not is_valid_transaction(transaction):
                raise ValueError(f"Invalid transaction format: {transaction['id']}")
                
            # Process based on transaction type
            if transaction['type'] == 'purchase':
                result = process_purchase(transaction)
            elif transaction['type'] == 'refund':
                result = process_refund(transaction)
            elif transaction['type'] == 'adjustment':
                result = process_adjustment(transaction)
            else:
                raise ValueError(f"Unknown transaction type: {transaction['type']}")
                
            # Record success
            processed_count += 1
            results.append({
                'transaction_id': transaction['id'],
                'status': 'success',
                'result': result
            })
            
        except Exception as e:
            # Record failure
            failed_count += 1
            logger.error(f"Failed to process transaction {transaction.get('id')}: {str(e)}")
            results.append({
                'transaction_id': transaction.get('id', 'unknown'),
                'status': 'error',
                'error': str(e)
            })
    
    return {
        'processed_count': processed_count,
        'failed_count': failed_count,
        'results': results
    }"""
            }
        else:
            return {
                "title": "Weather Forecasting Service",
                "description": "Professional applications use structured organization for data processing and API integrations.",
                "real_world_code": """def get_weather_forecast(location, days=5):
    # Input validation
    if not location:
        return {
            'status': 'error',
            'message': 'Location is required'
        }
        
    try:
        # Get coordinates from location name
        coordinates = geocoding_service.get_coordinates(location)
        
        # Get weather data from external API
        weather_data = weather_api.get_forecast(
            lat=coordinates['lat'],
            lon=coordinates['lon'],
            days=days
        )
        
        # Process and format the response
        forecast = []
        for day in weather_data['daily']:
            forecast.append({
                'date': day['dt'],
                'temp_min': day['temp']['min'],
                'temp_max': day['temp']['max'],
                'humidity': day['humidity'],
                'description': day['weather'][0]['description'],
                'icon': day['weather'][0]['icon']
            })
            
        return {
            'status': 'success',
            'location': {
                'name': location,
                'lat': coordinates['lat'],
                'lon': coordinates['lon']
            },
            'forecast': forecast
        }
        
    except LocationNotFoundError:
        return {
            'status': 'error',
            'message': f'Location not found: {location}'
        }
    except Exception as e:
        logger.error(f'Error getting weather forecast: {str(e)}')
        return {
            'status': 'error',
            'message': 'Unable to retrieve weather forecast'
        }"""
            }

def get_interactive_demo(code: str):
    """
    Generate an interactive demo HTML based on code.
    Use the real-world code examples to create practical, domain-specific demos.
    
    Args:
        code: The user's code
        
    Returns:
        dict: Demo HTML with contextually relevant interactive elements
    """
    if not code or len(code.strip()) < 10:
        return {
            "demo_html": "<div style='padding:15px; text-align:center;'>Write some code to see an interactive demo based on real-world usage scenarios.</div>"
        }
    
    try:
        # First get a real-world example to base our demo on
        real_world_example = get_real_world_mapping(code)
        real_world_code = real_world_example.get("real_world_code", "")
        real_world_title = real_world_example.get("title", "Real-World Example")
        real_world_description = real_world_example.get("description", "")
        
        # Use OpenAI to generate an interactive demo based on the real-world code
        system_message = """You are an expert programmer who creates interactive UI demonstrations. 
        You'll receive a real-world code example and need to create an HTML/CSS/JavaScript demo that 
        visualizes this code in action with a practical, domain-specific implementation.
        Your demo should be self-contained, visually attractive, and actually functional when 
        inserted into a webpage. Focus on creating interactive elements that demonstrate how 
        this code would work in its intended domain-specific scenario.  Make sure to use modern UI 
        elements and a professional design."""
        
        user_message = f"Here's some user code:\n```\n{code}\n```\n\nHere's a real-world example based on this code:\n```\n{real_world_code}\n```\n\nTitle: {real_world_title}\nDescription: {real_world_description}\n\nCreate an interactive HTML/CSS/JavaScript demo that visualizes this real-world code example in action. The demo should have rich interactive elements (buttons, inputs, toggles, visualizations, etc.) that show how this code works in its specific domain. Use modern CSS for an attractive UI with proper spacing, colors, and responsive design. Keep all the HTML, CSS, and JavaScript in one block - no external dependencies. The demo should be contained in a div with appropriate styling. Focus on creating a practical, domain-specific simulation that makes the real-world application clear to users."
        
        response = client.chat.completions.create(
            model="gpt-4o",  # The newest OpenAI model is "gpt-4o" which was released May 13, 2024
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            max_tokens=1500
        )
        
        response_text = response.choices[0].message.content
        
        # Extract the HTML from the response
        import re
        html_match = re.search(r'```(?:html)?\n(.+?)```', response_text, re.DOTALL)
        
        if html_match:
            html_content = html_match.group(1)
            return {"demo_html": html_content}
        else:
            # If no code block found, use the raw response
            if "<div" in response_text and "</div>" in response_text:
                return {"demo_html": response_text}
            else:
                return {"demo_html": f"<div style='padding:15px;'>{response_text}</div>"}
    except Exception as e:
        print(f"Error generating interactive demo: {e}")
        # Fallback to pattern-based demo
        if "class" in code:
            return {
                "demo_html": """<div style="padding:20px; border:1px solid #ddd; border-radius:8px">
                    <h4>Object Creator</h4>
                    <div>
                        <div style="margin-bottom:10px;">
                            <label>Object Name:</label>
                            <input type="text" id="obj-name" value="MyObject" style="margin-left:10px;" />
                        </div>
                        <div style="margin-bottom:10px;">
                            <label>Property Name:</label>
                            <input type="text" id="obj-prop" value="value" style="margin-left:10px;" />
                        </div>
                        <div style="margin-bottom:10px;">
                            <label>Property Value:</label>
                            <input type="text" id="obj-val" value="true" style="margin-left:10px;" />
                        </div>
                        <button onclick="createObject()" style="padding:8px 16px; background:#4a6bdf; color:white; border:none; border-radius:4px;">Create Object</button>
                    </div>
                    <div id="obj-result" style="margin-top:15px; padding:10px; background:#f5f5f5; border-radius:4px; font-family:monospace;">
                        Object will appear here
                    </div>
                    <script>
                        function createObject() {
                            const name = document.getElementById('obj-name').value || 'MyObject';
                            const prop = document.getElementById('obj-prop').value || 'value';
                            const val = document.getElementById('obj-val').value || 'true';
                            const resultEl = document.getElementById('obj-result');
                            
                            resultEl.innerHTML = `const ${name} = {<br>    ${prop}: ${val},<br>    created: "${new Date().toISOString()}",<br>    toString() { return "${name} object"; }<br>}`;
                        }
                    </script>
                </div>"""
            }
        elif "if" in code and "else" in code:
            return {
                "demo_html": """<div style="padding:20px; border:1px solid #ddd; border-radius:8px">
                    <h4>Conditional Flow Simulator</h4>
                    <div>
                        <label>Input value:</label>
                        <input type="text" id="simple-input" placeholder="Enter a value" style="margin-left:10px;" />
                        <button onclick="runSimpleCondition()" style="margin-left:10px; padding:5px 10px; background:#4a6bdf; color:white; border:none; border-radius:4px;">Test</button>
                    </div>
                    <div id="simple-result" style="margin-top:15px; padding:10px; background:#f5f5f5; border-radius:4px;">
                        Enter a value and click Test
                    </div>
                    <script>
                        function runSimpleCondition() {
                            const input = document.getElementById('simple-input').value;
                            const resultEl = document.getElementById('simple-result');
                            
                            if (!input) {
                                resultEl.innerHTML = '<span style="color:red;">Please enter a value!</span>';
                            } else if (isNaN(input)) {
                                resultEl.innerHTML = `<span style="color:blue;">"${input}" is text - entered branch 1</span>`;
                            } else if (Number(input) > 10) {
                                resultEl.innerHTML = `<span style="color:green;">${input} is greater than 10 - entered branch 2</span>`;
                            } else {
                                resultEl.innerHTML = `<span style="color:orange;">${input} is a number <= 10 - entered branch 3</span>`;
                            }
                        }
                    </script>
                </div>"""
            }
        elif "for" in code or "while" in code:
            return {
                "demo_html": """<div style="padding:20px; border:1px solid #ddd; border-radius:8px">
                    <h4>Loop Visualizer</h4>
                    <div>
                        <div style="margin-bottom:10px;">
                            <label>Number of iterations:</label>
                            <input type="number" id="loop-count" min="1" max="20" value="5" style="margin-left:10px; width:60px;" />
                        </div>
                        <div style="margin-bottom:10px;">
                            <label>Loop type:</label>
                            <select id="loop-type" style="margin-left:10px;">
                                <option value="for">For Loop</option>
                                <option value="while">While Loop</option>
                            </select>
                        </div>
                        <button onclick="visualizeLoop()" style="padding:5px 10px; background:#4a6bdf; color:white; border:none; border-radius:4px;">Run Loop</button>
                    </div>
                    <div id="loop-visualization" style="margin-top:15px; padding:10px; background:#f5f5f5; border-radius:4px;">
                        Configure and run the loop
                    </div>
                    <script>
                        function visualizeLoop() {
                            const count = parseInt(document.getElementById('loop-count').value) || 5;
                            const type = document.getElementById('loop-type').value;
                            const visualEl = document.getElementById('loop-visualization');
                            
                            visualEl.innerHTML = `<div style="font-family:monospace; margin-bottom:10px;">${type === 'for' ? 
                                `for (let i = 0; i < ${count}; i++) {<br>    // Loop body<br>}` : 
                                `let i = 0;<br>while (i < ${count}) {<br>    // Loop body<br>    i++;<br>}`
                            }</div><div>Execution:</div>`;
                            
                            // Simulate loop execution with delays
                            let i = 0;
                            const interval = setInterval(() => {
                                visualEl.innerHTML += `<div>Iteration ${i}: Processing item ${i}</div>`;
                                i++;
                                if (i >= count) {
                                    clearInterval(interval);
                                    visualEl.innerHTML += `<div style="margin-top:10px;">Loop completed after ${count} iterations</div>`;
                                }
                            }, 500);
                        }
                    </script>
                </div>"""
            }
        else:
            return {
                "demo_html": """<div style="padding:20px; border:1px solid #ddd; border-radius:8px">
                    <h4>Code Execution Simulator</h4>
                    <div style="margin-bottom:15px;">
                        <p>This interactive demo simulates the execution of your code.</p>
                    </div>
                    <div style="display:flex; margin-bottom:15px;">
                        <div style="flex:1; margin-right:10px;">
                            <label>Input 1:</label>
                            <input type="text" id="input1" value="Test" style="display:block; margin-top:5px; width:100%;" />
                        </div>
                        <div style="flex:1;">
                            <label>Input 2:</label>
                            <input type="number" id="input2" value="42" style="display:block; margin-top:5px; width:100%;" />
                        </div>
                    </div>
                    <button onclick="processInputs()" style="padding:8px 16px; background:#4a6bdf; color:white; border:none; border-radius:4px;">Process</button>
                    <div id="generic-result" style="margin-top:15px; padding:10px; background:#f5f5f5; border-radius:4px;">
                        Results will appear here
                    </div>
                    <script>
                        function processInputs() {
                            const input1 = document.getElementById('input1').value;
                            const input2 = parseInt(document.getElementById('input2').value);
                            const resultEl = document.getElementById('generic-result');
                            
                            // Simulate processing
                            resultEl.innerHTML = '<div>Processing...</div>';
                            
                            setTimeout(() => {
                                resultEl.innerHTML = `
                                    <div style="margin-bottom:10px;"><strong>Input Processing Results:</strong></div>
                                    <div>Text Input: "${input1}" (${input1.length} characters)</div>
                                    <div>Number Input: ${input2} (${input2 % 2 === 0 ? 'even' : 'odd'} number)</div>
                                    <div style="margin-top:10px;">Combined Result: "${input1}-${input2}"</div>
                                    <div>Timestamp: ${new Date().toLocaleTimeString()}</div>
                                `;
                            }, 1000);
                        }
                    </script>
                </div>"""
            }

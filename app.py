from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
import os

from code_executor import execute_python_code, execute_javascript_code, execute_java_code
from ai_service import get_ai_response, get_concept_context, get_ai_content, get_practice_problem, get_real_world_mapping, get_interactive_demo, check_openai_api_key, get_concept_examples, analyze_code_complexity

# Check for OpenAI API key and log status
openai_api_key = os.environ.get("OPENAI_API_KEY")
if openai_api_key:
    print("OpenAI API key is configured and available")
else:
    print("WARNING: OpenAI API key is not configured. AI features will use fallback responses.")

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# Data models
class CodeExecutionRequest(BaseModel):
    code: str
    language: str

class AIAssistantRequest(BaseModel):
    question: str
    code: Optional[str] = None
    language: Optional[str] = "python"
    concept: Optional[str] = "general"

class CodeComplexityRequest(BaseModel):
    code: str
    language: Optional[str] = "python"
    
class APIStatusRequest(BaseModel):
    api_key: Optional[str] = None

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/execute")
async def execute_code(request: CodeExecutionRequest):
    if request.language.lower() == "python":
        result = execute_python_code(request.code)
    elif request.language.lower() == "javascript":
        result = execute_javascript_code(request.code)
    elif request.language.lower() == "java":
        result = execute_java_code(request.code)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported language: {request.language}")
    
    return result

@app.post("/api/realworld")
async def get_real_world_example(request: Request):
    data = await request.json()
    code = data.get("code", "")
    language = data.get("language", "python")
    concept = data.get("concept", "general")
    
    print(f"Received real-world code request. Code length: {len(code)}, Language: {language}, Concept: {concept}")
    
    try:
        result = get_real_world_mapping(code)
        print(f"Successfully generated real-world example with title: {result.get('title', 'Unknown')}")
        return result
    except Exception as e:
        print(f"Error in get_real_world_example: {e}")
        # Return appropriate fallback based on code pattern
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

@app.post("/api/realworld/demo")
async def get_interactive_demo_example(request: Request):
    data = await request.json()
    code = data.get("code", "")
    language = data.get("language", "python")
    concept = data.get("concept", "general")
    
    try:
        return get_interactive_demo(code)
    except Exception as e:
        print(f"Error in get_interactive_demo_example: {e}")
        # Return appropriate fallback based on code pattern
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
                        <button onclick="createSimpleObject()" style="padding:8px 16px; background:#4a6bdf; color:white; border:none; border-radius:4px;">Create Object</button>
                    </div>
                    <div id="obj-result" style="margin-top:15px; padding:10px; background:#f5f5f5; border-radius:4px; font-family:monospace;">
                        Object will appear here
                    </div>
                    <script>
                        function createSimpleObject() {
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
                                resultEl.innerHTML = `<span style="color:blue;">${input} is text - entered branch 1</span>`;
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

@app.get("/api/ai/{topic}")
async def get_ai_topic_content(topic: str):
    return get_ai_content(topic)

@app.get("/api/practice")
async def get_practice_problems():
    # Get practice problems based on current concept/language
    return {
        "problems": [
            {
                "title": "Sum of Two Numbers",
                "description": "Write a function called `add_numbers` that takes two parameters and returns their sum.",
                "difficulty": "Easy",
                "starter_code": "def add_numbers(a, b):\n    # Your code here\n    pass\n\n# Test your function\nprint(add_numbers(5, 3))  # Should output 8"
            },
            {
                "title": "Fibonacci Sequence",
                "description": "Write a function called `fibonacci` that takes a number n as parameter and returns the nth Fibonacci number. Remember that the Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding ones.",
                "difficulty": "Medium",
                "starter_code": "def fibonacci(n):\n    # Your code here\n    pass\n\n# Test your function\nprint(fibonacci(6))  # Should output 8"
            },
            {
                "title": "Reverse a String",
                "description": "Write a function called `reverse_string` that takes a string as parameter and returns the reversed string.",
                "difficulty": "Easy",
                "starter_code": "def reverse_string(s):\n    # Your code here\n    pass\n\n# Test your function\nprint(reverse_string('hello'))  # Should output 'olleh'"
            }
        ]
    }

@app.get("/api/ai/practice")
async def get_practice_problem_api():
    return get_practice_problem()

@app.get("/api/history")
async def get_history_api():
    # For MVP, return empty history
    return {"history": []}

@app.post("/api/ask")
async def ask_ai(request: AIAssistantRequest):
    try:
        # Log the request
        print(f"AI Assistant Request - Question: {request.question[:50]}...")
        if request.code:
            print(f"Code context provided: {len(request.code)} characters")
            
        # Get response with fallback mechanisms in place
        response = get_ai_response(
            question=request.question,
            code=request.code,
            language=request.language or "python",  # Default to Python if None
            concept=request.concept or "general"    # Default to general if None
        )
        
        # Log success
        print(f"AI response generated successfully: {len(response)} characters")
        
        return {
            "response": response,
            "status": "success"
        }
    except Exception as e:
        # Log error
        print(f"Error in AI Assistant: {str(e)}")
        
        # Return error response with fallback content
        return {
            "response": "I'm sorry, I'm having trouble processing your question right now. Please try again later or ask a different question.",
            "status": "error",
            "error": str(e)
        }

@app.get("/api/concept/{concept}")
async def get_concept(concept: str):
    """
    Get detailed information about a programming concept using AI
    
    This endpoint uses OpenAI to generate contextual information about
    programming concepts for the Learning Path feature
    """
    print(f"Getting AI concept information for: {concept}")
    
    # First, get the static context as a fallback
    static_context = get_concept_context(concept)
    
    # Try to get AI-generated content for the concept
    try:
        if check_openai_api_key():
            # Get AI content for this concept
            ai_content = get_ai_content(concept)
            
            # Return the AI-generated content
            return {
                "title": ai_content.get("title", concept.capitalize()),
                "description": ai_content.get("description", static_context),
                "example": ai_content.get("example", "# Example will appear here"),
                "real_world": ai_content.get("real_world", "Used in various software applications.")
            }
        else:
            print("OpenAI API key not available, using static concept content")
    except Exception as e:
        print(f"Error getting AI content for concept {concept}: {str(e)}")
        
    # Fallback to static content if AI generation fails
    return {
        "title": concept.replace("-", " ").capitalize(),
        "description": static_context,
        "example": f"# {concept.capitalize()} example\ndef example():\n    pass",
        "real_world": f"The {concept} concept is widely used in software development."
    }
    
@app.get("/api/concept-examples/{concept}")
async def get_concept_examples_endpoint(concept: str, language: str = "python"):
    """Get AI-generated examples for a specific concept"""
    print(f"Getting AI-generated examples for concept: {concept}, language: {language}")
    try:
        result = get_concept_examples(concept, language)
        
        # For backward compatibility, add code_examples field if it doesn't exist
        if 'code' in result and 'code_examples' not in result:
            result['code_examples'] = result['code']
            
        print(f"Successfully generated concept examples. Keys: {list(result.keys())}")
        return result
    except Exception as e:
        print(f"Error generating concept examples: {e}")
        # Return both formats for maximum compatibility
        return {
            "title": f"{concept.capitalize()} in {language.capitalize()}",
            "description": "Sorry, there was an error generating examples for this concept.",
            "code": "# No examples available at this time",
            "code_examples": "# No examples available at this time",
            "explanation": "Please try again later or select a different concept."
        }

@app.post("/api/analyze-complexity")
async def analyze_code_complexity_endpoint(request: CodeComplexityRequest):
    """
    Analyze code complexity using AI and provide explanations
    """
    try:
        # Default to 'python' if language is None
        language = request.language or 'python'
        print(f"Analyzing code complexity. Language: {language}")
        result = analyze_code_complexity(request.code, language)
        return result
    except Exception as e:
        print(f"Error analyzing code complexity: {str(e)}")
        return {
            "status": "error",
            "message": f"Error analyzing code complexity: {str(e)}"
        }

@app.post("/api/check-openai-status")
async def check_openai_status(request: APIStatusRequest):
    try:
        # If API key is provided in the request, use it
        if request.api_key:
            # Temporarily override environment variable
            import os
            original_key = os.environ.get("OPENAI_API_KEY")
            os.environ["OPENAI_API_KEY"] = request.api_key
            
            # Check API key and reset
            is_valid = check_openai_api_key()
            
            # Restore original key if there was one
            if original_key:
                os.environ["OPENAI_API_KEY"] = original_key
            else:
                del os.environ["OPENAI_API_KEY"]
        else:
            # Use the key from environment
            is_valid = check_openai_api_key()
        
        if is_valid:
            return {
                "status": "ok",
                "message": "OpenAI API key is valid"
            }
        else:
            return {
                "status": "error",
                "message": "OpenAI API key is invalid or missing"
            }
    except Exception as e:
        print(f"Error checking OpenAI API status: {str(e)}")
        return {
            "status": "error",
            "message": f"Error checking API status: {str(e)}"
        }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
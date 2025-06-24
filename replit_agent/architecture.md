# Architecture Overview

## 1. Overview

Code Meets Reality is an interactive learning platform designed to help beginners understand coding concepts by connecting them to real-world applications. The platform features a 3-panel view that shows code, real-world examples, and visual output simultaneously, supported by AI assistance.

### Key Features
- Interactive code editor with syntax highlighting
- Real-world code mapping to see practical applications
- Visual execution and interactive demos
- AI-powered assistance and explanations
- Practice problems and reference materials

## 2. System Architecture

The application follows a client-server architecture with a clear separation between frontend and backend components.

### Technology Stack
- **Frontend**: JavaScript, HTML, CSS
- **Backend**: Python, FastAPI
- **AI Integration**: OpenAI API

### High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐    ┌───────────────────┐
│                 │     │                 │    │                   │
│    Frontend     │◄────┤   FastAPI       │◄───┤   AI Services     │
│    (Browser)    │     │   Backend       │    │   (OpenAI)        │
│                 │─────►                 │───►│                   │
└─────────────────┘     └─────────────────┘    └───────────────────┘
                              │
                              │
                              ▼
                        ┌─────────────────┐
                        │  Code Execution │
                        │  Environment    │
                        └─────────────────┘
```

## 3. Key Components

### Frontend Components

The frontend is organized into modular components that handle different aspects of the user interface:

1. **Sidebar** (`static/js/components/Sidebar.js`)
   - Provides navigation for different coding concepts and tools
   - Toggles between different learning paths and references

2. **Code Editor** (`static/js/components/CodeEditor.js`)
   - Offers a syntax-highlighted code editing environment
   - Supports multiple programming languages

3. **Real-World Code** (`static/js/components/RealWorldCode.js`)
   - Displays practical applications of coding concepts
   - Updates dynamically based on user's code

4. **Interactive Demo** (`static/js/components/InteractiveDemo.js`)
   - Provides visual representations of code execution
   - Demonstrates real-world use cases

5. **Practice Area** (`static/js/components/PracticeArea.js`)
   - Offers coding challenges related to the current concept
   - Provides feedback on solutions

6. **Console Output** (`static/js/components/ConsoleOutput.js`)
   - Displays code execution results
   - Shows errors and warnings

7. **Helpline** (`static/js/components/Helpline.js`)
   - AI-powered assistant for answering coding questions
   - Provides contextual help

8. **Popup Canvas** (`static/js/components/PopupCanvas.js`)
   - Modal interface for additional content
   - Used for reference materials and other supplementary information

### Backend Components

The backend is organized using FastAPI's router pattern, separating concerns into distinct modules:

1. **API Routes**
   - `routers/ai.py`: Handles AI-related endpoints for content and practice problems
   - `routers/code_runner.py`: Manages code execution requests
   - `routers/real_world.py`: Provides real-world mappings and demos
   - `routers/history.py`: Manages user history
   - `routers/debugger.py`: Handles debugging logs

2. **Services**
   - `services/ai_service.py`: Integrates with OpenAI for AI-assisted content
   - `services/code_service.py`: Executes code in a safe environment
   - `services/debugger_service.py`: Logging and debugging utilities

3. **Core Application**
   - `main.py`: Main entry point that sets up the FastAPI application
   - `app.py`: Legacy entry point with direct route definitions

4. **Code Execution Environment**
   - `code_executor.py`: Handles secure code execution with error handling

## 4. Data Flow

### Code Execution Flow

1. User writes code in the Code Editor component
2. User clicks "Run Code" button
3. Frontend sends code to `/api/code/run` endpoint via AJAX
4. Backend's `code_runner.py` processes the request
5. `code_service.py` executes the code in a controlled environment
6. Execution results are returned to the frontend
7. Console Output component displays the results

### AI Assistance Flow

1. User asks a question using the Helpline component
2. Question is sent to `/api/ai` endpoint
3. `ai_service.py` processes the request
4. If OpenAI API is available, it generates a response
5. If not, fallback responses are used
6. The answer is returned to the frontend
7. Helpline component displays the answer

### Real-World Mapping Flow

1. User runs code or selects a concept
2. Frontend sends code to `/api/realworld` endpoint
3. `real_world.py` router handles the request
4. AI service analyzes the code and finds real-world applications
5. Results are returned to the frontend
6. Real-World Code component displays the mapping

## 5. External Dependencies

### Frontend Dependencies
- **Feather Icons**: Lightweight icon library
- **Highlight.js**: Syntax highlighting
- **CodeMirror**: Code editor library

### Backend Dependencies
- **FastAPI**: Web framework for building APIs
- **Uvicorn**: ASGI server
- **Jinja2**: Template engine
- **OpenAI**: AI integration

## 6. Deployment Strategy

The application is configured for deployment with the following considerations:

### Deployment Configuration
- `pyproject.toml`: Defines project metadata and dependencies
- `.replit`: Configuration for Replit deployment
- Port configuration: Internal port 5000 mapped to external port 80

### Running the Application
- Development: `uvicorn app:app --host 0.0.0.0 --port 5000 --reload`
- Production: `python app.py`

### Environment Variables
- `OPENAI_API_KEY`: Required for AI integration

### Containerization
The application appears to be designed to run in a containerized environment, with deployment configuration suitable for cloud platforms.

## 7. Future Architecture Considerations

### Scalability
- Implement caching for AI responses to reduce API calls
- Add database integration for user data persistence
- Improve code execution environment with containerization

### Security
- Enhance code execution environment to prevent malicious code execution
- Implement proper authentication and authorization mechanisms
- Add rate limiting for API endpoints

### Performance
- Optimize frontend assets with bundling and minification
- Implement server-side rendering for improved initial load time
- Add caching mechanisms for frequently accessed content
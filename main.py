from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
from routers import ai, code_runner, real_world, history, debugger, auth

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

# Include routers
app.include_router(ai.router, prefix="/api/ai")
app.include_router(code_runner.router, prefix="/api/code")
app.include_router(real_world.router, prefix="/api/realworld")
app.include_router(history.router, prefix="/api/history")
app.include_router(debugger.router, prefix="/api/debugger")
app.include_router(auth.router, prefix="/auth")

# Root route
@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse("new_index.html", {"request": request})

# Run the server
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
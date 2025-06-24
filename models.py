from pydantic import BaseModel

class CodeRequest(BaseModel):
    code: str

class AIContentResponse(BaseModel):
    title: str
    description: str
    example: str
    real_world: str
    dry_run: str

class PracticeProblemResponse(BaseModel):
    title: str
    problem: str
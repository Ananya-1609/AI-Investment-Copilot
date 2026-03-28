from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal
from orchestrator import run_agents

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Query(BaseModel):
    query: str = Field(..., min_length=1)
    mode: Literal["conservative", "balanced", "aggressive"] = "balanced"


@app.post("/analyze")
def analyze(q: Query):
    return run_agents(q.query, q.mode)
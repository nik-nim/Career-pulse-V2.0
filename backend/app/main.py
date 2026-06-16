from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import engine, Base
from app.api.v1 import auth, jobs, match, ai, profile

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="CareerPulse", version="2.0", lifespan=lifespan)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router, prefix="/api/v1")
app.include_router(jobs.router, prefix="/api/v1")
app.include_router(match.router, prefix="/api/v1")
app.include_router(ai.router, prefix="/api/v1")
app.include_router(profile.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"status": "running", "docs": "/docs"}
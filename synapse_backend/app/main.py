from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.router import router as tasks_router
from app.db.database import init_db
from app.router_auth import router as auth_router
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    print("🚀 База Synapse синхронизирована (версия без ролей)")
    yield

app = FastAPI(
    title="Synapse Kanban API",
    version="2.0.0",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)   
app.include_router(tasks_router)  

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Synapse API is running smoothly",
        "mode": "standard_no_roles"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

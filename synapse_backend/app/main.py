from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.router import router as tasks_router
# Импорты твоих модулей
from app.db.database import init_db
from app.router_auth import router as auth_router
from app.router import router as tasks_router
# Если ты пока не используешь список пользователей, router_users можно закомментировать
# from app.router import router_users 

@asynccontextmanager
async def lifespan(app: FastAPI):
    # При запуске создаем таблицы (дедлайны, задачи и т.д.)
    await init_db()
    print("🚀 База Synapse синхронизирована (версия без ролей)")
    yield

app = FastAPI(
    title="Synapse Kanban API",
    version="2.0.0",
    lifespan=lifespan
)

# Настройка CORS — это критически важно для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Разрешаем запросы с любого адреса (для разработки)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(auth_router)   # /auth/login и /auth/register
app.include_router(tasks_router)  # /tasks (наши основные CRUD операции)

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Synapse API is running smoothly",
        "mode": "standard_no_roles"
    }
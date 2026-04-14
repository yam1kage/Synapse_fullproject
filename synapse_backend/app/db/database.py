import os
from typing import Optional, List, AsyncGenerator
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from sqlalchemy import text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Создаем движок для работы с базой
engine = create_async_engine(DATABASE_URL, echo=True)

# Фабрика сессий для запросов
async_session = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# --- МОДЕЛИ ДАННЫХ ---

class User(SQLModel, table=True):
    __tablename__ = "users" # Имя таблицы в базе данных
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False)
    hashed_password: str = Field(nullable=False)
    username: Optional[str] = Field(default=None, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Связь: один пользователь может иметь много задач
    # back_populates указывает на имя поля в классе Task
    tasks: List["Task"] = Relationship(back_populates="owner")

class Task(SQLModel, table=True):
    __tablename__ = "task" # Можно оставить так или изменить на "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(nullable=False)
    description: Optional[str] = None
    status: str = Field(default="todo")
    priority: str = Field(default="medium")
    deadline: Optional[str] = Field(default=None, nullable=True)

    # Внешний ключ: ссылается на id в таблице users
    owner_id: int = Field(foreign_key="users.id", nullable=False)
    
    # СВЯЗЬ: указываем на владельца задачи
    # back_populates указывает на имя поля в классе User
    owner: Optional[User] = Relationship(back_populates="tasks")

# --- ФУНКЦИИ ИНИЦИАЛИЗАЦИИ ---

# --- ФУНКЦИИ ИНИЦИАЛИЗАЦИИ ---

async def init_db():
    async with engine.begin() as conn:
        # УБРАЛИ: DROP TABLE IF EXISTS...
        
        # SQLModel.metadata.create_all создаст таблицы, только если их нет в базе.
        # Если таблицы уже существуют, он их просто пропустит и данные сохранятся.
        await conn.run_sync(SQLModel.metadata.create_all)
        
    print("✅ База данных SYNAPSE готова (существующие данные сохранены).")

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
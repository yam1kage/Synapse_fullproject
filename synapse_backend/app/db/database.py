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


engine = create_async_engine(DATABASE_URL, echo=True)


async_session = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)



class User(SQLModel, table=True):
    __tablename__ = "users" 
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False)
    hashed_password: str = Field(nullable=False)
    username: Optional[str] = Field(default=None, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

  
    
    tasks: List["Task"] = Relationship(back_populates="owner")

class Task(SQLModel, table=True):
    __tablename__ = "task" 
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(nullable=False)
    description: Optional[str] = None
    status: str = Field(default="todo")
    priority: str = Field(default="medium")
    deadline: Optional[str] = Field(default=None, nullable=True)


    owner_id: int = Field(foreign_key="users.id", nullable=False)
    
  
    owner: Optional[User] = Relationship(back_populates="tasks")



async def init_db():
    async with engine.begin() as conn:
      
        
       
        await conn.run_sync(SQLModel.metadata.create_all)
        
    print("✅ База данных SYNAPSE готова (существующие данные сохранены).")

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
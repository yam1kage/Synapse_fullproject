from sqlalchemy import select, delete
from app.db.database import Task, User, async_session
from app.schemas import STaskAdd, STaskUpdate
from typing import List, Optional

class TaskRepository:
    @classmethod
    async def add_one(cls, data: STaskAdd, owner_email: str) -> Optional[Task]:
        async with async_session() as session:
           
            user_query = select(User).where(User.email == owner_email)
            result = await session.execute(user_query)
            user = result.scalar_one_or_none()
            
            if not user:
                return None 
            task_dict = data.model_dump()
            db_task = Task(**task_dict, owner_id=user.id)
            
            session.add(db_task)
            await session.commit()
            await session.refresh(db_task)
            return db_task

    @classmethod
    async def find_all(cls, user_email: str) -> List[Task]:
        async with async_session() as session:
            user_query = select(User).where(User.email == user_email)
            user_res = await session.execute(user_query)
            user = user_res.scalar_one_or_none()
            
            if not user:
                return []

            query = select(Task).where(Task.owner_id == user.id)
            result = await session.execute(query)
            return list(result.scalars().all())

    @classmethod
    async def update_task(cls, task_id: int, task_data: STaskUpdate, user_email: str) -> bool:
    
        async with async_session() as session:
            user_stmt = select(User).where(User.email == user_email)
            user_res = await session.execute(user_stmt)
            user = user_res.scalar_one_or_none()
            
            if not user:
                return False

            stmt = select(Task).where(Task.id == task_id, Task.owner_id == user.id)
            result = await session.execute(stmt)
            task = result.scalars().first()

            if not task:
                return False
            update_dict = task_data.model_dump(exclude_unset=True)

            for key, value in update_dict.items():
                setattr(task, key, value)

            await session.commit()
            return True

    @classmethod
    async def delete_task(cls, task_id: int, user_email: str) -> bool:
    
        async with async_session() as session:
            user_query = select(User).where(User.email == user_email)
            user_res = await session.execute(user_query)
            user = user_res.scalar_one_or_none()

            if not user: 
                return False

            
            query = delete(Task).where(
                Task.id == task_id, 
                Task.owner_id == user.id
            )
            result = await session.execute(query)
            await session.commit()
            
            return result.rowcount > 0
from typing import Optional
from pydantic import BaseModel, ConfigDict


class STaskAdd(BaseModel):
    name: str
    description: Optional[str] = None
    status: Optional[str] = "todo"
    priority: Optional[str] = "medium"
    deadline: Optional[str] = None


class STaskUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    deadline: Optional[str] = None


class STask(STaskAdd):
    id: int
    owner_id: int
    model_config = ConfigDict(from_attributes=True)
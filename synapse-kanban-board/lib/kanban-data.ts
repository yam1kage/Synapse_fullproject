export type Priority = "low" | "medium" | "high"

export type Status = "todo" | "in-progress" | "done"

export interface Task {
  id: string | number; 
  name: string;        
  description: string;
  status: Status;      
  priority: Priority;
  deadline?: string; 
  assigned_to?: string | null; 
}


export const columnConfig = {

  todo: {
    title: "В планах",
    color: "hsl(240 5% 55%)",
  },
  "in-progress": {
    title: "В работе",
    color: "hsl(250 80% 65%)",
  },
  done: {
    title: "Готово",
    color: "hsl(142 71% 45%)",
  },
} as const


export const initialTasks: Task[] = [
  {
    id: "SYN-101",
    name: "Настроить CI/CD пайплайн", 
    description: "Автоматизировать сборку и деплой через GitHub Actions",
    priority: "high",
    status: "todo", 
  },
  {
    id: "SYN-104",
    name: "Оптимизация запросов к БД",
    description: "Добавить индексы и кэширование",
    priority: "high",
    status: "in-progress",
  },
]
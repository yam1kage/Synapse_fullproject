"use client"

import { Plus } from "lucide-react"
import type { Task, Status } from "@/lib/kanban-data"
import { columnConfig } from "@/lib/kanban-data"
import { TaskCard } from "./task-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence } from "framer-motion"

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
  onStatusChange: (id: string, newStatus: Status) => void;
  onEditTask?: (task: any) => void; 
}

export function KanbanColumn({ status, tasks, onAddTask, onDeleteTask, onStatusChange }: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false)


  const config = columnConfig[status as keyof typeof columnConfig] || {
    title: status === "todo" ? "В планах" : status === "done" ? "Готово" : status,
    color: "#3b82f6", 
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) onStatusChange(taskId, status);
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex min-w-[320px] flex-1 flex-col rounded-2xl p-2 transition-all duration-300",
        isOver ? "bg-primary/5 ring-2 ring-primary/20 shadow-inner" : "bg-transparent"
      )}
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: config.color }} // Теперь config точно не undefined
          />
          <h2 className="text-sm font-medium text-foreground">{config.title}</h2>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-md bg-secondary px-1.5 text-xs font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
       
        <button
          type="button"
          onClick={onAddTask} 
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-3 pb-4 pr-1 min-h-[150px]">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <div className={cn(
                "flex items-center justify-center rounded-xl border border-dashed border-border/40 p-8 transition-opacity",
                isOver ? "opacity-100" : "opacity-40"
            )}>
              <p className="text-center text-xs text-muted-foreground">
                Перетащите задачу сюда
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
"use client"

import { Pencil, Trash2, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/api"
import { cn } from "@/lib/utils"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}



function statusVariant(status: string) {
  const s = status.toLowerCase()
  if (s === "done") return "default"
  if (s === "in-progress" || s === "in progress") return "secondary"
  return "outline"
}

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "done":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/25 hover:bg-emerald-500/20"
    case "in progress":
    case "in-progress":
      return "bg-amber-500/15 text-amber-500 border-amber-500/25 hover:bg-amber-500/20"
    case "planned":
      return "bg-blue-500/15 text-blue-400 border-blue-500/25 hover:bg-blue-500/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

function priorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-500/15 text-red-400 border-red-500/25"
    case "medium":
      return "bg-blue-500/15 text-blue-400 border-blue-500/25"
    default:
      return "bg-secondary text-secondary-foreground border-border"
  }
}



export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center bg-card/30">
        <p className="text-muted-foreground">Задач пока нет.</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Создайте новую задачу, чтобы начать работу.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
    
      <div className="hidden md:grid md:grid-cols-[1.5fr_1.5fr_120px_120px_120px_100px] items-center gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
        <span>Название</span>
        <span>Описание</span>
        <span>Дедлайн</span>
        <span>Статус</span>
        <span>Приоритет</span>
        <span className="text-right">Действия</span>
      </div>


      {tasks.map((task) => {
        const isOverdue = task.deadline && new Date(task.deadline) < new Date();

        return (
          <div
            key={task.id}
            className="group grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr_120px_120px_120px_100px] items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20 md:px-4 md:py-3"
          >
            {/* Title & ID */}
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-foreground truncate" title={task.name}>
                {task.name}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-tighter">
                ID: {task.id}
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-1" title={task.description}>
              {task.description || "—"}
            </p>

     
            <div className="flex items-center gap-2">
              <Calendar className={cn("h-3.5 w-3.5", isOverdue ? "text-red-500" : "text-muted-foreground/50")} />
              <span className={cn(
                "text-xs font-medium",
                isOverdue ? "text-red-500 font-bold" : "text-muted-foreground"
              )}>
                {task.deadline ? new Date(task.deadline).toLocaleDateString('ru-RU') : "—"}
              </span>
            </div>

            <div className="flex md:block">
              <Badge
                variant={statusVariant(task.status) as any}
                className={`${statusColor(task.status)} capitalize px-2.5 py-0.5 text-[11px] font-bold`}
              >
                {task.status.replace("-", " ")}
              </Badge>
            </div>

        
            <div className="flex md:block">
              <Badge 
                variant="outline" 
                className={`${priorityColor(task.priority)} capitalize px-2.5 py-0.5 text-[11px] font-bold`}
              >
                {task.priority}
              </Badge>
            </div>

       
            <div className="flex items-center justify-start md:justify-end gap-2 border-t border-border/50 pt-3 md:border-none md:pt-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                onClick={() => onEdit(task)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
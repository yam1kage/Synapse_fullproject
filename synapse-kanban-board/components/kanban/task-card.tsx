"use client"

import { GripVertical, MoreHorizontal, Trash2, Calendar } from "lucide-react" 
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const priorityConfig: any = {
  low: { label: "Низкий", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  medium: { label: "Средний", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  high: { label: "Высокий", className: "bg-red-500/10 text-red-400 border-red-500/20" },
}

export function TaskCard({ task, onDelete }: { task: any; onDelete?: (id: string) => void }) {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  // Логика проверки просрочки
  const isOverdue = task.deadline && new Date(task.deadline) < new Date();

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('ru-RU');
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <motion.div
      layout
      draggable
      onDragStart={(e: any) => {
        e.dataTransfer.setData("taskId", String(task.id));
      }}
      className={cn(
        "group relative cursor-grab rounded-xl border border-border/60 bg-card p-4 transition-all duration-200",
        "hover:border-primary/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
      )}
    >
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground">ID-{task.id}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-accent">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDelete?.(task.id)} className="text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30" />
          </div>
        </div>

        <h3 className="mb-1 text-sm font-semibold text-foreground">
          {task.name || task.title}
        </h3>

        {task.description && (
          <p className="mb-4 line-clamp-2 text-xs text-muted-foreground">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5">
            <Calendar className={cn("h-3 w-3", isOverdue ? "text-red-500" : "text-muted-foreground")} />
            <span className={cn(
              "text-[10px] font-medium",
              isOverdue ? "text-red-500 font-bold" : "text-muted-foreground"
            )}>
              {task.deadline ? formatDate(task.deadline) : "Без срока"}
            </span>
          </div>

          <div className={cn("rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase", priority.className)}>
            {priority.label}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
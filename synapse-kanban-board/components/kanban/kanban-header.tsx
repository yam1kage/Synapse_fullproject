"use client"

import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KanbanHeaderProps {
  taskCount: number
  onNewTask: () => void
}

export function KanbanHeader({ taskCount, onNewTask }: KanbanHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-4">
        <h1 className="font-mono text-lg font-bold tracking-widest text-foreground">
          SYNAPSE
        </h1>
        <div className="h-5 w-px bg-border" />
        <span className="text-sm text-muted-foreground">
          {taskCount} {taskCount === 1 ? "задача" : "задач"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-64 items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск задач.."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <Button
          onClick={onNewTask}
          className="gap-2 bg-gradient-to-r from-[hsl(250,80%,65%)] to-[hsl(210,80%,55%)] text-foreground shadow-lg shadow-[hsl(250,80%,65%)]/20 transition-all duration-200 hover:shadow-[hsl(250,80%,65%)]/30 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Новая задача
        </Button>
      </div>
    </header>
  )
}

"use client"

import { Plus, LogOut, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { logout } from "@/lib/api"

interface DashboardHeaderProps {
  search: string
  onSearchChange: (val: string) => void
  onAddTask: () => void
}

export function DashboardHeader({
  search,
  onSearchChange,
  onAddTask,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-border bg-card px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <h1 className="font-mono text-xl font-bold tracking-tight text-foreground">
          SYNAPSE
        </h1>
        <span className="hidden rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary sm:inline-block">
          Tasks
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          
        </div>

        <Button
          onClick={onAddTask}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Новая задача
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

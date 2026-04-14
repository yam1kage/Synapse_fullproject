"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { LayoutDashboard, Settings, Zap, Inbox } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Task {
  deadline?: string | null;
  status: string;
}

export function AppSidebar() {
  const pathname = usePathname()
  const [hasOverdue, setHasOverdue] = useState(false)

  const checkOverdue = async () => {
    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token")
      if (!token) return

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) return
      
      const data = await response.json()
      const tasksArray: Task[] = Array.isArray(data) ? data : []

      const now = new Date()
      const overdueExists = tasksArray.some((task) => {
        if (!task.deadline) return false
        const isCompleted = task.status === 'done' || task.status === 'completed'
        return new Date(task.deadline) < now && !isCompleted
      })
      
      setHasOverdue(overdueExists)
    } catch (e) {
      console.error("Sidebar sync error")
    }
  }

  useEffect(() => {
    checkOverdue()
    const interval = setInterval(checkOverdue, 30000)
    return () => clearInterval(interval)
  }, [pathname])

  const navItems = [
    { icon: LayoutDashboard, label: "Задачи", href: "/" },
    { icon: Inbox, label: "Входящие", href: "/inbox", showBadge: hasOverdue },
    { icon: Settings, label: "Настройки", href: "/settings" },
  ]

  return (
    <aside className="flex h-screen w-[60px] flex-col items-center border-r border-border bg-sidebar py-5">
      {/* Логотип */}
      <div className="mb-8 flex items-center justify-center">
        <Link href="/">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(250,80%,65%)] to-[hsl(210,80%,55%)] shadow-lg shadow-purple-500/20">
            <Zap className="h-4 w-4 text-white fill-white" />
          </div>
        </Link>
      </div>

      <TooltipProvider delayDuration={0}>
        <nav className="flex flex-1 flex-col items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300",
                      isActive
                        ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-[18px] w-[18px]", isActive && "stroke-[2.5px]")} />
                    
                    {item.showBadge && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background animate-pulse shadow-sm">
                        !
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute -left-[1px] h-5 w-[3px] rounded-r-full bg-primary" />
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10} className="bg-popover text-popover-foreground border-border font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </TooltipProvider>

      {/* Профиль */}
      <div className="mt-auto flex flex-col items-center gap-4">
        <Link href="/profile">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 ring-2 ring-border hover:ring-primary/50 transition-all duration-300 cursor-pointer overflow-hidden shadow-inner" />
        </Link>
      </div>
    </aside>
  )
}
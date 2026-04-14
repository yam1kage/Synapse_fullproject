"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  
  
  if (!mounted) {
    return <div className="flex gap-2 p-1 bg-muted rounded-lg w-[260px] h-[36px]" />
  }

  const options = [
    { value: "light", label: "Светлая", icon: Sun },
    { value: "dark", label: "Темная", icon: Moon },
    { value: "system", label: "Системная", icon: Monitor },
  ]

  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
            theme === opt.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <opt.icon className="h-4 w-4" />
          {opt.label}
        </button>
      ))}
    </div>
  )
}
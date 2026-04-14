"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Настройки</h1>
        <p className="text-muted-foreground">
          Управление внешним видом и предпочтениями вашего рабочего пространства.
        </p>
      </div>
      
      <Separator className="my-6" />

      <div className="space-y-6">
       
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Внешний вид</h3>
            <p className="text-sm text-muted-foreground">
              Выберите тему оформления интерфейса.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <Separator />

        
 
          </div>
        </div>
    
  )
}
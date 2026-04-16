"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { TaskCard } from "@/components/kanban/task-card"

export default function InboxPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        
        const token = localStorage.getItem("access_token") || localStorage.getItem("token")
        
        if (!token) {
          console.error("Токен не найден в localStorage!")
          setLoading(false)
          return
        }

        const response = await fetch('http://172.20.10.2:8000/tasks', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.status === 401) {
          console.error("Сервер отклонил токен (401 Unauthorized)")
          throw new Error("Не авторизован")
        }

        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`)

        const data = await response.json()
        const tasksArray = Array.isArray(data) ? data : (data.tasks || [])

        const now = new Date()
        const overdue = tasksArray.filter((task: any) => {
          if (!task.deadline) return false
          const isDone = task.status === 'done' || task.status === 'completed'
          return new Date(task.deadline) < now && !isDone
        })

        setTasks(overdue)
      } catch (e) {
        console.error("Ошибка во входящих:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-red-500/10 rounded-lg">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Входящие</h1>
          <p className="text-muted-foreground text-sm">
            {tasks.length > 0 
              ? `У вас ${tasks.length} просроченных задач` 
              : "Все задачи под контролем!"}
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Ищем просрочки...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.length > 0 ? (
            tasks.map((task: any) => (
              <div key={task.id} className="relative group transition-transform hover:translate-x-1">
                <TaskCard task={task} />
            
                <div className="absolute -left-1 top-4 bottom-4 w-1 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-2xl border-border bg-card/50">
              <CheckCircle2 className="h-12 w-12 text-green-500/50 mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">Чисто!</p>
              <p className="text-sm text-muted-foreground">Просроченных задач не найдено.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
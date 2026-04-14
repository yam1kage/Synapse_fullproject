"use client"

import { useMemo, useState, useEffect } from "react"
import useSWR from "swr"
import { DashboardHeader } from "@/todo/dashboard-header"
import { TaskDialog } from "@/todo/task-dialog"
import { KanbanColumn } from "@/components/kanban/kanban-column" 
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
  type TaskCreate,
} from "@/lib/api"
import type { Status } from "@/lib/kanban-data"
import { AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const COLUMNS: Status[] = ["todo", "in-progress", "done"];

export function Dashboard() {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeStatus, setActiveStatus] = useState<Status>("todo")

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token")
    if (!token) router.push("/login")
  }, [router])

  const { data: tasks, error, isLoading, mutate } = useSWR("tasks", fetchTasks, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
  })

  const allTasks = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return []
    return tasks
  }, [tasks])

  const handleAddTask = (status: Status = "todo") => {
    setActiveStatus(status)
    setEditingTask(null)
    setDialogOpen(true)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить задачу?")) return
    try {
      await deleteTask(id)
      mutate()
    } catch (err) { console.error(err) }
  }

  const handleStatusChange = async (taskId: number, newStatus: Status) => {
    try {
      await updateTask(taskId, { status: newStatus })
      mutate() 
    } catch (err) { console.error(err) }
  }

  const handleSubmit = async (data: any) => {
    try {
      const taskData: TaskCreate = {
        name: data.name,
        description: data.description,
        priority: data.priority,
        status: data.status, 
        deadline: data.deadline
      }

      if (editingTask) {
        await updateTask(editingTask.id, taskData)
      } else {
        await createTask(taskData)
      }
      
      setDialogOpen(false)
      mutate()
    } catch (err) { alert("Ошибка сохранения") }
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <DashboardHeader
        search="" 
        onSearchChange={() => {}} 
        onAddTask={() => handleAddTask("todo")}
      />

      <main className="flex-1 overflow-x-auto p-6">
        {isLoading && <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /></div>}
        
        {!isLoading && !error && (
          <div className="flex h-full gap-6 min-w-max pb-4">
            {COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={allTasks.filter((t) => t.status === status).map(t => ({...t, id: String(t.id), title: t.name})) as any}
                onAddTask={() => handleAddTask(status)}
                onDeleteTask={(id) => handleDelete(Number(id))}
                onStatusChange={(id, newStat) => handleStatusChange(Number(id), newStat as Status)}
                onEditTask={handleEdit}
              />
            ))}
          </div>
        )}
      </main>

      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        task={editingTask}
        defaultStatus={activeStatus} 
      />
    </div>
  )
}
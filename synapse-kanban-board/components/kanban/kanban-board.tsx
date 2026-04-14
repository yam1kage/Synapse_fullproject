"use client"

import { useState, useEffect } from "react"
import type { Task, Status } from "@/lib/kanban-data"
import { KanbanHeader } from "./kanban-header"
import { KanbanColumn } from "./kanban-column"
import { AddTaskDialog } from "./add-task-dialog"
import { fetchTasks, createTask, deleteTask, updateTask } from "@/lib/api"

const COLUMNS: Status[] = ["todo", "in-progress", "done"]

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]) 
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeColumnStatus, setActiveColumnStatus] = useState<Status>("todo")

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      const data = await fetchTasks()
      const mappedTasks = data.map((t: any) => ({
        ...t,
        id: String(t.id),
        name: t.name,
        title: t.name,
        description: t.description || "",
        status: t.status as Status,
        priority: t.priority || "medium"
      }))
      setTasks(mappedTasks)
    } catch (error) {
      console.error("Ошибка загрузки:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleAddTask = async (taskData: any) => {
    try {
      await createTask({
        name: taskData.title || taskData.name || "Без названия",
        description: taskData.description || "",

        status: taskData.status || activeColumnStatus, 
        priority: taskData.priority || "medium",
        deadline: taskData.deadline
      })
      await loadTasks()
      setDialogOpen(false)
    } catch (error) {
      console.error(error)
      alert("Не удалось создать задачу")
    }
  }
  
  const handleDeleteTask = async (id: string) => {
    if (!confirm("Точно удалить?")) return
    try {
      await deleteTask(Number(id))
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error("Ошибка удаления:", error)
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    try {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
      await updateTask(Number(taskId), { status: newStatus })
    } catch (error) {
      console.error("Ошибка при смене статуса:", error)
      loadTasks()
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <KanbanHeader
        taskCount={tasks.length}
        onNewTask={() => {
          setActiveColumnStatus("todo"); 
          setDialogOpen(true);
        }}
      />

      <div className="flex flex-1 gap-6 overflow-x-auto p-6">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">Загрузка...</div>
        ) : (
          COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              onAddTask={() => {
                setActiveColumnStatus(status);
                setDialogOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange} 
            />
          ))
        )}
      </div>

      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddTask={handleAddTask}
        defaultStatus={activeColumnStatus} 
        nextId={0}
      />
    </div>
  )
}
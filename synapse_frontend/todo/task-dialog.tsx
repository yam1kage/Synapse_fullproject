"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Task, TaskCreate } from "@/lib/api"

interface TaskDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TaskCreate) => Promise<void>
  task?: Task | null
  defaultStatus?: string 
}

export function TaskDialog({ open, onClose, onSubmit, task, defaultStatus }: TaskDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("todo") 
  const [priority, setPriority] = useState("medium")
  const [deadline, setDeadline] = useState("") 
  const [loading, setLoading] = useState(false)

  const isEditing = !!task

  useEffect(() => {
    if (task) {
      setName(task.name || "")
      setDescription(task.description || "")
      setStatus(task.status || "todo")
      setPriority(task.priority || "medium")
      setDeadline(task.deadline || "") 
    } else {
      setName("")
      setDescription("")
      
      setStatus(defaultStatus || "todo") 
      setPriority("medium")
      setDeadline("")
    }
  }, [task, open, defaultStatus])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      await onSubmit({ 
        name, 
        description, 
        status, 
        priority,
        deadline: deadline || undefined 
      })
      onClose()
    } catch (error) {
      console.error("Failed to save task:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground font-bold">
            {isEditing ? "Редактировать задачу" : "Новая задача"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-name" className="text-foreground">Название</Label>
            <Input
              id="task-name"
              placeholder="Что нужно сделать?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-secondary text-foreground border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-desc" className="text-foreground">Описание</Label>
            <Textarea
              id="task-desc"
              placeholder="Добавьте детали..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="bg-secondary text-foreground border-border resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Статус</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-secondary text-foreground border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="todo">Планирование</SelectItem>
                  <SelectItem value="in-progress">В работе</SelectItem>
                  <SelectItem value="done">Сделано</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Приоритет</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="bg-secondary text-foreground border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="low">Низкий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="high">Высокий</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-deadline" className="text-foreground">Дедлайн</Label>
            <Input
              id="task-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-secondary text-foreground border-border [color-scheme:dark]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
            <Button type="button" variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              Отмена
            </Button>
            <Button type="submit" disabled={loading || !name.trim()} className="bg-primary text-primary-foreground">
              {loading ? "Сохранение..." : isEditing ? "Сохранить" : "Создать"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
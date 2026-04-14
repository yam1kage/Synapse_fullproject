"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Priority, Status, Task } from "@/lib/kanban-data"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: any) => void 
  nextId: number
  defaultStatus?: string 
}

export function AddTaskDialog({
  open,
  onOpenChange,
  onAddTask,
  nextId,
  defaultStatus, 
}: AddTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [status, setStatus] = useState<string>("todo") 
  const [deadline, setDeadline] = useState("")


  useEffect(() => {
    if (open) {
      setTitle("")
      setDescription("")
      setPriority("medium")
      setDeadline("")
  
      setStatus(defaultStatus || "todo") 
    }
  }, [open, defaultStatus])

  const handleSubmit = () => {
    if (!title.trim()) return


    onAddTask({
      title: title.trim(),
      description: description.trim() || null,
      priority: priority,
      status: status, // Это значение из Select
      deadline: deadline || null,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-mono text-base tracking-wide text-foreground">
            Новая задача
          </DialogTitle>
          <DialogDescription>
            Заполните информацию о задаче. Сейчас выбрано: {
              status === "todo" ? "В планах" : status === "in-progress" ? "В работе" : "Готово"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-title" className="text-sm text-foreground">
              Название
            </Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название задачи..."
              className="border-border bg-secondary/50 text-foreground"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="task-description" className="text-sm text-foreground">
              Описание
            </Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите задачу подробнее..."
              className="min-h-[100px] resize-none border-border bg-secondary/50 text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-foreground">Приоритет</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as Priority)}
              >
                <SelectTrigger className="border-border bg-secondary/50 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover text-foreground">
                  <SelectItem value="low">Низкий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="high">Высокий</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-foreground">Статус</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v)} // ПОЗВОЛЯЕМ МЕНЯТЬ СТАТУС ВРУЧНУЮ
              >
                <SelectTrigger className="border-border bg-secondary/50 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover text-foreground">
                  <SelectItem value="todo">В планах</SelectItem>
                  <SelectItem value="in-progress">В работе</SelectItem>
                  <SelectItem value="done">Готово</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="task-deadline" className="text-sm text-foreground">
              Дедлайн
            </Label>
            <Input
              id="task-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="border-border bg-secondary/50 text-foreground [color-scheme:dark]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="bg-primary text-primary-foreground shadow-lg"
          >
            Создать задачу
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
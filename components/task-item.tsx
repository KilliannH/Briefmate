"use client"

import { toggleTask, deleteTask } from "@/app/actions/tasks"
import { useTransition } from "react"
import { Trash2 } from "lucide-react"

type TaskItemProps = {
  task: {
    id: string
    title: string
    description: string | null
    completed: boolean
  }
}

export function TaskItem({ task }: TaskItemProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTask(task.id)
    })
  }

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      startTransition(async () => {
        await deleteTask(task.id)
      })
    }
  }

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggle}
        disabled={isPending}
        className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
      />
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className={`text-sm mt-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
            {task.description}
          </p>
        )}
      </div>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-gray-400 hover:text-red-600 disabled:opacity-50"
        title="Supprimer"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}
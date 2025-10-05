"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"

type TemplateTasksFormProps = {
  initialTasks?: string[]
}

export function TemplateTasksForm({ initialTasks = [] }: TemplateTasksFormProps) {
  const [tasks, setTasks] = useState<string[]>(initialTasks.length > 0 ? initialTasks : [""])

  const addTask = () => {
    setTasks([...tasks, ""])
  }

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const updateTask = (index: number, value: string) => {
    const newTasks = [...tasks]
    newTasks[index] = value
    setTasks(newTasks)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tâches prédéfinies
      </label>
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              name={`task-${index}`}
              value={task}
              onChange={(e) => updateTask(index, e.target.value)}
              placeholder={`Tâche ${index + 1}`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {tasks.length > 1 && (
              <button
                type="button"
                onClick={() => removeTask(index)}
                className="p-2 text-gray-400 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addTask}
        className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
      >
        <Plus className="w-4 h-4" />
        Ajouter une tâche
      </button>
    </div>
  )
}
"use client"

import { deleteTemplate } from "@/app/actions/templates"
import { useTransition } from "react"
import { Trash2 } from "lucide-react"

export function DeleteTemplateButton({ templateId }: { templateId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce template ?")) {
      startTransition(async () => {
        await deleteTemplate(templateId)
      })
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-gray-400 hover:text-red-600 disabled:opacity-50"
      title="Supprimer"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  )
}
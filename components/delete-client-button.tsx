"use client"

import { deleteClient } from "@/app/actions/clients"
import { useTransition } from "react"
import { Trash2 } from "lucide-react"

export function DeleteClientButton({ clientId }: { clientId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ? Tous les briefs associés seront dissociés.")) {
      startTransition(async () => {
        await deleteClient(clientId)
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
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { useTransition } from "react"

type BriefsFiltersProps = {
  clients: Array<{ id: string; name: string }>
}

export function BriefsFilters({ clients }: BriefsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentSearch = searchParams.get("search") || ""
  const currentStatus = searchParams.get("status") || ""
  const currentPriority = searchParams.get("priority") || ""
  const currentClient = searchParams.get("client") || ""

  const updateFilters = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      router.push(`/dashboard?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    startTransition(() => {
      router.push("/dashboard")
    })
  }

  const hasActiveFilters = currentSearch || currentStatus || currentPriority || currentClient

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Recherche */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un brief..."
              defaultValue={currentSearch}
              onChange={(e) => updateFilters("search", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Statut */}
        <div>
          <select
            value={currentStatus}
            onChange={(e) => updateFilters("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="DRAFT">Brouillon</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="IN_REVIEW">En révision</option>
            <option value="COMPLETED">Terminé</option>
            <option value="CANCELLED">Annulé</option>
          </select>
        </div>

        {/* Priorité */}
        <div>
          <select
            value={currentPriority}
            onChange={(e) => updateFilters("priority", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les priorités</option>
            <option value="LOW">Basse</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Haute</option>
            <option value="URGENT">Urgente</option>
          </select>
        </div>

        {/* Client */}
        <div className="flex gap-2">
          <select
            value={currentClient}
            onChange={(e) => updateFilters("client", e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les clients</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              disabled={isPending}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              title="Réinitialiser les filtres"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isPending && (
        <div className="mt-2 text-sm text-gray-500">Chargement...</div>
      )}
    </div>
  )
}
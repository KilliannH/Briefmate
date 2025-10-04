"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown } from "lucide-react"
import { useTransition } from "react"

export function BriefsSort() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentSort = searchParams.get("sort") || "createdAt-desc"

  const handleSort = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("sort", value)
      router.push(`/dashboard?${params.toString()}`)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-400" />
      <select
        value={currentSort}
        onChange={(e) => handleSort(e.target.value)}
        disabled={isPending}
        className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <option value="createdAt-desc">Plus récent</option>
        <option value="createdAt-asc">Plus ancien</option>
        <option value="deadline-asc">Deadline proche</option>
        <option value="deadline-desc">Deadline éloignée</option>
        <option value="title-asc">Titre (A-Z)</option>
        <option value="title-desc">Titre (Z-A)</option>
        <option value="priority-desc">Priorité haute</option>
        <option value="priority-asc">Priorité basse</option>
      </select>
    </div>
  )
}
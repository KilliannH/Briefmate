import Link from "next/link"
import { DeleteBriefButton } from "./delete-brief-button"
import { Calendar, DollarSign } from "lucide-react"

type BriefCardProps = {
  brief: {
    id: string
    title: string
    description: string | null
    status: string
    priority: string
    deadline: Date | null
    budget: number | null
    client: {
      name: string
    } | null
    _count: {
      tasks: number
    }
  }
}

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  IN_REVIEW: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

const priorityColors = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-blue-100 text-blue-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-red-100 text-red-600",
}

const statusLabels = {
  DRAFT: "Brouillon",
  IN_PROGRESS: "En cours",
  IN_REVIEW: "En révision",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
}

const priorityLabels = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  URGENT: "Urgente",
}

export function BriefCard({ brief }: BriefCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link href={`/dashboard/briefs/${brief.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
              {brief.title}
            </h3>
          </Link>
          {brief.client && (
            <p className="text-sm text-gray-500 mt-1">
              Client: {brief.client.name}
            </p>
          )}
        </div>
        <DeleteBriefButton briefId={brief.id} />
      </div>

      {brief.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {brief.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[brief.status as keyof typeof statusColors]}`}>
          {statusLabels[brief.status as keyof typeof statusLabels]}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[brief.priority as keyof typeof priorityColors]}`}>
          {priorityLabels[brief.priority as keyof typeof priorityLabels]}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          {brief.deadline && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(brief.deadline).toLocaleDateString('fr-FR')}
            </span>
          )}
          {brief.budget && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {brief.budget.toLocaleString('fr-FR')}€
            </span>
          )}
        </div>
        <span className="text-xs">
          {brief._count.tasks} tâche{brief._count.tasks > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
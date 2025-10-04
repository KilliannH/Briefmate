import { getBrief } from "@/app/actions/briefs"
import { TaskItem } from "@/components/task-item"
import { AddTaskForm } from "@/components/add-task-form"
import { DeleteBriefButton } from "@/components/delete-brief-button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Edit, Calendar, DollarSign, Clock } from "lucide-react"

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

export default async function BriefDetailPage({ params }: { params: { id: string } }) {
  const brief = await getBrief(params.id)

  if (!brief) {
    notFound()
  }

  const completedTasks = brief.tasks.filter(t => t.completed).length
  const totalTasks = brief.tasks.length
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux briefs
        </Link>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{brief.title}</h1>
            {brief.client && (
              <p className="text-gray-600 mt-1">
                Client: <span className="font-medium">{brief.client.name}</span>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/briefs/${brief.id}/edit`}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Link>
            <DeleteBriefButton briefId={brief.id} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {brief.description && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{brief.description}</p>
            </div>
          )}

          {/* Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Tâches ({completedTasks}/{totalTasks})
              </h2>
              {totalTasks > 0 && (
                <span className="text-sm text-gray-600">{Math.round(progress)}% complété</span>
              )}
            </div>

            {totalTasks > 0 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 mb-4">
              {brief.tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>

            <AddTaskForm briefId={brief.id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Informations</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Statut</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[brief.status as keyof typeof statusColors]}`}>
                  {statusLabels[brief.status as keyof typeof statusLabels]}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Priorité</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${priorityColors[brief.priority as keyof typeof priorityColors]}`}>
                  {priorityLabels[brief.priority as keyof typeof priorityLabels]}
                </span>
              </div>
            </div>
          </div>

          {/* Dates & Budget */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Détails</h3>
            <div className="space-y-3 text-sm">
              {brief.deadline && (
                <div>
                  <p className="text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date limite
                  </p>
                  <p className="font-medium text-gray-900 ml-6">
                    {new Date(brief.deadline).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
              {brief.budget && (
                <div>
                  <p className="text-gray-500 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget
                  </p>
                  <p className="font-medium text-gray-900 ml-6">{brief.budget.toLocaleString('fr-FR')} €</p>
                </div>
              )}
              {brief.estimatedHours && (
                <div>
                  <p className="text-gray-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Heures estimées
                  </p>
                  <p className="font-medium text-gray-900 ml-6">{brief.estimatedHours} h</p>
                </div>
              )}
              <div>
                <p className="text-gray-500">Créé le</p>
                <p className="font-medium text-gray-900">
                  {new Date(brief.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { getTemplates } from "@/app/actions/templates"
import Link from "next/link"
import { LayoutTemplate, Plus } from "lucide-react"
import { DeleteTemplateButton } from "@/components/delete-template-button"

const priorityLabels = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  URGENT: "Urgente",
}

const priorityColors = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-blue-100 text-blue-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-red-100 text-red-600",
}

export default async function TemplatesPage() {
  const templates = await getTemplates()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates de briefs</h1>
          <p className="text-gray-600 mt-1">
            {templates.length} template{templates.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <Link
          href="/dashboard/templates/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau template
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <LayoutTemplate className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun template pour le moment
          </h2>
          <p className="text-gray-600 mb-6">
            Créez des templates pour gagner du temps lors de la création de briefs
          </p>
          <Link
            href="/dashboard/templates/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Créer mon premier template
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const tasksArray = template.tasks as { title: string }[] | null
            const taskCount = tasksArray ? tasksArray.length : 0

            return (
              <div key={template.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {template.name}
                    </h3>
                    {template.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {template.description}
                      </p>
                    )}
                  </div>
                  <DeleteTemplateButton templateId={template.id} />
                </div>

                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${priorityColors[template.priority as keyof typeof priorityColors]}`}>
                    {priorityLabels[template.priority as keyof typeof priorityLabels]}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  {template.estimatedHours && (
                    <p>{template.estimatedHours} heures estimées</p>
                  )}
                  <p>{taskCount} tâche{taskCount > 1 ? 's' : ''} prédéfinie{taskCount > 1 ? 's' : ''}</p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/templates/${template.id}/use`}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm"
                  >
                    Utiliser
                  </Link>
                  <Link
                    href={`/dashboard/templates/${template.id}/edit`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
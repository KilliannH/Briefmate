import { createTemplate } from "@/app/actions/templates"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TemplateTasksForm } from "@/components/template-tasks-form"

export default function NewTemplatePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link 
          href="/dashboard/templates" 
          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux templates
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Nouveau template</h1>
        <p className="text-gray-600 mt-1">Créez un template réutilisable pour vos briefs</p>
      </div>

      <form action={createTemplate} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Nom */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du template *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Site web e-commerce"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Description du type de projet..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Priorité */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priorité par défaut
            </label>
            <select
              id="priority"
              name="priority"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Haute</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>

          {/* Heures estimées */}
          <div>
            <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">
              Heures estimées
            </label>
            <input
              type="number"
              id="estimatedHours"
              name="estimatedHours"
              step="0.5"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="40"
            />
          </div>
        </div>

        {/* Tâches prédéfinies */}
        <TemplateTasksForm />

        {/* Boutons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Créer le template
          </button>
          <Link
            href="/dashboard/templates"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium text-center"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
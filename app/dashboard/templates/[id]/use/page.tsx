import { getTemplate, createBriefFromTemplate } from "@/app/actions/templates"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function UseTemplatePage({ params }: { params: { id: string } }) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const template = await getTemplate(params.id)

  if (!template) {
    notFound()
  }

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" }
  })

  const handleCreate = async (formData: FormData) => {
    "use server"
    await createBriefFromTemplate(params.id, formData)
  }

  const tasksArray = template.tasks as { title: string }[] | null

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
        <h1 className="text-3xl font-bold text-gray-900">Créer un brief depuis un template</h1>
        <p className="text-gray-600 mt-1">Template: {template.name}</p>
      </div>

      <form action={handleCreate} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre du brief *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Site e-commerce pour Client X"
          />
        </div>

        {/* Client */}
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
            Client
          </label>
          <select
            id="clientId"
            name="clientId"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Aucun client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Date limite
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
              Budget (€)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2500"
            />
          </div>
        </div>

        {/* Informations du template */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Ce brief inclura :</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            {template.description && (
              <li>• Description : {template.description}</li>
            )}
            <li>• Priorité : {template.priority}</li>
            {template.estimatedHours && (
              <li>• Heures estimées : {template.estimatedHours}h</li>
            )}
            {tasksArray && tasksArray.length > 0 && (
              <li>• {tasksArray.length} tâche{tasksArray.length > 1 ? 's' : ''} prédéfinie{tasksArray.length > 1 ? 's' : ''}</li>
            )}
          </ul>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Créer le brief
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
import { getBrief, updateBrief } from "@/app/actions/briefs"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function EditBriefPage({ params }: { params: { id: string } }) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const brief = await getBrief(params.id)

  if (!brief) {
    notFound()
  }

  // Récupérer les clients de l'utilisateur pour le select
  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" }
  })

  // Formater la date pour l'input date
  const deadlineValue = brief.deadline 
    ? new Date(brief.deadline).toISOString().split('T')[0]
    : ''

  const handleUpdate = async (formData: FormData) => {
    "use server"
    await updateBrief(params.id, formData)
    redirect(`/dashboard/briefs/${params.id}`)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link 
          href={`/dashboard/briefs/${params.id}`}
          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au brief
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Modifier le brief</h1>
        <p className="text-gray-600 mt-1">Modifiez les informations de votre brief</p>
      </div>

      <form action={handleUpdate} className="bg-white rounded-lg shadow p-6 space-y-6">
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
            defaultValue={brief.title}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Refonte du site web"
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
            defaultValue={brief.description || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Décrivez le projet en détail..."
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
            defaultValue={brief.clientId || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Aucun client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {clients.length === 0 && (
            <p className="mt-1 text-xs text-gray-500">
              <Link href="/dashboard/clients/new" className="text-blue-600 hover:text-blue-700">
                Créer un client
              </Link>
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Statut */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="status"
              name="status"
              defaultValue={brief.status}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DRAFT">Brouillon</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="IN_REVIEW">En révision</option>
              <option value="COMPLETED">Terminé</option>
              <option value="CANCELLED">Annulé</option>
            </select>
          </div>

          {/* Priorité */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue={brief.priority}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Haute</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
            Date limite
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            defaultValue={deadlineValue}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
              defaultValue={brief.budget || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2500"
            />
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
              defaultValue={brief.estimatedHours || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="40"
            />
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Enregistrer les modifications
          </button>
          <Link
            href={`/dashboard/briefs/${params.id}`}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium text-center"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
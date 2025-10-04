import { getClient } from "@/app/actions/clients"
import { DeleteClientButton } from "@/components/delete-client-button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Edit, Mail, Phone, Building2, FileText, Calendar, DollarSign } from "lucide-react"

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  IN_REVIEW: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

const statusLabels = {
  DRAFT: "Brouillon",
  IN_PROGRESS: "En cours",
  IN_REVIEW: "En révision",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
}

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await getClient(params.id)

  if (!client) {
    notFound()
  }

  const totalBudget = client.briefs.reduce((sum, brief) => sum + (brief.budget || 0), 0)
  const completedBriefs = client.briefs.filter(b => b.status === "COMPLETED").length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard/clients" 
          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux clients
        </Link>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            {client.company && (
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {client.company}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/clients/${client.id}/edit`}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Link>
            <DeleteClientButton clientId={client.id} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Infos client */}
        <div className="space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
            <div className="space-y-3">
              {client.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${client.email}`} className="text-blue-600 hover:text-blue-700">
                    {client.email}
                  </a>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${client.phone}`} className="text-blue-600 hover:text-blue-700">
                    {client.phone}
                  </a>
                </div>
              )}
              {!client.email && !client.phone && (
                <p className="text-sm text-gray-500">Aucune information de contact</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {client.notes && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{client.notes}</p>
            </div>
          )}

          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Briefs total</p>
                <p className="text-2xl font-bold text-gray-900">{client.briefs.length}</p>
              </div>
              <div>
                <p className="text-gray-500">Briefs terminés</p>
                <p className="text-2xl font-bold text-green-600">{completedBriefs}</p>
              </div>
              {totalBudget > 0 && (
                <div>
                  <p className="text-gray-500">Budget total</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBudget.toLocaleString('fr-FR')} €</p>
                </div>
              )}
              <div>
                <p className="text-gray-500">Client depuis</p>
                <p className="font-medium text-gray-900">
                  {new Date(client.createdAt).toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content - Briefs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Briefs ({client.briefs.length})
              </h2>
              <Link
                href={`/dashboard/briefs/new?clientId=${client.id}`}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Nouveau brief
              </Link>
            </div>

            {client.briefs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 mb-4">Aucun brief pour ce client</p>
                <Link
                  href={`/dashboard/briefs/new?clientId=${client.id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Créer un brief
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {client.briefs.map((brief) => (
                  <Link
                    key={brief.id}
                    href={`/dashboard/briefs/${brief.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{brief.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[brief.status as keyof typeof statusColors]}`}>
                        {statusLabels[brief.status as keyof typeof statusLabels]}
                      </span>
                    </div>
                    
                    {brief.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {brief.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {brief.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(brief.deadline).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      {brief.budget && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {brief.budget.toLocaleString('fr-FR')} €
                        </span>
                      )}
                      <span className="ml-auto">
                        Créé le {new Date(brief.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
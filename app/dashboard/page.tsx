import { getBriefs } from "@/app/actions/briefs"
import { BriefCard } from "@/components/brief-card"
import Link from "next/link"
import { FileText, Plus } from "lucide-react"

export default async function DashboardPage() {
  const briefs = await getBriefs()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes briefs</h1>
          <p className="text-gray-600 mt-1">
            {briefs.length} brief{briefs.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <Link
          href="/dashboard/briefs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau brief
        </Link>
      </div>

      {briefs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun brief pour le moment
          </h2>
          <p className="text-gray-600 mb-6">
            Commencez par créer votre premier brief pour organiser vos projets
          </p>
          <Link
            href="/dashboard/briefs/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Créer mon premier brief
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {briefs.map((brief) => (
            <BriefCard key={brief.id} brief={brief} />
          ))}
        </div>
      )}
    </div>
  )
}
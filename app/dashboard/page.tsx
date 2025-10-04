import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { BriefCard } from "@/components/brief-card"
import { BriefsFilters } from "@/components/briefs-filters"
import { BriefsSort } from "@/components/briefs-sort"
import { ExportBriefs } from "@/components/export-briefs"
import Link from "next/link"
import { FileText, Plus } from "lucide-react"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { 
    search?: string
    status?: string
    priority?: string
    client?: string
    sort?: string
  }
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Construire les filtres
  const where: any = {
    userId: session.user.id,
  }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
    ]
  }

  if (searchParams.status) {
    where.status = searchParams.status
  }

  if (searchParams.priority) {
    where.priority = searchParams.priority
  }

  if (searchParams.client) {
    where.clientId = searchParams.client
  }

  // Construire le tri
  const sortParam = searchParams.sort || "createdAt-desc"
  const [sortField, sortOrder] = sortParam.split("-")
  
  const orderBy: any = {}
  
  if (sortField === "createdAt" || sortField === "deadline" || sortField === "title") {
    orderBy[sortField] = sortOrder
  } else if (sortField === "priority") {
    // Tri personnalisé pour la priorité
    orderBy.priority = sortOrder
  } else {
    orderBy.createdAt = "desc"
  }

  // Récupérer les briefs filtrés
  const briefs = await prisma.brief.findMany({
    where,
    include: {
      client: true,
      _count: {
        select: { tasks: true }
      }
    },
    orderBy
  })

  // Récupérer tous les clients pour les filtres
  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  })

  const hasFilters = searchParams.search || searchParams.status || searchParams.priority || searchParams.client
  const totalBriefs = await prisma.brief.count({
    where: { userId: session.user.id }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes briefs</h1>
          <p className="text-gray-600 mt-1">
            {hasFilters && briefs.length !== totalBriefs
              ? `${briefs.length} sur ${totalBriefs} brief${totalBriefs > 1 ? 's' : ''}`
              : `${briefs.length} brief${briefs.length > 1 ? 's' : ''} au total`
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportBriefs filters={searchParams} />
          <BriefsSort />
          <Link
            href="/dashboard/briefs/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouveau brief
          </Link>
        </div>
      </div>

      <BriefsFilters clients={clients} />

      {briefs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {hasFilters ? "Aucun brief trouvé" : "Aucun brief pour le moment"}
          </h2>
          <p className="text-gray-600 mb-6">
            {hasFilters 
              ? "Essayez de modifier vos filtres de recherche"
              : "Commencez par créer votre premier brief pour organiser vos projets"
            }
          </p>
          {!hasFilters && (
            <Link
              href="/dashboard/briefs/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Créer mon premier brief
            </Link>
          )}
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
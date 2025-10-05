import { getDashboardStats } from "@/app/actions/stats"
import { StatsCard } from "@/components/stats-card"
import { StatusChart, PriorityChart, TimeChart } from "@/components/stats-charts"
import { FileText, Users, CheckCircle, DollarSign, Clock, AlertTriangle } from "lucide-react"

export default async function StatsPage() {
  const stats = await getDashboardStats()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* Cartes de stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total de briefs"
          value={stats.totalBriefs}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Clients"
          value={stats.totalClients}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Briefs terminés"
          value={stats.completedBriefs}
          icon={CheckCircle}
          color="green"
          description={`${stats.totalBriefs > 0 ? Math.round((stats.completedBriefs / stats.totalBriefs) * 100) : 0}% de taux de complétion`}
        />
        <StatsCard
          title="Budget total"
          value={`${stats.totalBudget.toLocaleString('fr-FR')} €`}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Deadlines proches"
          value={stats.upcomingDeadlines}
          icon={Clock}
          color="yellow"
          description="Dans les 7 prochains jours"
        />
        <StatsCard
          title="Briefs en retard"
          value={stats.overdueBriefs}
          icon={AlertTriangle}
          color="red"
          description={stats.overdueBriefs > 0 ? "Nécessite votre attention" : "Tout est à jour"}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {stats.briefsByStatus.length > 0 && (
          <StatusChart data={stats.briefsByStatus} />
        )}
        {stats.briefsByPriority.length > 0 && (
          <PriorityChart data={stats.briefsByPriority} />
        )}
      </div>

      {/* Graphique temporel */}
      {stats.briefsOverTime.length > 0 && (
        <TimeChart data={stats.briefsOverTime} />
      )}

      {/* Message si pas de données */}
      {stats.totalBriefs === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Pas encore de statistiques
          </h2>
          <p className="text-gray-600 mb-6">
            Créez vos premiers briefs pour voir vos statistiques apparaître ici
          </p>
        </div>
      )}
    </div>
  )
}
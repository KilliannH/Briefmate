import Link from "next/link"
import { FileText, Users, LayoutTemplate, BarChart3, CheckCircle, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className=" bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">Briefmate</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Gérez vos briefs clients
            <span className="block text-blue-600">simplement et efficacement</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            L'outil tout-en-un pour les freelances qui veulent organiser leurs projets, suivre leurs tâches et impressionner leurs clients.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center gap-2"
            >
              Créer mon compte gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-300 transition-colors font-semibold text-lg"
            >
              Se connecter
            </Link>
          </div>
        </div>

        {/* Screenshot/Image placeholder */}
        <div className="mt-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 aspect-video max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg h-full flex items-center justify-center">
            <FileText className="w-32 h-32 text-white/50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-xl text-gray-600">
            Des fonctionnalités pensées pour les freelances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Gestion de briefs
            </h3>
            <p className="text-gray-600">
              Créez, organisez et suivez tous vos briefs clients au même endroit. Statuts, priorités, deadlines.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Suivi des tâches
            </h3>
            <p className="text-gray-600">
              Découpez vos briefs en tâches. Suivez la progression en temps réel avec une barre de complétion.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Base de clients
            </h3>
            <p className="text-gray-600">
              Gérez vos contacts clients avec toutes leurs informations. Suivez tous leurs projets.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="bg-orange-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <LayoutTemplate className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Templates réutilisables
            </h3>
            <p className="text-gray-600">
              Créez des templates pour vos projets récurrents. Gagnez du temps avec les tâches prédéfinies.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Statistiques détaillées
            </h3>
            <p className="text-gray-600">
              Visualisez votre activité avec des graphiques. Suivez vos métriques importantes.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="bg-indigo-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Export PDF/CSV
            </h3>
            <p className="text-gray-600">
              Exportez vos briefs en PDF ou CSV. Partagez facilement avec vos clients.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à organiser vos projets ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez Briefmate et gérez vos briefs comme un pro
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
          >
            Commencer gratuitement
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p className="font-bold text-gray-900 mb-2">Briefmate</p>
            <p>© 2025 Briefmate. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
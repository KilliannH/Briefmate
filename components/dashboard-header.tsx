import { auth } from "@/lib/auth"
import { logout } from "@/app/actions/auth"
import Link from "next/link"

export async function DashboardHeader() {
  const session = await auth()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Briefmate
            </Link>
          </div>

          <nav className="flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="text-gray-700 hover:text-gray-900"
            >
              Briefs
            </Link>
            <Link 
              href="/dashboard/clients" 
              className="text-gray-700 hover:text-gray-900"
            >
              Clients
            </Link>
            <Link 
              href="/dashboard/templates" 
              className="text-gray-700 hover:text-gray-900"
            >
              Templates
            </Link>
            <Link 
              href="/dashboard/stats" 
              className="text-gray-700 hover:text-gray-900"
            >
              Statistiques
            </Link>
            
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
              <span className="text-sm text-gray-600">
                {session?.user?.name || session?.user?.email}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
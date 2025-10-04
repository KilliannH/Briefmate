import Link from "next/link"
import { DeleteClientButton } from "./delete-client-button"
import { Mail, Phone } from "lucide-react"

type ClientCardProps = {
  client: {
    id: string
    name: string
    email: string | null
    phone: string | null
    company: string | null
    _count: {
      briefs: number
    }
  }
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link href={`/dashboard/clients/${client.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
              {client.name}
            </h3>
          </Link>
          {client.company && (
            <p className="text-sm text-gray-500 mt-1">
              {client.company}
            </p>
          )}
        </div>
        <DeleteClientButton clientId={client.id} />
      </div>

      <div className="space-y-2 mb-4">
        {client.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <a href={`mailto:${client.email}`} className="hover:text-blue-600">
              {client.email}
            </a>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <a href={`tel:${client.phone}`} className="hover:text-blue-600">
              {client.phone}
            </a>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-500">
          {client._count.briefs} brief{client._count.briefs > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
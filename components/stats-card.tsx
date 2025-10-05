import { LucideIcon } from "lucide-react"

type StatsCardProps = {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  color?: "blue" | "green" | "yellow" | "red" | "purple"
}

const colorClasses = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  yellow: "bg-yellow-100 text-yellow-600",
  red: "bg-red-100 text-red-600",
  purple: "bg-purple-100 text-purple-600",
}

export function StatsCard({ title, value, icon: Icon, description, color = "blue" }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {description && (
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        )}
      </div>
    </div>
  )
}
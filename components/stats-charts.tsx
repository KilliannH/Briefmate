"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

type StatusData = {
  status: string
  count: number
}

type PriorityData = {
  priority: string
  count: number
}

type TimeData = {
  month: string
  count: number
}

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  IN_PROGRESS: "En cours",
  IN_REVIEW: "En révision",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
}

const priorityLabels: Record<string, string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  URGENT: "Urgente",
}

const STATUS_COLORS = {
  DRAFT: "#94a3b8",
  IN_PROGRESS: "#3b82f6",
  IN_REVIEW: "#eab308",
  COMPLETED: "#22c55e",
  CANCELLED: "#ef4444",
}

const PRIORITY_COLORS = {
  LOW: "#94a3b8",
  MEDIUM: "#3b82f6",
  HIGH: "#f97316",
  URGENT: "#ef4444",
}

export function StatusChart({ data }: { data: StatusData[] }) {
  const chartData = data.map(item => ({
    name: statusLabels[item.status] || item.status,
    value: item.count,
    color: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS]
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Briefs par statut</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PriorityChart({ data }: { data: PriorityData[] }) {
  const chartData = data.map(item => ({
    name: priorityLabels[item.priority] || item.priority,
    value: item.count,
    color: PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS]
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Briefs par priorité</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TimeChart({ data }: { data: TimeData[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des briefs (6 derniers mois)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
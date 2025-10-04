"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

type Filters = {
  search?: string
  status?: string
  priority?: string
  client?: string
}

export async function getExportData(filters?: Filters) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const where: any = {
    userId: session.user.id,
  }

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  const validStatuses = ['DRAFT', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED']
  if (filters?.status && validStatuses.includes(filters.status)) {
    where.status = filters.status
  }

  const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
  if (filters?.priority && validPriorities.includes(filters.priority)) {
    where.priority = filters.priority
  }

  if (filters?.client) {
    where.clientId = filters.client
  }

  const briefs = await prisma.brief.findMany({
    where,
    include: {
      client: true,
      _count: {
        select: { tasks: true }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return briefs.map(brief => ({
    id: brief.id,
    title: brief.title,
    description: brief.description || '',
    status: brief.status,
    priority: brief.priority,
    clientName: brief.client?.name || 'Aucun client',
    deadline: brief.deadline ? new Date(brief.deadline).toISOString() : null,
    budget: brief.budget,
    estimatedHours: brief.estimatedHours,
    tasksCount: brief._count.tasks,
    createdAt: brief.createdAt.toISOString(),
  }))
}
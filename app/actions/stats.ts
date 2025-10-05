"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getDashboardStats() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = session.user.id

  // Compter les briefs par statut
  const briefsByStatus = await prisma.brief.groupBy({
    by: ['status'],
    where: { userId },
    _count: { status: true }
  })

  // Compter les briefs par priorité
  const briefsByPriority = await prisma.brief.groupBy({
    by: ['priority'],
    where: { userId },
    _count: { priority: true }
  })

  // Stats globales
  const [totalBriefs, totalClients, completedBriefs, totalBudget] = await Promise.all([
    prisma.brief.count({ where: { userId } }),
    prisma.client.count({ where: { userId } }),
    prisma.brief.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.brief.aggregate({
      where: { userId },
      _sum: { budget: true }
    })
  ])

  // Briefs avec deadline dans les 7 prochains jours
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

  const upcomingDeadlines = await prisma.brief.count({
    where: {
      userId,
      deadline: {
        gte: new Date(),
        lte: sevenDaysFromNow
      },
      status: { not: 'COMPLETED' }
    }
  })

  // Briefs en retard
  const overdueBriefs = await prisma.brief.count({
    where: {
      userId,
      deadline: {
        lt: new Date()
      },
      status: { notIn: ['COMPLETED', 'CANCELLED'] }
    }
  })

  // Briefs créés par mois (6 derniers mois)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const briefsByMonth = await prisma.brief.findMany({
    where: {
      userId,
      createdAt: { gte: sixMonthsAgo }
    },
    select: {
      createdAt: true
    }
  })

  // Grouper par mois
  const monthlyData = briefsByMonth.reduce((acc: any, brief) => {
    const month = brief.createdAt.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  const briefsOverTime = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    count
  }))

  return {
    totalBriefs,
    totalClients,
    completedBriefs,
    totalBudget: totalBudget._sum.budget || 0,
    upcomingDeadlines,
    overdueBriefs,
    briefsByStatus: briefsByStatus.map(item => ({
      status: item.status,
      count: item._count.status
    })),
    briefsByPriority: briefsByPriority.map(item => ({
      priority: item.priority,
      count: item._count.priority
    })),
    briefsOverTime
  }
}
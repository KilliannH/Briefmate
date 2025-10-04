"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const briefSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "IN_PROGRESS", "IN_REVIEW", "COMPLETED", "CANCELLED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  deadline: z.string().optional(),
  budget: z.string().optional(),
  estimatedHours: z.string().optional(),
  clientId: z.string().optional(),
})

export async function createBrief(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const validatedFields = briefSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status") || "DRAFT",
    priority: formData.get("priority") || "MEDIUM",
    deadline: formData.get("deadline"),
    budget: formData.get("budget"),
    estimatedHours: formData.get("estimatedHours"),
    clientId: formData.get("clientId"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description, status, priority, deadline, budget, estimatedHours, clientId } = validatedFields.data

  await prisma.brief.create({
    data: {
      title,
      description: description || null,
      status,
      priority,
      deadline: deadline ? new Date(deadline) : null,
      budget: budget ? parseFloat(budget) : null,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
      userId: session.user.id,
      clientId: clientId || null,
    }
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function updateBrief(briefId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const validatedFields = briefSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    deadline: formData.get("deadline"),
    budget: formData.get("budget"),
    estimatedHours: formData.get("estimatedHours"),
    clientId: formData.get("clientId"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description, status, priority, deadline, budget, estimatedHours, clientId } = validatedFields.data

  await prisma.brief.update({
    where: {
      id: briefId,
      userId: session.user.id,
    },
    data: {
      title,
      description: description || null,
      status,
      priority,
      deadline: deadline ? new Date(deadline) : null,
      budget: budget ? parseFloat(budget) : null,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
      clientId: clientId || null,
    }
  })

  revalidatePath("/dashboard")
  revalidatePath(`/dashboard/briefs/${briefId}`)
}

export async function deleteBrief(briefId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  await prisma.brief.delete({
    where: {
      id: briefId,
      userId: session.user.id,
    }
  })

  revalidatePath("/dashboard")
}

export async function getBriefs() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  return await prisma.brief.findMany({
    where: {
      userId: session.user.id,
    },
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
}

export async function getBrief(briefId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  return await prisma.brief.findUnique({
    where: {
      id: briefId,
      userId: session.user.id,
    },
    include: {
      client: true,
      tasks: {
        orderBy: { order: "asc" }
      },
      attachments: true,
    }
  })
}
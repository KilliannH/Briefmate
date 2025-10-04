"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const taskSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
})

export async function createTask(briefId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Vérifier que le brief appartient à l'utilisateur
  const brief = await prisma.brief.findUnique({
    where: {
      id: briefId,
      userId: session.user.id,
    },
    include: {
      tasks: true
    }
  })

  if (!brief) {
    throw new Error("Brief non trouvé")
  }

  const validatedFields = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description } = validatedFields.data

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      briefId,
      order: brief.tasks.length,
    }
  })

  revalidatePath(`/dashboard/briefs/${briefId}`)
}

export async function toggleTask(taskId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      brief: true
    }
  })

  if (!task || task.brief.userId !== session.user.id) {
    throw new Error("Tâche non trouvée")
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: !task.completed
    }
  })

  revalidatePath(`/dashboard/briefs/${task.briefId}`)
}

export async function deleteTask(taskId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      brief: true
    }
  })

  if (!task || task.brief.userId !== session.user.id) {
    throw new Error("Tâche non trouvée")
  }

  await prisma.task.delete({
    where: { id: taskId }
  })

  revalidatePath(`/dashboard/briefs/${task.briefId}`)
}
"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const templateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  estimatedHours: z.string().optional(),
})

export async function createTemplate(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const validatedFields = templateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    priority: formData.get("priority") || "MEDIUM",
    estimatedHours: formData.get("estimatedHours"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, priority, estimatedHours } = validatedFields.data

  // Récupérer les tâches du formulaire
  const tasks: any[] = []
  let taskIndex = 0
  while (formData.has(`task-${taskIndex}`)) {
    const taskTitle = formData.get(`task-${taskIndex}`) as string
    if (taskTitle) {
      tasks.push({ title: taskTitle })
    }
    taskIndex++
  }

  await prisma.briefTemplate.create({
    data: {
      name,
      description: description || null,
      priority,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
      tasks: tasks.length > 0 ? tasks : null,
      userId: session.user.id,
    }
  })

  revalidatePath("/dashboard/templates")
  redirect("/dashboard/templates")
}

export async function updateTemplate(templateId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const validatedFields = templateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    estimatedHours: formData.get("estimatedHours"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, priority, estimatedHours } = validatedFields.data

  const tasks: any[] = []
  let taskIndex = 0
  while (formData.has(`task-${taskIndex}`)) {
    const taskTitle = formData.get(`task-${taskIndex}`) as string
    if (taskTitle) {
      tasks.push({ title: taskTitle })
    }
    taskIndex++
  }

  await prisma.briefTemplate.update({
    where: {
      id: templateId,
      userId: session.user.id,
    },
    data: {
      name,
      description: description || null,
      priority,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
      tasks: tasks.length > 0 ? tasks : null,
    }
  })

  revalidatePath("/dashboard/templates")
  redirect("/dashboard/templates")
}

export async function deleteTemplate(templateId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  await prisma.briefTemplate.delete({
    where: {
      id: templateId,
      userId: session.user.id,
    }
  })

  revalidatePath("/dashboard/templates")
}

export async function getTemplates() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  return await prisma.briefTemplate.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}

export async function getTemplate(templateId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  return await prisma.briefTemplate.findUnique({
    where: {
      id: templateId,
      userId: session.user.id,
    }
  })
}

export async function createBriefFromTemplate(templateId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const template = await getTemplate(templateId)
  if (!template) {
    throw new Error("Template non trouvé")
  }

  const title = formData.get("title") as string
  const clientId = formData.get("clientId") as string
  const deadline = formData.get("deadline") as string
  const budget = formData.get("budget") as string

  // Créer le brief
  const brief = await prisma.brief.create({
    data: {
      title,
      description: template.description,
      status: "DRAFT",
      priority: template.priority,
      deadline: deadline ? new Date(deadline) : null,
      budget: budget ? parseFloat(budget) : null,
      estimatedHours: template.estimatedHours,
      userId: session.user.id,
      clientId: clientId || null,
    }
  })

  // Créer les tâches depuis le template
  if (template.tasks && Array.isArray(template.tasks)) {
    const tasks = template.tasks as { title: string }[]
    await Promise.all(
      tasks.map((task, index) =>
        prisma.task.create({
          data: {
            title: task.title,
            briefId: brief.id,
            order: index,
          }
        })
      )
    )
  }

  revalidatePath("/dashboard")
  redirect(`/dashboard/briefs/${brief.id}`)
}
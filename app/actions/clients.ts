"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const clientSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
})

export async function createClient(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const validatedFields = clientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    notes: formData.get("notes"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, phone, company, notes } = validatedFields.data

  await prisma.client.create({
    data: {
      name,
      email: email || null,
      phone: phone || null,
      company: company || null,
      notes: notes || null,
      userId: session.user.id,
    }
  })

  revalidatePath("/dashboard/clients")
  redirect("/dashboard/clients")
}

export async function updateClient(clientId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const validatedFields = clientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    notes: formData.get("notes"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, phone, company, notes } = validatedFields.data

  await prisma.client.update({
    where: {
      id: clientId,
      userId: session.user.id,
    },
    data: {
      name,
      email: email || null,
      phone: phone || null,
      company: company || null,
      notes: notes || null,
    }
  })

  revalidatePath("/dashboard/clients")
  revalidatePath(`/dashboard/clients/${clientId}`)
}

export async function deleteClient(clientId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  await prisma.client.delete({
    where: {
      id: clientId,
      userId: session.user.id,
    }
  })

  revalidatePath("/dashboard/clients")
}

export async function getClients() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  return await prisma.client.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      _count: {
        select: { briefs: true }
      }
    },
    orderBy: {
      name: "asc"
    }
  })
}

export async function getClient(clientId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  return await prisma.client.findUnique({
    where: {
      id: clientId,
      userId: session.user.id,
    },
    include: {
      briefs: {
        orderBy: { createdAt: "desc" }
      }
    }
  })
}
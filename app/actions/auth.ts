"use server"

import { signIn, signOut } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"
import { z } from "zod"
import AuthError from "next-auth"

const signUpSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
})

export async function signup(formData: FormData) {
  const validatedFields = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password, name } = validatedFields.data

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return {
      error: { email: ["Cet email est déjà utilisé"] }
    }
  }

  const hashedPassword = await hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    }
  })

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard"
  })
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard"
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou mot de passe incorrect" }
    }
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" })
}
import { NextResponse } from "next/server"
import { z } from "zod"

const functionSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  dockerImage: z
    .string()
    .regex(/^[\w.-]+\/[\w.-]+:[\w.-]+$/, "Format d'image Docker invalide. Utilisez le format : utilisateur/image:tag"),
  inputSchema: z.string().min(2, "Le schéma d'entrée est requis"),
  outputSchema: z.string().min(2, "Le schéma de sortie est requis"),
  version: z.string().min(1, "La version est requise"),
})

// This would typically be a database
const functions: any[] = []

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedFields = functionSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json({ error: validatedFields.error.flatten().fieldErrors }, { status: 400 })
    }

    const newFunction = {
      ...validatedFields.data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    functions.push(newFunction)

    return NextResponse.json(newFunction, { status: 201 })
  } catch (error) {
    console.error("Error registering function:", error)
    return NextResponse.json({ error: "An error occurred while registering the function" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(functions)
}


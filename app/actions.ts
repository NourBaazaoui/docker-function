"use server"

import { z } from "zod"

interface DockerFunction {
  name: string
  description: string
  dockerImage: string
  inputSchema: string
  outputSchema: string
  version: string
  createdAt: string
}

// Static examples for demonstration
const registeredFunctions: DockerFunction[] = [
  {
    name: "Image Resizer",
    description: "Resizes images to specified dimensions",
    dockerImage: "imageprocessing/resizer:v1.2",
    inputSchema: JSON.stringify(
      {
        type: "object",
        properties: {
          imageUrl: { type: "string" },
          width: { type: "number" },
          height: { type: "number" },
        },
        required: ["imageUrl", "width", "height"],
      },
      null,
      2,
    ),
    outputSchema: JSON.stringify(
      {
        type: "object",
        properties: {
          resizedImageUrl: { type: "string" },
        },
        required: ["resizedImageUrl"],
      },
      null,
      2,
    ),
    version: "1.2.0",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    name: "Text Summarizer",
    description: "Generates a concise summary of long text",
    dockerImage: "nlp/summarizer:v2.1",
    inputSchema: JSON.stringify(
      {
        type: "object",
        properties: {
          text: { type: "string" },
          maxLength: { type: "number" },
        },
        required: ["text"],
      },
      null,
      2,
    ),
    outputSchema: JSON.stringify(
      {
        type: "object",
        properties: {
          summary: { type: "string" },
        },
        required: ["summary"],
      },
      null,
      2,
    ),
    version: "2.1.0",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    name: "Weather Forecaster",
    description: "Provides weather forecast for a given location",
    dockerImage: "weatherapi/forecaster:v3.0",
    inputSchema: JSON.stringify(
      {
        type: "object",
        properties: {
          latitude: { type: "number" },
          longitude: { type: "number" },
          days: { type: "number" },
        },
        required: ["latitude", "longitude"],
      },
      null,
      2,
    ),
    outputSchema: JSON.stringify(
      {
        type: "object",
        properties: {
          forecast: {
            type: "array",
            items: {
              type: "object",
              properties: {
                date: { type: "string" },
                temperature: { type: "number" },
                conditions: { type: "string" },
              },
            },
          },
        },
        required: ["forecast"],
      },
      null,
      2,
    ),
    version: "3.0.0",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
]

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

export async function registerFunction(formData: FormData) {
  const validatedFields = functionSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    dockerImage: formData.get("dockerImage"),
    inputSchema: formData.get("inputSchema"),
    outputSchema: formData.get("outputSchema"),
    version: formData.get("version"),
  })

  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors }
  }

  try {
    // Add the new function to the list
    registeredFunctions.push({
      ...validatedFields.data,
      createdAt: new Date().toISOString(),
    })

    return { success: true, message: "Function registered successfully" }
  } catch (error) {
    console.error("Error registering function:", error)
    throw new Error("Failed to register function")
  }
}

export async function getRegisteredFunctions() {
  return registeredFunctions
}


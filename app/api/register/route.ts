import { NextResponse } from "next/server"
import Docker from "dockerode"

const docker = new Docker()

// Static examples for demonstration
const registeredFunctions = [
  {
    name: "Image Resizer",
    description: "Resizes images to specified dimensions",
    dockerImage: "imageprocessing/resizer:v1.2",
    inputSchema: JSON.stringify({
      type: "object",
      properties: {
        imageUrl: { type: "string" },
        width: { type: "number" },
        height: { type: "number" },
      },
      required: ["imageUrl", "width", "height"],
    }),
    outputSchema: JSON.stringify({
      type: "object",
      properties: {
        resizedImageUrl: { type: "string" },
      },
      required: ["resizedImageUrl"],
    }),
    version: "1.2.0",
  },
  {
    name: "Text Summarizer",
    description: "Generates a concise summary of long text",
    dockerImage: "nlp/summarizer:v2.1",
    inputSchema: JSON.stringify({
      type: "object",
      properties: {
        text: { type: "string" },
        maxLength: { type: "number" },
      },
      required: ["text"],
    }),
    outputSchema: JSON.stringify({
      type: "object",
      properties: {
        summary: { type: "string" },
      },
      required: ["summary"],
    }),
    version: "2.1.0",
  },
  {
    name: "Weather Forecaster",
    description: "Provides weather forecast for a given location",
    dockerImage: "weatherapi/forecaster:v3.0",
    inputSchema: JSON.stringify({
      type: "object",
      properties: {
        latitude: { type: "number" },
        longitude: { type: "number" },
        days: { type: "number" },
      },
      required: ["latitude", "longitude"],
    }),
    outputSchema: JSON.stringify({
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
    }),
    version: "3.0.0",
  },
]

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate Docker image
    try {
      const [repo, tag] = body.dockerImage.split(":")
      await docker.pull(repo, { tag: tag || "latest" })
    } catch (error) {
      console.error("Error pulling Docker image:", error)
      return NextResponse.json(
        { error: "Invalid Docker image" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    // Add the new function to the list
    registeredFunctions.push(body)

    return NextResponse.json(
      { message: "Function registered successfully" },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error) {
    console.error("Error in POST /api/register:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  }
}

export async function GET() {
  try {
    return NextResponse.json(registeredFunctions, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Error in GET /api/register:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  }
}


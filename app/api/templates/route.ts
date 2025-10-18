import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const templateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).optional().default([]),
  isPublic: z.boolean().optional().default(false),
})

// GET /api/templates - Get all templates for authenticated user
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's templates and public system templates
    const templates = await prisma.template.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { userId: null, isPublic: true },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ templates }, { status: 200 })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create a new template
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = templateSchema.parse(body)

    const now = new Date()
    await prisma.$runCommandRaw({
      insert: "templates",
      documents: [
        {
          name: validatedData.name,
          content: validatedData.content,
          tags: validatedData.tags,
          isPublic: validatedData.isPublic,
          userId: { $oid: session.user.id },
          createdAt: { $date: now.toISOString() },
          updatedAt: { $date: now.toISOString() },
        },
      ],
    })

    const template = await prisma.template.findFirst({
      where: {
        userId: session.user.id,
        name: validatedData.name,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(
      { message: "Template created successfully", template },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating template:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

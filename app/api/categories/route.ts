import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  color: z.string().optional().default("#A6B1E1"),
})

// GET /api/categories - Get all categories for authenticated user
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const categories = await prisma.category.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({ categories }, { status: 200 })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category
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
    const validatedData = categorySchema.parse(body)

    const now = new Date()
    await prisma.$runCommandRaw({
      insert: "categories",
      documents: [
        {
          name: validatedData.name,
          color: validatedData.color,
          userId: { $oid: session.user.id },
          createdAt: { $date: now.toISOString() },
          updatedAt: { $date: now.toISOString() },
        },
      ],
    })

    const category = await prisma.category.findFirst({
      where: {
        userId: session.user.id,
        name: validatedData.name,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(
      { message: "Category created successfully", category },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

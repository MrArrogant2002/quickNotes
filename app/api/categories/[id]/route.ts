import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const categoryUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z.string().optional(),
})

// PUT /api/categories/[id] - Update a category
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const validatedData = categoryUpdateSchema.parse(body)

    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category || category.userId !== session.user.id) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const now = new Date()
    await prisma.$runCommandRaw({
      update: "categories",
      updates: [
        {
          q: { _id: { $oid: id } },
          u: {
            $set: {
              ...validatedData,
              updatedAt: { $date: now.toISOString() },
            },
          },
        },
      ],
    })

    const updatedCategory = await prisma.category.findUnique({
      where: { id },
    })

    return NextResponse.json(
      { message: "Category updated successfully", category: updatedCategory },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category || category.userId !== session.user.id) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

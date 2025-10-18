import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema for updating notes
const noteUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long").optional(),
  content: z.string().min(1, "Content is required").optional(),
  tags: z.array(z.string()).optional(),
})

// GET /api/notes/[id] - Get a single note
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Await params
    const { id } = await params

    const note = await prisma.note.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    })

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      )
    }

    // Check if user owns the note
    if (note.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this note" },
        { status: 403 }
      )
    }

    // Remove userId from response for security
    const { userId: _userId, ...noteData } = note

    return NextResponse.json({ note: noteData }, { status: 200 })
  } catch (error) {
    console.error("Error fetching note:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/notes/[id] - Update a note
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Await params
    const { id } = await params

    // Check if note exists and user owns it
    const existingNote = await prisma.note.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    })

    if (!existingNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      )
    }

    if (existingNote.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this note" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = noteUpdateSchema.parse(body)

    // Use $runCommandRaw to update the note (avoid MongoDB replica set requirement)
    const updateDoc: Record<string, unknown> = {
      updatedAt: { $date: new Date().toISOString() },
    }
    
    if (validatedData.title !== undefined) updateDoc.title = validatedData.title
    if (validatedData.content !== undefined) updateDoc.content = validatedData.content
    if (validatedData.tags !== undefined) updateDoc.tags = validatedData.tags

    await prisma.$runCommandRaw({
      update: "notes",
      updates: [
        {
          q: { _id: { $oid: id } },
          u: { $set: updateDoc },
        } as never,
      ],
    })

    // Fetch the updated note
    const note = await prisma.note.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(
      { message: "Note updated successfully", note },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating note:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Await params
    const { id } = await params

    // Check if note exists and user owns it
    const existingNote = await prisma.note.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    })

    if (!existingNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      )
    }

    if (existingNote.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this note" },
        { status: 403 }
      )
    }

    await prisma.note.delete({
      where: {
        id,
      },
    })

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting note:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

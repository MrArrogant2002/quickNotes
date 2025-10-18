import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

// POST /api/notes/share - Generate or update share token for a note
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { noteId, isPublic } = await req.json()

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      )
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
    })

    if (!note || note.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      )
    }

    // Generate a unique share token
    const shareToken = randomBytes(16).toString("hex")
    
    const now = new Date()
    await prisma.$runCommandRaw({
      update: "notes",
      updates: [
        {
          q: { _id: { $oid: noteId } },
          u: {
            $set: {
              isPublic: isPublic ?? true,
              shareToken: shareToken,
              updatedAt: { $date: now.toISOString() },
            },
          },
        },
      ],
    })

    return NextResponse.json(
      { 
        message: "Share link generated successfully", 
        shareToken,
        shareUrl: `${process.env.NEXTAUTH_URL}/shared/${shareToken}`
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error sharing note:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/notes/share - Remove share access for a note
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { noteId } = await req.json()

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      )
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
    })

    if (!note || note.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      )
    }

    const now = new Date()
    await prisma.$runCommandRaw({
      update: "notes",
      updates: [
        {
          q: { _id: { $oid: noteId } },
          u: {
            $set: {
              isPublic: false,
              shareToken: null,
              updatedAt: { $date: now.toISOString() },
            },
          },
        },
      ],
    })

    return NextResponse.json(
      { message: "Share link removed successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error removing share:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

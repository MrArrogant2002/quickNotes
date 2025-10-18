import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/notes/versions?noteId=xxx - Get all versions for a note
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const searchParams = req.nextUrl.searchParams
    const noteId = searchParams.get("noteId")

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

    const versions = await prisma.noteVersion.findMany({
      where: {
        noteId: noteId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ versions }, { status: 200 })
  } catch (error) {
    console.error("Error fetching note versions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/notes/versions - Create a new version (automatically on update)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { noteId, title, content, tags } = await req.json()

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

    // Get the next version number
    const latestVersion = await prisma.noteVersion.findFirst({
      where: { noteId },
      orderBy: { version: "desc" },
    })

    const nextVersion = (latestVersion?.version || 0) + 1

    const now = new Date()
    await prisma.$runCommandRaw({
      insert: "note_versions",
      documents: [
        {
          noteId: { $oid: noteId },
          title: title || note.title,
          content: content || note.content,
          tags: tags || note.tags,
          version: nextVersion,
          userId: { $oid: session.user.id },
          createdAt: { $date: now.toISOString() },
        },
      ],
    })

    return NextResponse.json(
      { message: "Version created successfully", version: nextVersion },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating version:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

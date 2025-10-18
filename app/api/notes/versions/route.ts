import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// TODO: Implement version control feature - requires NoteVersion model in Prisma schema
// Temporarily disabled to make the app deployable

// GET /api/notes/versions?noteId=xxx - Get all versions for a note
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Feature temporarily disabled
    return NextResponse.json(
      { error: "Version control feature coming soon", versions: [] },
      { status: 501 }
    )
  } catch (error) {
    console.error("Error fetching note versions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/notes/versions - Create a new version (automatically on update)
export async function POST() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Feature temporarily disabled
    return NextResponse.json(
      { error: "Version control feature coming soon" },
      { status: 501 }
    )
  } catch (error) {
    console.error("Error creating version:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

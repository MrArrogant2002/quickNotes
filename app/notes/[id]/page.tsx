import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NoteEditorClient } from "@/components/notes/note-editor-client"

export default async function NoteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Await params
  const { id } = await params

  // Fetch the note
  const note = await prisma.note.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      tags: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  // Check if note exists
  if (!note) {
    redirect("/dashboard")
  }

  // Check if user owns the note
  if (note.userId !== session.user.id) {
    redirect("/dashboard")
  }

  return <NoteEditorClient note={note} />
}

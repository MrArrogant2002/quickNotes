import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardClient } from "@/components/notes/dashboard-client"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch user's notes
  const notesData = await prisma.note.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      content: true,
      tags: true,
      isPublic: true,
      shareToken: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  // Convert Date objects to strings for client component
  const notes = notesData.map(note => ({
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  }))

  return <DashboardClient notes={notes} user={session.user} />
}

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProfileClient } from "@/components/auth/profile-client"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  })
  
  // Count notes manually since we removed Prisma relations
  const notesCount = await prisma.note.count({
    where: {
      userId: session.user.id,
    },
  })

  const notes = await prisma.note.findMany({
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
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    redirect("/login")
  }

  // Add notes count to user object
  const userWithCount = {
    ...user,
    _count: {
      notes: notesCount,
    },
  }

  return <ProfileClient user={userWithCount} notes={notes} />
}

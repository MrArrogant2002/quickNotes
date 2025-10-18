import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import Link from "next/link"

export default async function SharedNotePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const note = await prisma.note.findFirst({
    where: {
      shareToken: token,
      isPublic: true,
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

  if (!note) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4EEFF] via-[#DCD6F7] to-[#A6B1E1] dark:from-gray-900 dark:via-[#424874] dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl shadow-xl p-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
                {note.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span>Created: {format(new Date(note.createdAt), "MMM d, yyyy")}</span>
                <span>•</span>
                <span>Updated: {format(new Date(note.updatedAt), "MMM d, yyyy")}</span>
              </div>
            </div>

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#E4E1F6] dark:bg-[#424874] text-[#424874] dark:text-[#A6B1E1] rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </div>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            <p>
              This note was shared via{" "}
              <Link href="/" className="font-semibold text-[#424874] dark:text-[#A6B1E1] hover:underline">
                QuickNotes
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

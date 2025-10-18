"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, FileText, Mail } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface ProfileUser {
  id: string
  name: string | null
  email: string
  avatar: string | null
  createdAt: string
  _count: {
    notes: number
  }
}

interface ProfileClientProps {
  user: ProfileUser
  notes: Note[]
}

// Separate component for time display to avoid hydration issues
function NoteTimeDisplay({ updatedAt }: { updatedAt: string }) {
  const [timeAgo, setTimeAgo] = useState<string>("")

  useEffect(() => {
    setTimeAgo(formatDistanceToNow(new Date(updatedAt), { addSuffix: true }))
    
    const interval = setInterval(() => {
      setTimeAgo(formatDistanceToNow(new Date(updatedAt), { addSuffix: true }))
    }, 60000)

    return () => clearInterval(interval)
  }, [updatedAt])

  return (
    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
      {timeAgo ? `Updated ${timeAgo}` : "Updated recently"}
    </p>
  )
}

// Helper function to strip HTML tags and get plain text
function stripHtml(html: string): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '')
  // Decode HTML entities (server-safe method)
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

export function ProfileClient({ user, notes }: ProfileClientProps) {
  const router = useRouter()

  const userInitials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email[0].toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4EEFF] via-[#DCD6F7] to-[#A6B1E1] dark:from-gray-900 dark:via-[#424874] dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-6 hover:bg-white/50 dark:hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Profile Header */}
        <Card className="mb-8 border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <Avatar className="w-28 h-28 border-4 border-white dark:border-gray-800 shadow-xl">
                <AvatarFallback className="text-4xl bg-gradient-to-br from-[#A6B1E1] to-[#424874] text-white font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#A6B1E1] to-[#424874] bg-clip-text text-transparent">
                  {user.name || "User"}
                </h1>
                <div className="space-y-3 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-5 h-5" />
                    <span className="text-base">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-base">Joined {format(new Date(user.createdAt), "MMMM d, yyyy")}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center bg-[#F4EEFF] dark:bg-blue-900/30 rounded-xl px-6 py-4">
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#A6B1E1] to-[#424874] bg-clip-text text-transparent">
                    {user._count.notes}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Notes</div>
                </div>
                <div className="text-center bg-[#DCD6F7] dark:bg-purple-900/30 rounded-xl px-6 py-4">
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#A6B1E1] to-[#424874] bg-clip-text text-transparent">
                    {new Set(notes.flatMap(note => note.tags)).size}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Tags</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#A6B1E1] to-[#424874] bg-clip-text text-transparent">
              My Notes
            </h2>
            <Button 
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-[#A6B1E1] to-[#424874] hover:from-[#8B9FD9] hover:to-[#333561] text-white shadow-lg shadow-[#A6B1E1]/30"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Dashboard
            </Button>
          </div>

          {notes.length === 0 ? (
            <Card className="border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-[#F4EEFF] to-[#DCD6F7] dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-[#424874] dark:text-[#A6B1E1]" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">No notes yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  Create your first note to get started
                </p>
                <Button 
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-r from-[#A6B1E1] to-[#424874] hover:from-[#8B9FD9] hover:to-[#333561] text-white shadow-lg"
                >
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notes.map((note, index) => (
                <div
                  key={note.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Card className="group hover:shadow-2xl hover:shadow-[#A6B1E1]/10 transition-all duration-300 hover:-translate-y-1 border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link href={`/notes/${note.id}`}>
                            <CardTitle className="hover:text-[#424874] dark:hover:text-[#A6B1E1] cursor-pointer text-xl font-bold transition-colors">
                              {note.title}
                            </CardTitle>
                          </Link>
                          <NoteTimeDisplay updatedAt={note.updatedAt} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/notes/${note.id}`}>
                        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 cursor-pointer leading-relaxed">
                          {stripHtml(note.content).substring(0, 200)}
                          {stripHtml(note.content).length > 200 && "..."}
                        </p>
                      </Link>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {note.tags.map((tag) => (
                            <Badge 
                              key={tag}
                              className="bg-[#DCD6F7] text-[#424874] dark:bg-blue-900 dark:text-blue-300 border-0 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

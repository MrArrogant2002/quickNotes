"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, FileText, Mail, User } from "lucide-react"
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

// Helper function to strip HTML tags and get plain text
function stripHtml(html: string): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '')
  // Decode HTML entities
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

export function ProfileClient({ user, notes }: ProfileClientProps) {
  const router = useRouter()

  const userInitials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email[0].toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{user.name || "User"}</h1>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {format(new Date(user.createdAt), "MMMM d, yyyy")}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{user._count.notes}</div>
                  <div className="text-sm text-muted-foreground">Notes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {new Set(notes.flatMap(note => note.tags)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Tags</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">My Notes</h2>
            <Button onClick={() => router.push("/dashboard")}>
              <FileText className="w-4 h-4 mr-2" />
              View Dashboard
            </Button>
          </div>

          {notes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first note to get started
                </p>
                <Button onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <Card key={note.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/notes/${note.id}`}>
                          <CardTitle className="hover:text-primary cursor-pointer">
                            {note.title}
                          </CardTitle>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/notes/${note.id}`}>
                      <p className="text-muted-foreground mb-3 line-clamp-2 cursor-pointer">
                        {stripHtml(note.content).substring(0, 200)}
                        {stripHtml(note.content).length > 200 && "..."}
                      </p>
                    </Link>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag) => (
                          <Badge key={tag}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

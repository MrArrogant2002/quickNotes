"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateNoteDialog } from "@/components/notes/create-note-dialog"
import { NoteCard } from "@/components/notes/note-card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LogOut, Search, StickyNote, User } from "lucide-react"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface DashboardClientProps {
  notes: Note[]
  user: {
    id: string
    name: string | null
    email: string
  }
}

export function DashboardClient({ notes: initialNotes, user }: DashboardClientProps) {
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null)

  const handleNoteCreated = () => {
    router.refresh()
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return
    }

    setDeletingNoteId(noteId)

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        toast.error("Failed to delete note")
        return
      }

      toast.success("Note deleted successfully")
      setNotes(notes.filter((note) => note.id !== noteId))
    } catch (error) {
      console.error("Error deleting note:", error)
      toast.error("Something went wrong")
    } finally {
      setDeletingNoteId(null)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase()
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  })

  const userInitials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email[0].toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4EEFF] via-[#DCD6F7] to-[#A6B1E1] dark:from-gray-900 dark:via-[#424874] dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl sticky top-0 z-10 shadow-sm" role="banner">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A6B1E1] to-[#424874] rounded-lg flex items-center justify-center shadow-lg shadow-[#A6B1E1]/30" aria-hidden="true">
                <StickyNote className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#A6B1E1] to-[#424874] bg-clip-text text-transparent">
                  QuickNotes
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400" aria-live="polite" aria-atomic="true">
                  {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-11 w-11 rounded-full hover:ring-2 hover:ring-[#A6B1E1]/50 transition-all focus:ring-2 focus:ring-[#A6B1E1] focus:ring-offset-2"
                    aria-label={`User menu for ${user.name || user.email}`}
                  >
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className="bg-gradient-to-br from-[#A6B1E1] to-[#424874] text-white font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 shadow-xl">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">{user.name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-700">
                    <User className="w-4 h-4 mr-2" aria-hidden="true" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-700">
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in">
          <div className="relative flex-1">
            <label htmlFor="note-search" className="sr-only">Search notes</label>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" aria-hidden="true" />
            <Input
              id="note-search"
              placeholder="Search notes by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#A6B1E1]/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur"
              aria-label="Search through your notes"
              role="searchbox"
            />
          </div>
          <CreateNoteDialog onNoteCreated={handleNoteCreated} />
        </div>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }} aria-label="Dashboard statistics">
          <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Notes</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1" aria-label={`${notes.length} total notes`}>{notes.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#DCD6F7] dark:bg-blue-900 rounded-lg flex items-center justify-center" aria-hidden="true">
                <StickyNote className="w-6 h-6 text-[#424874] dark:text-[#A6B1E1]" />
              </div>
            </div>
          </article>
          
          <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Tags Used</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1" aria-label={`${new Set(notes.flatMap(note => note.tags)).size} unique tags`}>
                  {new Set(notes.flatMap(note => note.tags)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#F4EEFF] dark:bg-purple-900 rounded-lg flex items-center justify-center" aria-hidden="true">
                <Search className="w-6 h-6 text-[#424874] dark:text-[#A6B1E1]" />
              </div>
            </div>
          </article>
          
          <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Active Searches</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1" aria-label={`${searchQuery ? filteredNotes.length : notes.length} notes shown`}>{searchQuery ? filteredNotes.length : notes.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#DCD6F7] dark:bg-green-900 rounded-lg flex items-center justify-center" aria-hidden="true">
                <User className="w-6 h-6 text-[#424874] dark:text-[#A6B1E1]" />
              </div>
            </div>
          </article>
        </section>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-[#F4EEFF] to-[#DCD6F7] dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <StickyNote className="w-10 h-10 text-[#424874] dark:text-[#A6B1E1]" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
              {searchQuery ? "No notes found" : "No notes yet"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search query to find what you're looking for"
                : "Start creating notes to organize your thoughts and ideas"}
            </p>
            {!searchQuery && <CreateNoteDialog onNoteCreated={handleNoteCreated} />}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note, index) => (
              <div
                key={note.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <NoteCard
                  {...note}
                  onDelete={handleDeleteNote}
                  isDeleting={deletingNoteId === note.id}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

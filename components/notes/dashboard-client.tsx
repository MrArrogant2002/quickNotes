"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateNoteDialog } from "@/components/notes/create-note-dialog"
import { CreateCategoryDialog } from "@/components/categories/create-category-dialog"
import { NoteCard } from "@/components/notes/note-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogOut, Search, StickyNote, User, Copy, X } from "lucide-react"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  isPublic?: boolean
  shareToken?: string | null
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
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareNote, setShareNote] = useState<Note | null>(null)
  const [shareUrl, setShareUrl] = useState("")

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

  const handleShareNote = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    if (!note) return

    if (note.shareToken) {
      // Already shared, show existing link
      setShareUrl(`${window.location.origin}/shared/${note.shareToken}`)
      setShareNote(note)
      setShareDialogOpen(true)
    } else {
      // Generate new share link
      try {
        const response = await fetch("/api/notes/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noteId, isPublic: true }),
        })

        if (!response.ok) {
          toast.error("Failed to generate share link")
          return
        }

        const data = await response.json()
        setShareUrl(data.shareUrl)
        setShareNote(note)
        setShareDialogOpen(true)
        
        // Update local state
        setNotes(notes.map(n => 
          n.id === noteId 
            ? { ...n, isPublic: true, shareToken: data.shareToken }
            : n
        ))
        
        toast.success("Share link generated!")
      } catch (error) {
        console.error("Error sharing note:", error)
        toast.error("Something went wrong")
      }
    }
  }

  const handleRemoveShare = async () => {
    if (!shareNote) return

    try {
      const response = await fetch("/api/notes/share", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: shareNote.id }),
      })

      if (!response.ok) {
        toast.error("Failed to remove share link")
        return
      }

      // Update local state
      setNotes(notes.map(n => 
        n.id === shareNote.id 
          ? { ...n, isPublic: false, shareToken: null }
          : n
      ))
      
      setShareDialogOpen(false)
      setShareNote(null)
      setShareUrl("")
      toast.success("Share link removed")
    } catch (error) {
      console.error("Error removing share:", error)
      toast.error("Something went wrong")
    }
  }

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success("Link copied to clipboard!")
  }

  const handleExportNote = async (noteId: string, format: "markdown" | "pdf") => {
    try {
      const response = await fetch(`/api/notes/export?noteId=${noteId}&format=${format}`)
      
      if (!response.ok) {
        toast.error("Failed to export note")
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `note-${noteId}.${format === "markdown" ? "md" : "html"}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success(`Note exported as ${format.toUpperCase()}`)
    } catch (error) {
      console.error("Error exporting note:", error)
      toast.error("Something went wrong")
    }
  }

  const handleViewHistory = (noteId: string) => {
    // Navigate to note page where history can be viewed
    router.push(`/notes/${noteId}?tab=history`)
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
      <header className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A6B1E1] to-[#424874] rounded-lg flex items-center justify-center shadow-lg shadow-[#A6B1E1]/30">
                <StickyNote className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#A6B1E1] to-[#424874] bg-clip-text text-transparent">
                  QuickNotes
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-11 w-11 rounded-full hover:ring-2 hover:ring-[#A6B1E1]/50 transition-all">
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
                  <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Create */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search notes by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#A6B1E1]/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur"
            />
          </div>
          <div className="flex gap-2">
            <CreateCategoryDialog onCategoryCreated={() => router.refresh()} />
            <CreateNoteDialog onNoteCreated={handleNoteCreated} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Notes</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{notes.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#DCD6F7] dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <StickyNote className="w-6 h-6 text-[#424874] dark:text-[#A6B1E1]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Tags Used</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {new Set(notes.flatMap(note => note.tags)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#F4EEFF] dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-[#424874] dark:text-[#A6B1E1]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Active Searches</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{searchQuery ? filteredNotes.length : notes.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#DCD6F7] dark:bg-green-900 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-[#424874] dark:text-[#A6B1E1]" />
              </div>
            </div>
          </div>
        </div>

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
                  onShare={handleShareNote}
                  onExport={handleExportNote}
                  onViewHistory={handleViewHistory}
                  isDeleting={deletingNoteId === note.id}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Note</DialogTitle>
            <DialogDescription>
              Anyone with this link can view this note.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleCopyShareLink}
                className="shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={handleRemoveShare}
                className="text-destructive"
              >
                <X className="w-4 h-4 mr-2" />
                Remove Share Link
              </Button>
              <Button
                variant="outline"
                onClick={() => setShareDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

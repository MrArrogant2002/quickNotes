"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Save, Trash2, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

// Dynamically import TipTap editor to reduce initial bundle size
const TiptapEditor = dynamic(
  () => import("@/components/editor/tiptap-editor").then((mod) => ({ default: mod.TiptapEditor })),
  {
    loading: () => (
      <div className="border rounded-lg overflow-hidden">
        <div className="border-b bg-gray-50 dark:bg-gray-900 p-2 h-[52px] animate-pulse"></div>
        <div className="min-h-[300px] flex items-center justify-center bg-white dark:bg-gray-950">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#A6B1E1]" />
            <p className="text-sm text-slate-600 dark:text-slate-300">Loading editor...</p>
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
)

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface NoteEditorClientProps {
  note: Note
}

export function NoteEditorClient({ note }: NoteEditorClientProps) {
  const router = useRouter()
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState<string[]>(note.tags)
  const [tagInput, setTagInput] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [timeAgo, setTimeAgo] = useState<string>("")

  useEffect(() => {
    setTimeAgo(formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true }))
    
    const interval = setInterval(() => {
      setTimeAgo(formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true }))
    }, 60000)

    return () => clearInterval(interval)
  }, [note.updatedAt])

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!content.trim()) {
      toast.error("Content is required")
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          tags,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Failed to save note")
        return
      }

      toast.success("Note saved successfully!")
      router.refresh()
    } catch (error) {
      console.error("Error saving note:", error)
      toast.error("Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || "Failed to delete note")
        return
      }

      toast.success("Note deleted successfully!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting note:", error)
      toast.error("Something went wrong")
    } finally {
      setIsDeleting(false)
    }
  }

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4EEFF] via-[#DCD6F7] to-[#A6B1E1] dark:from-gray-900 dark:via-[#424874] dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="hover:bg-white/50 dark:hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="shadow-lg"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-[#A6B1E1] to-[#424874] hover:from-[#8B9FD9] hover:to-[#333561] text-white shadow-lg shadow-[#A6B1E1]/30"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Note Editor Card */}
        <Card className="border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="border-b border-slate-200 dark:border-slate-700">
            <div className="space-y-6">
              {/* Title */}
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="text-3xl font-bold border-0 focus-visible:ring-0 px-0 placeholder:text-slate-400"
              />

              {/* Tags */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      className="pl-3 pr-2 py-1.5 bg-[#DCD6F7] text-[#424874] dark:bg-blue-900 dark:text-[#A6B1E1] border-0 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-destructive transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add a tag..."
                    className="flex-1 h-10 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    className="px-6"
                  >
                    Add Tag
                  </Button>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">
                  {timeAgo ? `Last updated ${timeAgo}` : "Last updated recently"}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* TipTap Editor with fade-in animation */}
            <div className="animate-fade-in">
              <TiptapEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your note..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

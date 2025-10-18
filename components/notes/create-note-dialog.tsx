"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"

interface CreateNoteDialogProps {
  onNoteCreated?: () => void
}

export function CreateNoteDialog({ onNoteCreated }: CreateNoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
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
        toast.error(data.error || "Failed to create note")
        return
      }

      toast.success("Note created successfully!")
      setTitle("")
      setContent("")
      setTags([])
      setOpen(false)
      onNoteCreated?.()
    } catch (error) {
      console.error("Error creating note:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-[#A6B1E1] to-[#424874] hover:from-[#8B9FD9] hover:to-[#333561] text-white shadow-lg shadow-[#A6B1E1]/30 hover:shadow-[#A6B1E1]/50 transition-all duration-300 hover:scale-105 h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#A6B1E1] to-[#424874] bg-clip-text text-transparent">
              Create New Note
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Add a new note to your collection. You can organize it with tags.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">Title</Label>
              <Input
                id="title"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-semibold">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your note content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                disabled={isLoading}
                rows={6}
                className="border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-semibold">Tags (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  disabled={isLoading}
                  className="h-10 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/50"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={isLoading || !tagInput.trim()}
                  className="px-4"
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      className="pl-3 pr-2 py-1.5 bg-[#DCD6F7] text-[#424874] dark:bg-blue-900 dark:text-[#A6B1E1] border-0 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-destructive transition-colors"
                        disabled={isLoading}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-[#A6B1E1] to-[#424874] hover:from-[#8B9FD9] hover:to-[#333561] text-white px-6"
            >
              {isLoading ? "Creating..." : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

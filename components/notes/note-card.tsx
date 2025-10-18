"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Calendar, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface NoteCardProps {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
  onDelete?: (id: string) => void
  isDeleting?: boolean
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

export function NoteCard({ id, title, content, tags, updatedAt, onDelete, isDeleting }: NoteCardProps) {
  // Strip HTML and truncate content for preview
  const plainText = stripHtml(content)
  const preview = plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText

  // Use client-side only rendering for time to avoid hydration mismatch
  const [timeAgo, setTimeAgo] = useState<string>("")

  useEffect(() => {
    setTimeAgo(formatDistanceToNow(new Date(updatedAt), { addSuffix: true }))
    
    // Optional: Update every minute
    const interval = setInterval(() => {
      setTimeAgo(formatDistanceToNow(new Date(updatedAt), { addSuffix: true }))
    }, 60000) // 60 seconds

    return () => clearInterval(interval)
  }, [updatedAt])

  return (
    <Card className="group hover:shadow-2xl hover:shadow-[#A6B1E1]/10 transition-all duration-300 hover:-translate-y-1 border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur overflow-hidden relative" role="article" aria-label={`Note: ${title}`}>
      {isDeleting && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex items-center justify-center" role="status" aria-live="polite">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#A6B1E1]" aria-hidden="true" />
            <p className="text-sm text-slate-600 dark:text-slate-300">Deleting...</p>
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/notes/${id}`} className="focus:outline-none focus:ring-2 focus:ring-[#A6B1E1] rounded">
              <CardTitle className="hover:text-[#424874] dark:hover:text-[#A6B1E1] cursor-pointer line-clamp-1 text-lg font-bold transition-colors">
                {title}
              </CardTitle>
            </Link>
            <CardDescription className="flex items-center gap-1 mt-2">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <time className="text-xs" dateTime={updatedAt}>
                {timeAgo ? `Updated ${timeAgo}` : "Updated recently"}
              </time>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus:ring-2 focus:ring-[#A6B1E1]"
                aria-label={`Actions for ${title}`}
              >
                <MoreVertical className="w-4 h-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 shadow-xl">
              <DropdownMenuItem asChild>
                <Link href={`/notes/${id}`} className="flex items-center cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-700">
                  <Edit className="w-4 h-4 mr-2" aria-hidden="true" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(id)}
                className="text-destructive focus:text-destructive cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-700"
              >
                <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/notes/${id}`} className="focus:outline-none focus:ring-2 focus:ring-[#A6B1E1] rounded block">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-3 cursor-pointer leading-relaxed">
            {preview}
          </p>
        </Link>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5" role="list" aria-label="Note tags">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                className="text-xs px-2 py-0.5 bg-[#DCD6F7] text-[#424874] dark:bg-blue-900 dark:text-[#A6B1E1] border-0 hover:bg-[#F4EEFF] dark:hover:bg-blue-800 transition-colors"
                role="listitem"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

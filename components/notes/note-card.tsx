"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Calendar, Loader2, Share2, Download, History } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface NoteCardProps {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
  isPublic?: boolean
  shareToken?: string | null
  onDelete?: (id: string) => void
  onShare?: (id: string) => void
  onExport?: (id: string, format: "markdown" | "pdf") => void
  onViewHistory?: (id: string) => void
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

export function NoteCard({ 
  id, 
  title, 
  content, 
  tags, 
  updatedAt, 
  isPublic,
  // shareToken,
  onDelete, 
  onShare,
  onExport,
  onViewHistory,
  isDeleting 
}: NoteCardProps) {
  // Strip HTML and truncate content for preview
  const plainText = stripHtml(content)
  const preview = plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText

  return (
    <Card className="group hover:shadow-2xl hover:shadow-[#A6B1E1]/10 transition-all duration-300 hover:-translate-y-1 border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur overflow-hidden relative">
      {isDeleting && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#A6B1E1]" />
            <p className="text-sm text-slate-600 dark:text-slate-300">Deleting...</p>
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/notes/${id}`}>
              <CardTitle className="hover:text-[#424874] dark:hover:text-[#A6B1E1] cursor-pointer line-clamp-1 text-lg font-bold transition-colors">
                {title}
              </CardTitle>
            </Link>
            <CardDescription className="flex items-center gap-1 mt-2">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">
                Updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
              </span>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 shadow-xl">
              <DropdownMenuItem asChild>
                <Link href={`/notes/${id}`} className="flex items-center cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {onShare && (
                <DropdownMenuItem
                  onClick={() => onShare(id)}
                  className="cursor-pointer"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {isPublic ? "Manage Sharing" : "Share Note"}
                </DropdownMenuItem>
              )}
              {onExport && (
                <>
                  <DropdownMenuItem
                    onClick={() => onExport(id, "markdown")}
                    className="cursor-pointer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onExport(id, "pdf")}
                    className="cursor-pointer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </>
              )}
              {onViewHistory && (
                <DropdownMenuItem
                  onClick={() => onViewHistory(id)}
                  className="cursor-pointer"
                >
                  <History className="w-4 h-4 mr-2" />
                  View History
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onDelete?.(id)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/notes/${id}`}>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-3 cursor-pointer leading-relaxed">
            {preview}
          </p>
        </Link>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                className="text-xs px-2 py-0.5 bg-[#DCD6F7] text-[#424874] dark:bg-blue-900 dark:text-[#A6B1E1] border-0 hover:bg-[#F4EEFF] dark:hover:bg-blue-800 transition-colors"
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

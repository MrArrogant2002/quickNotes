import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/notes/export?noteId=xxx&format=markdown|pdf
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const searchParams = req.nextUrl.searchParams
    const noteId = searchParams.get("noteId")
    const format = searchParams.get("format") || "markdown"

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      )
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
    })

    if (!note || note.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      )
    }

    if (format === "markdown") {
      // Convert HTML content to Markdown (simple conversion)
      const markdown = convertHtmlToMarkdown(note.content)
      const content = `# ${note.title}\n\n${markdown}\n\n---\n\nTags: ${note.tags.join(", ")}\nCreated: ${new Date(note.createdAt).toLocaleDateString()}\nUpdated: ${new Date(note.updatedAt).toLocaleDateString()}`

      return new NextResponse(content, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown",
          "Content-Disposition": `attachment; filename="${note.title.replace(/[^a-z0-9]/gi, "_")}.md"`,
        },
      })
    } else if (format === "pdf") {
      // For PDF export, we'll return HTML that can be printed as PDF by the browser
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${note.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2cm; }
    h1 { color: #424874; border-bottom: 2px solid #A6B1E1; padding-bottom: 10px; }
    .metadata { color: #666; font-size: 12px; margin-bottom: 20px; }
    .content { line-height: 1.6; }
    .tags { margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd; }
    .tag { display: inline-block; background: #E4E1F6; padding: 4px 12px; margin: 4px; border-radius: 12px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>${note.title}</h1>
  <div class="metadata">
    <p>Created: ${new Date(note.createdAt).toLocaleDateString()} | Updated: ${new Date(note.updatedAt).toLocaleDateString()}</p>
  </div>
  <div class="content">
    ${note.content}
  </div>
  <div class="tags">
    ${note.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
  </div>
</body>
</html>
      `

      return new NextResponse(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `inline; filename="${note.title.replace(/[^a-z0-9]/gi, "_")}.html"`,
        },
      })
    }

    return NextResponse.json(
      { error: "Invalid format" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error exporting note:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Simple HTML to Markdown converter
function convertHtmlToMarkdown(html: string): string {
  const markdown = html
    .replace(/<h1>(.*?)<\/h1>/g, "# $1\n")
    .replace(/<h2>(.*?)<\/h2>/g, "## $1\n")
    .replace(/<h3>(.*?)<\/h3>/g, "### $1\n")
    .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
    .replace(/<b>(.*?)<\/b>/g, "**$1**")
    .replace(/<em>(.*?)<\/em>/g, "*$1*")
    .replace(/<i>(.*?)<\/i>/g, "*$1*")
    .replace(/<u>(.*?)<\/u>/g, "_$1_")
    .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<ul>/g, "")
    .replace(/<\/ul>/g, "\n")
    .replace(/<ol>/g, "")
    .replace(/<\/ol>/g, "\n")
    .replace(/<li>(.*?)<\/li>/g, "- $1\n")
    .replace(/<code>(.*?)<\/code>/g, "`$1`")
    .replace(/<pre>(.*?)<\/pre>/g, "```\n$1\n```\n")
    .replace(/<blockquote>(.*?)<\/blockquote>/g, "> $1\n")
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, "[$2]($1)")
    .replace(/<[^>]*>/g, "")
    .replace(/\n\n\n+/g, "\n\n")
  
  return markdown.trim()
}

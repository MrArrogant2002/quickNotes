# QuickNotes - Quick Start Guide for New Features

This guide will help you test all the newly implemented features.

## Prerequisites

1. MongoDB running (local or Atlas)
2. Node.js 20+ installed
3. pnpm installed

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mongodb://localhost:27017/quicknotes"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NODE_ENV="development"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Database Setup

Push the new schema to MongoDB:

```bash
pnpm prisma generate
pnpm prisma db push
```

This will create the following collections:
- `users` (with email verification and password reset fields)
- `notes` (with categories, sharing, templates, attachments, versioning)
- `categories` (new)
- `templates` (new)
- `note_versions` (new)

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at http://localhost:3000

## Testing Features

### 1. Dark Mode Toggle

1. Open the dashboard
2. Click the sun/moon icon in the header
3. Choose Light, Dark, or System theme
4. Theme preference persists across sessions

### 2. Categories

1. Click "New Category" button on dashboard
2. Enter a category name (e.g., "Work")
3. Choose a color from the presets or use the color picker
4. Click "Create Category"
5. Category is now available for organizing notes

**API Test:**
```bash
# Get all categories
curl -X GET http://localhost:3000/api/categories \
  -H "Cookie: your-session-cookie"
```

### 3. Note Sharing

1. Find a note in the dashboard
2. Click the three dots menu on the note card
3. Click "Share Note"
4. A share link will be generated
5. Copy the link and open it in an incognito window
6. The note is viewable without authentication
7. To revoke: click "Remove Share Link" in the share dialog

**API Test:**
```bash
# Generate share link
curl -X POST http://localhost:3000/api/notes/share \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"noteId":"your-note-id","isPublic":true}'

# Remove share link
curl -X DELETE http://localhost:3000/api/notes/share \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"noteId":"your-note-id"}'
```

### 4. Export Notes

1. Find a note in the dashboard
2. Click the three dots menu
3. Choose "Export as Markdown" or "Export as PDF"
4. The file will download automatically

**Markdown Export:**
- Creates a `.md` file with markdown formatting
- Includes title, content, tags, and timestamps

**PDF Export:**
- Creates an HTML file formatted for printing
- Use browser's "Print to PDF" feature for final PDF

**API Test:**
```bash
# Export as Markdown
curl http://localhost:3000/api/notes/export?noteId=your-note-id&format=markdown \
  -H "Cookie: your-session-cookie" \
  -o note.md

# Export as PDF (HTML)
curl http://localhost:3000/api/notes/export?noteId=your-note-id&format=pdf \
  -H "Cookie: your-session-cookie" \
  -o note.html
```

### 5. Note Templates

**Create a Template:**
```bash
curl -X POST http://localhost:3000/api/templates \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "name":"Meeting Notes",
    "content":"<p>Date: </p><p>Attendees: </p><p>Topics: </p>",
    "tags":["meeting"],
    "isPublic":false
  }'
```

**Get All Templates:**
```bash
curl http://localhost:3000/api/templates \
  -H "Cookie: your-session-cookie"
```

**Create Note from Template:**
When creating a note, include `templateId` in the request.

### 6. Note Versioning

Version history is automatically created when updating notes.

**View History:**
1. Click the three dots menu on a note
2. Click "View History"
3. You'll be redirected to the note page (implement history UI there)

**API Test:**
```bash
# Get note versions
curl http://localhost:3000/api/notes/versions?noteId=your-note-id \
  -H "Cookie: your-session-cookie"
```

### 7. Email Verification

Email verification is set up but requires an email service for production.

**Test Flow:**
1. Register a new user at `/register`
2. Check the console for the verification token (development mode)
3. Visit the verification URL: `/verify-email?token=xxx`
4. Email is marked as verified

**API Test:**
```bash
# Verify email
curl http://localhost:3000/api/auth/verify-email?token=your-token
```

### 8. Password Reset

Password reset is implemented but requires an email service for production.

**Test Flow:**
1. Request password reset:
```bash
curl -X POST http://localhost:3000/api/auth/request-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

2. Check console for reset token (development mode)

3. Reset password:
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"reset-token","password":"newpassword123"}'
```

### 9. Browser Extension

**Installation:**

1. Navigate to `browser-extension/` folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `browser-extension` folder

**Usage:**

1. Click the extension icon in the toolbar
2. Enter your QuickNotes URL (default: http://localhost:3000)
3. Login with your credentials
4. Create notes directly from the popup
5. Select text on any webpage, right-click, and choose "Save to QuickNotes"
6. Use keyboard shortcut: `Ctrl/Cmd + Shift + N` to save selected text

### 10. File Attachments (Schema Ready)

The database schema supports attachments, but you need to implement file upload:

**Expected Structure:**
```json
{
  "attachments": [
    {
      "id": "unique_id",
      "name": "document.pdf",
      "type": "application/pdf",
      "size": 1024000,
      "url": "https://storage.example.com/file.pdf"
    }
  ]
}
```

**To Complete:**
1. Add file upload endpoint (use multer or similar)
2. Store files in S3/Cloudinary
3. Save metadata to note's `attachments` array

### 11. MongoDB Atlas Search (Configuration Needed)

**Setup:**

1. Go to MongoDB Atlas dashboard
2. Select your cluster
3. Go to "Search" tab
4. Create a new search index with this configuration:

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "content": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "tags": {
        "type": "string",
        "analyzer": "lucene.standard"
      }
    }
  }
}
```

5. Create a search API endpoint using the example in `FEATURES.md`

## Troubleshooting

### Database Issues

If you encounter MongoDB issues:

```bash
# Reset database
pnpm prisma db push --force-reset

# Regenerate client
pnpm prisma generate
```

### TypeScript Errors

If you see TypeScript errors:

```bash
# Restart TypeScript server in VS Code
# Or run:
pnpm prisma generate
```

### Port Already in Use

If port 3000 is taken:

```bash
# Change port in package.json or use:
PORT=3001 pnpm dev
```

## Production Deployment

Before deploying to production:

1. **Email Service**: Set up SendGrid, AWS SES, or similar
2. **File Storage**: Set up S3, Cloudinary, or similar for attachments
3. **MongoDB Atlas**: Configure Atlas Search indexes
4. **Environment Variables**: Update all production URLs and secrets
5. **Browser Extension**: Update manifest.json with production API URL
6. **Security**: Enable rate limiting on API routes
7. **WebSocket**: Add Socket.io or similar for real-time features

## Next Steps

1. Test all features thoroughly
2. Add UI for viewing note history
3. Implement file upload functionality
4. Configure MongoDB Atlas Search
5. Add real-time collaborative editing
6. Set up email service for verification and password reset
7. Deploy to production (Vercel/Railway/similar)

## Documentation

- [FEATURES.md](./FEATURES.md) - Comprehensive feature documentation
- [README.md](./README.md) - Project overview
- [browser-extension/README.md](./browser-extension/README.md) - Extension guide
- [DOCKER.md](./DOCKER.md) - Docker deployment guide

## Support

For issues or questions:
1. Check the documentation
2. Review the API endpoints in the `app/api/` directory
3. Examine the database schema in `prisma/schema.prisma`
4. Create an issue on GitHub

---

Happy testing! 🚀

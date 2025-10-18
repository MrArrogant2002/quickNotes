# NotesVault - Full Stack Project Plan

## Project Overview
Building a secure, production-ready note-taking web app with:
- **Frontend**: Next.js 14 + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: MongoDB (already connected)
- **Authentication**: NextAuth with JWT sessions
- **Deployment**: Docker + CI/CD
- **Security**: Role-based access, HTTPS, environment variables

---

## Phase 1: Project Initialization & Setup
- [ ] 1.1 Initialize Next.js 14 project with TypeScript
- [ ] 1.2 Configure TailwindCSS
- [ ] 1.3 Create `.env` file for MongoDB connection string
- [ ] 1.4 Setup project folder structure
- [ ] 1.5 Initialize Git and create `.gitignore`

## Phase 2: Database & Prisma Setup
- [ ] 2.1 Install Prisma and initialize for MongoDB
- [ ] 2.2 Create Prisma schema with User model (email, password, name, avatar, createdAt)
- [ ] 2.3 Create Prisma schema with Note model (title, content, tags, userId, createdAt, updatedAt)
- [ ] 2.4 Generate Prisma Client
- [ ] 2.5 Test database connection
- [ ] 2.6 Document migration process

## Phase 3: Authentication System
- [ ] 3.1 Install NextAuth and dependencies
- [ ] 3.2 Configure NextAuth with Credentials Provider
- [ ] 3.3 Setup JWT session strategy
- [ ] 3.4 Create authentication API routes
- [ ] 3.5 Implement password hashing (bcrypt)
- [ ] 3.6 Add session management utilities

## Phase 4: Backend API - CRUD Operations
- [ ] 4.1 Install Zod for validation
- [ ] 4.2 Create API route: POST /api/notes (Create)
- [ ] 4.3 Create API route: GET /api/notes (Read all user notes)
- [ ] 4.4 Create API route: GET /api/notes/[id] (Read single note)
- [ ] 4.5 Create API route: PUT /api/notes/[id] (Update)
- [ ] 4.6 Create API route: DELETE /api/notes/[id] (Delete)
- [ ] 4.7 Add request validation with Zod
- [ ] 4.8 Implement error handling middleware
- [ ] 4.9 Add authentication checks to all note routes

## Phase 5: Frontend - Authentication Pages
- [ ] 5.1 Install shadcn/ui and setup components (Button, Input, Card, Form, Textarea, Select, Badge, Avatar, Dialog, Toast)
- [ ] 5.2 Create `/register` page with form
- [ ] 5.3 Create `/login` page with form
- [ ] 5.4 Add client-side form validation
- [ ] 5.5 Connect forms to API endpoints
- [ ] 5.6 Add loading states and error messages
- [ ] 5.7 Implement redirect after successful auth

## Phase 6: Frontend - Dashboard, Profile & Notes
- [ ] 6.1 Create `/dashboard` page (protected)
- [ ] 6.2 Create `/profile` page showing user info and feed-style notes
- [ ] 6.3 Display all user notes in feed/card layout
- [ ] 6.4 Add "Create New Note" functionality with modal/dialog
- [ ] 6.5 Create `/notes/[id]` page for viewing/editing
- [ ] 6.6 Implement rich text editor (TipTap or Quill)
- [ ] 6.7 Add tag input and management
- [ ] 6.8 Add delete note functionality
- [ ] 6.9 Add search/filter by tags
- [ ] 6.10 Add real-time UI updates

## Phase 7: Middleware & Route Protection
- [ ] 7.1 Create NextAuth middleware for route protection
- [ ] 7.2 Protect `/dashboard` route
- [ ] 7.3 Protect `/notes/*` routes
- [ ] 7.4 Implement role-based access control
- [ ] 7.5 Add authorization checks (users can only see their notes)
- [ ] 7.6 Handle unauthorized access gracefully

## Phase 8: Docker & Containerization
- [ ] 8.1 Create `Dockerfile` for Next.js app
- [ ] 8.2 Create `docker-compose.yml`
- [ ] 8.3 Configure environment variables for Docker
- [ ] 8.4 Test local Docker build
- [ ] 8.5 Test app running in container
- [ ] 8.6 Document Docker commands

## Phase 9: Security Hardening
- [ ] 9.1 Review all environment variables
- [ ] 9.2 Ensure no secrets in frontend code
- [ ] 9.3 Add rate limiting (optional but recommended)
- [ ] 9.4 Implement CORS properly
- [ ] 9.5 Add security headers
- [ ] 9.6 Validate all user inputs
- [ ] 9.7 Sanitize data before storage
- [ ] 9.8 Prepare HTTPS configuration notes

## Phase 10: Testing & Documentation
- [ ] 10.1 Test all API endpoints
- [ ] 10.2 Test authentication flow
- [ ] 10.3 Test CRUD operations
- [ ] 10.4 Test role-based access
- [ ] 10.5 Create README.md with setup instructions
- [ ] 10.6 Document environment variables
- [ ] 10.7 Document deployment process

---

## ✅ Requirements Confirmed:

1. **MongoDB Connection**: ✅ Will create `.env` file, user will paste connection string
2. **Project Name**: ✅ "quicknotes"
3. **UI Components**: ✅ Best-in-class shadcn/ui setup (Button, Input, Card, Form, Textarea, Select, Badge, Avatar, DropdownMenu, Dialog, Toast)
4. **Deployment**: ✅ Vercel (optimized for Next.js)
5. **Note Features**: ✅ Full-featured notes:
   - Title + Content
   - Rich text editing (TipTap or similar)
   - Tags/categories for organization
   - Timestamps (created/updated)
6. **User Profile**: ✅ Profile page showing user info + feed-style notes display

---

## Notes:
- Following **Mark Zuckerberg's philosophy**: Move fast, keep it simple, focus on core functionality first, iterate based on feedback
- **Security First**: Every step will prioritize production-ready security
- **Simplicity**: Each change will be minimal and focused
- **Documentation**: Every step will be explained clearly

---

## Review Section
*Will be updated after execution with summary of changes*

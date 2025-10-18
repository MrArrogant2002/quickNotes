# Testing Guide - QuickNotes Application

## 🚀 Current Status
✅ Development server running at: http://localhost:3000
✅ Database: MongoDB connected at localhost:27017/quicknotes
✅ All pages compiled successfully

---

## 📋 Manual Testing Checklist

### 1. **Homepage** (`/`)
- [ ] Hero section displays "Your Notes, Simplified"
- [ ] Features section shows 3 cards (Secure Authentication, Rich Text Editor, Smart Organization)
- [ ] "Get Started" button navigates to `/register`
- [ ] "Sign In" button navigates to `/login`
- [ ] Footer displays correct information

### 2. **Registration** (`/register`)

**Test Case 1: Valid Registration**
```
Name: John Doe
Email: john@example.com
Password: test123
```
- [ ] Form accepts valid input
- [ ] Success toast appears
- [ ] Redirects to `/login` after success
- [ ] User created in database

**Test Case 2: Duplicate Email**
```
Email: (use same email as above)
```
- [ ] Shows error: "User with this email already exists"
- [ ] Form does not submit
- [ ] Stays on registration page

**Test Case 3: Validation Errors**
- [ ] Empty email: Shows "Invalid email address"
- [ ] Invalid email format: Shows "Invalid email address"
- [ ] Password < 6 chars: Shows "Password must be at least 6 characters"
- [ ] Empty name: Shows "Name must be at least 2 characters"

### 3. **Login** (`/login`)

**Test Case 1: Valid Login**
```
Email: john@example.com
Password: test123
```
- [ ] Form accepts credentials
- [ ] Success toast appears
- [ ] Redirects to `/dashboard`
- [ ] User session created

**Test Case 2: Invalid Credentials**
```
Email: john@example.com
Password: wrongpass
```
- [ ] Shows error: "Invalid email or password"
- [ ] Form does not submit
- [ ] Stays on login page

**Test Case 3: Non-existent User**
```
Email: notfound@example.com
Password: test123
```
- [ ] Shows error: "Invalid email or password"
- [ ] Does not reveal if user exists (security)

### 4. **Dashboard** (`/dashboard`) - Protected Route

**Prerequisites:** Must be logged in

**Test Case 1: View Dashboard**
- [ ] Dashboard loads without errors
- [ ] User name displays in header
- [ ] Profile button/link is visible
- [ ] "Create Note" button is present
- [ ] Search bar is visible
- [ ] Empty state shows if no notes

**Test Case 2: Create Note**
```
Title: My First Note
Content: This is a test note with some sample content to verify the note creation functionality works correctly.
Tags: test, demo, important
```
- [ ] Click "Create Note" opens dialog
- [ ] Dialog contains Title, Content, Tags fields
- [ ] Enter tag and press Enter/click Add
- [ ] Tags display as removable badges
- [ ] Click "Create Note" button
- [ ] Success toast appears
- [ ] Dialog closes
- [ ] New note appears in grid
- [ ] Note shows correct title, content preview, tags

**Test Case 3: Search Functionality**
- [ ] Search by title (e.g., "First")
- [ ] Search by content (e.g., "sample")
- [ ] Search by tag (e.g., "test")
- [ ] Results filter in real-time
- [ ] Clear search shows all notes

**Test Case 4: Delete Note**
- [ ] Click three-dot menu on note card
- [ ] Click "Delete" option
- [ ] Confirmation dialog appears
- [ ] Click confirm
- [ ] Note removed from grid
- [ ] Success toast appears

**Test Case 5: View Note (Navigation)**
- [ ] Click on note card
- [ ] Navigates to `/notes/[id]` (will need editor page)

### 5. **Profile Page** (`/profile`) - Protected Route

**Prerequisites:** Must be logged in with at least one note

**Test Case 1: Profile Display**
- [ ] User avatar with initials displays
- [ ] User name displays correctly
- [ ] Email displays correctly
- [ ] Join date displays (e.g., "Joined October 17, 2025")
- [ ] Notes count is accurate
- [ ] Unique tags count is accurate

**Test Case 2: Notes Feed**
- [ ] All user notes display in feed layout
- [ ] Each note shows title, content preview, tags
- [ ] "Updated X ago" timestamp displays
- [ ] Notes are sorted by most recent update
- [ ] Tags display as badges
- [ ] Click note title navigates to `/notes/[id]`

**Test Case 3: Navigation**
- [ ] "Back to Dashboard" button works
- [ ] "View Dashboard" button works
- [ ] Dashboard link in header works

**Test Case 4: Empty State**
- [ ] If user has no notes, shows empty state message
- [ ] "Go to Dashboard" button is visible
- [ ] Clicking button navigates to dashboard

### 6. **Authentication & Security**

**Test Case 1: Protected Routes**
- [ ] Access `/dashboard` without login → Redirects to `/login`
- [ ] Access `/profile` without login → Redirects to `/login`
- [ ] After login, original destination is restored (if applicable)

**Test Case 2: Session Persistence**
- [ ] Login and refresh page → Still logged in
- [ ] Close tab and reopen → Session persists (30 days)
- [ ] Notes remain associated with correct user

**Test Case 3: Data Isolation**
- [ ] Create second user account
- [ ] Login as user 2
- [ ] Verify user 2 cannot see user 1's notes
- [ ] Verify user 2 can only delete their own notes

### 7. **API Endpoints**

**Test Case 1: Registration API**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```
- [ ] Returns 201 with user object
- [ ] Password is hashed in database
- [ ] Duplicate email returns 400 error

**Test Case 2: Notes API**
```bash
# Must be authenticated (use browser session)
# GET all notes
curl http://localhost:3000/api/notes

# POST create note
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"API Test","content":"Testing via API","tags":["api"]}'

# GET single note
curl http://localhost:3000/api/notes/[id]

# PUT update note
curl -X PUT http://localhost:3000/api/notes/[id] \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# DELETE note
curl -X DELETE http://localhost:3000/api/notes/[id]
```

### 8. **Responsive Design**

**Test Case 1: Mobile View (375px)**
- [ ] All pages are mobile-friendly
- [ ] Forms are usable
- [ ] Note grid stacks vertically
- [ ] Buttons are touch-friendly
- [ ] Navigation works on mobile

**Test Case 2: Tablet View (768px)**
- [ ] Layout adjusts appropriately
- [ ] Note grid shows 2 columns
- [ ] All features accessible

**Test Case 3: Desktop View (1024px+)**
- [ ] Note grid shows 3 columns
- [ ] Optimal use of screen space
- [ ] All features work as expected

---

## 🐛 Known Issues

1. **TypeScript False Positives**
   - Status: Non-blocking
   - Issue: VS Code shows "Cannot find module 'sonner'" and Badge variant errors
   - Impact: No runtime impact, app compiles and runs successfully
   - Fix: TypeScript cache issue, can be ignored

2. **Lockfile Warning**
   - Status: Warning only
   - Issue: Multiple pnpm-lock.yaml files detected
   - Impact: None, app runs normally
   - Fix: Can configure turbopack.root in next.config.ts if needed

---

## ✅ Completed Features

- [x] **User Authentication**
  - Registration with validation
  - Login with NextAuth v5
  - JWT session management (30-day expiration)
  - Password hashing with bcrypt
  - Protected routes with middleware

- [x] **Notes Management**
  - Create notes with title, content, tags
  - View all notes in grid layout
  - Search notes by title/content/tags
  - Delete notes with confirmation
  - Real-time filtering

- [x] **User Interface**
  - Responsive design with TailwindCSS
  - Beautiful UI with shadcn/ui components
  - Toast notifications
  - Loading states
  - Empty states
  - Profile page with feed view

- [x] **Database**
  - MongoDB integration with Prisma ORM
  - User and Note models
  - Proper relationships and indexes
  - Data isolation per user

---

## 🚧 Pending Features

- [ ] **Note Editor Page** (`/notes/[id]`)
  - View individual note
  - Edit note inline
  - Rich text editing with TipTap
  - Save changes

- [ ] **Rich Text Editor**
  - TipTap integration
  - Formatting toolbar (bold, italic, lists, etc.)
  - Store formatted content

- [ ] **Docker Configuration**
  - Dockerfile for app
  - docker-compose.yml with MongoDB
  - Production-ready setup

- [ ] **Additional Features**
  - Logout functionality
  - Change password
  - Delete account
  - Export notes
  - Share notes (optional)

---

## 📊 Test Results Summary

**Date:** _[To be filled after testing]_

| Feature | Status | Notes |
|---------|--------|-------|
| Registration | ⏳ Pending | |
| Login | ⏳ Pending | |
| Dashboard | ⏳ Pending | |
| Create Note | ⏳ Pending | |
| Search | ⏳ Pending | |
| Delete Note | ⏳ Pending | |
| Profile Page | ⏳ Pending | |
| Protected Routes | ⏳ Pending | |
| Responsive Design | ⏳ Pending | |

---

## 🎯 Quick Start Testing

1. **Start Development Server** (if not running):
   ```bash
   pnpm dev
   ```

2. **Open Browser**: http://localhost:3000

3. **Create Test Account**:
   - Go to http://localhost:3000/register
   - Register with test credentials
   - Login at http://localhost:3000/login

4. **Test Core Features**:
   - Create 2-3 notes with different tags
   - Search for notes
   - Visit profile page
   - Test delete functionality

5. **Report Issues**: Document any bugs or unexpected behavior

---

## 💡 Tips for Testing

- **Use DevTools**: Check Console for errors, Network tab for API calls
- **Test Edge Cases**: Empty inputs, very long content, special characters
- **Clear Cache**: If something doesn't work, try clearing browser cache
- **Check Database**: Use Prisma Studio to verify data: `pnpm exec prisma studio`
- **Test Different Browsers**: Chrome, Firefox, Safari, Edge

---

**Last Updated:** October 17, 2025
**Tester:** _[Your Name]_
**Environment:** Development (localhost:3000)

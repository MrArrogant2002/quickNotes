# QuickNotes - Quick Reference Guide

## 🚀 Quick Start Commands

### Local Development
```bash
# Install dependencies
pnpm install

# Set up database
pnpm prisma generate
pnpm prisma db push

# Start development server
pnpm dev
```

### Docker
```bash
# Start with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 🔑 Environment Variables

Create `.env` file:
```env
DATABASE_URL="mongodb://localhost:27017/quicknotes"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[run: openssl rand -base64 32]"
```

## 📂 Key Files

| File | Purpose |
|------|---------|
| `app/api/notes/route.ts` | Notes CRUD API (uses $runCommandRaw) |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth handlers |
| `lib/auth.ts` | NextAuth configuration |
| `prisma/schema.prisma` | Database schema (no relations) |
| `components/editor/tiptap-editor.tsx` | Rich text editor |

## 🔧 Common Tasks

### Add New API Route
```typescript
// app/api/your-route/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  // Your logic here
}
```

### Add New Component
```bash
# Create in components/ folder
touch components/your-component.tsx
```

### Database Changes
```bash
# Update prisma/schema.prisma, then:
pnpm prisma generate
pnpm prisma db push
```

## 🐛 Troubleshooting

### MongoDB Not Connected
```bash
# Check if MongoDB is running
docker ps
# or locally
sudo systemctl status mongod
```

### Port 3000 Already in Use
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
# or on Windows
taskkill /F /IM node.exe
```

### Clear .next Cache
```bash
rm -rf .next
pnpm dev
```

### Prisma Client Issues
```bash
rm -rf node_modules/.pnpm/@prisma+client*/node_modules/.prisma
pnpm prisma generate
```

## 📊 Project Statistics

- **Lines of Code**: ~2000+
- **Components**: 15+
- **API Routes**: 5
- **Pages**: 6
- **Features**: Authentication, CRUD, Rich Text, Search, Profile

## 🔒 Security Checklist

- [x] Password hashing (bcrypt)
- [x] JWT sessions
- [x] Protected API routes
- [x] Input validation (Zod)
- [x] Authorization checks
- [x] Environment variables for secrets
- [ ] Rate limiting (TODO)
- [ ] HTTPS in production
- [ ] MongoDB authentication

## 🚢 Deployment Checklist

- [ ] Update environment variables for production
- [ ] Set secure NEXTAUTH_SECRET
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable HTTPS
- [ ] Set up error monitoring (Sentry)
- [ ] Set up logging
- [ ] Configure CORS if needed
- [ ] Test all features in production
- [ ] Set up CI/CD pipeline

## 📞 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/register` | POST | No | Register new user |
| `/api/auth/signin` | POST | No | Login user |
| `/api/notes` | GET | Yes | Get all user notes |
| `/api/notes` | POST | Yes | Create new note |
| `/api/notes/[id]` | GET | Yes | Get single note |
| `/api/notes/[id]` | PUT | Yes | Update note |
| `/api/notes/[id]` | DELETE | Yes | Delete note |

## 🎨 UI Components Used

From shadcn/ui:
- Button
- Input
- Card
- Form
- Textarea
- Select
- Badge
- Avatar
- Dialog
- DropdownMenu
- Sonner (Toast)

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | User login |
| `/register` | User registration |
| `/dashboard` | Main dashboard with notes grid |
| `/profile` | User profile and notes feed |
| `/notes/[id]` | Note editor with TipTap |

## 🔄 MongoDB Workarounds

Since we're not using replica sets, we use `$runCommandRaw` for:
- User registration (INSERT)
- Note creation (INSERT)
- Note updates (UPDATE)

Regular Prisma methods work for:
- All READ operations
- DELETE operations

See `MONGODB_FIX.md` for details.

## 📚 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [TipTap Docs](https://tiptap.dev)
- [TailwindCSS Docs](https://tailwindcss.com)

## 💡 Tips

1. **Use VS Code extensions**: Prisma, Tailwind CSS IntelliSense, ESLint
2. **Hot reload**: Save files to see changes instantly
3. **Prisma Studio**: Visual database editor (`pnpm prisma studio`)
4. **Chrome DevTools**: Debug API calls in Network tab
5. **React DevTools**: Inspect component state

## 🎯 Next Steps

1. Test all features thoroughly
2. Add more error handling
3. Implement rate limiting
4. Add note sharing feature
5. Add export functionality
6. Optimize performance
7. Add analytics
8. Write unit tests

---

**Need help?** Check the main README.md or DOCKER.md for detailed documentation.

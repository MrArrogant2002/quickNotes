# QuickNotes 📝

A modern, secure, and feature-rich note-taking application built with Next.js 15, MongoDB, and TipTap rich text editor.

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## ✨ Features

### 🔐 Authentication
- Secure user registration and login
- JWT-based session management (30-day expiration)
- Password hashing with bcrypt (10 salt rounds)
- Protected routes and API endpoints

### 📝 Rich Text Editing
- Full WYSIWYG editor powered by TipTap
- Text formatting: Bold, Italic, Underline, Strikethrough
- Lists: Bullet and Ordered lists
- Blockquotes and Code blocks
- Text alignment: Left, Center, Right
- Link management
- Undo/Redo functionality

### 📚 Note Management
- Create, read, update, and delete notes
- Tag organization system
- Search functionality across titles, content, and tags
- Responsive grid layout
- Last updated timestamps

### 👤 User Profile
- Profile page with user statistics
- Notes count and unique tags count
- Timeline feed view of all notes
- Avatar with initials fallback

### 🎨 Modern UI/UX
- Beautiful, responsive design with shadcn/ui components
- Dark mode support
- Toast notifications for user feedback
- Smooth animations and transitions
- Mobile-friendly interface

## 🚀 Tech Stack

### Frontend
- **Next.js 15.5.6** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **TailwindCSS 4.1.14** - Utility-first CSS
- **shadcn/ui** - Beautiful component library
- **TipTap** - Rich text editor
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Server-side API
- **NextAuth v5** - Authentication
- **Prisma 6.17.1** - ORM for database
- **MongoDB** - NoSQL database
- **Zod** - Schema validation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **pnpm** - Fast, disk-efficient package manager

## 📦 Installation

### Prerequisites
- Node.js 20+ installed
- MongoDB running locally or Docker installed
- pnpm installed (`npm install -g pnpm`)

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/quicknotes.git
cd quicknotes
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="mongodb://localhost:27017/quicknotes"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

4. **Set up the database**
```bash
pnpm prisma generate
pnpm prisma db push
```

5. **Run the development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🐳 Docker Setup

### Quick Start with Docker

1. **Create environment file**
```bash
cp .env.docker.example .env
```

2. **Update `.env` with your secrets**
```env
NEXTAUTH_SECRET=your-secure-secret-here
```

3. **Build and run**
```bash
docker-compose up --build
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up --build

# Remove volumes (database data)
docker-compose down -v
```

See [DOCKER.md](./DOCKER.md) for detailed Docker documentation.

## 📁 Project Structure

```
quicknotes/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── notes/          # Notes CRUD API
│   │   └── register/       # User registration
│   ├── dashboard/          # Dashboard page
│   ├── login/              # Login page
│   ├── notes/[id]/         # Note editor page
│   ├── profile/            # Profile page
│   ├── register/           # Registration page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── editor/             # TipTap editor
│   ├── notes/              # Note-related components
│   └── ui/                 # shadcn/ui components
├── lib/                     # Utility functions
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # Helper functions
├── prisma/                  # Database schema
│   └── schema.prisma       # Prisma schema
├── types/                   # TypeScript types
│   └── next-auth.d.ts      # NextAuth type extensions
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
└── middleware.ts           # Next.js middleware
```

## 🔧 Configuration

### Database Schema

The application uses MongoDB with Prisma ORM. Key models:

- **User**: Stores user information and credentials
- **Note**: Stores notes with title, content, tags, and relationships

**Note**: We use `$runCommandRaw` for CREATE and UPDATE operations to avoid MongoDB replica set requirements in development.

### Authentication

NextAuth is configured with:
- Credentials provider
- JWT strategy
- 30-day session expiration
- Password hashing with bcrypt

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/quicknotes` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Generated with `openssl rand -base64 32` |

## 🧪 Testing

The application has been thoroughly tested with:
- ✅ User registration and login
- ✅ Note CRUD operations
- ✅ Rich text editing and saving
- ✅ Search functionality
- ✅ Profile page display
- ✅ Authentication and authorization
- ✅ MongoDB connection handling

## 🔒 Security Features

- **Password Security**: bcrypt hashing with 10 salt rounds
- **Session Management**: JWT tokens with 30-day expiration
- **Authorization**: User-based note ownership verification
- **Input Validation**: Zod schema validation on all inputs
- **XSS Prevention**: React's built-in escaping
- **Secure Headers**: Next.js security headers
- **Environment Variables**: Sensitive data in .env files

## 🚢 Deployment

### Vercel (Recommended for Next.js)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Docker Deployment

The application is Docker-ready and can be deployed to:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean
- Railway
- Render

### MongoDB Atlas

For production, use MongoDB Atlas:
1. Create a cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Get connection string
3. Update `DATABASE_URL` in environment variables

## 📝 Scripts

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
pnpm prisma generate    # Generate Prisma Client
pnpm prisma db push     # Push schema to database
pnpm prisma studio      # Open Prisma Studio

# Docker
docker-compose up       # Start with Docker
docker-compose down     # Stop Docker containers
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error**: `P1013: The provided database string is invalid`
- **Solution**: Ensure `DATABASE_URL` includes database name: `mongodb://localhost:27017/quicknotes`

**Error**: `P2031: Prisma needs to perform transactions`
- **Solution**: This is handled by using `$runCommandRaw` for operations. No replica set needed in development.

### TypeScript Errors

**Error**: Module not found for installed packages
- **Solution**: Restart TypeScript server in VS Code or run `pnpm install` again

### Docker Issues

**Error**: Port already in use
- **Solution**: Change ports in `docker-compose.yml` or stop conflicting services

**Error**: Build fails
- **Solution**: Run `docker-compose build --no-cache`

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [TipTap](https://tiptap.dev/) - Headless editor framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth](https://next-auth.js.org/) - Authentication for Next.js

## 📚 Documentation

All documentation has been organized in the `docs/` folder:

### **Getting Started**
- [Quick Start Guide](./docs/QUICKSTART.md) - Get up and running quickly
- [Features Overview](./docs/FEATURES.md) - Complete feature list
- [Testing Guide](./docs/TESTING.md) - How to test the application

### **Deployment**
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deploy to Vercel or other platforms

### **Email & Authentication**
- [Email Setup Guide](./docs/EMAIL_SETUP_GUIDE.md) - Configure Resend email service
- [Email Implementation](./docs/EMAIL_IMPLEMENTATION_COMPLETE.md) - Email feature details
- [Password Reset Guide](./docs/PASSWORD_RESET_TESTING_GUIDE.md) - Test password reset
- [Password Change Feature](./docs/PASSWORD_CHANGE_FEATURE.md) - Inline password change
- [Login Troubleshooting](./docs/LOGIN_TROUBLESHOOTING.md) - Fix login issues

### **Architecture & Design**
- [File Structure Guide](./docs/FILE_STRUCTURE_GUIDE.md) - Project organization
- [UI/UX Enhancements](./docs/UI_UX_ENHANCEMENT.md) - Design improvements
- [Accessibility](./docs/ACCESSIBILITY_IMPROVEMENTS.md) - A11y features
- [Editor Optimization](./docs/EDITOR_OPTIMIZATION.md) - Rich text editor details

### **Maintenance**
- [Optimization Complete](./docs/OPTIMIZATION_COMPLETE.md) - Recent cleanup summary
- [Cleanup Plan](./docs/CLEANUP_PLAN.md) - Folder optimization details

## 🗺️ Roadmap

- [x] User authentication
- [x] Rich text editor
- [x] Note CRUD operations
- [x] Profile page
- [x] Password reset functionality
- [x] Email notifications (Resend)
- [x] Note sharing with public links
- [x] Inline password change
- [x] Optimized folder structure
- [ ] Note export (PDF, Markdown)
- [ ] Note templates
- [ ] Dark/Light theme toggle
- [ ] Email verification
- [ ] Note versioning
- [ ] Mobile app (React Native)

---

Made with ❤️ using Next.js and TypeScript

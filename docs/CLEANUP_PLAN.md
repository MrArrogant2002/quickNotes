# 🧹 QuickNotes Cleanup Plan

## Files to Remove

### 1. **Duplicate/Old Files** ❌
- `README.old.md` - Old readme, no longer needed
- `tsconfig.tsbuildinfo` - Build cache, auto-generated
- `.env.docker.example` - Not using Docker
- `.env.example` - Keep `.env` only

### 2. **Docker Files** (Not Using Docker) ❌
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- `DOCKER.md`

### 3. **Development Task Files** (Outdated) ❌
- `tasks/dev.md`
- `tasks/steps.md`
- `tasks/todo.md`
- Entire `tasks/` folder can be removed

### 4. **Browser Extension** (Not Being Used) ❌
- Entire `browser-extension/` folder
- This was a Chrome extension project, not part of main app

### 5. **Redundant Documentation** ❌
Move to `docs/` folder instead of removing:
- All `.md` files except `README.md`

---

## Files to Keep ✅

### **Core Application**
- `app/` - Next.js app directory
- `components/` - React components
- `lib/` - Utilities and services
- `prisma/` - Database schema
- `scripts/` - Useful database scripts
- `types/` - TypeScript definitions
- `public/` - Static assets

### **Configuration**
- `package.json`
- `pnpm-lock.yaml`
- `next.config.ts`
- `tsconfig.json`
- `eslint.config.mjs`
- `postcss.config.mjs`
- `components.json`
- `middleware.ts`
- `vercel.json`
- `.gitignore`
- `.npmrc`
- `.env`

### **Documentation**
- `README.md` - Main readme (keep in root)
- All other `.md` files - Move to `docs/`

---

## Cleanup Actions

### Step 1: Create docs folder
```bash
mkdir docs
```

### Step 2: Move documentation
```bash
mv *.md docs/ 
mv README.md .  # Move README back to root
```

### Step 3: Remove unnecessary folders
```bash
rm -rf browser-extension
rm -rf tasks
```

### Step 4: Remove Docker files
```bash
rm Dockerfile
rm docker-compose.yml
rm .dockerignore
rm .env.docker.example
```

### Step 5: Remove old files
```bash
rm README.old.md
rm tsconfig.tsbuildinfo
rm .env.example
```

---

## Final Structure

```
quicknotes/
├── app/                    # Next.js app
├── components/             # React components
├── lib/                    # Utilities
├── prisma/                 # Database
├── scripts/                # Database scripts
├── types/                  # TypeScript types
├── public/                 # Static files
├── docs/                   # 📁 NEW: All documentation
│   ├── ACCESSIBILITY_IMPROVEMENTS.md
│   ├── CLEANUP_SUMMARY.md
│   ├── DEPLOYMENT.md
│   ├── EDITOR_OPTIMIZATION.md
│   ├── EMAIL_IMPLEMENTATION_COMPLETE.md
│   ├── EMAIL_SETUP_GUIDE.md
│   ├── FEATURES.md
│   ├── FILE_STRUCTURE_GUIDE.md
│   ├── LOGIN_TROUBLESHOOTING.md
│   ├── PASSWORD_CHANGE_FEATURE.md
│   ├── PASSWORD_RESET_AND_SHARE_IMPLEMENTATION.md
│   ├── PASSWORD_RESET_FIX.md
│   ├── PASSWORD_RESET_TESTING_GUIDE.md
│   ├── QUICKSTART.md
│   ├── QUICKSTART_FEATURES.md
│   ├── TESTING.md
│   ├── UI_UX_ENHANCEMENT.md
│   └── VALIDATION_REPORT.md
├── .env
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tsconfig.json
├── middleware.ts
├── vercel.json
└── README.md              # Main readme (root)
```

---

## Space Saved

Estimated space savings: **~5-10 MB**
- Browser extension: ~2 MB
- Docker files: ~1 MB
- Old files: ~500 KB
- Cleaner structure: Priceless! ✨

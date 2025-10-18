# MongoDB Replica Set Fix - QuickNotes

## Problem
When trying to register a new user, the application was throwing this error:

```
PrismaClientKnownRequestError: 
Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set.
Code: P2031
```

## Root Cause
MongoDB transactions are required when Prisma uses **relations** between models. In our schema, we had:

```prisma
model User {
  notes Note[]  // ← This relation triggers transactions
}

model Note {
  user User @relation(fields: [userId], references: [id])  // ← This too
}
```

Even though we removed `onDelete: Cascade`, the Prisma relation itself still requires MongoDB to support transactions, which requires:
- MongoDB running as a **replica set**
- MongoDB 4.0+ 
- Replica set configuration (complex for local development)

## Solution
We **removed the Prisma relations** but kept the foreign key reference:

### Updated Schema

**Before:**
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  name      String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  notes     Note[]  // ← REMOVED THIS RELATION
  @@map("users")
}

model Note {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String
  tags      String[]
  userId    String   @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])  // ← REMOVED THIS
  @@map("notes")
  @@index([userId])
}
```

**After:**
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  name      String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("users")
}

model Note {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String
  tags      String[]
  userId    String   @db.ObjectId  // ← Still here as foreign key reference
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("notes")
  @@index([userId])
}
```

### Code Changes Required

Since we removed Prisma relations, we had to manually handle the relationship in our code:

**1. Profile Page (`app/profile/page.tsx`)**

**Before:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: {
    id: true,
    name: true,
    email: true,
    avatar: true,
    createdAt: true,
    _count: {
      select: { notes: true }  // ← This used the relation
    }
  }
})
```

**After:**
```typescript
// Fetch user separately
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: {
    id: true,
    name: true,
    email: true,
    avatar: true,
    createdAt: true,
  }
})

// Count notes manually
const notesCount = await prisma.note.count({
  where: { userId: session.user.id }
})

// Combine the data
const userWithCount = {
  ...user,
  _count: { notes: notesCount }
}
```

## Commands Run

```bash
# 1. Remove locked Prisma files
rm -rf node_modules/.pnpm/@prisma+client*/node_modules/.prisma

# 2. Regenerate Prisma Client with updated schema
pnpm exec prisma generate

# 3. Push schema changes to MongoDB
pnpm exec prisma db push

# 4. Restart dev server
pnpm dev
```

## Benefits of This Approach

✅ **No Replica Set Required** - Works with standard MongoDB installation
✅ **Simpler Local Development** - No complex MongoDB configuration
✅ **Same Functionality** - We can still query related data
✅ **Production Ready** - This approach works in both development and production

## Tradeoffs

⚠️ **Manual Queries** - We have to manually query related data instead of using Prisma's `include`
⚠️ **No Automatic Cascades** - We need to handle deletion of related records manually if needed

## Testing the Fix

1. Start the dev server: `pnpm dev`
2. Navigate to: http://localhost:3001 (or 3000 if available)
3. Go to `/register` and create a new account
4. Should work without the replica set error! ✅

## Production Deployment

For production with **MongoDB Atlas**:
- Atlas automatically provides replica sets
- You could re-enable Prisma relations if desired
- Or keep this approach for consistency between dev/prod

## Alternative Solution (Not Recommended for Local Dev)

If you really want to use Prisma relations locally, you'd need to:

1. Convert MongoDB to a replica set:
   ```bash
   mongod --replSet rs0
   ```

2. Initialize the replica set:
   ```javascript
   mongosh
   > rs.initiate()
   ```

3. Update connection string:
   ```
   DATABASE_URL="mongodb://localhost:27017/quicknotes?replicaSet=rs0"
   ```

**But this is overkill for local development!**

---

## Status: ✅ FIXED

Registration, login, and all CRUD operations now work without requiring MongoDB replica sets.

**Date Fixed:** October 17, 2025
**Fix Type:** Schema Modification (Removed Prisma Relations)

# Login Troubleshooting Guide

## ❌ Error: "CredentialsSignin"

This error means authentication failed. Here's how to debug and fix it.

---

## 🔍 Common Causes & Solutions

### **1. Wrong Email or Password** (Most Common)

**Symptoms:**
- Error: "CredentialsSignin"
- Console shows: "User not found" or "Password verification failed"

**Solution:**
✅ **Double-check your credentials**
- Make sure email is correct (case-sensitive)
- Make sure password is correct
- No extra spaces before/after

✅ **Reset your password:**
1. Go to http://localhost:3000/forgot-password
2. Enter your email
3. Get reset token from database (see PASSWORD_RESET_TESTING_GUIDE.md)
4. Reset your password

✅ **Or create a new account:**
1. Go to http://localhost:3000/register
2. Create new account
3. Login with new credentials

---

### **2. User Doesn't Exist in Database**

**Symptoms:**
- Console shows: "User not found: your.email@example.com"

**Check if user exists:**

```bash
# Option 1: Prisma Studio
npx prisma studio
# Opens at http://localhost:5555
# Click "User" table and check if your email exists

# Option 2: MongoDB Compass
# Connect to your database
# Navigate to quicknotes → users collection
# Search for your email

# Option 3: MongoDB Shell
mongosh "YOUR_CONNECTION_STRING"
use quicknotes
db.users.findOne({ email: "your.email@example.com" })
```

**Solution:**
If user doesn't exist, register at: http://localhost:3000/register

---

### **3. Password Hash Mismatch**

**Symptoms:**
- User exists but password always fails
- Console shows: "Password verification failed"

**Cause:**
- Password was stored incorrectly (not hashed)
- Password was modified directly in database

**Solution - Reset the password properly:**

Create a script: `scripts/reset-user-password.js`

```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetPassword(email, newPassword) {
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Update in database
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })
    
    console.log('✅ Password reset successfully for:', user.email)
    console.log('📝 New password:', newPassword)
    console.log('\nYou can now login at: http://localhost:3000/login')
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Usage: node scripts/reset-user-password.js
resetPassword('your.email@example.com', 'newpassword123')
```

Run it:
```bash
node scripts/reset-user-password.js
```

---

### **4. Database Connection Issue**

**Symptoms:**
- Login always fails
- Console shows database errors
- Terminal shows connection errors

**Check database connection:**

```bash
# Test Prisma connection
npx prisma db pull

# Or create test script: scripts/test-db.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

prisma.user.count()
  .then(count => console.log('✅ Connected! User count:', count))
  .catch(err => console.error('❌ Connection failed:', err))
  .finally(() => prisma.$disconnect())
```

**Solution:**
1. Check `.env` file has correct `DATABASE_URL`
2. Verify MongoDB Atlas cluster is running
3. Check IP whitelist in MongoDB Atlas (allow your IP or 0.0.0.0/0)

---

### **5. Auth Configuration Issue**

**Symptoms:**
- Login page not working
- Redirects to wrong page
- Session not persisting

**Check environment variables:**

```bash
# .env file should have:
DATABASE_URL="mongodb+srv://..."
NEXTAUTH_SECRET="your-secret-key-here"  # Must be set!
NEXTAUTH_URL="http://localhost:3000"    # Must match your URL
```

**Generate new NEXTAUTH_SECRET if missing:**

```bash
# Generate random secret
openssl rand -base64 32

# Or in Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add to `.env`:
```env
NEXTAUTH_SECRET="your-generated-secret-here"
```

**Restart dev server after changing .env:**
```bash
# Kill current server (Ctrl+C)
pnpm dev
```

---

## 🧪 Step-by-Step Debugging

### **Step 1: Check Browser Console**

Open DevTools (F12) → Console tab

Look for these logs:
```
🔐 Login attempt started
📧 Email: your.email@example.com
🔑 Password length: 12
📡 Calling signIn...
```

If you see:
- ✅ "Login successful!" → Check if redirect works
- ❌ "Login failed: CredentialsSignin" → Go to Step 2

---

### **Step 2: Check Server Console**

Look at your terminal where `pnpm dev` is running

Look for:
```
Login attempt for email: your.email@example.com
User found, verifying password...
Login successful for: your.email@example.com
```

**If you see "User not found":**
→ User doesn't exist, need to register

**If you see "Password verification failed":**
→ Wrong password, or password hash corrupted

**If you see database errors:**
→ Database connection issue

---

### **Step 3: Manually Verify User**

```bash
npx prisma studio
```

1. Open http://localhost:5555
2. Click "User" table
3. Find your user by email
4. Check these fields:
   - ✅ `email` - matches what you're typing
   - ✅ `password` - should be a long hash (starts with $2a$ or $2b$)
   - ✅ `name` - optional but good to have

**If password doesn't look like a hash:**
```
❌ BAD:  "password123"
✅ GOOD: "$2b$10$abcdef123456..."
```

Use the reset password script above to fix it.

---

### **Step 4: Test with Known Good Credentials**

Create a test user with known password:

```javascript
// scripts/create-test-user.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  const email = 'test@example.com'
  const password = 'test123456'
  const hashedPassword = await bcrypt.hash(password, 10)
  
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Test User',
      },
    })
    
    console.log('✅ Test user created!')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('\nLogin at: http://localhost:3000/login')
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  User already exists')
      console.log('📧 Email:', email)
      console.log('🔑 Password:', password)
    } else {
      console.error('❌ Error:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
```

Run it:
```bash
node scripts/create-test-user.js
```

Then try logging in with:
- Email: `test@example.com`
- Password: `test123456`

If this works → Your credentials were wrong
If this fails → Something else is broken

---

## 🔧 Quick Fixes

### **Fix 1: Clear Browser Cache**

Sometimes cached auth state causes issues:

1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
4. Try login again

### **Fix 2: Clear NextAuth Cookies**

1. Open DevTools (F12) → Application tab
2. Expand "Cookies" → http://localhost:3000
3. Delete all cookies starting with "next-auth"
4. Try login again

### **Fix 3: Restart Everything**

```bash
# Kill dev server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Restart
pnpm dev
```

### **Fix 4: Check for Typos**

Common typos:
- Email has spaces: " test@example.com" (wrong)
- Wrong domain: "test@exmaple.com" (typo in example)
- Case sensitive: "Test@Example.com" vs "test@example.com"

---

## ✅ Working Login Checklist

- [ ] Dev server is running (`pnpm dev`)
- [ ] Database is connected (check MongoDB Atlas)
- [ ] Environment variables are set correctly
- [ ] User exists in database
- [ ] Password is hashed correctly
- [ ] Email matches exactly (no spaces, correct case)
- [ ] Password is correct
- [ ] Browser console shows login logs
- [ ] Server console shows auth logs
- [ ] No CORS or network errors

---

## 🆘 Still Not Working?

### Get detailed logs:

Add this to `lib/auth.ts` in the `authorize` function:

```typescript
authorize: async (credentials) => {
  console.log("=" .repeat(50))
  console.log("🔐 AUTHORIZE FUNCTION CALLED")
  console.log("📥 Credentials received:", {
    email: credentials?.email,
    passwordLength: credentials?.password?.length,
  })
  
  try {
    const { email, password } = loginSchema.parse(credentials)
    console.log("✅ Validation passed")
    
    const user = await prisma.user.findUnique({ where: { email } })
    console.log("🔍 Database query result:", user ? "User found" : "User not found")
    
    if (!user) {
      console.log("❌ Returning null - user not found")
      return null
    }
    
    const isValid = await bcrypt.compare(password, user.password)
    console.log("🔑 Password comparison result:", isValid)
    
    if (!isValid) {
      console.log("❌ Returning null - password invalid")
      return null
    }
    
    console.log("✅ Returning user object:", { id: user.id, email: user.email })
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    }
  } catch (error) {
    console.error("💥 Exception in authorize:", error)
    return null
  } finally {
    console.log("=" .repeat(50))
  }
}
```

This will show you exactly where it's failing.

---

## 📞 Need Help?

Share these logs when asking for help:

1. **Browser console output** (F12 → Console)
2. **Server console output** (terminal where pnpm dev is running)
3. **User data from database** (via Prisma Studio)
4. **Environment variables** (redact sensitive values)

---

**Last Updated:** October 19, 2025

# Password Reset Testing Guide

## 🧪 Testing Password Reset Flow (Without Email Service)

Since email service is not configured, you need to manually retrieve the reset token from the database.

---

## Step-by-Step Testing Process

### **Step 1: Request Password Reset**

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Open browser and go to: `http://localhost:3000/login`

3. Click **"Forgot Password?"** link

4. Enter a valid email address (must exist in your database)
   - Example: The email you used to register

5. Click **"Send Reset Link"**

6. You should see: **"Check Your Email"** success message

---

### **Step 2: Get Reset Token from Database**

**Option A: Using MongoDB Compass (GUI)**

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to: `quicknotes` → `users` collection
4. Find your user by email
5. Look for these fields:
   ```json
   {
     "email": "your.email@example.com",
     "resetToken": "abc123def456...",  ← Copy this
     "resetTokenExpiry": "2025-10-19T..."
   }
   ```
6. Copy the `resetToken` value

**Option B: Using MongoDB Shell**

```bash
mongosh "YOUR_MONGODB_CONNECTION_STRING"
```

```javascript
// Switch to your database
use quicknotes

// Find user and show reset token
db.users.findOne(
  { email: "your.email@example.com" },
  { email: 1, resetToken: 1, resetTokenExpiry: 1 }
)
```

**Option C: Using Prisma Studio**

```bash
npx prisma studio
```

1. Opens in browser at `http://localhost:5555`
2. Click on `User` model
3. Find your user
4. Copy the `resetToken` value

**Option D: Using Node.js Script**

Create a temporary file: `scripts/get-reset-token.js`

```javascript
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function getResetToken(email) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      resetToken: true,
      resetTokenExpiry: true,
    },
  })
  
  if (user && user.resetToken) {
    console.log('Reset Token:', user.resetToken)
    console.log('Expires:', user.resetTokenExpiry)
    console.log('\nReset URL:')
    console.log(`http://localhost:3000/reset-password?token=${user.resetToken}`)
  } else {
    console.log('No reset token found for this email')
  }
  
  await prisma.$disconnect()
}

// Replace with your email
getResetToken('your.email@example.com')
```

Run it:
```bash
node scripts/get-reset-token.js
```

---

### **Step 3: Use Reset Token**

1. Copy the reset token from database

2. Construct the reset URL:
   ```
   http://localhost:3000/reset-password?token=YOUR_RESET_TOKEN
   ```

3. Paste the URL in your browser

4. You should see the **"Reset Your Password"** page

---

### **Step 4: Reset Password**

1. Enter new password (minimum 6 characters)

2. Confirm password (must match)

3. Click **"Reset Password"**

4. You should see: **"Password Reset Successful!"**

5. Auto-redirects to login page after 3 seconds

---

### **Step 5: Verify Password Changed**

1. Go to login page: `http://localhost:3000/login`

2. Try logging in with:
   - **Email**: Your email
   - **Password**: Your OLD password
   - **Result**: Should FAIL ❌

3. Try logging in with:
   - **Email**: Your email
   - **Password**: Your NEW password
   - **Result**: Should SUCCESS ✅

4. Check database - token should be cleared:
   ```javascript
   db.users.findOne(
     { email: "your.email@example.com" },
     { resetToken: 1, resetTokenExpiry: 1 }
   )
   // Should show: resetToken: null, resetTokenExpiry: null
   ```

---

## 🎬 Quick Test Script

Create this script to automate testing: `scripts/test-password-reset.js`

```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const prisma = new PrismaClient()

async function testPasswordReset(email) {
  console.log('🧪 Testing Password Reset Flow\n')
  
  // Step 1: Check user exists
  console.log('Step 1: Finding user...')
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.log('❌ User not found!')
    return
  }
  console.log('✅ User found:', user.email)
  
  // Step 2: Generate reset token (simulating API call)
  console.log('\nStep 2: Generating reset token...')
  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour
  
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  })
  console.log('✅ Reset token generated')
  
  // Step 3: Display reset URL
  console.log('\n📧 Reset URL (copy and paste in browser):')
  console.log(`http://localhost:3000/reset-password?token=${resetToken}`)
  console.log(`\nToken expires at: ${resetTokenExpiry.toLocaleString()}`)
  
  // Step 4: Wait for user to reset
  console.log('\n⏳ Waiting for password reset...')
  console.log('(Use the URL above to reset your password)')
  console.log('\nPress Ctrl+C when done to exit')
  
  await prisma.$disconnect()
}

// Usage
const email = process.argv[2] || 'test@example.com'
testPasswordReset(email)
  .catch(console.error)
  .finally(() => process.exit())
```

Run it:
```bash
node scripts/test-password-reset.js your.email@example.com
```

---

## 🔍 Checking Token Expiry

Reset tokens expire after **1 hour** for security.

**Check if token is expired:**

```javascript
db.users.findOne({ email: "your.email@example.com" })

// Compare resetTokenExpiry with current time
// If resetTokenExpiry < current time → EXPIRED
```

**Test expired token:**

1. Request password reset
2. Get token from database
3. Wait 1 hour (or manually set expiry to past date)
4. Try to use the token
5. Should see: **"Invalid or Expired Link"** ❌

---

## 🐛 Troubleshooting

### Issue: "Invalid token" error

**Causes:**
- Token doesn't exist in database
- Token has expired (> 1 hour old)
- Token was already used (cleared after reset)
- Typo in token string

**Solution:**
- Request new password reset
- Get fresh token from database
- Make sure to copy entire token string

---

### Issue: Token not appearing in database

**Causes:**
- API route not working
- Database connection issue
- User email doesn't exist

**Debug:**
1. Check terminal for API errors
2. Verify user exists:
   ```javascript
   db.users.findOne({ email: "your.email@example.com" })
   ```
3. Check API route logs

---

### Issue: "Failed to send reset email"

**Causes:**
- This is expected! (No email service configured)
- API may still generate token successfully

**Solution:**
- Check database for token anyway
- Token should be there even if email fails
- Use manual token retrieval method above

---

## 🚀 Setting Up Email Service (Optional)

To enable automatic email sending:

### Using Resend (Recommended - Free Tier)

1. Sign up at https://resend.com
2. Get API key
3. Install package:
   ```bash
   pnpm add resend
   ```

4. Add to `.env`:
   ```env
   RESEND_API_KEY=re_your_api_key
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```

5. Update `app/api/auth/request-reset/route.ts`:
   ```typescript
   import { Resend } from 'resend'
   
   const resend = new Resend(process.env.RESEND_API_KEY)
   
   // After generating token:
   await resend.emails.send({
     from: process.env.RESEND_FROM_EMAIL,
     to: email,
     subject: 'Reset Your Password - QuickNotes',
     html: `
       <h1>Reset Your Password</h1>
       <p>Click the link below to reset your password:</p>
       <a href="${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}">
         Reset Password
       </a>
       <p>This link expires in 1 hour.</p>
     `,
   })
   ```

---

## ✅ Complete Test Checklist

- [ ] User can access forgot password page
- [ ] User can submit email (valid user)
- [ ] User can submit email (invalid user - should not reveal)
- [ ] Token appears in database with correct expiry
- [ ] Token can be retrieved manually
- [ ] Reset password page loads with valid token
- [ ] Reset password page shows error with invalid token
- [ ] Reset password page shows error with expired token
- [ ] Password requirements are enforced (min 6 chars)
- [ ] Password confirmation must match
- [ ] New password saves to database (hashed)
- [ ] Token cleared from database after reset
- [ ] Old password no longer works
- [ ] New password works for login
- [ ] Success message shows and redirects to login

---

## 📹 Video Tutorial Flow

1. **Show forgot password page** (0:00-0:15)
2. **Submit email** (0:15-0:30)
3. **Open MongoDB Compass** (0:30-0:45)
4. **Find and copy token** (0:45-1:00)
5. **Paste URL in browser** (1:00-1:15)
6. **Enter new password** (1:15-1:30)
7. **Submit and see success** (1:30-1:45)
8. **Login with new password** (1:45-2:00)

---

**Total Testing Time**: ~5-10 minutes

**Status**: ✅ Ready for testing without email service

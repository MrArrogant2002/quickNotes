# Email Service Setup Guide

## 🚨 Current Status: NO EMAIL SENDING

The password reset generates a token but **does NOT send emails** because no email service is configured.

---

## ✅ Solution: Add Resend Email Service (Recommended)

**Resend** offers:
- ✅ Free tier: 3,000 emails/month
- ✅ Easy setup (5 minutes)
- ✅ Modern API
- ✅ Good deliverability
- ✅ Beautiful email templates

---

## 📧 Step-by-Step Setup

### **Step 1: Sign Up for Resend**

1. Go to https://resend.com/signup
2. Create free account
3. Verify your email
4. Go to API Keys: https://resend.com/api-keys
5. Create new API key
6. Copy the key (starts with `re_...`)

---

### **Step 2: Install Resend Package**

```bash
pnpm add resend
```

---

### **Step 3: Add Environment Variables**

Add to your `.env` file:

```env
# Email Service (Resend)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev  # Use this for testing
# Or use your own domain (requires DNS setup):
# RESEND_FROM_EMAIL=noreply@yourdomain.com
```

---

### **Step 4: Create Email Service**

Create file: `lib/email.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(
  to: string,
  resetToken: string
) {
  const resetUrl = \`\${process.env.NEXTAUTH_URL}/reset-password?token=\${resetToken}\`
  
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'QuickNotes <onboarding@resend.dev>',
      to,
      subject: 'Reset Your Password - QuickNotes',
      html: \`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #A6B1E1 0%, #424874 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #A6B1E1 0%, #424874 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                font-size: 12px;
                color: #666;
              }
              .warning {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🔐 Reset Your Password</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for your QuickNotes account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="\${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all;">
                <code>\${resetUrl}</code>
              </p>
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in <strong>1 hour</strong></li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password won't change until you create a new one</li>
                </ul>
              </div>
              <div class="footer">
                <p>
                  This email was sent to <strong>\${to}</strong> because a password reset was requested.
                </p>
                <p>
                  If you didn't request this, you can safely ignore this email.
                </p>
                <p style="margin-top: 20px;">
                  — QuickNotes Team
                </p>
              </div>
            </div>
          </body>
        </html>
      \`,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error('Failed to send email')
    }

    console.log('✅ Password reset email sent:', data)
    return data
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'QuickNotes <onboarding@resend.dev>',
      to,
      subject: 'Welcome to QuickNotes! 🎉',
      html: \`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #A6B1E1 0%, #424874 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #A6B1E1 0%, #424874 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎉 Welcome to QuickNotes!</h1>
            </div>
            <div class="content">
              <p>Hi \${name},</p>
              <p>Thanks for signing up! We're excited to have you on board.</p>
              <p>QuickNotes is your personal space for capturing and organizing ideas, notes, and thoughts.</p>
              <div style="text-align: center;">
                <a href="\${process.env.NEXTAUTH_URL}/dashboard" class="button">Go to Dashboard</a>
              </div>
              <p><strong>What you can do:</strong></p>
              <ul>
                <li>📝 Create rich text notes with formatting</li>
                <li>🏷️ Organize with tags</li>
                <li>🔗 Share notes publicly with a link</li>
                <li>🔐 Keep everything secure and private</li>
              </ul>
              <p>If you have any questions, feel free to reach out!</p>
              <p>Happy note-taking! ✨</p>
              <p>— QuickNotes Team</p>
            </div>
          </body>
        </html>
      \`,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error('Failed to send email')
    }

    console.log('✅ Welcome email sent:', data)
    return data
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw error
  }
}
```

---

### **Step 5: Update Password Reset API**

Update `app/api/auth/request-reset/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"  // Add this import

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { message: "If that email exists, a reset link has been sent" },
        { status: 200 }
      )
    }

    const resetToken = randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    })

    // Send email! 📧
    try {
      await sendPasswordResetEmail(email, resetToken)
      console.log(\`✅ Password reset email sent to: \${email}\`)
    } catch (emailError) {
      console.error('Failed to send email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { message: "If that email exists, a reset link has been sent" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error requesting password reset:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

---

### **Step 6: Optional - Send Welcome Email on Registration**

Update `app/api/register/route.ts`:

```typescript
import { sendWelcomeEmail } from "@/lib/email"

// After creating user:
try {
  await sendWelcomeEmail(email, name || email.split('@')[0])
} catch (emailError) {
  console.error('Failed to send welcome email:', emailError)
  // Don't fail registration if email fails
}
```

---

### **Step 7: Test Email Sending**

```bash
# Start dev server
pnpm dev

# Go to forgot password page
# Enter your REAL email address
# Check your inbox!
```

---

## 🎯 Testing Checklist

- [ ] Resend account created
- [ ] API key added to `.env`
- [ ] `resend` package installed
- [ ] `lib/email.ts` created
- [ ] `request-reset` API updated
- [ ] Dev server restarted
- [ ] Test with real email address
- [ ] Check spam folder if not in inbox
- [ ] Click link in email
- [ ] Reset password successfully

---

## 🔧 Troubleshooting

### Email not received?

1. **Check spam folder** - First time emails often go to spam
2. **Check Resend dashboard** - https://resend.com/emails
3. **Verify API key** - Make sure it's in `.env`
4. **Check console logs** - Look for "✅ Password reset email sent"
5. **Use correct domain** - `onboarding@resend.dev` for testing

### From email address

**For testing (no setup needed)**:
```env
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**For production (requires DNS setup)**:
```env
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

See: https://resend.com/docs/send-with-nextjs

---

## 💰 Cost

**Resend Free Tier**:
- ✅ 3,000 emails/month
- ✅ 100 emails/day
- ✅ Perfect for small apps

**Pricing after free tier**:
- $20/month for 50,000 emails
- See: https://resend.com/pricing

---

## 🎉 After Setup

Once configured, the flow will be:

1. User clicks "Forgot Password"
2. Enters email
3. **Email sent to their inbox** ✅
4. User clicks link in email
5. Resets password
6. Done!

No more manual token retrieval from database!

---

**Estimated setup time**: 10 minutes

**Ready to set this up?** Let me know if you need help with any step!

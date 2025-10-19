import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

// POST /api/auth/request-reset - Request password reset
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

    // For security, always return success even if user doesn't exist
    if (!user) {
      return NextResponse.json(
        { message: "If that email exists, a reset link has been sent" },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    })

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetToken)
      console.log(`✅ Password reset email sent to: ${email}`)
    } catch (emailError) {
      console.error('Failed to send email:', emailError)
      // Don't fail the request if email fails
      // Still return success to avoid leaking user existence
    }

    return NextResponse.json(
      { 
        message: "If that email exists, a reset link has been sent"
      },
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

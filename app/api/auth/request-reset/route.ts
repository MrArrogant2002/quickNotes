import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

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

    const now = new Date()
    await prisma.$runCommandRaw({
      update: "users",
      updates: [
        {
          q: { _id: { $oid: user.id } },
          u: {
            $set: {
              resetToken: resetToken,
              resetTokenExpiry: { $date: resetTokenExpiry.toISOString() },
              updatedAt: { $date: now.toISOString() },
            },
          },
        },
      ],
    })

    // In production, send email here
    console.log(`Password reset link: ${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`)
    
    // TODO: Send email with reset link
    // await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json(
      { 
        message: "If that email exists, a reset link has been sent",
        // For development only - remove in production
        resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined
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

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { randomBytes } from "crypto"

// Validation schema for registration
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
})


export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json()
    console.log("Registration request body:", body)
    const validatedData = registerSchema.parse(body)
    console.log("Validated data:", validatedData)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      console.log("User already exists:", validatedData.email)
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Generate email verification token
    const verificationToken = randomBytes(32).toString("hex")

    // Create user - MongoDB Atlas supports this without replica set
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        verificationToken: verificationToken,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    console.log("User created successfully:", user.email)
    console.log(`Verification link: ${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`)

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, verificationToken)

    return NextResponse.json(
      {
        message: "User created successfully. Please check your email for verification.",
        user,
        // For development only - remove in production
        verificationToken: process.env.NODE_ENV === "development" ? verificationToken : undefined,
      },
      { status: 201 }
    )
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      console.log("Validation error:", error.issues)
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    // Handle other errors
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

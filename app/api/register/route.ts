import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

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

    // Create user using raw MongoDB query to avoid transaction requirement
    const now = new Date()
    const result = await prisma.$runCommandRaw({
      insert: "users",
      documents: [
        {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          avatar: null,
          createdAt: { $date: now.toISOString() },
          updatedAt: { $date: now.toISOString() },
        },
      ],
    })

    // Fetch the created user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
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

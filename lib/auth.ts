import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Validate input
          const { email, password } = loginSchema.parse(credentials)
          console.log("Login attempt for email:", email)

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            console.log("User not found:", email)
            throw new Error("Invalid credentials")
          }

          console.log("User found, verifying password...")

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password)

          if (!isPasswordValid) {
            console.log("Password verification failed for:", email)
            throw new Error("Invalid credentials")
          }

          console.log("Login successful for:", email)

          // Return user object (exclude password)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.email = user.email as string
        token.name = user.name ?? null
        token.avatar = user.avatar ?? null
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
        session.user.avatar = token.avatar
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

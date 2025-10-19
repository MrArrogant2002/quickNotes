import { DefaultSession, DefaultUser } from "next-auth"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      avatar: string | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    avatar?: string | null
  }
}

// Extend the built-in JWT types
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string | null
    avatar: string | null
  }
}

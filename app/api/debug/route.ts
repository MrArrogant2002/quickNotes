import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    databaseUrlSet: !!process.env.DATABASE_URL,
    databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + "...",
    nextauthSecretSet: !!process.env.NEXTAUTH_SECRET,
    nextauthUrl: process.env.NEXTAUTH_URL,
    nodeEnv: process.env.NODE_ENV,
  })
}

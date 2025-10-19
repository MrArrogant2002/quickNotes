import { NextResponse } from "next/server"

export function middleware() {
  // Simple protection - pages will check auth on server side
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

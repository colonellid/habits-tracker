import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Auth is handled client-side in DashboardLayout and AuthLayout.
// Middleware only handles the root redirect.
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

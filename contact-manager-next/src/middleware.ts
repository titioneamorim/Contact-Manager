import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public paths that don't require authentication
    if (path === '/login' || path === '/register') {
      if (token) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return NextResponse.next()
    }

    // Protected paths that require authentication
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Admin-only paths
    if (path.startsWith('/admin') && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
}

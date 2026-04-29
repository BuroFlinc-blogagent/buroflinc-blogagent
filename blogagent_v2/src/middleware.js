import { NextResponse } from 'next/server'

export function middleware(request) {
  // Skip the auth check for the login page and auth API itself
  const { pathname } = request.nextUrl
  if (pathname === '/login' || pathname === '/api/auth') {
    return NextResponse.next()
  }

  // Check for auth cookie
  const auth = request.cookies.get('bf_auth')
  if (auth?.value === process.env.ACCESS_TOKEN) {
    return NextResponse.next()
  }

  // Redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

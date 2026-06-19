import { NextRequest, NextResponse } from 'next/server'

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function middleware(request: NextRequest) {
  const parts = request.nextUrl.pathname.split('/')
  if (parts[1] === 'client') {
    const token = parts[2]
    if (!token || !UUID_V4.test(token)) {
      return NextResponse.rewrite(new URL('/not-found', request.url))
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/client/:token*'] }

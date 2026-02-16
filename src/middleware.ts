import { NextResponse } from 'next/server'

export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/status/:path*', '/api/proxy/:path*'],
}

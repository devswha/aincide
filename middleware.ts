import { NextRequest, NextResponse } from 'next/server'

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="AIncide Status"',
    },
  })
}

export function middleware(request: NextRequest) {
  const user = process.env.STATUS_BASIC_USER
  const pass = process.env.STATUS_BASIC_PASS

  // Safe-by-default: if management secrets are present, require auth in production.
  const hasSensitiveConfig = Boolean(
    process.env.CLIPROXY_MANAGEMENT_KEY || process.env.CLIPROXY_KEY
  )

  if (process.env.NODE_ENV === 'production' && (!user || !pass) && hasSensitiveConfig) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Dev: allow access without auth unless explicitly configured.
  if (!user || !pass) return NextResponse.next()

  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Basic ')) return unauthorized()

  const encoded = auth.slice('Basic '.length)
  let decoded = ''
  try {
    decoded = atob(encoded)
  } catch {
    return unauthorized()
  }

  const sep = decoded.indexOf(':')
  if (sep < 0) return unauthorized()

  const providedUser = decoded.slice(0, sep)
  const providedPass = decoded.slice(sep + 1)

  if (providedUser === user && providedPass === pass) {
    return NextResponse.next()
  }

  return unauthorized()
}

export const config = {
  matcher: ['/status/:path*', '/api/proxy/:path*'],
}

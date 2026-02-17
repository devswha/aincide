import { NextRequest } from 'next/server'
import { proxyFetch } from '@/lib/proxy'

const USAGE_SERVER_URL = process.env.USAGE_SERVER_URL

export async function GET(request: NextRequest) {
  if (!USAGE_SERVER_URL) {
    return Response.json({ error: 'Usage server not configured' }, { status: 503 })
  }

  const { searchParams } = request.nextUrl
  const account = searchParams.get('account') || ''
  const metric = searchParams.get('metric') || ''
  const range = searchParams.get('range') || '24h'

  const url = new URL('/api/usage-history', USAGE_SERVER_URL)
  url.searchParams.set('account', account)
  url.searchParams.set('metric', metric)
  url.searchParams.set('range', range)

  return proxyFetch(url.toString(), 'Usage history', { timeoutMs: 8000 })
}

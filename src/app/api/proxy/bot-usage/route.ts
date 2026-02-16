import { proxyFetch } from '@/lib/proxy'

const USAGE_SERVER_URL = process.env.USAGE_SERVER_URL

export async function GET() {
  if (!USAGE_SERVER_URL) {
    return Response.json({ error: 'Usage server not configured' }, { status: 503 })
  }
  return proxyFetch(`${USAGE_SERVER_URL}/api/usage`, 'Usage server')
}

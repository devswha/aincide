import { proxyFetch } from '@/lib/proxy'

const USAGE_SERVER_URL = process.env.USAGE_SERVER_URL

export async function GET() {
  if (!USAGE_SERVER_URL) {
    // Return empty data instead of 503 to avoid browser console errors
    return Response.json({ bots: [], serverUptime: '' })
  }
  return proxyFetch(`${USAGE_SERVER_URL}/api/bot-status`, 'Bot status server')
}

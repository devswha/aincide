import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CLIPROXY_URL = process.env.CLIPROXY_URL
const MANAGEMENT_KEY = process.env.CLIPROXY_MANAGEMENT_KEY || process.env.CLIPROXY_KEY
const CRON_SECRET = process.env.CRON_SECRET

interface ApiCallResponse {
  status_code: number
  body: string
}

interface UsageItem {
  utilization: number
  resets_at: string | null
}

interface AnthropicUsageResponse {
  five_hour?: UsageItem
  seven_day?: UsageItem
  seven_day_sonnet?: UsageItem
}

interface AuthFileEntry {
  auth_index: string
  name: string
  type: string
  provider: string
  email?: string
  disabled: boolean
}

const METRICS = ['five_hour', 'seven_day', 'seven_day_sonnet'] as const
const HIDDEN_EMAILS = new Set(['hadaneywoo@gmail.com'])

async function apiCall(authIndex: string, method: string, url: string, headers: Record<string, string>): Promise<ApiCallResponse | null> {
  try {
    const res = await fetch(`${CLIPROXY_URL}/v0/management/api-call`, {
      method: 'POST',
      headers: {
        'X-Management-Key': MANAGEMENT_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ auth_index: authIndex, method, url, header: headers }),
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel Cron sends this header)
  if (CRON_SECRET) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  if (!CLIPROXY_URL || !MANAGEMENT_KEY) {
    return NextResponse.json({ error: 'CLIProxyAPI not configured' }, { status: 503 })
  }

  try {
    // 1. Get Claude auth files
    const authRes = await fetch(`${CLIPROXY_URL}/v0/management/auth-files`, {
      headers: { 'X-Management-Key': MANAGEMENT_KEY },
      signal: AbortSignal.timeout(8000),
    })
    if (!authRes.ok) {
      return NextResponse.json({ error: 'CLIProxyAPI unreachable' }, { status: 502 })
    }

    const authData = await authRes.json()
    const files: AuthFileEntry[] = Array.isArray(authData?.files) ? authData.files : []
    const claudeEntries = files.filter((e) => {
      if (e.disabled) return false
      if (HIDDEN_EMAILS.has(e.email || e.name)) return false
      const provider = (e.provider || e.type || '').toLowerCase()
      return provider === 'claude' || provider === 'anthropic'
    })

    // 2. Fetch usage for each account
    const now = new Date()
    const snapshots: { account: string; metric: string; utilization: number; timestamp: Date }[] = []

    await Promise.all(
      claudeEntries.map(async (entry) => {
        const result = await apiCall(entry.auth_index, 'GET', 'https://api.anthropic.com/api/oauth/usage', {
          Authorization: 'Bearer $TOKEN$',
          'anthropic-beta': 'oauth-2025-04-20',
        })
        if (!result || result.status_code !== 200) return

        let usage: AnthropicUsageResponse
        try {
          usage = JSON.parse(result.body)
        } catch {
          return
        }

        const email = entry.email || entry.name
        for (const metric of METRICS) {
          const item = usage[metric]
          if (item && typeof item.utilization === 'number') {
            snapshots.push({ account: email, metric, utilization: item.utilization, timestamp: now })
          }
        }
      }),
    )

    // 3. Batch insert
    if (snapshots.length > 0) {
      await prisma.usageSnapshot.createMany({ data: snapshots })
    }

    // 4. Cleanup: delete snapshots older than 31 days
    const cutoff = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000)
    await prisma.usageSnapshot.deleteMany({ where: { timestamp: { lt: cutoff } } })

    return NextResponse.json({ collected: snapshots.length, accounts: claudeEntries.length })
  } catch (err) {
    console.error('Collect usage error:', err)
    return NextResponse.json({ error: 'Collection failed' }, { status: 500 })
  }
}

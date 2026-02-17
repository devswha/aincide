import { NextResponse } from 'next/server'
import type { AccountUsage, CodexUsage, GeminiUsage, GeminiQuotaBucket, AnthropicLimit, CodexRateWindow } from '@/types/status'
import { prisma } from '@/lib/prisma'

const CLIPROXY_URL = process.env.CLIPROXY_URL
const MANAGEMENT_KEY = process.env.CLIPROXY_MANAGEMENT_KEY || process.env.CLIPROXY_KEY

const CACHE_HEADERS = { 'Cache-Control': 'no-store, max-age=0' } as const

interface AuthFileEntry {
  auth_index: string
  name: string
  type: string
  provider: string
  label?: string
  email?: string
  status: string
  status_message: string
  disabled: boolean
  unavailable: boolean
  account_type?: string
  account?: string
  id_token?: {
    plan_type?: string
  }
}

interface ApiCallResponse {
  status_code: number
  header: Record<string, string[]>
  body: string
}

interface AnthropicUsageResponse {
  five_hour?: { utilization: number; resets_at: string | null }
  seven_day?: { utilization: number; resets_at: string | null }
  seven_day_sonnet?: { utilization: number; resets_at: string | null }
  extra_usage?: { is_enabled: boolean }
}

interface CodexUsageResponse {
  rate_limit?: {
    primary_window?: CodexRateWindow
    secondary_window?: CodexRateWindow | null
  }
  code_review_rate_limit?: {
    primary_window?: CodexRateWindow
    secondary_window?: CodexRateWindow | null
  }
}

const UNKNOWN_LIMIT: AnthropicLimit = { utilization: 0, resets_at: null }
const EMPTY_WINDOW: CodexRateWindow = {
  used_percent: 0,
  limit_window_seconds: 0,
  reset_after_seconds: 0,
  reset_at: 0,
}

async function apiCall(authIndex: string, method: string, url: string, headers: Record<string, string>): Promise<ApiCallResponse | null> {
  try {
    const res = await fetch(`${CLIPROXY_URL}/v0/management/api-call`, {
      method: 'POST',
      headers: {
        'X-Management-Key': MANAGEMENT_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_index: authIndex,
        method,
        url,
        header: headers,
      }),
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function fetchAnthropicUsage(authIndex: string): Promise<AnthropicUsageResponse | null> {
  const result = await apiCall(authIndex, 'GET', 'https://api.anthropic.com/api/oauth/usage', {
    'Authorization': 'Bearer $TOKEN$',
    'anthropic-beta': 'oauth-2025-04-20',
  })
  if (!result || result.status_code !== 200) return null
  try {
    return JSON.parse(result.body)
  } catch {
    return null
  }
}

async function fetchCodexUsage(authIndex: string): Promise<CodexUsageResponse | null> {
  const result = await apiCall(authIndex, 'GET', 'https://chatgpt.com/backend-api/wham/usage', {
    'Authorization': 'Bearer $TOKEN$',
  })
  if (!result || result.status_code !== 200) return null
  try {
    return JSON.parse(result.body)
  } catch {
    return null
  }
}

async function fetchGeminiQuota(authIndex: string): Promise<GeminiQuotaBucket[] | null> {
  const result = await apiCall(authIndex, 'POST', 'https://cloudcode-pa.googleapis.com/v1internal:retrieveUserQuota', {
    'Authorization': 'Bearer $TOKEN$',
    'Content-Type': 'application/json',
  })
  if (!result || result.status_code !== 200) return null
  try {
    const data = JSON.parse(result.body)
    return Array.isArray(data?.buckets) ? data.buckets : null
  } catch {
    return null
  }
}

function toLimitOrDefault(limit?: { utilization: number; resets_at: string | null }): AnthropicLimit {
  if (!limit) return UNKNOWN_LIMIT
  return { utilization: limit.utilization, resets_at: limit.resets_at }
}

function toWindowOrDefault(window?: CodexRateWindow): CodexRateWindow {
  if (!window) return EMPTY_WINDOW
  return window
}

export async function GET() {
  if (!CLIPROXY_URL || !MANAGEMENT_KEY) {
    return NextResponse.json(
      { error: 'CLIProxyAPI not configured' },
      { status: 503, headers: CACHE_HEADERS },
    )
  }

  try {
    // 1. Fetch auth files
    const authRes = await fetch(`${CLIPROXY_URL}/v0/management/auth-files`, {
      headers: { 'X-Management-Key': MANAGEMENT_KEY },
      signal: AbortSignal.timeout(8000),
    })

    if (!authRes.ok) {
      console.error(`CLIProxyAPI auth-files: ${authRes.status}`)
      return NextResponse.json(
        { error: 'CLIProxyAPI unreachable' },
        { status: 502, headers: CACHE_HEADERS },
      )
    }

    const authData = await authRes.json()
    const files: AuthFileEntry[] = Array.isArray(authData?.files) ? authData.files : []

    const claudeEntries: AuthFileEntry[] = []
    const codexEntries: AuthFileEntry[] = []
    const geminiEntries: AuthFileEntry[] = []

    const HIDDEN_EMAILS = new Set(['hadaneywoo@gmail.com'])

    for (const entry of files) {
      if (entry.disabled) continue
      if (HIDDEN_EMAILS.has(entry.email || entry.name)) continue
      const provider = (entry.provider || entry.type || '').toLowerCase()
      if (provider === 'claude' || provider === 'anthropic') {
        claudeEntries.push(entry)
      } else if (provider === 'codex') {
        codexEntries.push(entry)
      } else if (provider === 'gemini-cli') {
        geminiEntries.push(entry)
      }
    }

    // 2. Fetch real utilization in parallel
    const [claudeResults, codexResults, geminiResults] = await Promise.all([
      Promise.all(claudeEntries.map((e) => fetchAnthropicUsage(e.auth_index))),
      Promise.all(codexEntries.map((e) => fetchCodexUsage(e.auth_index))),
      Promise.all(geminiEntries.map((e) => fetchGeminiQuota(e.auth_index))),
    ])

    // 3. Build response
    const accounts: AccountUsage[] = claudeEntries.map((entry, i) => {
      const usage = claudeResults[i]
      const isError = entry.unavailable || entry.status === 'disabled'
      const planType = 'MAX'
      return {
        name: entry.label || entry.account || entry.name,
        email: entry.email || entry.name,
        authFileName: entry.name,
        planType,
        status: isError ? 'error' : 'active',
        statusMessage: entry.status_message || undefined,
        usage: {
          five_hour: toLimitOrDefault(usage?.five_hour),
          seven_day: toLimitOrDefault(usage?.seven_day),
          seven_day_sonnet: toLimitOrDefault(usage?.seven_day_sonnet),
        },
      }
    })

    const codex: CodexUsage[] = codexEntries.map((entry, i) => {
      const usage = codexResults[i]
      return {
        email: entry.email || entry.name,
        plan_type: entry.id_token?.plan_type || 'unknown',
        authFileName: entry.name,
        rate_limit: {
          primary_window: toWindowOrDefault(usage?.rate_limit?.primary_window),
          secondary_window: usage?.rate_limit?.secondary_window ?? null,
        },
        code_review_rate_limit: {
          primary_window: toWindowOrDefault(usage?.code_review_rate_limit?.primary_window),
          secondary_window: usage?.code_review_rate_limit?.secondary_window ?? null,
        },
      }
    })

    const gemini: GeminiUsage[] = geminiEntries.map((entry, i) => {
      const buckets = geminiResults[i]
      const proBucket = buckets?.find((b) => b.modelId.includes('pro') && !b.modelId.includes('vertex'))
      return {
        email: entry.email || entry.name,
        provider: entry.provider || entry.type,
        authFileName: entry.name,
        label: entry.label,
        status: (entry.unavailable || entry.status === 'disabled') ? 'error' as const : 'active' as const,
        statusMessage: entry.status_message || undefined,
        quota: buckets ? {
          pro: proBucket ? {
            used: Math.round((1 - proBucket.remainingFraction) * 100),
            resetTime: proBucket.resetTime,
          } : null,
        } : undefined,
      }
    })

    // Save usage snapshots to DB (fire-and-forget, no delay to response)
    const now = new Date()
    const METRICS = ['five_hour', 'seven_day', 'seven_day_sonnet'] as const
    const snapshots: { account: string; metric: string; utilization: number; timestamp: Date }[] = []
    for (const acc of accounts) {
      for (const metric of METRICS) {
        const val = acc.usage[metric]?.utilization
        if (typeof val === 'number') {
          snapshots.push({ account: acc.email, metric, utilization: val, timestamp: now })
        }
      }
    }
    if (snapshots.length > 0) {
      prisma.usageSnapshot.createMany({ data: snapshots })
        .then(() => prisma.usageSnapshot.deleteMany({ where: { timestamp: { lt: new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000) } } }))
        .catch((err) => console.error('Snapshot save error:', err))
    }

    return NextResponse.json({ accounts, codex, gemini }, { headers: CACHE_HEADERS })
  } catch (err) {
    console.error('Usage route error:', err)
    return NextResponse.json(
      { error: 'CLIProxyAPI unreachable' },
      { status: 502, headers: CACHE_HEADERS },
    )
  }
}

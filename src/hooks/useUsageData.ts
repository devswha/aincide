import useSWR from 'swr'
import type { AccountUsage, CodexUsage, GeminiUsage, UsageData } from '@/types/status'

async function fetchUsage(url: string): Promise<UsageData> {
  const response = await fetch(url)
  let data: { error?: string; accounts?: unknown; codex?: unknown; gemini?: unknown } | null = null
  try { data = await response.json() } catch { data = null }

  if (response.status === 503 && (data?.error === 'CLIProxyAPI not configured' || data?.error === 'Usage server not configured')) {
    throw new Error('NOT_CONFIGURED')
  }
  if (!response.ok) {
    throw new Error(data?.error || `usage:${response.status}`)
  }

  return {
    accounts: Array.isArray(data?.accounts) ? (data.accounts as AccountUsage[]) : [],
    codex: Array.isArray(data?.codex) ? (data.codex as CodexUsage[]) : [],
    gemini: Array.isArray(data?.gemini) ? (data.gemini as GeminiUsage[]) : [],
  }
}

export function useUsageData(enabled: boolean) {
  const { data, error, isLoading, mutate } = useSWR<UsageData>(
    enabled ? '/api/proxy/usage' : null,
    fetchUsage,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    }
  )

  const isNotConfigured = !enabled || error?.message === 'NOT_CONFIGURED'

  return {
    data: data ?? null,
    error: error && !isNotConfigured ? '토큰 사용량을 가져올 수 없습니다. (CLIProxyAPI 연결 확인)' : null,
    isLoading: enabled ? isLoading : false,
    isNotConfigured,
    mutate,
  }
}

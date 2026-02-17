import useSWR from 'swr'
import { BOT_API_URL } from '@/lib/constants'
import type { BotInfo, BotStatusData } from '@/types/status'

function parseBotData(data: Record<string, unknown>): BotStatusData {
  return {
    bots: Array.isArray(data?.bots) ? (data.bots as BotInfo[]) : [],
    serverUptime: typeof data?.serverUptime === 'string' ? data.serverUptime : '',
  }
}

async function fetchBotStatus(): Promise<BotStatusData> {
  // Try server-side proxy first
  try {
    const response = await fetch('/api/proxy/bot-status')
    if (response.ok) return parseBotData(await response.json())
  } catch { /* proxy unavailable */ }

  // Fallback: direct fetch from browser (works when on Tailscale)
  try {
    const response = await fetch(`${BOT_API_URL}/api/bot-status`, {
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) throw new Error(`bot-status:${response.status}`)
    return parseBotData(await response.json())
  } catch {
    // Both proxy and direct failed — return empty
    return { bots: [], serverUptime: '' }
  }
}

export function useBotStatus() {
  const { data, error, isLoading, mutate } = useSWR<BotStatusData>(
    'bot-status',
    fetchBotStatus,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    }
  )

  return {
    data: data ?? null,
    error: error ? '봇 상태를 가져올 수 없습니다. Tailscale 연결 상태를 확인하세요.' : null,
    isLoading,
    mutate,
  }
}

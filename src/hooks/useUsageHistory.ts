import useSWR from 'swr'

export interface HistoryDataPoint {
  timestamp: string
  utilization: number
}

export type TimeRange = '5h' | '24h' | '7d' | '30d'

async function fetchHistory(url: string): Promise<HistoryDataPoint[]> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`history:${response.status}`)
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export function useUsageHistory(
  accountKey: string | null,
  metricType: string,
  range: TimeRange,
) {
  const key = accountKey
    ? `/api/proxy/usage-history?account=${encodeURIComponent(accountKey)}&metric=${encodeURIComponent(metricType)}&range=${range}`
    : null

  const { data, error, isLoading } = useSWR<HistoryDataPoint[]>(
    key,
    fetchHistory,
    {
      refreshInterval: 300000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  return {
    data: data ?? [],
    isLoading,
    isUnavailable: !!error,
    isEmpty: data !== undefined && data.length === 0,
  }
}

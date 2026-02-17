import useSWR from 'swr'
import { QUANT_DASHBOARD_URL, STOCK_DASHBOARD_URL } from '@/lib/constants'
import type { ServiceHealth } from '@/types/status'

const DEFAULT_SERVICES = [
  { name: 'Quant Dashboard', url: QUANT_DASHBOARD_URL, description: 'magi-quant 트레이딩 대시보드' },
  { name: 'Stock Dashboard', url: STOCK_DASHBOARD_URL, description: 'magi-stock 주식 대시보드' },
]

async function fetchServiceHealth(): Promise<ServiceHealth[]> {
  // Try server-side proxy first
  try {
    const response = await fetch('/api/proxy/services')
    if (response.ok) {
      const results: ServiceHealth[] = await response.json()
      // Always trust proxy response — don't fall back to direct fetches
      return results
    }
  } catch { /* proxy unavailable — fall through to direct check */ }

  // Fallback: direct health check from browser (works when on Tailscale)
  return Promise.all(
    DEFAULT_SERVICES.map(async (svc): Promise<ServiceHealth> => {
      if (!svc.url) return { name: svc.name, url: null as unknown as string, status: 'offline', description: svc.description }
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      try {
        await fetch(svc.url, { signal: controller.signal, mode: 'no-cors' })
        return { name: svc.name, url: svc.url, status: 'online', description: svc.description }
      } catch {
        return { name: svc.name, url: svc.url, status: 'offline', description: svc.description }
      } finally {
        clearTimeout(timeout)
      }
    })
  )
}

export function useServiceHealth() {
  const { data, isLoading } = useSWR<ServiceHealth[]>(
    'service-health',
    fetchServiceHealth,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
    }
  )

  return {
    data: data ?? DEFAULT_SERVICES.map(s => ({ ...s, status: 'checking' as const })),
    isLoading,
  }
}

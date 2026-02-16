import { NextResponse } from 'next/server'

const SERVICES = [
  {
    name: 'Quant Dashboard',
    url: process.env.QUANT_DASHBOARD_URL,
    description: 'magi-quant 트레이딩 대시보드',
  },
  {
    name: 'Stock Dashboard',
    url: process.env.STOCK_DASHBOARD_URL,
    description: 'magi-stock 주식 대시보드',
  },
]

export async function GET() {
  const results = await Promise.all(
    SERVICES.map(async (svc) => {
      if (!svc.url) {
        return { name: svc.name, url: null, status: 'offline' as const, description: svc.description }
      }
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 3000)
        await fetch(svc.url, { signal: controller.signal })
        clearTimeout(timeout)
        return { name: svc.name, url: svc.url, status: 'online' as const, description: svc.description }
      } catch {
        return { name: svc.name, url: svc.url, status: 'offline' as const, description: svc.description }
      }
    })
  )

  return NextResponse.json(results)
}

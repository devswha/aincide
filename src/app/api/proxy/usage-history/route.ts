import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const RANGE_MS: Record<string, number> = {
  '5h': 5 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const account = searchParams.get('account') || ''
  const metric = searchParams.get('metric') || ''
  const range = searchParams.get('range') || '24h'

  if (!account || !metric) {
    return NextResponse.json({ error: 'Missing account or metric' }, { status: 400 })
  }

  const ms = RANGE_MS[range] || RANGE_MS['24h']
  const since = new Date(Date.now() - ms)

  try {
    const snapshots = await prisma.usageSnapshot.findMany({
      where: {
        account,
        metric,
        timestamp: { gte: since },
      },
      orderBy: { timestamp: 'asc' },
      select: { timestamp: true, utilization: true },
    })

    const data = snapshots.map((s) => ({
      timestamp: s.timestamp.toISOString(),
      utilization: s.utilization,
    }))

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch (err) {
    console.error('Usage history query error:', err)
    return NextResponse.json({ error: 'Failed to query usage history' }, { status: 500 })
  }
}

'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useUsageHistory, type TimeRange } from '@/hooks/useUsageHistory'
import TimeRangeToggle from './TimeRangeToggle'

interface UsageTimeChartProps {
  accountKey: string
  title?: string
}

function formatTick(timestamp: string): string {
  const d = new Date(timestamp)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function UsageTimeChart({ accountKey, title = 'Usage History' }: UsageTimeChartProps) {
  const [range, setRange] = useState<TimeRange>('24h')

  const { data: opusData, isLoading: opusLoading, isUnavailable: opusUnavailable, isEmpty: opusEmpty } = useUsageHistory(accountKey, 'five_hour', range)
  const { data: opus7dData } = useUsageHistory(accountKey, 'seven_day', range)
  const { data: sonnetData } = useUsageHistory(accountKey, 'seven_day_sonnet', range)

  // Merge data by timestamp union (all series contribute keys)
  const mergedMap = new Map<string, { timestamp: string; fiveHour: number; sevenDay: number; sonnet: number }>()
  const ensureEntry = (ts: string) => {
    if (!mergedMap.has(ts)) mergedMap.set(ts, { timestamp: ts, fiveHour: 0, sevenDay: 0, sonnet: 0 })
    return mergedMap.get(ts)!
  }
  opusData.forEach((p) => { ensureEntry(p.timestamp).fiveHour = p.utilization })
  opus7dData.forEach((p) => { ensureEntry(p.timestamp).sevenDay = p.utilization })
  sonnetData.forEach((p) => { ensureEntry(p.timestamp).sonnet = p.utilization })
  const mergedData = Array.from(mergedMap.values()).sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  if ((opusUnavailable || opusEmpty) && !opusLoading) {
    return (
      <div className="p-5 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{title}</h3>
          <TimeRangeToggle value={range} onChange={setRange} />
        </div>
        <div className="flex items-center justify-center h-40 text-sm text-[var(--color-text-muted)]">
          히스토리 데이터를 사용할 수 없습니다
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{title}</h3>
        <TimeRangeToggle value={range} onChange={setRange} />
      </div>

      {opusLoading ? (
        <div className="skeleton h-48 rounded-xl" />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={mergedData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradFiveHour" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSevenDay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSonnet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTick}
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
              stroke="var(--color-border-subtle)"
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
              stroke="var(--color-border-subtle)"
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--color-text-primary)',
              }}
              labelFormatter={(label) => formatTick(String(label))}
              formatter={(value) => [`${value}%`]}
            />
            <Area
              type="monotone"
              dataKey="fiveHour"
              name="Opus 5시간"
              stroke="#8b5cf6"
              fill="url(#gradFiveHour)"
              strokeWidth={2}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="sevenDay"
              name="Opus 7일"
              stroke="#6366f1"
              fill="url(#gradSevenDay)"
              strokeWidth={2}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="sonnet"
              name="Sonnet 7일"
              stroke="#10b981"
              fill="url(#gradSonnet)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

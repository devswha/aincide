'use client'

import { PieChart, Pie } from 'recharts'

interface UsageGaugeProps {
  value: number
  label: string
  resetText?: string
}

function getGaugeColor(value: number): string {
  if (value >= 80) return 'var(--color-danger)'
  if (value >= 50) return 'var(--color-warning)'
  return 'var(--color-success)'
}

export default function UsageGauge({ value, label, resetText }: UsageGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const isUnknown = value === 0 && !resetText
  const color = isUnknown ? 'var(--color-bg-muted)' : getGaugeColor(clamped)

  const trackData = [{ name: 'track', value: 100, fill: 'var(--color-bg-base)' }]
  const valueData = isUnknown
    ? [{ name: 'empty', value: 100, fill: 'transparent' }]
    : [
        { name: 'used', value: clamped, fill: color },
        { name: 'free', value: 100 - clamped, fill: 'transparent' },
      ]

  return (
    <div className="flex flex-col items-center justify-start">
      <div className="relative w-24 h-24">
        <PieChart width={96} height={96}>
          {/* Background Track */}
          <Pie
            data={trackData}
            dataKey="value"
            cx={47}
            cy={47}
            innerRadius="75%"
            outerRadius="95%"
            isAnimationActive={false}
            stroke="none"
          />
          {/* Value Arc */}
          <Pie
            data={valueData}
            dataKey="value"
            cx={47}
            cy={47}
            innerRadius="75%"
            outerRadius="95%"
            startAngle={90}
            endAngle={-270}
            animationDuration={800}
            stroke="none"
            cornerRadius={10}
          />
        </PieChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`font-bold text-[var(--color-text-primary)] ${isUnknown ? 'text-lg' : 'text-xl'}`}>
            {isUnknown ? '—' : `${Math.round(clamped)}%`}
          </span>
        </div>
      </div>
      <div className="text-center mt-1.5">
        <p className="text-[11px] font-medium text-[var(--color-text-secondary)] leading-tight">{label}</p>
        {resetText ? (
          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{resetText}</p>
        ) : isUnknown ? (
          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">대기 중</p>
        ) : null}
      </div>
    </div>
  )
}

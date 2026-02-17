import type { TimeRange } from '@/hooks/useUsageHistory'

const RANGES: { value: TimeRange; label: string }[] = [
  { value: '5h', label: '5H' },
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
]

export default function TimeRangeToggle({
  value,
  onChange,
}: {
  value: TimeRange
  onChange: (range: TimeRange) => void
}) {
  return (
    <div role="group" aria-label="시간 범위 선택" className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]">
      {RANGES.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          aria-pressed={value === r.value}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
            value === r.value
              ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent-light)] shadow-sm'
              : 'text-[var(--color-text-muted)] sm:hover:text-[var(--color-text-secondary)]'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}

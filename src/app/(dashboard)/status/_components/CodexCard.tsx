import { CodexUsage } from '@/types/status'
import { formatResetTimestamp } from '@/lib/status-helpers'
import UsageGauge from './UsageGauge'

export default function CodexCard({
  codex,
  onDownload,
}: {
  codex: CodexUsage
  onDownload: (fileName: string) => void
}) {
  const hasSecondary = !!codex.rate_limit.secondary_window

  return (
    <div
      className="relative overflow-hidden p-5 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] transition-all duration-300 sm:hover:border-[var(--color-border-hover)] group"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[var(--color-text-primary)] tracking-tight">
              Codex
            </h3>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-[var(--color-success)]/30 text-[var(--color-success)] bg-[var(--color-success-muted)]"
            >
              {codex.plan_type.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">{codex.email}</p>
        </div>

        {codex.authFileName && (
          <button
            onClick={() => onDownload(codex.authFileName!)}
            className="p-2 text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] rounded-xl transition-all duration-200 sm:hover:text-[var(--color-text-primary)] sm:hover:bg-[var(--color-bg-hover)] active:scale-95"
            title="Download Auth File"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        )}
      </div>

      <div className={`grid ${hasSecondary ? 'grid-cols-2' : 'grid-cols-1 max-w-[120px] mx-auto'} gap-4`}>
        <UsageGauge
          label="일간"
          value={codex.rate_limit.primary_window.used_percent}
          resetText={formatResetTimestamp(codex.rate_limit.primary_window.reset_at)}
        />
        {codex.rate_limit.secondary_window && (
          <UsageGauge
            label="주간"
            value={codex.rate_limit.secondary_window.used_percent}
            resetText={formatResetTimestamp(codex.rate_limit.secondary_window.reset_at)}
          />
        )}
      </div>
    </div>
  )
}

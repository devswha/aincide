import { GeminiUsage } from '@/types/status'
import { formatResetTime } from '@/lib/status-helpers'
import UsageGauge from './UsageGauge'

const PROVIDER_LABELS: Record<string, string> = {
  'gemini-cli': 'Gemini CLI',
}

const MODEL_LABELS: Record<string, string> = {
  'gemini-2.0-flash': '2.0 Flash',
  'gemini-2.5-flash': '2.5 Flash',
  'gemini-2.5-flash-lite': '2.5 Flash Lite',
  'gemini-2.5-pro': '2.5 Pro',
  'gemini-3-flash-preview': '3 Flash',
  'gemini-3-pro-preview': '3 Pro',
}

export default function GeminiCard({
  account,
  onDownload,
}: {
  account: GeminiUsage
  onDownload: (fileName: string) => void
}) {
  const isError = account.status === 'error'
  const providerLabel = PROVIDER_LABELS[account.provider] || account.provider
  const models = account.quota?.models ?? []
  const hasQuota = models.length > 0

  return (
    <div
      className={`relative overflow-hidden p-5 rounded-2xl border bg-[var(--color-bg-surface)] transition-all duration-300 sm:hover:border-[var(--color-border-hover)] group ${
        isError
          ? 'border-[var(--color-danger)]/30'
          : 'border-[var(--color-border-subtle)]'
      }`}
    >
      <div className={`flex items-start justify-between ${hasQuota ? 'mb-5' : ''}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[var(--color-text-primary)] tracking-tight">
              {providerLabel}
            </h3>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                isError
                  ? 'border-[var(--color-danger)]/30 text-[var(--color-danger)] bg-[var(--color-danger-muted)]'
                  : 'border-[var(--color-success)]/30 text-[var(--color-success)] bg-[var(--color-success-muted)]'
              }`}
            >
              {isError ? 'ERROR' : 'ACTIVE'}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">{account.email}</p>
          {account.statusMessage && (
            <p className="text-[10px] text-[var(--color-text-muted)] line-clamp-2" title={account.statusMessage}>{account.statusMessage}</p>
          )}
        </div>

        {account.authFileName && (
          <button
            onClick={() => onDownload(account.authFileName)}
            className="p-2 text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] rounded-xl transition-all duration-200 sm:hover:text-[var(--color-text-primary)] sm:hover:bg-[var(--color-bg-hover)] active:scale-95"
            title="Download Auth File"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        )}
      </div>

      {hasQuota && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {models.map((m) => (
            <UsageGauge
              key={m.modelId}
              label={MODEL_LABELS[m.modelId] || m.modelId.replace('gemini-', '')}
              value={m.used}
              resetText={formatResetTime(m.resetTime)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

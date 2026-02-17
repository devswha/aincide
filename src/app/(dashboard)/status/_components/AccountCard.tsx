import { AccountUsage } from '@/types/status'
import { formatResetTime } from '@/lib/status-helpers'
import UsageGauge from './UsageGauge'

export default function AccountCard({
  account,
  onDownload,
}: {
  account: AccountUsage
  onDownload: (fileName: string) => void
}) {
  const isError = account.status === 'error'
  const isRateLimited = account.statusMessage?.includes('rate_limit') || account.statusMessage?.includes('quota')

  return (
    <div
      className={`relative overflow-hidden p-5 rounded-2xl border bg-[var(--color-bg-surface)] transition-all duration-300 sm:hover:border-[var(--color-border-hover)] group ${
        isError
          ? 'border-[var(--color-danger)]/30'
          : 'border-[var(--color-border-subtle)]'
      }`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[var(--color-text-primary)] tracking-tight">
              Claude {account.planType || 'MAX'}
            </h3>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                isError
                  ? 'border-[var(--color-danger)]/30 text-[var(--color-danger)] bg-[var(--color-danger-muted)]'
                  : 'border-transparent text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]'
              }`}
            >
              {isError ? (isRateLimited ? 'RATE LIMITED' : 'ERROR') : 'ACTIVE'}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">{account.email}</p>
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

      <div className="grid grid-cols-3 gap-2">
        <UsageGauge
          label="일간 (5시간)"
          value={account.usage.five_hour.utilization}
          resetText={formatResetTime(account.usage.five_hour.resets_at)}
        />
        <UsageGauge
          label="Opus (7일)"
          value={account.usage.seven_day.utilization}
          resetText={formatResetTime(account.usage.seven_day.resets_at)}
        />
        <UsageGauge
          label="Sonnet (7일)"
          value={account.usage.seven_day_sonnet.utilization}
          resetText={formatResetTime(account.usage.seven_day_sonnet.resets_at)}
        />
      </div>
    </div>
  )
}

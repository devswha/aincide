'use client'

import { useState, useEffect, useCallback } from 'react'

// === TYPE DEFINITIONS ===

interface BotInfo {
  id: string
  name: string
  status: 'online' | 'offline'
  uptime: string
  ping: number
  openclawAgent: string
  workspace?: string
  description: string
}

interface BotStatusData {
  bots: BotInfo[]
  serverUptime: string
}

interface AnthropicLimit {
  utilization: number
  resets_at: string | null
}

interface AccountUsage {
  name: string
  email: string
  authFileName: string
  status?: 'active' | 'error'
  statusMessage?: string
  usage: {
    five_hour: AnthropicLimit
    seven_day: AnthropicLimit
    seven_day_sonnet: AnthropicLimit
  }
}

interface CodexRateWindow {
  used_percent: number
  limit_window_seconds: number
  reset_after_seconds: number
  reset_at: number
}

interface CodexUsage {
  email: string
  plan_type: string
  authFileName?: string
  rate_limit: {
    primary_window: CodexRateWindow
    secondary_window: CodexRateWindow | null
  }
  code_review_rate_limit: {
    primary_window: CodexRateWindow
    secondary_window: CodexRateWindow | null
  }
}

interface UsageData {
  accounts: AccountUsage[]
  codex: CodexUsage[]
}

interface ServiceHealth {
  name: string
  url: string
  status: 'checking' | 'online' | 'offline'
  description: string
}

// === HELPER FUNCTIONS ===

function formatResetTime(resetAt: string | null): string {
  if (!resetAt) return '리셋 대기 없음'
  const now = new Date()
  const reset = new Date(resetAt)
  const diffMs = reset.getTime() - now.getTime()
  if (diffMs <= 0) return '리셋 중...'
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay > 0) return `${diffDay}일 ${diffHour % 24}시간 후 리셋`
  if (diffHour > 0) return `${diffHour}시간 ${diffMin % 60}분 후 리셋`
  return `${diffMin}분 후 리셋`
}

function formatResetTimestamp(resetAt: number): string {
  const now = Date.now() / 1000
  const diffSec = resetAt - now
  if (diffSec <= 0) return '리셋 중...'
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay > 0) return `${diffDay}일 ${diffHour % 24}시간 후 리셋`
  if (diffHour > 0) return `${diffHour}시간 ${diffMin % 60}분 후 리셋`
  return `${diffMin}분 후 리셋`
}

function getBarColor(pct: number): string {
  if (pct >= 80) return 'var(--color-danger)'
  if (pct >= 50) return 'var(--color-warning)'
  return 'var(--color-success)'
}

// === SUB-COMPONENTS ===

function UsageBar({ label, limit }: { label: string; limit: AnthropicLimit }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
        <span className="text-sm font-medium text-[var(--color-text-primary)]">
          {limit.utilization}%
        </span>
      </div>
      <div className="w-full h-2 bg-[var(--color-bg-base)] rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${limit.utilization}%`,
            backgroundColor: getBarColor(limit.utilization),
          }}
        />
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
        {formatResetTime(limit.resets_at)}
      </p>
    </div>
  )
}

function CodexUsageBar({ label, usedPercent, resetAt }: { label: string; usedPercent: number; resetAt: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
        <span className="text-sm font-medium text-[var(--color-text-primary)]">
          {usedPercent}%
        </span>
      </div>
      <div className="w-full h-2 bg-[var(--color-bg-base)] rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${usedPercent}%`,
            backgroundColor: getBarColor(usedPercent),
          }}
        />
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
        {formatResetTimestamp(resetAt)}
      </p>
    </div>
  )
}

function BotRow({ bot }: { bot: BotInfo }) {
  const isOnline = bot.status === 'online'
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-[var(--color-border-subtle)] last:border-b-0">
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${isOnline ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]'}`}
        style={isOnline ? { boxShadow: '0 0 8px var(--color-success)' } : {}}
      />
      <span className="text-sm font-semibold text-[var(--color-text-primary)] min-w-[60px]">{bot.name}</span>
      <span className="text-xs text-[var(--color-text-muted)] min-w-[60px]">{bot.uptime}</span>
      <span className="text-xs text-[var(--color-text-muted)] min-w-[50px]">{bot.ping >= 0 ? `${bot.ping}ms` : 'N/A'}</span>
      <span className="text-xs text-[var(--color-text-secondary)] flex-1">{bot.openclawAgent}</span>
    </div>
  )
}

// === MAIN PAGE COMPONENT ===

export default function StatusPage() {
  const [botStatus, setBotStatus] = useState<BotStatusData | null>(null)
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [services, setServices] = useState<ServiceHealth[]>([
    { name: 'Quant Dashboard', url: '', status: 'checking', description: 'magi-quant 트레이딩 대시보드' },
    { name: 'Stock Dashboard', url: '', status: 'checking', description: 'magi-stock 주식 대시보드' },
  ])

  const checkServices = useCallback(async () => {
    try {
      const response = await fetch('/api/proxy/services')
      if (response.ok) {
        const results: ServiceHealth[] = await response.json()
        setServices(results)
      }
    } catch {
      // Services check failed silently
    }
  }, [])

  const fetchAll = useCallback(async () => {
    try {
      setError(null)
      const [statusResult, usageResult] = await Promise.allSettled([
        fetch('/api/proxy/bot-status').then(r => {
          if (!r.ok) throw new Error('Failed')
          return r.json()
        }),
        fetch('/api/proxy/bot-usage').then(r => {
          if (!r.ok) throw new Error('Failed')
          return r.json()
        }),
      ])
      if (statusResult.status === 'fulfilled') setBotStatus(statusResult.value)
      if (usageResult.status === 'fulfilled') setUsageData(usageResult.value)
      if (statusResult.status === 'rejected' && usageResult.status === 'rejected') {
        setError('봇 서버에 연결할 수 없습니다. Tailscale 연결을 확인하세요.')
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('봇 서버에 연결할 수 없습니다. Tailscale 연결을 확인하세요.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
    checkServices()
  }, [checkServices])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAll()
  }

  const handleDownload = (fileName: string) => {
    window.open(`/api/proxy/auth-files/download?name=${encodeURIComponent(fileName)}`, '_blank')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Status</h1>
          {botStatus && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]">
              Server {botStatus.serverUptime}
            </span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="min-h-[44px] px-4 py-2 text-sm font-medium text-white bg-[var(--color-accent)] rounded-xl transition-all duration-200 sm:hover:bg-[var(--color-accent-hover)] sm:hover:shadow-[0_0_15px_-3px_var(--color-accent-glow)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          style={{ touchAction: 'manipulation' }}
        >
          {refreshing ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            '새로고침'
          )}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="skeleton h-48 rounded-2xl" />
          <div className="skeleton h-48 rounded-2xl" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      ) : error ? (
        <div
          className="p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center gap-3 text-[var(--color-warning)]">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-base">{error}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Token Usage Section - HERO */}
          {usageData && (usageData.accounts.length > 0 || usageData.codex.length > 0) && (
            <div>
              <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Token Usage</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {usageData.accounts.map((account, idx) => (
                  <div
                    key={account.email || idx}
                    className={`p-4 rounded-2xl border bg-[var(--color-bg-surface)] ${
                      account.status === 'error'
                        ? 'border-[var(--color-danger)]/30'
                        : 'border-[var(--color-border-subtle)]'
                    }`}
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Claude MAX</h3>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{account.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.authFileName && (
                          <button
                            onClick={() => handleDownload(account.authFileName)}
                            className="min-h-[32px] px-2 py-1 text-xs text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] rounded-lg transition-all duration-200 sm:hover:bg-[var(--color-bg-base)] active:scale-95"
                            style={{ touchAction: 'manipulation' }}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        )}
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{
                            color: account.status === 'error'
                              ? (account.statusMessage?.includes('rate_limit') ? 'var(--color-danger)' : 'var(--color-warning)')
                              : 'var(--color-accent-light)',
                            backgroundColor: account.status === 'error'
                              ? (account.statusMessage?.includes('rate_limit') ? 'rgba(248, 113, 113, 0.15)' : 'rgba(251, 191, 36, 0.15)')
                              : 'var(--color-accent-muted)',
                          }}
                        >
                          {account.status === 'error'
                            ? (account.statusMessage?.includes('rate_limit') ? 'RATE LIMITED' : 'ERROR')
                            : 'MAX'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <UsageBar label="일간 (5시간)" limit={account.usage.five_hour} />
                      <UsageBar label="주간 Opus (7일)" limit={account.usage.seven_day} />
                      <UsageBar label="주간 Sonnet (7일)" limit={account.usage.seven_day_sonnet} />
                    </div>
                  </div>
                ))}

                {usageData.codex.map((codex, idx) => (
                  <div
                    key={codex.email || idx}
                    className="p-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]"
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Codex</h3>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{codex.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {codex.authFileName && (
                          <button
                            onClick={() => handleDownload(codex.authFileName!)}
                            className="min-h-[32px] px-2 py-1 text-xs text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] rounded-lg transition-all duration-200 sm:hover:bg-[var(--color-bg-base)] active:scale-95"
                            style={{ touchAction: 'manipulation' }}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        )}
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{
                            color: '#4ade80',
                            backgroundColor: 'rgba(74, 222, 128, 0.15)',
                          }}
                        >
                          {codex.plan_type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <CodexUsageBar
                        label="일간"
                        usedPercent={codex.rate_limit.primary_window.used_percent}
                        resetAt={codex.rate_limit.primary_window.reset_at}
                      />
                      {codex.rate_limit.secondary_window && (
                        <CodexUsageBar
                          label="주간"
                          usedPercent={codex.rate_limit.secondary_window.used_percent}
                          resetAt={codex.rate_limit.secondary_window.reset_at}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bot Status Section - Compact */}
          {botStatus && botStatus.bots.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Bot Status</h2>
              <div
                className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] overflow-hidden"
                style={{ backdropFilter: 'blur(12px)' }}
              >
                {botStatus.bots.map((bot) => (
                  <BotRow key={bot.id} bot={bot} />
                ))}
              </div>
            </div>
          )}

          {/* External Services Section - Inline */}
          {services.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Dashboards</h2>
              <div
                className="p-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] flex items-center gap-6 flex-wrap"
                style={{ backdropFilter: 'blur(12px)' }}
              >
                {services.map((svc) => {
                  const isOnline = svc.status === 'online'
                  const isChecking = svc.status === 'checking'
                  return (
                    <div key={svc.name} className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${isChecking ? 'bg-[var(--color-text-muted)] animate-pulse' : isOnline ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]'}`}
                        style={isOnline ? { boxShadow: '0 0 8px var(--color-success)' } : {}}
                      />
                      {isOnline ? (
                        <a
                          href={svc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-[var(--color-text-primary)] sm:hover:text-[var(--color-accent)] transition-colors flex items-center gap-1"
                        >
                          {svc.name}
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-[var(--color-text-muted)]">{svc.name}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {(!botStatus || botStatus.bots.length === 0) && (!usageData || (usageData.accounts.length === 0 && usageData.codex.length === 0)) && (
            <div
              className="p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]"
              style={{ backdropFilter: 'blur(12px)' }}
            >
              <p className="text-[var(--color-text-muted)] text-center">등록된 봇이나 계정이 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

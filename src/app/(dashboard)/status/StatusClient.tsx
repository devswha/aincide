'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { BOT_API_URL } from '@/lib/constants'
import { useUsageData } from '@/hooks/useUsageData'
import { useBotStatus } from '@/hooks/useBotStatus'
import { useServiceHealth } from '@/hooks/useServiceHealth'
import BotRow from './_components/BotRow'
import ServiceHealthBadge from './_components/ServiceHealthBadge'
import RefreshButton from './_components/RefreshButton'
import SectionErrorBoundary from './_components/SectionErrorBoundary'

const AccountCard = dynamic(() => import('./_components/AccountCard'), {
  ssr: false,
  loading: () => <div className="skeleton h-48 rounded-2xl" />,
})
const CodexCard = dynamic(() => import('./_components/CodexCard'), {
  ssr: false,
  loading: () => <div className="skeleton h-48 rounded-2xl" />,
})
const GeminiCard = dynamic(() => import('./_components/GeminiCard'), {
  ssr: false,
  loading: () => <div className="skeleton h-24 rounded-2xl" />,
})
const UsageTimeChart = dynamic(() => import('./_components/UsageTimeChart'), {
  ssr: false,
  loading: () => <div className="skeleton h-64 rounded-2xl" />,
})

export default function StatusClient({ usageConfigured }: { usageConfigured: boolean }) {
  const [refreshing, setRefreshing] = useState(false)

  const { data: usageData, error: usageError, isLoading: usageLoading, isNotConfigured, mutate: mutateUsage } = useUsageData(usageConfigured)
  const { data: botStatus, error: botError, isLoading: botLoading, mutate: mutateBots } = useBotStatus()
  const { data: services } = useServiceHealth()

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.allSettled([mutateUsage(), mutateBots()])
    setRefreshing(false)
  }

  const handleDownload = (fileName: string) => {
    window.open(`/api/proxy/auth-files/download?name=${encodeURIComponent(fileName)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Status</h1>
          {botStatus && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]">
              Server {botStatus.serverUptime}
            </span>
          )}
        </div>
        <RefreshButton refreshing={refreshing} onRefresh={handleRefresh} />
      </div>

      <div className="space-y-6">
        {/* Token Usage */}
        <section>
          <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Token Usage</h2>
          {usageLoading ? (
            <div className="skeleton h-48 rounded-2xl" />
          ) : isNotConfigured ? (
            <div className="p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]" style={{ backdropFilter: 'blur(12px)' }}>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 text-[var(--color-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[var(--color-text-primary)]">CLIProxyAPI 설정 필요</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    토큰 사용량 모니터링은{' '}
                    <a href="https://github.com/router-for-me/CLIProxyAPI" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-light)] sm:hover:text-[var(--color-accent)] underline underline-offset-4">CLIProxyAPI</a>{' '}
                    연동이 필요합니다.
                  </p>
                  <div className="mt-3 text-sm text-[var(--color-text-secondary)] space-y-1">
                    <p>1) CLIProxyAPI를 실행합니다.</p>
                    <p>2) Vercel 프로젝트 환경변수에 아래 값을 추가합니다.</p>
                  </div>
                  <pre className="mt-3 p-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-primary)] overflow-x-auto">
                    {`CLIPROXY_URL="https://your-cliproxy.example.com"\nCLIPROXY_MANAGEMENT_KEY="your-management-key"\n# or\nCLIPROXY_KEY="your-management-key"`}
                  </pre>
                  <p className="text-xs text-[var(--color-text-muted)] mt-2">설정 후 새로고침하면 토큰 사용량 카드가 표시됩니다.</p>
                </div>
              </div>
            </div>
          ) : usageError ? (
            <div className="p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]" style={{ backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center gap-3 text-[var(--color-warning)]">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-base">{usageError}</p>
              </div>
            </div>
          ) : usageData && (usageData.accounts.length > 0 || usageData.codex.length > 0 || usageData.gemini.length > 0) ? (
            <SectionErrorBoundary fallbackMessage="토큰 사용량 카드를 불러오는 중 오류가 발생했습니다.">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {usageData.accounts.map((account, idx) => (
                  <div key={account.email || idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'backwards' }}>
                    <AccountCard account={account} onDownload={handleDownload} />
                  </div>
                ))}
                {usageData.codex.map((codex, idx) => (
                  <div key={codex.email || idx} className="animate-fade-in-up" style={{ animationDelay: `${(usageData.accounts.length + idx) * 80}ms`, animationFillMode: 'backwards' }}>
                    <CodexCard codex={codex} onDownload={handleDownload} />
                  </div>
                ))}
                {usageData.gemini.map((gemini, idx) => (
                  <div key={gemini.authFileName || idx} className="animate-fade-in-up" style={{ animationDelay: `${(usageData.accounts.length + usageData.codex.length + idx) * 80}ms`, animationFillMode: 'backwards' }}>
                    <GeminiCard account={gemini} onDownload={handleDownload} />
                  </div>
                ))}
              </div>
            </SectionErrorBoundary>
          ) : (
            <div className="p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]" style={{ backdropFilter: 'blur(12px)' }}>
              <p className="text-[var(--color-text-muted)] text-center">토큰 사용량 데이터가 없습니다.</p>
            </div>
          )}
        </section>

        {/* Usage History Charts */}
        {usageData && usageData.accounts.length > 0 && (
          <SectionErrorBoundary fallbackMessage="히스토리 차트를 불러오는 중 오류가 발생했습니다.">
            <section>
              <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Usage History</h2>
              <div className="space-y-4">
                {usageData.accounts.map((account) => (
                  <UsageTimeChart
                    key={`history-${account.email}`}
                    accountKey={account.email}
                    title={`${account.email} — All Window Usage`}
                  />
                ))}
              </div>
            </section>
          </SectionErrorBoundary>
        )}

        {/* Bot Status */}
        {botLoading ? (
          <section>
            <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Bot Status</h2>
            <div className="skeleton h-48 rounded-2xl" />
          </section>
        ) : botStatus && botStatus.bots.length > 0 ? (
          <section>
            <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Bot Status</h2>
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] overflow-hidden" style={{ backdropFilter: 'blur(12px)' }}>
              {botStatus.bots.map((bot) => (
                <BotRow key={bot.id} bot={bot} />
              ))}
            </div>
          </section>
        ) : botError ? (
          <div className="p-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]" style={{ backdropFilter: 'blur(12px)' }}>
            <p className="text-sm text-[var(--color-text-muted)]">{botError}</p>
            <a href={`${BOT_API_URL}/api/bot-status`} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs text-[var(--color-accent-light)] sm:hover:text-[var(--color-accent)] underline underline-offset-4">
              직접 확인하기 →
            </a>
          </div>
        ) : null}

        {/* Dashboards */}
        {services.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Dashboards</h2>
            <div className="p-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] flex items-center gap-6 flex-wrap" style={{ backdropFilter: 'blur(12px)' }}>
              {services.map((svc) => (
                <ServiceHealthBadge key={svc.name} service={svc} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {botStatus && botStatus.bots.length === 0 && usageData && usageData.accounts.length === 0 && usageData.codex.length === 0 && usageData.gemini.length === 0 && !isNotConfigured && !usageError && !botError && (
          <div className="p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]" style={{ backdropFilter: 'blur(12px)' }}>
            <p className="text-[var(--color-text-muted)] text-center">등록된 봇이나 계정이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function formatResetTime(resetAt: string | null): string {
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

export function formatResetTimestamp(resetAt: number): string {
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

export function getBarColor(pct: number): string {
  if (pct >= 80) return 'var(--color-danger)'
  if (pct >= 50) return 'var(--color-warning)'
  return 'var(--color-success)'
}

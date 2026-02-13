// Time ago formatter (Korean)
export function timeAgo(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffDay > 0) return `${diffDay}일 전`
  if (diffHour > 0) return `${diffHour}시간 전`
  if (diffMin > 0) return `${diffMin}분 전`
  return '방금 전'
}

export function parseSimpleMarkdown(text: string): string {
  // Escape HTML entities first to prevent XSS
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
  // Bold: **text** -> <strong>text</strong>
  return escaped.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-[var(--color-text-primary)]">$1</strong>')
}

export interface AuthorTheme {
  label: string
  emoji: string
  colors: string
}

export function getAuthorTheme(type: string): AuthorTheme {
  switch (type) {
    case 'HUMAN':
      return {
        label: 'Human',
        emoji: '🧑',
        colors: 'bg-[var(--color-human-muted)] text-[var(--color-human)] border-[var(--color-human)]/20'
      }
    case 'AI':
      return {
        label: 'Agent',
        emoji: '🤖',
        colors: 'bg-[var(--color-ai-muted)] text-[var(--color-ai)] border-[var(--color-ai)]/20'
      }
    case 'ANONYMOUS':
    default:
      return {
        label: 'Anonymous',
        emoji: '👤',
        colors: 'bg-[var(--color-bg-surface-hover)] text-[var(--color-text-muted)] border-[var(--color-border-default)]'
      }
  }
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Generate visitor ID for voting
export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server'
  try {
    let id = localStorage.getItem('visitorId')
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2) + Date.now().toString(36)
      localStorage.setItem('visitorId', id)
    }
    return id
  } catch {
    // Private browsing or storage blocked
    return 'anonymous-' + Math.random().toString(36).substring(2)
  }
}
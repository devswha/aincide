import { ServiceHealth } from '@/types/status'

export default function ServiceHealthBadge({ service }: { service: ServiceHealth }) {
  const isOnline = service.status === 'online'
  const isChecking = service.status === 'checking'

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${isChecking ? 'bg-[var(--color-text-muted)] animate-pulse' : isOnline ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]'}`}
        style={isOnline ? { boxShadow: '0 0 8px var(--color-success)' } : {}}
      />
      {isOnline ? (
        <a
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[var(--color-text-primary)] sm:hover:text-[var(--color-accent)] transition-colors flex items-center gap-1"
        >
          {service.name}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ) : (
        <span className="text-sm font-medium text-[var(--color-text-muted)]">{service.name}</span>
      )}
    </div>
  )
}

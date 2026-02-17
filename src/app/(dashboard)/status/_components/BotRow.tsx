import { BotInfo } from '@/types/status'

export default function BotRow({ bot }: { bot: BotInfo }) {
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

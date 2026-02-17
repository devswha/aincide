export default function RefreshButton({
  refreshing,
  onRefresh,
}: {
  refreshing: boolean
  onRefresh: () => void
}) {
  return (
    <button
      onClick={onRefresh}
      disabled={refreshing}
      aria-label="새로고침"
      aria-busy={refreshing}
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
  )
}

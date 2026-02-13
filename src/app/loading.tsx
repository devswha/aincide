export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center animate-pulse">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-border-default)] border-t-[var(--color-accent)] mb-4" style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' }}></div>
        <p className="text-[var(--color-text-muted)] text-lg">로딩 중...</p>
      </div>
    </div>
  )
}

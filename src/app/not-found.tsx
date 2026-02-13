import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="glass-card rounded-xl p-8 max-w-md w-full text-center animate-fade-in-up">
        <h2 className="text-6xl font-bold text-gradient mb-4">404</h2>
        <p className="text-xl text-[var(--color-text-secondary)] mb-6">
          페이지를 찾을 수 없습니다
        </p>
        <Link
          href="/"
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-3 rounded-lg transition-all duration-200 min-h-[44px] inline-flex items-center justify-center sm:hover:scale-[1.02] active:scale-[0.98]"
          style={{ touchAction: 'manipulation' }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

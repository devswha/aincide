'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="glass-card rounded-xl p-8 max-w-md w-full text-center animate-fade-in-up">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-[var(--color-danger)] mb-4">
          오류가 발생했습니다
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          {error.message || '알 수 없는 오류가 발생했습니다.'}
        </p>
        <button
          onClick={() => reset()}
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-3 rounded-lg transition-all duration-200 min-h-[44px] w-full sm:w-auto sm:hover:scale-[1.02] active:scale-[0.98]"
          style={{ touchAction: 'manipulation' }}
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}

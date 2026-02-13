'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CommentFormProps {
  postId: string
}

export default function CommentForm({ postId }: CommentFormProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [nickname, setNickname] = useState('익명')
  const [authorType, setAuthorType] = useState('ANONYMOUS')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('댓글 내용을 입력해주세요')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          authorNickname: nickname.trim() || '익명',
          authorType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create comment')
      }

      setContent('')
      setNickname('익명')
      setAuthorType('ANONYMOUS')
      router.refresh()
    } catch (err) {
      setError('댓글 작성에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card p-6 rounded-lg animate-fade-in-up"
    >
      <div className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-bg-input)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] min-h-[100px] resize-vertical transition-all duration-150 text-base placeholder:text-[var(--color-text-muted)]"
            placeholder="댓글을 입력하세요..."
            style={{ touchAction: 'manipulation' }}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--color-bg-input)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition-all duration-150 text-base placeholder:text-[var(--color-text-muted)] min-h-[44px]"
            placeholder="닉네임"
            style={{ touchAction: 'manipulation' }}
          />

          <select
            value={authorType}
            onChange={(e) => setAuthorType(e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--color-bg-input)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition-all duration-150 text-base min-h-[44px]"
            style={{ touchAction: 'manipulation' }}
          >
            <option value="ANONYMOUS">👤 Anonymous</option>
            <option value="HUMAN">🧑 Human</option>
            <option value="AI">🤖 AI</option>
          </select>
        </div>

        {error && (
          <div className="text-[var(--color-danger)] text-sm animate-fade-in-up">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-2.5 bg-[var(--gradient-accent)] sm:hover:scale-[1.02] active:scale-[0.98] disabled:bg-[var(--color-bg-surface-hover)] disabled:text-[var(--color-text-muted)] text-white rounded-lg transition-all duration-200 font-medium disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[44px] shadow-md disabled:shadow-none"
          style={{
            touchAction: 'manipulation',
            transitionTimingFunction: 'var(--ease-out)'
          }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              작성 중...
            </span>
          ) : (
            '댓글 작성'
          )}
        </button>
      </div>
    </form>
  )
}

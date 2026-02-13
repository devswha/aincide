'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PostForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [nickname, setNickname] = useState('익명')
  const [authorType, setAuthorType] = useState('ANONYMOUS')
  const [category, setCategory] = useState('GENERAL')
  const [githubUrl, setGithubUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('내용을 입력해주세요')
      return
    }

    // Validate GitHub URL if provided
    if (githubUrl && !githubUrl.startsWith('https://github.com/')) {
      setError('GitHub URL은 https://github.com/으로 시작해야 합니다')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim() || null,
          content: content.trim(),
          authorNickname: nickname.trim() || '익명',
          authorType,
          category,
          githubUrl: githubUrl.trim() || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('게시글 작성에 실패했습니다')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass-card rounded-xl p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-bg-input)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition-all duration-200 text-base placeholder:text-[var(--color-text-muted)]"
            placeholder="제목을 입력하세요 (선택사항)"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            내용 *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-bg-input)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition-all duration-200 min-h-[200px] resize-vertical text-base placeholder:text-[var(--color-text-muted)]"
            placeholder="내용을 입력하세요..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--color-bg-input)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition-all duration-200 text-base placeholder:text-[var(--color-text-muted)] min-h-[44px]"
              placeholder="익명"
            />
          </div>

          <div>
            <label htmlFor="authorType" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              작성자 유형
            </label>
            <select
              id="authorType"
              value={authorType}
              onChange={(e) => setAuthorType(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--color-bg-input)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition-all duration-200 cursor-pointer text-base appearance-none min-h-[44px]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            >
              <option value="ANONYMOUS">👤 Anonymous</option>
              <option value="HUMAN">🧑 Human</option>
              <option value="AI">🤖 AI</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              카테고리
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--color-bg-input)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition-all duration-200 cursor-pointer text-base appearance-none min-h-[44px]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            >
              <option value="GENERAL">일반</option>
              <option value="DISCUSSION">토론</option>
              <option value="RANDOM">뻘글</option>
              <option value="GITHUB">📦 GitHub</option>
            </select>
          </div>
        </div>

        {category === 'GITHUB' && (
          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              GitHub 저장소 URL
            </label>
            <input
              id="githubUrl"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--color-bg-input)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition-all duration-200 text-base placeholder:text-[var(--color-text-muted)] min-h-[44px]"
              placeholder="https://github.com/username/repository"
            />
          </div>
        )}

        {error && (
          <div className="text-[var(--color-danger)] bg-[var(--color-danger-muted)] text-sm px-4 py-2 rounded-lg animate-fade-in">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[#8b5cf6] hover:from-[var(--color-accent-hover)] hover:to-[#7c3aed] disabled:bg-[var(--color-bg-surface)] disabled:text-[var(--color-text-muted)] text-white rounded-lg transition-all duration-200 font-medium disabled:cursor-not-allowed sm:hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 min-h-[44px]"
          style={{ touchAction: 'manipulation' }}
        >
          {isSubmitting && (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSubmitting ? '작성 중...' : '게시글 작성'}
        </button>
      </form>
    </div>
  )
}

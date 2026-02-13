import Link from 'next/link'
import PostForm from '@/components/PostForm'

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 animate-fade-in-up">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-light)] transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        목록으로
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-[var(--color-text-primary)]">새 글 작성</h1>

      <PostForm />
    </div>
  )
}

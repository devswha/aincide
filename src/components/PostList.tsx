'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PostCard from './PostCard'
import PostCardSkeleton from './skeletons/PostCardSkeleton'
import { Post } from '@/generated/prisma'

interface PostListProps {
  initialPosts: (Post & { _count?: { comments: number } })[]
  filter: string
  initialPage: number
  totalPages: number
}

export default function PostList({
  initialPosts,
  filter,
  initialPage,
  totalPages,
}: PostListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(false)
  }, [initialPosts])

  const handlePageChange = (newPage: number) => {
    setIsLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    if (filter !== 'all') {
      params.set('filter', filter)
    }
    router.push(`/?${params.toString()}`)
  }

  if (initialPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4 opacity-40">📭</div>
        <p className="text-xl font-medium text-[var(--color-text-secondary)] mb-2">
          게시글이 없습니다
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          첫 번째 게시글을 작성해보세요
        </p>
      </div>
    )
  }

  return (
    <div>
      {isLoading ? (
        <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}
              className="animate-fade-in-up"
            >
              <PostCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-5">
          {initialPosts.map((post, index) => (
            <div
              key={post.id}
              style={{ animationDelay: `${index * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}
              className="animate-fade-in-up"
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(initialPage - 1)}
            disabled={initialPage <= 1 || isLoading}
            className="px-5 py-2.5 bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-border-default)] sm:hover:bg-[var(--color-bg-surface-hover)] sm:hover:border-[var(--color-accent)]/40 sm:hover:text-[var(--color-accent-light)] disabled:opacity-50 disabled:cursor-not-allowed disabled:sm:hover:bg-[var(--color-bg-surface)] disabled:sm:hover:border-[var(--color-border-default)] disabled:sm:hover:text-[var(--color-text-secondary)] transition-all duration-200 font-medium min-h-[44px] active:scale-[0.98]"
            style={{ touchAction: 'manipulation' }}
          >
            이전
          </button>
          <span className="text-[var(--color-text-muted)] font-medium min-w-[60px] text-center">
            {initialPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(initialPage + 1)}
            disabled={initialPage >= totalPages || isLoading}
            className="px-5 py-2.5 bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-border-default)] sm:hover:bg-[var(--color-bg-surface-hover)] sm:hover:border-[var(--color-accent)]/40 sm:hover:text-[var(--color-accent-light)] disabled:opacity-50 disabled:cursor-not-allowed disabled:sm:hover:bg-[var(--color-bg-surface)] disabled:sm:hover:border-[var(--color-border-default)] disabled:sm:hover:text-[var(--color-text-secondary)] transition-all duration-200 font-medium min-h-[44px] active:scale-[0.98]"
            style={{ touchAction: 'manipulation' }}
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}

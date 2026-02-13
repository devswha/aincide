import { Comment } from '@/generated/prisma'
import { timeAgo, getAuthorTheme } from '@/lib/utils'

interface CommentListProps {
  comments: Comment[]
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="glass-card text-center py-12 rounded-lg">
        <div className="text-[var(--color-text-muted)] space-y-2">
          <svg
            className="w-12 h-12 mx-auto opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="font-medium">아직 댓글이 없습니다</p>
          <p className="text-sm">첫 댓글을 남겨보세요!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => {
        const badge = getAuthorTheme(comment.authorType)
        return (
          <div
            key={comment.id}
            className="glass-card p-4 sm:p-5 rounded-lg sm:hover:shadow-lg transition-shadow"
            style={{
              animationName: 'slideUp',
              animationDuration: 'var(--duration-normal)',
              animationTimingFunction: 'var(--ease-out)',
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'backwards',
            }}
          >
            <p className="text-[var(--color-text-primary)] mb-4 whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>
            <div className="flex flex-wrap items-center gap-2.5 text-sm">
              <span className="font-medium text-[var(--color-text-secondary)]">
                {comment.authorNickname}
              </span>
              <span className={`px-2.5 py-1 rounded border text-xs font-medium transition-all duration-150 ${badge.colors}`}>
                {badge.emoji} {badge.label}
              </span>
              <span className="text-[var(--color-text-muted)]">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import VoteButtons from '@/components/VoteButtons'
import CommentList from '@/components/CommentList'
import CommentForm from '@/components/CommentForm'
import { timeAgo, getAuthorTheme, parseSimpleMarkdown } from '@/lib/utils'
import GitHubIcon from '@/components/icons/GitHubIcon'

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!post) {
    notFound()
  }

  return post
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const post = await getPost(id)

  const badge = getAuthorTheme(post.authorType)

  return (
    <div className="mx-auto max-w-4xl lg:max-w-5xl px-4 lg:px-8 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-light)] transition-colors mb-6 group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        목록으로
      </Link>

      <article className="glass-card rounded-xl p-6 sm:p-8 lg:p-10 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-4 lg:gap-8">
          <VoteButtons
            postId={post.id}
            initialUpvotes={post.upvotes}
            initialDownvotes={post.downvotes}
          />

          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-semibold text-[var(--color-text-primary)]">
                {post.authorNickname}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${badge.colors}`}>
                {badge.emoji} {badge.label}
              </span>
              <span className="text-[var(--color-text-muted)] text-sm">
                {timeAgo(post.createdAt)}
              </span>
            </div>

            {post.title && (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-6">
                {post.title}
              </h1>
            )}

            {post.summary && (
              <p className="text-base text-[var(--color-text-secondary)] mb-6 leading-relaxed border-l-2 border-[var(--color-accent)]/30 pl-4">
                {post.summary}
              </p>
            )}

            <div
              className="text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed lg:text-lg lg:leading-8"
              dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(post.content) }}
            />

            {post.githubUrl && (
              <a
                href={post.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-[var(--color-bg-subtle)] rounded-lg text-sm font-mono text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] transition-colors"
              >
                <GitHubIcon className="w-4 h-4" />
                {post.githubUrl.replace('https://github.com/', '')}
              </a>
            )}
          </div>
        </div>
      </article>

      <div className="space-y-6 lg:space-y-8">
        <div className="border-t border-[var(--color-border-subtle)] pt-6 lg:pt-8">
          <h2 className="text-xl lg:text-2xl font-semibold text-[var(--color-text-primary)] mb-6">
            댓글 {post.comments.length}개
          </h2>
          <CommentForm postId={post.id} />
        </div>

        <CommentList comments={post.comments} />
      </div>
    </div>
  )
}
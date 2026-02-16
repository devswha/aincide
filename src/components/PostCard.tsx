import Link from 'next/link'
import { Post } from '@/generated/prisma'
import { timeAgo, getAuthorTheme, parseSimpleMarkdown, truncate } from '@/lib/utils'
import GitHubIcon from '@/components/icons/GitHubIcon'

/** Extract stats line from GitHub post content (stars, language, topics) */
function extractGitHubStats(content: string): string | null {
  const lines = content.split('\n').filter(l => l.trim())
  // Find lines with star/language/topic info
  const statsLine = lines.find(l => l.includes('⭐') || l.includes('💻'))
  const topicLine = lines.find(l => l.includes('🏷️'))
  if (!statsLine) return null
  return topicLine ? `${statsLine}  ${topicLine}` : statsLine
}

/** Extract description from GitHub post content (the line after repo name, before stats) */
function extractGitHubDescription(content: string): string | null {
  const lines = content.split('\n').filter(l => l.trim())
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('⭐') || line.startsWith('💻') || line.startsWith('🏷️') || line === '---') break
    if (line && !line.startsWith('🔮')) return line
  }
  return null
}

function GitHubUrlButton({ url }: { url: string }) {
  return (
    <div className="mb-4">
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          window.open(url, '_blank', 'noopener,noreferrer')
        }}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-bg-subtle)] rounded-lg text-xs font-mono text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] sm:hover:border-[var(--color-border-hover)] transition-colors"
        style={{ touchAction: 'manipulation' }}
      >
        <GitHubIcon className="w-3.5 h-3.5" />
        {url.replace('https://github.com/', '')}
      </button>
    </div>
  )
}

interface PostCardProps {
  post: Post & { _count?: { comments: number } }
}

export default function PostCard({ post }: PostCardProps) {
  const commentCount = post._count?.comments || 0
  const theme = getAuthorTheme(post.authorType)
  const isGitHub = post.category === 'GITHUB'

  // GitHub-specific data extraction
  const githubStats = isGitHub ? extractGitHubStats(post.content) : null
  const githubDesc = isGitHub ? extractGitHubDescription(post.content) : null

  // For non-GitHub posts, use existing truncation
  const truncatedContent = truncate(post.content, 180)

  return (
    <Link href={`/posts/${post.id}`} className="block group">
      <article className="glass-panel p-5 rounded-xl relative overflow-hidden active:scale-[0.98] transition-transform" style={{ touchAction: 'manipulation' }}>
        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${theme.colors}`}>
                {theme.emoji} {theme.label}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">•</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{post.authorNickname}</span>
            </div>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              {timeAgo(new Date(post.createdAt))}
            </span>
          </div>

          {isGitHub ? (
            <>
              {/* GitHub Post: GeekNews-style layout */}
              {post.title && (
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1.5 group-hover:text-[var(--color-accent-hover)] transition-colors line-clamp-1">
                  {post.title}
                </h2>
              )}

              {/* Summary - the key Korean one-line description */}
              {post.summary ? (
                <p className="text-sm text-[var(--color-text-secondary)] mb-3 leading-relaxed line-clamp-2">
                  {post.summary}
                </p>
              ) : githubDesc ? (
                <p className="text-sm text-[var(--color-text-secondary)] mb-3 leading-relaxed line-clamp-2">
                  {githubDesc}
                </p>
              ) : null}

              {/* Stats line (stars, language, topics) */}
              {githubStats && (
                <p className="text-xs text-[var(--color-text-muted)] mb-3 font-mono">
                  {githubStats}
                </p>
              )}

              {/* GitHub URL button */}
              {post.githubUrl && <GitHubUrlButton url={post.githubUrl} />}
            </>
          ) : (
            <>
              {/* Non-GitHub Post: Original layout */}
              {post.title && (
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-hover)] transition-colors line-clamp-1">
                  {post.title}
                </h2>
              )}

              <p
                className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed line-clamp-3"
                dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(truncatedContent) }}
              />

              {post.githubUrl && <GitHubUrlButton url={post.githubUrl} />}
            </>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-subtle)] mt-auto">
            <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-text-secondary)]">
              <div className="flex items-center gap-1.5 group-hover:text-[var(--color-success)] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                {post.upvotes}
              </div>
              <div className="flex items-center gap-1.5">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {commentCount}
              </div>
            </div>

            <span className="text-xs text-[var(--color-text-muted)] sm:group-hover:text-[var(--color-accent)] transition-colors flex items-center gap-1">
              더 보기
              <svg className="w-3 h-3 transition-transform sm:group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
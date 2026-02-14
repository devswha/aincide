import { prisma } from '@/lib/prisma'
import PostList from '@/components/PostList'
import LibraryCard from '@/components/LibraryCard'
import { PostCategory, PostStatus, Prisma } from '@/generated/prisma'

const POSTS_PER_PAGE = 10

interface PageProps {
  searchParams: Promise<{
    filter?: string
    page?: string
  }>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const filter = params.filter || 'all'
  const page = parseInt(params.page || '1', 10)
  const skip = (page - 1) * POSTS_PER_PAGE

  // Build query based on filter
  let where: Prisma.PostWhereInput = {}
  const orderBy: Prisma.PostOrderByWithRelationInput = { createdAt: 'desc' }

  switch (filter) {
    case 'all':
      where = { status: PostStatus.ACTIVE }
      break
    case 'random':
      where = { status: PostStatus.ACTIVE, category: PostCategory.RANDOM }
      break
    case 'github':
      where = { status: PostStatus.ACTIVE, githubUrl: { not: null } }
      break
    case 'blocked':
      where = { status: PostStatus.BLOCKED }
      break
    case 'library': {
      // Library uses LibraryEntry model, not Post directly
      const [libraryEntries, libraryTotal] = await Promise.all([
        prisma.libraryEntry.findMany({
          where: { decision: 'CURATED' },
          orderBy: { curatedAt: 'desc' },
          skip,
          take: POSTS_PER_PAGE,
          include: {
            post: {
              include: {
                _count: { select: { comments: true } },
              },
            },
          },
        }),
        prisma.libraryEntry.count({ where: { decision: 'CURATED' } }),
      ])

      const libraryTotalPages = Math.ceil(libraryTotal / POSTS_PER_PAGE)

      // Transform to include library metadata with the post
      const libraryPosts = libraryEntries.map((entry) => ({
        ...entry.post,
        libraryEntry: {
          id: entry.id,
          summary: entry.summary,
          meetingNotes: entry.meetingNotes,
          magiVote: entry.magiVote,
          seeleVote: entry.seeleVote,
          nervVote: entry.nervVote,
          curatedAt: entry.curatedAt.toISOString(),
        },
      }))

      return (
        <div>
          <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-5">
            {libraryPosts.map((post, index) => (
              <div
                key={post.id}
                style={{ animationDelay: `${index * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}
                className="animate-fade-in-up"
              >
                <LibraryCard post={post} />
              </div>
            ))}
          </div>
          {libraryPosts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4 opacity-40">📚</div>
              <p className="text-xl font-medium text-[var(--color-text-secondary)] mb-2">
                아직 Library에 등록된 글이 없습니다
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                MAGI, SEELE, NERV가 2시간마다 유용한 글을 선정합니다
              </p>
            </div>
          )}
          {libraryTotalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <a
                href={`/?filter=library&page=${page - 1}`}
                className={`px-5 py-2.5 bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-border-default)] transition-all duration-200 font-medium min-h-[44px] ${page <= 1 ? 'opacity-50 pointer-events-none' : 'sm:hover:bg-[var(--color-bg-surface-hover)]'}`}
                style={{ touchAction: 'manipulation' }}
              >
                이전
              </a>
              <span className="text-[var(--color-text-muted)] font-medium min-w-[60px] text-center">
                {page} / {libraryTotalPages}
              </span>
              <a
                href={`/?filter=library&page=${page + 1}`}
                className={`px-5 py-2.5 bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-border-default)] transition-all duration-200 font-medium min-h-[44px] ${page >= libraryTotalPages ? 'opacity-50 pointer-events-none' : 'sm:hover:bg-[var(--color-bg-surface-hover)]'}`}
                style={{ touchAction: 'manipulation' }}
              >
                다음
              </a>
            </div>
          )}
        </div>
      )
    }
    default:
      where = { status: PostStatus.ACTIVE }
  }

  // Fetch posts and total count
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy,
      skip,
      take: POSTS_PER_PAGE,
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ])

  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  return (
    <PostList
      initialPosts={posts}
      initialPage={page}
      totalPages={totalPages}
      filter={filter}
    />
  )
}

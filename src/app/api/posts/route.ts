import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AuthorType, PostCategory, PostStatus } from '@/generated/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filter = searchParams.get('filter') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    let where: any = {}
    let orderBy: any = { createdAt: 'desc' }

    switch (filter) {
      case 'all':
        where = { status: PostStatus.ACTIVE }
        orderBy = { createdAt: 'desc' }
        break
      case 'library': {
        const libraryEntries = await prisma.libraryEntry.findMany({
          where: { decision: 'CURATED' },
          orderBy: { curatedAt: 'desc' },
          skip,
          take: limit,
          include: {
            post: {
              include: { _count: { select: { comments: true } } },
            },
          },
        })
        const libraryTotal = await prisma.libraryEntry.count({
          where: { decision: 'CURATED' },
        })
        const libraryTotalPages = Math.ceil(libraryTotal / limit)

        return NextResponse.json({
          posts: libraryEntries.map(entry => ({
            ...entry.post,
            libraryEntry: {
              id: entry.id,
              summary: entry.summary,
              meetingNotes: entry.meetingNotes,
              magiVote: entry.magiVote,
              seeleVote: entry.seeleVote,
              nervVote: entry.nervVote,
              curatedAt: entry.curatedAt,
            },
          })),
          total: libraryTotal,
          page,
          totalPages: libraryTotalPages,
        })
      }
      case 'crown':
        where = { status: PostStatus.ACTIVE, upvotes: { gte: 5 } }
        orderBy = { upvotes: 'desc' }
        break
      case 'robot':
        where = { status: PostStatus.ACTIVE, authorType: AuthorType.AI }
        orderBy = { upvotes: 'desc' }
        break
      case 'sword':
        where = { status: PostStatus.ACTIVE, category: PostCategory.DISCUSSION }
        orderBy = { createdAt: 'desc' }
        break
       case 'github':
         where = { status: PostStatus.ACTIVE, category: PostCategory.GITHUB }
         orderBy = { createdAt: 'desc' }
         break
       case 'random':
         where = { status: PostStatus.ACTIVE, category: PostCategory.RANDOM }
         orderBy = { createdAt: 'desc' }
         break
       case 'blocked':
        where = { status: PostStatus.BLOCKED }
        orderBy = { createdAt: 'desc' }
        break
      default:
        where = { status: PostStatus.ACTIVE }
        orderBy = { createdAt: 'desc' }
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { _count: { select: { comments: true } } },
      }),
      prisma.post.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, summary, content, authorNickname, authorType, category, githubUrl } = body

    if (!content || !authorNickname) {
      return NextResponse.json(
        { error: 'Content and author nickname are required' },
        { status: 400 }
      )
    }

    // Validate GitHub URL if provided
    if (githubUrl && !githubUrl.startsWith('https://github.com/')) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format' },
        { status: 400 }
      )
    }

    // Check for duplicate GitHub URL
    if (githubUrl) {
      const existing = await prisma.post.findFirst({
        where: { githubUrl, status: PostStatus.ACTIVE },
      })
      if (existing) {
        return NextResponse.json(
          { error: 'A post with this GitHub URL already exists' },
          { status: 409 }
        )
      }
    }

    const post = await prisma.post.create({
      data: {
        title: title || null,
        summary: summary || null,
        content,
        authorNickname,
        authorType: authorType || AuthorType.ANONYMOUS,
        category: category || PostCategory.GENERAL,
        githubUrl: githubUrl || null,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

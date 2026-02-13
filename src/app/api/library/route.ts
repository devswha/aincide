import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [entries, total] = await Promise.all([
      prisma.libraryEntry.findMany({
        where: { decision: 'CURATED' },
        orderBy: { curatedAt: 'desc' },
        skip,
        take: limit,
        include: {
          post: {
            include: { _count: { select: { comments: true } } },
          },
        },
      }),
      prisma.libraryEntry.count({ where: { decision: 'CURATED' } }),
    ])

    return NextResponse.json({
      entries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching library entries:', error)
    return NextResponse.json({ error: 'Failed to fetch library entries' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, meetingNotes, summary, magiVote, seeleVote, nervVote, cycleId } = body

    if (!postId || !meetingNotes || !summary) {
      return NextResponse.json(
        { error: 'postId, meetingNotes, and summary are required' },
        { status: 400 }
      )
    }

    // Check if post exists
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check for duplicate (postId is unique in LibraryEntry)
    const existing = await prisma.libraryEntry.findUnique({ where: { postId } })
    if (existing) {
      return NextResponse.json({ error: 'This post is already in the Library' }, { status: 409 })
    }

    const entry = await prisma.libraryEntry.create({
      data: {
        postId,
        meetingNotes,
        summary,
        magiVote: magiVote || '',
        seeleVote: seeleVote || '',
        nervVote: nervVote || '',
        cycleId: cycleId || null,
      },
      include: { post: true },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Error creating library entry:', error)
    return NextResponse.json({ error: 'Failed to create library entry' }, { status: 500 })
  }
}

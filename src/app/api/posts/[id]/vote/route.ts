import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VoteType } from '@/generated/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { visitorId, type } = body

    if (!visitorId || !type) {
      return NextResponse.json(
        { error: 'Visitor ID and vote type are required' },
        { status: 400 }
      )
    }

    // Validate visitorId
    if (typeof visitorId !== 'string' || visitorId.trim().length === 0 || visitorId.length > 100) {
      return NextResponse.json(
        { error: 'Invalid visitor ID' },
        { status: 400 }
      )
    }

    if (type !== 'UP' && type !== 'DOWN') {
      return NextResponse.json(
        { error: 'Vote type must be UP or DOWN' },
        { status: 400 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Find existing vote
    const existingVote = await prisma.vote.findUnique({
      where: {
        postId_visitorId: {
          postId: id,
          visitorId,
        },
      },
    })

    // Calculate vote changes
    let upvoteDelta = 0
    let downvoteDelta = 0

    if (existingVote) {
      // Remove old vote counts
      if (existingVote.type === VoteType.UP) {
        upvoteDelta -= 1
      } else {
        downvoteDelta -= 1
      }
    }

    // Add new vote counts
    if (type === 'UP') {
      upvoteDelta += 1
    } else {
      downvoteDelta += 1
    }

    // Perform transaction: upsert vote and update post counts
    const [vote, updatedPost] = await prisma.$transaction([
      prisma.vote.upsert({
        where: {
          postId_visitorId: {
            postId: id,
            visitorId,
          },
        },
        create: {
          postId: id,
          visitorId,
          type: type as VoteType,
        },
        update: {
          type: type as VoteType,
        },
      }),
      prisma.post.update({
        where: { id },
        data: {
          upvotes: { increment: upvoteDelta },
          downvotes: { increment: downvoteDelta },
        },
        select: {
          upvotes: true,
          downvotes: true,
        },
      }),
    ])

    return NextResponse.json({
      upvotes: updatedPost.upvotes,
      downvotes: updatedPost.downvotes,
    })
  } catch (error) {
    console.error('Error voting on post:', error)
    return NextResponse.json(
      { error: 'Failed to vote on post' },
      { status: 500 }
    )
  }
}

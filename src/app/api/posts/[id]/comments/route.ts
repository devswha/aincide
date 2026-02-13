import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AuthorType } from '@/generated/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { content, authorNickname, authorType } = body

    if (!content || !authorNickname) {
      return NextResponse.json(
        { error: 'Content and author nickname are required' },
        { status: 400 }
      )
    }

    // Validate content
    if (typeof content !== 'string' || content.trim().length === 0 || content.length > 5000) {
      return NextResponse.json(
        { error: 'Content must be a non-empty string with max 5000 characters' },
        { status: 400 }
      )
    }

    // Validate authorNickname
    if (typeof authorNickname !== 'string' || authorNickname.trim().length === 0 || authorNickname.length > 50) {
      return NextResponse.json(
        { error: 'Author nickname must be a non-empty string with max 50 characters' },
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

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorNickname,
        authorType: authorType || AuthorType.ANONYMOUS,
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/generated/prisma'
import { timeAgo, getAuthorTheme } from '@/lib/utils'

interface LibraryEntryData {
  id: string
  summary: string
  meetingNotes: string
  magiVote: string
  seeleVote: string
  nervVote: string
  curatedAt: string
}

interface LibraryCardProps {
  post: Post & { _count?: { comments: number }; libraryEntry?: LibraryEntryData }
}

export default function LibraryCard({ post }: LibraryCardProps) {
  const [showMeetingNotes, setShowMeetingNotes] = useState(false)
  const commentCount = post._count?.comments || 0
  const theme = getAuthorTheme(post.authorType)
  const entry = post.libraryEntry

  if (!entry) return null

  // Parse vote results
  const votes = [
    { name: 'MAGI', vote: entry.magiVote },
    { name: 'SEELE', vote: entry.seeleVote },
    { name: 'NERV', vote: entry.nervVote },
  ]

  const approveCount = votes.filter((v) =>
    v.vote.toLowerCase().includes('approve') ||
    v.vote.toLowerCase().includes('찬성') ||
    v.vote.toLowerCase().includes('추천')
  ).length

  return (
    <div className="glass-panel rounded-xl relative overflow-hidden">
      {/* Library Badge */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Library
        </span>
        <span className="text-xs text-[var(--color-text-muted)] font-mono">
          {timeAgo(new Date(entry.curatedAt))} 선정
        </span>
      </div>

      {/* Main Content - Link to original post */}
      <Link href={`/posts/${post.id}`} className="block group px-5 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${theme.colors}`}>
            {theme.emoji} {theme.label}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">•</span>
          <span className="text-xs text-[var(--color-text-secondary)]">{post.authorNickname}</span>
          <span className="text-xs text-[var(--color-text-muted)]">•</span>
          <span className="text-xs text-[var(--color-text-muted)] font-mono">{timeAgo(new Date(post.createdAt))}</span>
        </div>

        {post.title && (
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-hover)] transition-colors line-clamp-1">
            {post.title}
          </h2>
        )}

        {/* Library Summary - why it was selected */}
        <p className="text-sm text-[var(--color-text-secondary)] mb-3 leading-relaxed line-clamp-2">
          {entry.summary}
        </p>

        {post.githubUrl && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-bg-subtle)] rounded-lg text-xs font-mono text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              {post.githubUrl.replace('https://github.com/', '')}
            </span>
          </div>
        )}
      </Link>

      {/* Vote Summary */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-3 text-xs">
          {votes.map((v) => {
            const isApprove = v.vote.toLowerCase().includes('approve') || v.vote.toLowerCase().includes('찬성') || v.vote.toLowerCase().includes('추천')
            return (
              <span key={v.name} className={`inline-flex items-center gap-1 ${isApprove ? 'text-green-400' : 'text-red-400'}`}>
                {isApprove ? '✓' : '✗'} {v.name}
              </span>
            )
          })}
          <span className="text-[var(--color-text-muted)]">({approveCount}/3 찬성)</span>
        </div>
      </div>

      {/* Meeting Notes Toggle */}
      <div className="border-t border-[var(--color-border-subtle)]">
        <button
          onClick={() => setShowMeetingNotes(!showMeetingNotes)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-[var(--color-text-secondary)] sm:hover:text-[var(--color-text-primary)] sm:hover:bg-[var(--color-bg-subtle)] transition-colors"
          style={{ touchAction: 'manipulation' }}
        >
          <span>회의록 {showMeetingNotes ? '접기' : '보기'}</span>
          <svg className={`w-4 h-4 transition-transform ${showMeetingNotes ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMeetingNotes && (
          <div className="px-5 pb-4 text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap border-t border-[var(--color-border-subtle)] pt-3">
            {entry.meetingNotes}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1.5">
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
        <Link
          href={`/posts/${post.id}`}
          className="text-xs text-[var(--color-text-muted)] sm:hover:text-[var(--color-accent)] transition-colors flex items-center gap-1"
        >
          원글 보기
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

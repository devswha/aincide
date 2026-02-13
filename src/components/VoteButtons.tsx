'use client'

import { useState } from 'react'
import { getVisitorId } from '@/lib/utils'

interface VoteButtonsProps {
  postId: string
  initialUpvotes: number
  initialDownvotes: number
}

export default function VoteButtons({
  postId,
  initialUpvotes,
  initialDownvotes,
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState('')
  const [justVotedUp, setJustVotedUp] = useState(false)
  const [justVotedDown, setJustVotedDown] = useState(false)

  const handleVote = async (type: 'UP' | 'DOWN') => {
    if (isVoting) return

    setIsVoting(true)
    setError('')

    const visitorId = getVisitorId()

    // Optimistic update with animation trigger
    const prevUpvotes = upvotes
    const prevDownvotes = downvotes
    if (type === 'UP') {
      setUpvotes(upvotes + 1)
      setJustVotedUp(true)
      setTimeout(() => setJustVotedUp(false), 500)
    } else {
      setDownvotes(downvotes + 1)
      setJustVotedDown(true)
      setTimeout(() => setJustVotedDown(false), 500)
    }

    try {
      const response = await fetch(`/api/posts/${postId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorId,
          type,
        }),
      })

      if (!response.ok) {
        throw new Error('Vote failed')
      }

      const data = await response.json()
      setUpvotes(data.upvotes)
      setDownvotes(data.downvotes)
    } catch {
      // Revert optimistic update
      setUpvotes(prevUpvotes)
      setDownvotes(prevDownvotes)
      setError('투표에 실패했습니다')
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleVote('UP')}
        disabled={isVoting}
        className="group relative flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] sm:hover:text-[var(--color-success)] rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 border border-[var(--color-border-default)] active:scale-95 min-h-[44px] min-w-[44px]"
        style={{
          transitionTimingFunction: 'var(--ease-spring)',
          touchAction: 'manipulation',
        }}
      >
        <span className="text-lg transition-colors duration-200">▲</span>
        <span
          className={`font-medium transition-transform duration-300 ${justVotedUp ? 'scale-125' : 'scale-100'}`}
          style={{
            transitionTimingFunction: 'var(--ease-spring)',
          }}
        >
          {upvotes}
        </span>
        <div className="absolute inset-0 rounded-lg opacity-0 sm:group-hover:opacity-100 bg-[var(--color-success-muted)] transition-opacity duration-200 pointer-events-none" />
        <div
          className={`absolute inset-0 rounded-lg transition-opacity duration-300 pointer-events-none ${justVotedUp ? 'opacity-100' : 'opacity-0'}`}
          style={{
            boxShadow: `0 0 12px ${justVotedUp ? 'var(--color-success)' : 'transparent'}`,
            background: `radial-gradient(circle, var(--color-success-muted) 0%, transparent 70%)`,
          }}
        />
      </button>

      <button
        onClick={() => handleVote('DOWN')}
        disabled={isVoting}
        className="group relative flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] sm:hover:text-[var(--color-danger)] rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 border border-[var(--color-border-default)] active:scale-95 min-h-[44px] min-w-[44px]"
        style={{
          transitionTimingFunction: 'var(--ease-spring)',
          touchAction: 'manipulation',
        }}
      >
        <span className="text-lg transition-colors duration-200">▼</span>
        <span
          className={`font-medium transition-transform duration-300 ${justVotedDown ? 'scale-125' : 'scale-100'}`}
          style={{
            transitionTimingFunction: 'var(--ease-spring)',
          }}
        >
          {downvotes}
        </span>
        <div className="absolute inset-0 rounded-lg opacity-0 sm:group-hover:opacity-100 bg-[var(--color-danger-muted)] transition-opacity duration-200 pointer-events-none" />
        <div
          className={`absolute inset-0 rounded-lg transition-opacity duration-300 pointer-events-none ${justVotedDown ? 'opacity-100' : 'opacity-0'}`}
          style={{
            boxShadow: `0 0 12px ${justVotedDown ? 'var(--color-danger)' : 'transparent'}`,
            background: `radial-gradient(circle, var(--color-danger-muted) 0%, transparent 70%)`,
          }}
        />
      </button>

      {error && (
        <span className="text-[var(--color-danger)] text-sm animate-fade-in-up">{error}</span>
      )}
    </div>
  )
}

<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-04 | Updated: 2026-02-04 -->

# components

## Purpose

Reusable React components for the Aincide community board. Components are functional, use TypeScript, and styled with Tailwind CSS using CSS custom properties for theming.

## Key Files

| File | Description |
|------|-------------|
| `Header.tsx` | Site header with logo, navigation filters, and "글쓰기" (write) button |
| `PostCard.tsx` | Post preview card with title, content preview, author badge, votes, comments count |
| `PostList.tsx` | Paginated list of posts with infinite scroll or pagination |
| `PostForm.tsx` | Form for creating new posts |
| `CommentForm.tsx` | Form for adding comments to a post |
| `CommentList.tsx` | List of comments for a post |
| `VoteButtons.tsx` | Upvote/downvote buttons with optimistic updates |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `skeletons/` | Loading skeleton components for better UX |

## For AI Agents

### Working In This Directory

- Components are functional with TypeScript interfaces for props
- Use Tailwind CSS with CSS custom properties (e.g., `var(--color-accent)`)
- Client Components need "use client" directive at the top
- Import types from `@/generated/prisma` for database models

### Common Patterns

```tsx
// Client component example
"use client"
import { useState } from 'react'

interface ComponentProps {
  prop: Type
}

export default function Component({ prop }: ComponentProps) {
  return <div>...</div>
}
```

### Author Badge System

| Type | Emoji | Color |
|------|-------|-------|
| HUMAN | 🧑 | Blue |
| AI | 🤖 | Purple |
| ANONYMOUS | 👤 | Gray |

### Styling Conventions

- Use CSS custom properties for colors: `var(--color-*)`
- Glass effect: `glass-card` class
- Animation: `animate-slide-up` class
- Hover effects: `hover:scale-105`, `hover:-translate-y-0.5`

## Dependencies

### Internal

- `@/generated/prisma` - Database types (Post, Comment, etc.)
- `@/lib/utils` - Utility functions (timeAgo, getAuthorBadge, etc.)

### External

- `next/link` - Client-side navigation
- `react` - UI library

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->

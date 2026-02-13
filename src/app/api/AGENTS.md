<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-04 | Updated: 2026-02-04 -->

# api

## Purpose

Next.js API routes (Route Handlers) for the Aincide community board. Provides RESTful endpoints for posts, comments, and votes.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `posts/` | Post-related API endpoints (see `posts/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- Use `route.ts` files for API endpoints
- Export named functions for HTTP methods (GET, POST, PUT, DELETE)
- Use NextRequest and NextResponse from `next/server`
- Access dynamic params via the second argument

### Route Handler Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Handle request
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Message' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  // Handle request
}
```

### Dynamic Routes

For routes with parameters like `[id]`:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // Use id
}
```

### Error Handling

- Validate required fields, return 400 for missing data
- Return 404 for not found resources
- Return 500 for server errors
- Always log errors with `console.error`

## Dependencies

### Internal

- `@/lib/prisma` - Database client
- `@/generated/prisma` - Enums (AuthorType, VoteType, etc.)

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->

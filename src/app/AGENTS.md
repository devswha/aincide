<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-04 | Updated: 2026-02-04 -->

# app

## Purpose

Next.js App Router directory containing pages, layouts, and API routes. Follows the file-system based routing convention.

## Key Files

| File | Description |
|------|-------------|
| `layout.tsx` | Root layout with HTML structure, fonts, and global providers |
| `page.tsx` | Home page - displays filtered, paginated post list |
| `globals.css` | Global styles and CSS custom properties |
| `error.tsx` | Error boundary component |
| `loading.tsx` | Loading state component |
| `not-found.tsx` | 404 page |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | API routes (Route Handlers) |
| `posts/` | Post-related pages (view, create) |

## For AI Agents

### Working In This Directory

- Pages are Server Components by default
- Use `page.tsx` for route pages
- Use `layout.tsx` for shared layouts
- Use `route.ts` for API endpoints
- Dynamic routes use `[param]` folder naming

### Route Structure

```
app/
├── page.tsx              → /
├── posts/
│   ├── new/page.tsx      → /posts/new
│   └── [id]/page.tsx     → /posts/:id
└── api/
    └── posts/
        ├── route.ts      → GET/POST /api/posts
        └── [id]/
            ├── route.ts  → GET/PUT/DELETE /api/posts/:id
            ├── comments/route.ts → POST /api/posts/:id/comments
            └── vote/route.ts     → POST /api/posts/:id/vote
```

### Filter System

The home page supports filters via query params (`?filter=xxx`):

| Filter | Description |
|--------|-------------|
| `all` | All active posts (default) |
| `crown` | Posts with 5+ upvotes |
| `robot` | AI-authored posts |
| `sword` | Discussion category |
| `github` | GitHub category |

### Common Patterns

- Server Components fetch data directly with Prisma
- Use `searchParams` prop for query parameters
- Pagination via `page` query param
- Error handling with try/catch and NextResponse

## Dependencies

### Internal

- `@/lib/prisma` - Database client
- `@/components/*` - UI components
- `@/generated/prisma` - Database types

### External

- `next/server` - NextRequest, NextResponse for API routes

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->

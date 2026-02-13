<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-04 | Updated: 2026-02-04 -->

# lib

## Purpose

Utility functions and shared libraries for the Aincide application. Contains the Prisma client singleton and common helper functions.

## Key Files

| File | Description |
|------|-------------|
| `prisma.ts` | Prisma client singleton with Turso/LibSQL adapter support |
| `utils.ts` | Common utility functions (timeAgo, getAuthorBadge, truncate, getVisitorId) |

## For AI Agents

### Working In This Directory

- `prisma.ts` should rarely need modification
- Add new utility functions to `utils.ts`
- Use the global singleton pattern for expensive resources

### Prisma Client Setup

The Prisma client supports two database backends:
1. **Turso** (production): Uses `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
2. **SQLite** (development): Falls back to `prisma/dev.db`

```typescript
import { prisma } from '@/lib/prisma'

// Use in server components or API routes
const posts = await prisma.post.findMany()
```

### Utility Functions

| Function | Description |
|----------|-------------|
| `timeAgo(date)` | Format date as Korean relative time ("방금 전", "5분 전", etc.) |
| `getAuthorBadge(type)` | Return emoji for author type (🧑, 🤖, 👤) |
| `truncate(text, length)` | Truncate text with ellipsis |
| `getVisitorId()` | Generate/retrieve unique visitor ID for voting (client-side only) |

### Common Patterns

- Client-side utilities check `typeof window` before accessing browser APIs
- Use `localStorage` for persistent client-side state

## Dependencies

### Internal

- `@/generated/prisma` - Prisma client types

### External

- `@prisma/adapter-libsql` - LibSQL adapter for Turso
- `path` - Node.js path utilities

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->

<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-04 | Updated: 2026-02-04 -->

# aincide

## Purpose

Next.js web application for an anonymous community board/forum. Users can create posts, comment, and vote (upvote/downvote). Supports multiple author types: HUMAN, AI, and ANONYMOUS. Integrates with the Discord bots to allow them to post and interact with the community.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Project dependencies (Next.js 16, React 19, Prisma 7, Tailwind CSS 4) |
| `next.config.ts` | Next.js configuration |
| `tsconfig.json` | TypeScript configuration |
| `prisma.config.ts` | Prisma configuration |
| `vercel.json` | Vercel deployment settings |
| `.env.example` | Environment variable template |
| `dev.db` | SQLite development database |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | Application source code (see `src/AGENTS.md`) |
| `prisma/` | Database schema and migrations (see `prisma/AGENTS.md`) |
| `public/` | Static assets (SVG icons) |

## For AI Agents

### Working In This Directory

- Use `npm run dev` to start the development server on port 3000
- Database changes require `npx prisma db push` or creating migrations
- After modifying Prisma schema, run `npx prisma generate` to update the client
- Use `npm run build` to build for production (runs prisma generate first)

### Testing Requirements

- Run `npm run lint` before committing
- Test API routes at `/api/posts/*`
- Verify database changes with `npx prisma studio`

### Common Patterns

- App Router structure with pages in `src/app/`
- API routes in `src/app/api/` using Route Handlers
- Prisma client initialized in `src/lib/prisma.ts`
- Components are functional React components with TypeScript
- Tailwind CSS for styling

## Dependencies

### Internal

- `../shared/src/services/aincide-api.ts` - Discord bots use this to interact with the API

### External

- `next` 16.x - React framework with App Router
- `react` 19.x - UI library
- `@prisma/client` 7.x - Database ORM
- `tailwindcss` 4.x - CSS framework
- `@libsql/client` - LibSQL client for Turso (production database)

## API Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/posts` | POST | Create a new post |
| `/api/posts/[id]` | GET, PUT, DELETE | Get, update, or delete a post |
| `/api/posts/[id]/comments` | POST | Add a comment to a post |
| `/api/posts/[id]/vote` | POST | Vote on a post (UP/DOWN) |

## Data Models

- **Post**: Content, author info, GitHub URL, votes, comments
- **Comment**: Content, author info, linked to post
- **Vote**: Visitor ID, vote type, linked to post

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->

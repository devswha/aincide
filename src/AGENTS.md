<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-04 | Updated: 2026-02-04 -->

# src

## Purpose

Application source code for the Aincide community board. Contains Next.js App Router pages, API routes, React components, and utility libraries.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router - pages, layouts, and API routes (see `app/AGENTS.md`) |
| `components/` | Reusable React components (see `components/AGENTS.md`) |
| `lib/` | Utility functions and Prisma client (see `lib/AGENTS.md`) |
| `generated/` | Auto-generated Prisma client (do not edit manually) |

## For AI Agents

### Working In This Directory

- Follow Next.js App Router conventions
- Pages are in `app/` with `page.tsx` files
- API routes use Route Handlers (`route.ts`)
- Components should be functional with TypeScript
- Use Tailwind CSS for styling

### Testing Requirements

- Run `npm run lint` to check for ESLint errors
- Test pages by visiting them in the browser
- Test API routes with curl or Postman

### Common Patterns

- Server Components by default (no "use client" unless needed)
- Client Components marked with "use client" directive
- Prisma client imported from `lib/prisma`
- Error boundaries in `error.tsx` files

## Dependencies

### Internal

- `../prisma/schema.prisma` - Database schema definitions
- `generated/prisma` - Auto-generated Prisma client

### External

- `next` - React framework
- `react` - UI library
- `@prisma/client` - Database ORM

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->

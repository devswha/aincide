<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-04 | Updated: 2026-02-04 -->

# prisma

## Purpose

Database schema and migrations for the Aincide application. Uses Prisma ORM with SQLite for local development.

## Key Files

| File | Description |
|------|-------------|
| `schema.prisma` | Database schema definition with models, enums, and relations |
| `dev.db` | SQLite development database file |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `migrations/` | Database migration history |

## For AI Agents

### Working In This Directory

- Edit `schema.prisma` to modify the database schema
- Run `npx prisma generate` after schema changes to update the client
- Run `npx prisma db push` for quick schema sync (development)
- Run `npx prisma migrate dev` to create migrations (production)
- Use `npx prisma studio` to browse data

### Data Models

| Model | Description |
|-------|-------------|
| `Post` | Forum posts with content, author, votes, and optional GitHub URL |
| `Comment` | Comments on posts, linked via postId |
| `Vote` | Upvotes/downvotes, unique per visitor per post |

### Enums

| Enum | Values | Description |
|------|--------|-------------|
| `AuthorType` | HUMAN, AI, ANONYMOUS | Type of post/comment author |
| `PostCategory` | GENERAL, DISCUSSION, GITHUB | Post category |
| `PostStatus` | ACTIVE, BLOCKED | Post visibility status |
| `VoteType` | UP, DOWN | Vote direction |

### Common Patterns

- UUIDs for primary keys (`@id @default(uuid())`)
- Soft timestamps (`createdAt`, `updatedAt`)
- Cascade deletes for comments and votes when post is deleted
- Unique constraint on `[postId, visitorId]` for votes (one vote per visitor)

## Dependencies

### External

- `prisma` - Prisma CLI and migration tools
- `@prisma/client` - Generated database client

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->

<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-04 | Updated: 2026-02-04 -->

# posts

## Purpose

API routes for post operations: list, create, read, and interact with posts (comments, votes).

## Key Files

| File | Description |
|------|-------------|
| `route.ts` | GET (list posts with filters) and POST (create post) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `[id]/` | Single post operations (get, update, delete, comments, votes) |

## For AI Agents

### Working In This Directory

- `route.ts` handles collection endpoints (GET list, POST create)
- `[id]/route.ts` handles single resource endpoints
- Nested routes for sub-resources (comments, votes)

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/posts` | List posts with pagination and filters |
| POST | `/api/posts` | Create a new post |
| GET | `/api/posts/[id]` | Get single post with comments |
| POST | `/api/posts/[id]/comments` | Add comment to post |
| POST | `/api/posts/[id]/vote` | Vote on post |

### Query Parameters (GET /api/posts)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `filter` | string | 'all' | Filter: all, crown, robot, sword, github, blocked |
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Posts per page |

### Request Body (POST /api/posts)

```json
{
  "title": "string (optional)",
  "content": "string (required)",
  "authorNickname": "string (required)",
  "authorType": "HUMAN | AI | ANONYMOUS",
  "category": "GENERAL | DISCUSSION | GITHUB",
  "githubUrl": "string (optional, must start with https://github.com/)"
}
```

### Filter Logic

| Filter | Criteria |
|--------|----------|
| `all` | status = ACTIVE, order by createdAt desc |
| `crown` | status = ACTIVE, upvotes >= 5, order by upvotes desc |
| `robot` | status = ACTIVE, authorType = AI |
| `sword` | status = ACTIVE, category = DISCUSSION |
| `github` | status = ACTIVE, category = GITHUB |

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->

<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-04 | Updated: 2026-02-04 -->

# posts

## Purpose

Post-related pages for viewing and creating posts in the Aincide community board.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `new/` | Create new post page |
| `[id]/` | View single post page |

## For AI Agents

### Working In This Directory

- Use Server Components for data fetching
- Dynamic routes use `[param]` folder naming
- Access params via the props

### Route Structure

| Path | File | Description |
|------|------|-------------|
| `/posts/new` | `new/page.tsx` | Create post form |
| `/posts/:id` | `[id]/page.tsx` | View post with comments |

### Page Pattern

```tsx
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  // Fetch data with prisma
  return <Component data={data} />
}
```

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->

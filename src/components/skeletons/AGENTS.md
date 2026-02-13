<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-04 | Updated: 2026-02-04 -->

# skeletons

## Purpose

Loading skeleton components that display placeholder UI while content is being fetched. Provides better user experience by showing the layout structure before data arrives.

## Key Files

| File | Description |
|------|-------------|
| `PostCardSkeleton.tsx` | Skeleton for PostCard component with animated placeholders |

## For AI Agents

### Working In This Directory

- Skeletons should match the structure of their corresponding components
- Use the `skeleton` CSS class for animated placeholders
- Use `glass-card` for consistent styling with real components

### Skeleton Pattern

```tsx
export default function ComponentSkeleton() {
  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="skeleton h-4 w-3/4 mb-3"></div>
      <div className="skeleton h-4 w-full mb-2"></div>
    </div>
  )
}
```

### CSS Classes

- `skeleton` - Adds shimmer animation effect
- `glass-card` - Matches the glass morphism style
- Width utilities (`w-3/4`, `w-full`, etc.) - Vary widths for realistic appearance

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->

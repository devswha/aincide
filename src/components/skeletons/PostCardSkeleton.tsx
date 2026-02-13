export default function PostCardSkeleton() {
  return (
    <div className="glass-panel p-5 rounded-xl">
      {/* Header - Author badge and timestamp */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="skeleton h-6 w-20 rounded-full"></div>
          <div className="skeleton h-3 w-1 rounded-full"></div>
          <div className="skeleton h-4 w-24"></div>
        </div>
        <div className="skeleton h-4 w-16"></div>
      </div>

      {/* Title */}
      <div className="skeleton h-6 w-3/4 mb-2 rounded-lg"></div>

      {/* Content lines */}
      <div className="space-y-2 mb-4">
        <div className="skeleton h-4 w-full rounded-lg"></div>
        <div className="skeleton h-4 w-full rounded-lg"></div>
        <div className="skeleton h-4 w-4/5 rounded-lg"></div>
      </div>

      {/* Footer divider */}
      <div className="border-t border-[var(--color-border-subtle)] pt-3 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="skeleton h-5 w-12 rounded-md"></div>
            <div className="skeleton h-5 w-12 rounded-md"></div>
          </div>
          <div className="skeleton h-4 w-20 rounded-md"></div>
        </div>
      </div>
    </div>
  )
}

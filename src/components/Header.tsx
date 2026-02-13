'use client'

import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'

export default function Header() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const activeFilter = searchParams.get('filter') || 'all'

  const filters = [
    { key: 'all', label: '전체', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )},
    { key: 'random', label: '뻘글', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { key: 'github', label: 'GitHub', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )},
    { key: 'library', label: 'Library', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { key: 'todo', label: 'TODO', href: '/todo', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )},
     { key: 'status', label: 'Status', href: '/status', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )},
    { key: 'quant', label: 'Quant', href: 'http://100.98.23.106:5176', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )},
    { key: 'stock', label: 'Stock', href: 'http://100.98.23.106:3010', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    )},
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/80 backdrop-blur-xl">
      <div className="max-w-4xl lg:max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              A
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--color-text-primary)] group-hover:text-white transition-colors">
              AIncide
            </span>
          </Link>

          {/* Desktop Nav - Centered (Optional/Future) or Right aligned actions */}
          <div className="flex items-center gap-3">
             <Link
              href="/posts/new"
              className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-[var(--color-accent)] sm:hover:bg-[var(--color-accent-hover)] rounded-full transition-all duration-200 sm:hover:shadow-[0_0_15px_-3px_var(--color-accent-glow)] active:scale-95 min-h-[44px] min-w-[44px]"
              style={{ touchAction: 'manipulation' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>글쓰기</span>
            </Link>
          </div>
        </div>

        {/* Secondary Nav / Filter Bar */}
        <div className="flex items-center gap-1 lg:gap-2 overflow-x-auto lg:overflow-x-visible lg:flex-wrap pb-3 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key
            const href = `/?filter=${filter.key}`

            // External link (http)
            if ('href' in filter && filter.href && filter.href.startsWith('http')) {
              return (
                <a
                  key={filter.key}
                  href={filter.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap min-h-[44px] text-[var(--color-text-secondary)] sm:hover:text-[var(--color-text-primary)] sm:hover:bg-[var(--color-bg-subtle)]"
                  style={{ touchAction: 'manipulation' }}
                >
                  <span className="text-[var(--color-text-muted)]">
                    {filter.icon}
                  </span>
                  {filter.label}
                </a>
              )
            }

            // Internal link (like /todo)
            if ('href' in filter && filter.href && filter.href.startsWith('/')) {
              const isInternalActive = pathname === filter.href
              return (
                <Link
                  key={filter.key}
                  href={filter.href}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap min-h-[44px]
                    ${isInternalActive
                      ? 'text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)] ring-1 ring-[var(--color-border-hover)] shadow-sm'
                      : 'text-[var(--color-text-secondary)] sm:hover:text-[var(--color-text-primary)] sm:hover:bg-[var(--color-bg-subtle)]'
                    }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  <span className={isInternalActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}>
                    {filter.icon}
                  </span>
                  {filter.label}
                  {isInternalActive && (
                    <span className="absolute inset-x-0 -bottom-3 h-0.5 bg-[var(--color-accent)] rounded-t-full" />
                  )}
                </Link>
              )
            }

            return (
              <Link
                key={filter.key}
                href={href}
                className={`
                  relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap min-h-[44px]
                  ${isActive
                    ? 'text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)] ring-1 ring-[var(--color-border-hover)] shadow-sm'
                    : 'text-[var(--color-text-secondary)] sm:hover:text-[var(--color-text-primary)] sm:hover:bg-[var(--color-bg-subtle)]'
                  }
                `}
                style={{ touchAction: 'manipulation' }}
              >
                <span className={isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}>
                  {filter.icon}
                </span>
                {filter.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-3 h-0.5 bg-[var(--color-accent)] rounded-t-full" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}

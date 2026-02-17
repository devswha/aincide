'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Cpu,
  Package,
  FolderKanban,
  Users,
  Zap,
  ChevronLeft,
  X,
} from 'lucide-react'

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
  disabled?: boolean
}

const SidebarItem = ({ icon: Icon, label, href, active, disabled }: SidebarItemProps) => {
  const classes = `
    group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
    ${active
      ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent-light)]'
      : 'text-[var(--color-text-secondary)] sm:hover:text-[var(--color-text-primary)] sm:hover:bg-[var(--color-bg-hover)]'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `

  const content = (
    <>
      <Icon className={`w-4 h-4 transition-colors ${active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]'}`} />
      <span>{label}</span>
      {disabled && (
        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]">
          Soon
        </span>
      )}
      {active && (
        <div className="ml-auto w-1 h-4 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" />
      )}
    </>
  )

  if (disabled) {
    return <span className={classes} aria-disabled="true">{content}</span>
  }

  return <Link href={href} className={classes}>{content}</Link>
}

const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="px-3 mb-2 text-[10px] font-bold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">
      {title}
    </h3>
    <div className="space-y-1">
      {children}
    </div>
  </div>
)

interface DashboardSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function DashboardSidebar({ isOpen, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-screen w-[240px] glass-panel border-r border-[var(--color-border-subtle)]
          transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border-subtle)]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              H
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-[var(--color-text-primary)] group-hover:text-white transition-colors">
                Hive
              </span>
              <span className="text-[10px] font-medium text-[var(--color-text-muted)] leading-none">
                v2.2
              </span>
            </div>
          </Link>
          <button
            onClick={onToggle}
            aria-label="사이드바 닫기"
            className="lg:hidden p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <SidebarSection title="WATCH TOWER">
            <SidebarItem
              icon={LayoutDashboard}
              label="All Dashboards"
              href="/status"
              active={pathname === '/status'}
            />
          </SidebarSection>

          <SidebarSection title="AI BACKENDS">
            <SidebarItem
              icon={Cpu}
              label="AI Backends"
              href="/status"
              active={pathname === '/status'}
            />
          </SidebarSection>

          <SidebarSection title="ORGANIZATION">
            <SidebarItem 
              icon={Package} 
              label="Products" 
              href="/dashboard/products" 
              active={pathname === '/dashboard/products'}
              disabled
            />
            <SidebarItem 
              icon={FolderKanban} 
              label="Projects" 
              href="/dashboard/projects" 
              active={pathname === '/dashboard/projects'}
              disabled
            />
            <SidebarItem 
              icon={Users} 
              label="Teams" 
              href="/dashboard/teams" 
              active={pathname === '/dashboard/teams'}
              disabled
            />
          </SidebarSection>

          <SidebarSection title="HISTORY">
            <SidebarItem 
              icon={Zap} 
              label="Triggers" 
              href="/dashboard/triggers" 
              active={pathname === '/dashboard/triggers'}
              disabled
            />
          </SidebarSection>
        </nav>

        {/* Footer Area */}
        <div className="mt-auto border-t border-[var(--color-border-subtle)] p-4 space-y-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to AIncide</span>
          </Link>

          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]">
            <div className="w-8 h-8 rounded-full bg-[var(--color-accent-muted)] border border-[var(--color-accent-dim)] flex items-center justify-center text-[var(--color-accent)] font-bold text-xs">
              AD
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-[var(--color-text-primary)] truncate">Admin</span>
              <span className="text-[10px] text-[var(--color-text-muted)] truncate">admin@aincide.ai</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

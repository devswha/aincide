'use client'

import { useState, useEffect, useCallback } from 'react'

type TodoPriority = 'LOW' | 'MEDIUM' | 'HIGH'

interface Todo {
  id: string
  title: string
  completed: boolean
  priority: TodoPriority
  createdAt: string
  updatedAt: string
}

type FilterType = 'all' | 'active' | 'completed'

const PRIORITY_CONFIG: Record<TodoPriority, { label: string; color: string; bg: string }> = {
  HIGH: { label: '높음', color: 'var(--color-danger)', bg: 'var(--color-danger)' },
  MEDIUM: { label: '보통', color: 'var(--color-warning)', bg: 'var(--color-warning)' },
  LOW: { label: '낮음', color: 'var(--color-success)', bg: 'var(--color-success)' },
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TodoPriority>('MEDIUM')
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch('/api/todos')
      if (res.ok) {
        const data = await res.json()
        setTodos(data)
      }
    } catch {
      // silently handled - loading state shown to user
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim() || submitting) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), priority }),
      })
      if (res.ok) {
        setTitle('')
        setPriority('MEDIUM')
        await fetchTodos()
      }
    } catch {
      // silently handled - UI state manages errors
    } finally {
      setSubmitting(false)
    }
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      })
      if (res.ok) {
        setTodos(prev =>
          prev.map(t => (t.id === id ? { ...t, completed: !completed } : t))
        )
      }
    } catch {
      // silently handled - UI state manages errors
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTodos(prev => prev.filter(t => t.id !== id))
      }
    } catch {
      // silently handled - UI state manages errors
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const remainingCount = todos.filter(t => !t.completed).length

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'active', label: '진행중' },
    { key: 'completed', label: '완료' },
  ]

  return (
    <div className="max-w-3xl lg:max-w-4xl mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-text-primary)] mb-6">TODO</h1>

      {/* Add Form */}
      <form onSubmit={addTodo} className="mb-6">
        <div
          className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="할 일을 입력하세요..."
            className="flex-1 min-h-[44px] px-4 py-2 text-base rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
          />
          <div className="flex gap-3">
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as TodoPriority)}
              className="min-h-[44px] px-3 py-2 text-base rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="LOW">낮음</option>
              <option value="MEDIUM">보통</option>
              <option value="HIGH">높음</option>
            </select>
            <button
              type="submit"
              disabled={!title.trim() || submitting}
              className="min-h-[44px] px-6 py-2 text-base font-medium text-white bg-[var(--color-accent)] rounded-xl transition-all duration-200 sm:hover:bg-[var(--color-accent-hover)] sm:hover:shadow-[0_0_15px_-3px_var(--color-accent-glow)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 whitespace-nowrap"
              style={{ touchAction: 'manipulation' }}
            >
              {submitting ? '...' : '추가'}
            </button>
          </div>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`min-h-[44px] px-4 py-2 text-sm font-medium rounded-full transition-all duration-200
              ${filter === f.key
                ? 'text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)] ring-1 ring-[var(--color-border-hover)] shadow-sm'
                : 'text-[var(--color-text-secondary)] sm:hover:text-[var(--color-text-primary)] sm:hover:bg-[var(--color-bg-subtle)]'
              }`}
            style={{ touchAction: 'manipulation' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Todo List */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            불러오는 중...
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)] text-lg">
              {filter === 'all' ? '할 일이 없습니다' : filter === 'active' ? '진행중인 할 일이 없습니다' : '완료된 할 일이 없습니다'}
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              className="group flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] sm:hover:border-[var(--color-border-hover)] transition-all duration-200"
              style={{ backdropFilter: 'blur(12px)' }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTodo(todo.id, todo.completed)}
                className={`flex-shrink-0 w-6 h-6 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border-2 transition-all duration-200
                  ${todo.completed
                    ? 'border-[var(--color-success)] bg-[var(--color-success)]'
                    : 'border-[var(--color-border-default)] sm:hover:border-[var(--color-accent)]'
                  }`}
                style={{ touchAction: 'manipulation' }}
                aria-label={todo.completed ? '완료 취소' : '완료로 표시'}
              >
                {todo.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Title */}
              <span
                className={`flex-1 text-base transition-all duration-200 ${
                  todo.completed
                    ? 'line-through text-[var(--color-text-muted)]'
                    : 'text-[var(--color-text-primary)]'
                }`}
              >
                {todo.title}
              </span>

              {/* Priority Badge */}
              <span
                className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  color: PRIORITY_CONFIG[todo.priority].color,
                  backgroundColor: `color-mix(in srgb, ${PRIORITY_CONFIG[todo.priority].bg} 15%, transparent)`,
                }}
              >
                {PRIORITY_CONFIG[todo.priority].label}
              </span>

              {/* Delete Button */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--color-text-muted)] sm:hover:text-[var(--color-danger)] transition-colors duration-200 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 lg:opacity-100"
                style={{ touchAction: 'manipulation' }}
                aria-label="할 일 삭제"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Remaining Count */}
      {todos.length > 0 && (
        <div className="mt-4 text-sm text-[var(--color-text-muted)] text-center">
          {remainingCount}개 남음
        </div>
      )}
    </div>
  )
}

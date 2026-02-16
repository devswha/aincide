import { NextResponse } from 'next/server'

const DEFAULT_TIMEOUT_MS = 5000

interface ProxyFetchOptions {
  timeoutMs?: number
  headers?: Record<string, string>
}

export async function proxyFetch(
  url: string,
  errorLabel: string,
  options: ProxyFetchOptions = {}
): Promise<NextResponse> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, headers } = options
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return NextResponse.json(
        { error: `${errorLabel} unreachable` },
        { status: 502 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    clearTimeout(timeoutId)
    return NextResponse.json(
      { error: `${errorLabel} unreachable` },
      { status: 502 }
    )
  }
}

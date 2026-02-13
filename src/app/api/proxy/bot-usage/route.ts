import { NextResponse } from 'next/server'

const USAGE_SERVER_URL = process.env.USAGE_SERVER_URL || 'http://100.98.23.106:3090'

export async function GET() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(`${USAGE_SERVER_URL}/api/usage`, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Usage server unreachable' },
          { status: 502 }
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch {
      clearTimeout(timeoutId)
      return NextResponse.json(
        { error: 'Usage server unreachable' },
        { status: 502 }
      )
    }
  } catch (error) {
    console.error('Error proxying usage:', error)
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    )
  }
}

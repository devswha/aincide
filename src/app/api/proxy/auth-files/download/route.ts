import { NextRequest, NextResponse } from 'next/server'

const USAGE_SERVER_URL = process.env.USAGE_SERVER_URL || 'http://100.98.23.106:3090'

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name')

  if (!name) {
    return NextResponse.json(
      { error: 'Missing name parameter' },
      { status: 400 }
    )
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(
        `${USAGE_SERVER_URL}/api/auth-files/download?name=${encodeURIComponent(name)}`,
        { signal: controller.signal }
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Auth file download failed' },
          { status: 502 }
        )
      }

      const data = await response.text()
      return new NextResponse(data, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${name}"`,
        },
      })
    } catch {
      clearTimeout(timeoutId)
      return NextResponse.json(
        { error: 'Usage server unreachable' },
        { status: 502 }
      )
    }
  } catch (error) {
    console.error('Error proxying auth-files download:', error)
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    )
  }
}

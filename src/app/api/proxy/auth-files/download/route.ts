import { NextRequest, NextResponse } from 'next/server'

function sanitizeFilename(input: string) {
  const base = input.split('/').pop()?.split('\\').pop() || 'auth.json'
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200)
}

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name')

  if (!name) {
    return NextResponse.json(
      { error: 'Missing name parameter' },
      {
        status: 400,
        headers: { 'Cache-Control': 'no-store' },
      }
    )
  }

  const cliproxyUrl = process.env.CLIPROXY_URL
  const managementKey = process.env.CLIPROXY_MANAGEMENT_KEY

  if (!cliproxyUrl || !managementKey) {
    return NextResponse.json(
      { error: 'CLIProxyAPI not configured' },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      }
    )
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(
        `${cliproxyUrl}/v0/management/auth-files/download?name=${encodeURIComponent(name)}`,
        {
          headers: {
            'X-Management-Key': managementKey,
          },
          signal: controller.signal,
        }
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        return NextResponse.json(
          { error: 'CLIProxyAPI unreachable' },
          {
            status: 502,
            headers: { 'Cache-Control': 'no-store' },
          }
        )
      }

      const safeName = sanitizeFilename(name)
      const data = await response.arrayBuffer()
      return new NextResponse(data, {
        status: 200,
        headers: {
          'Content-Type': response.headers.get('content-type') || 'application/json',
          'Content-Disposition': `attachment; filename="${safeName}"`,
          'Cache-Control': 'no-store',
          Pragma: 'no-cache',
        },
      })
    } catch {
      clearTimeout(timeoutId)
      return NextResponse.json(
        { error: 'CLIProxyAPI unreachable' },
        {
          status: 502,
          headers: { 'Cache-Control': 'no-store' },
        }
      )
    }
  } catch (error) {
    console.error('Error proxying auth-files download:', error)
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      }
    )
  }
}

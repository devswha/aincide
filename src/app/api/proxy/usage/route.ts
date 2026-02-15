import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const cliproxyUrl = process.env.CLIPROXY_URL
    const managementKey =
      process.env.CLIPROXY_MANAGEMENT_KEY || process.env.CLIPROXY_KEY

    if (!cliproxyUrl || !managementKey) {
      return NextResponse.json(
        { error: 'CLIProxyAPI not configured' },
        {
          status: 503,
          headers: { 'Cache-Control': 'no-store' },
        }
      )
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(`${cliproxyUrl}/v0/management/usage`, {
        headers: {
          'X-Management-Key': managementKey,
        },
        signal: controller.signal,
      })

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

      const data = await response.json()
      return NextResponse.json(data.usage || data, {
        headers: { 'Cache-Control': 'no-store' },
      })
    } catch (error) {
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
    console.error('Error proxying to CLIProxyAPI:', error)
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      }
    )
  }
}

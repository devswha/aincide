import StatusClient from './StatusClient'

export const dynamic = 'force-dynamic'

export default function StatusPage() {
  const usageConfigured = Boolean(
    process.env.CLIPROXY_URL &&
      (process.env.CLIPROXY_MANAGEMENT_KEY || process.env.CLIPROXY_KEY)
  )

  return <StatusClient usageConfigured={usageConfigured} />
}

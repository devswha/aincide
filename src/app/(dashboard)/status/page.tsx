import StatusClient from './StatusClient'

export const dynamic = 'force-dynamic'

export default function StatusPage() {
  const usageConfigured = Boolean(process.env.CLIPROXY_URL)
  const usageHistoryConfigured = Boolean(process.env.USAGE_SERVER_URL)

  return <StatusClient usageConfigured={usageConfigured} usageHistoryConfigured={usageHistoryConfigured} />
}

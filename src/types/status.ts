export interface BotInfo {
  id: string
  name: string
  status: 'online' | 'offline'
  uptime: string
  ping: number
  openclawAgent: string
  workspace?: string
  description: string
}

export interface BotStatusData {
  bots: BotInfo[]
  serverUptime: string
}

export interface AnthropicLimit {
  utilization: number
  resets_at: string | null
}

export interface AccountUsage {
  name: string
  email: string
  authFileName: string
  planType?: string
  status?: 'active' | 'error'
  statusMessage?: string
  usage: {
    five_hour: AnthropicLimit
    seven_day: AnthropicLimit
    seven_day_sonnet: AnthropicLimit
  }
}

export interface CodexRateWindow {
  used_percent: number
  limit_window_seconds: number
  reset_after_seconds: number
  reset_at: number
}

export interface CodexUsage {
  email: string
  plan_type: string
  authFileName?: string
  rate_limit: {
    primary_window: CodexRateWindow
    secondary_window: CodexRateWindow | null
  }
  code_review_rate_limit: {
    primary_window: CodexRateWindow
    secondary_window: CodexRateWindow | null
  }
}

export interface GeminiQuotaBucket {
  modelId: string
  remainingFraction: number
  resetTime: string
}

export interface GeminiUsage {
  email: string
  provider: string
  authFileName: string
  label?: string
  status: 'active' | 'error'
  statusMessage?: string
  quota?: {
    pro: { used: number; resetTime: string } | null
  }
}

export interface UsageData {
  accounts: AccountUsage[]
  codex: CodexUsage[]
  gemini: GeminiUsage[]
}

export interface ServiceHealth {
  name: string
  url: string
  status: 'checking' | 'online' | 'offline'
  description: string
}

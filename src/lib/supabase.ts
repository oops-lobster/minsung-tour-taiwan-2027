import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const isBudgetApiConfigured = Boolean(supabaseUrl && supabasePublishableKey)
export const PRIVATE_SESSION_KEY = 'minsung-tour-budget-session-v1'

export const supabase = isBudgetApiConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null

export class BudgetApiError extends Error {
  status: number
  code: string

  constructor(message: string, status = 500, code = 'request_failed') {
    super(message)
    this.name = 'BudgetApiError'
    this.status = status
    this.code = code
  }
}

interface FunctionErrorBody {
  code?: string
  error?: string
  remaining_attempts?: number
  retry_after?: number
}

async function invokePrivateFunction(
  functionName: 'budget-api' | 'trip-tasks',
  action: string,
  payload: Record<string, unknown>,
  sessionToken?: string,
) {
  if (!supabaseUrl || !supabasePublishableKey) throw new BudgetApiError('예산 서버 환경변수가 설정되지 않았습니다.', 500, 'not_configured')
  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabasePublishableKey,
      ...(sessionToken ? { 'x-budget-session': sessionToken } : {}),
    },
    body: JSON.stringify({ action, ...payload }),
  })
  const data = await response.json().catch(() => null) as (Record<string, unknown> & FunctionErrorBody) | null
  return { response, data }
}

export async function callBudgetApi<T extends Record<string, unknown>>(
  action: string,
  payload: Record<string, unknown> = {},
  sessionToken?: string,
): Promise<T> {
  const { data, response } = await invokePrivateFunction('budget-api', action, payload, sessionToken)

  if (!response.ok || !data || data.ok !== true) {
    let code = data?.code ?? data?.error ?? 'request_failed'
    let message = '요청을 처리하지 못했습니다. 잠시 뒤 다시 시도해 주세요.'
    if (code === 'invalid_pin') message = `PIN이 맞지 않습니다. 남은 시도: ${Number(data?.remaining_attempts ?? 0)}회`
    if (code === 'rate_limited') message = `잠시 잠겼습니다. 약 ${Math.ceil(Number(data?.retry_after ?? 600) / 60)}분 뒤 다시 시도해 주세요.`
    if (code === 'session_expired') message = '보호 시간이 끝났습니다. PIN을 다시 입력해 주세요.'
    throw new BudgetApiError(message, response.status, code)
  }

  return data as T
}

export async function callTripTasksApi<T extends Record<string, unknown>>(
  action: string,
  payload: Record<string, unknown>,
  sessionToken: string,
): Promise<T> {
  const { data, response } = await invokePrivateFunction('trip-tasks', action, payload, sessionToken)

  if (!response.ok || !data || data.ok !== true) {
    let code = data?.error ?? 'request_failed'
    const messages: Record<string, string> = {
      session_expired: '보호 시간이 끝났습니다. PIN을 다시 입력해 주세요.',
      duplicate_title: '같은 제목의 할 일이 이미 있습니다.',
      title_required: '할 일 제목을 입력해 주세요.',
      invalid_due_month: '예정 시기를 다시 선택해 주세요.',
    }
    throw new BudgetApiError(messages[code] ?? '할 일 요청을 처리하지 못했습니다.', response.status, code)
  }

  return data as T
}

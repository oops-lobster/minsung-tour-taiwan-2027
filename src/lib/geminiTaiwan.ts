import type { TaiwanMarketNumber } from './taiwanUnits'

export const taiwanLanguageContexts = ['일반', '귀후어항', '식당', '택시', '호텔', '쇼핑', '예약'] as const
export type TaiwanLanguageContext = (typeof taiwanLanguageContexts)[number]

export interface TaiwanSpeechResult {
  traditionalChinese: string
  pinyin: string
  toneNumbers: string
  koreanPronunciation: string
  koreanMeaning: string
  naturalnessNote: string
  shortAlternative?: {
    traditionalChinese: string
    pinyin: string
    koreanPronunciation: string
  }
}

export interface TaiwanListeningReply {
  label: string
  korean: string
  traditionalChinese: string
  pinyin: string
  koreanPronunciation: string
}

export interface TaiwanListeningResult {
  transcriptTraditionalChinese: string
  pinyin?: string
  koreanTranslation: string
  intentSummary: string
  numbers: TaiwanMarketNumber[]
  uncertainty?: string
  suggestedReplies: TaiwanListeningReply[]
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
const functionUrl = supabaseUrl ? `${supabaseUrl}/functions/v1/taiwan-language-ai` : ''

export const isTaiwanAiConfigured = Boolean(functionUrl && supabasePublishableKey)

export class TaiwanAiError extends Error {
  code: string
  status: number

  constructor(code = 'request_failed', status = 500) {
    super(code)
    this.name = 'TaiwanAiError'
    this.code = code
    this.status = status
  }
}

interface FunctionResponse<T> {
  ok?: boolean
  data?: T
  error?: string
}

async function callTaiwanAi<T>(payload: Record<string, unknown>, timeoutMs: number, signal?: AbortSignal) {
  if (!functionUrl || !supabasePublishableKey) throw new TaiwanAiError('not_configured', 500)
  if (!navigator.onLine) throw new TaiwanAiError('offline', 0)

  const controller = new AbortController()
  const onAbort = () => controller.abort()
  signal?.addEventListener('abort', onAbort, { once: true })
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabasePublishableKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    const body = await response.json().catch(() => null) as FunctionResponse<T> | null
    if (!response.ok || body?.ok !== true || !body.data) throw new TaiwanAiError(body?.error ?? 'request_failed', response.status)
    return body.data
  } catch (error) {
    if (error instanceof TaiwanAiError) throw error
    if (controller.signal.aborted) throw new TaiwanAiError(signal?.aborted ? 'cancelled' : 'timeout', 0)
    throw new TaiwanAiError('network_error', 0)
  } finally {
    window.clearTimeout(timeoutId)
    signal?.removeEventListener('abort', onAbort)
  }
}

export function translateForSpeaking(text: string, context: TaiwanLanguageContext, signal?: AbortSignal) {
  return callTaiwanAi<TaiwanSpeechResult>({ action: 'translate-outbound', text, context }, 20_000, signal)
}

export function translateIncomingText(text: string, context: TaiwanLanguageContext, signal?: AbortSignal) {
  return callTaiwanAi<TaiwanListeningResult>({ action: 'translate-incoming-text', text, context }, 20_000, signal)
}

export function interpretAudio(audioBase64: string, mimeType: string, context: TaiwanLanguageContext, signal?: AbortSignal) {
  return callTaiwanAi<TaiwanListeningResult>({ action: 'interpret-audio', audioBase64, mimeType, context }, 40_000, signal)
}

export async function blobToBase64(blob: Blob) {
  const buffer = await blob.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const chunkSize = 0x8000
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, Math.min(index + chunkSize, bytes.length)))
  }
  return window.btoa(binary)
}

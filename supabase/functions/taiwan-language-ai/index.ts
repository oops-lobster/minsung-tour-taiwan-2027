const productionOrigin = 'https://oops-lobster.github.io'
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models'
const DEFAULT_MODEL = 'gemini-3.5-flash-lite'
const MAX_TEXT_LENGTH = 1_200
const MAX_AUDIO_BASE64_LENGTH = 5_600_000
const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 15

type JsonRecord = Record<string, unknown>
const rateBuckets = new Map<string, { count: number; resetAt: number }>()

function isAllowedOrigin(origin: string) {
  return origin === productionOrigin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
}

function corsHeaders(request: Request) {
  const origin = request.headers.get('origin') ?? ''
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin(origin) ? origin : productionOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'Vary': 'Origin',
  }
}

function json(request: Request, body: JsonRecord, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(request) })
}

function asObject(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : {}
}

function readPublishableKeys() {
  const keys: string[] = []
  const modern = Deno.env.get('SUPABASE_PUBLISHABLE_KEYS')
  if (modern) {
    try {
      const parsed = JSON.parse(modern) as Record<string, string | { key?: string; value?: string }>
      for (const candidate of Object.values(parsed)) {
        const reference = typeof candidate === 'string' ? candidate : candidate?.key || candidate?.value
        if (!reference) continue
        keys.push(Deno.env.get(reference) ?? reference)
      }
    } catch { /* malformed platform variable is treated as unavailable */ }
  }
  const legacy = Deno.env.get('SUPABASE_ANON_KEY')
  if (legacy) keys.push(legacy)
  return keys
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false
  let mismatch = 0
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index)
  return mismatch === 0
}

function isAuthorizedRequest(request: Request) {
  const provided = request.headers.get('apikey')?.trim() ?? ''
  return Boolean(provided) && readPublishableKeys().some((key) => constantTimeEqual(provided, key))
}

function hitRateLimit(request: Request) {
  const now = Date.now()
  const client = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('cf-connecting-ip')
    ?? 'anonymous'
  const current = rateBuckets.get(client)
  if (!current || current.resetAt <= now) {
    rateBuckets.set(client, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  current.count += 1
  return current.count > RATE_LIMIT
}

const outboundSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    traditionalChinese: { type: 'string' },
    pinyin: { type: 'string' },
    toneNumbers: { type: 'string' },
    koreanPronunciation: { type: 'string' },
    koreanMeaning: { type: 'string' },
    naturalnessNote: { type: 'string' },
    shortAlternative: {
      type: ['object', 'null'], additionalProperties: false,
      properties: {
        traditionalChinese: { type: 'string' },
        pinyin: { type: 'string' },
        koreanPronunciation: { type: 'string' },
      },
      required: ['traditionalChinese', 'pinyin', 'koreanPronunciation'],
    },
  },
  required: ['traditionalChinese', 'pinyin', 'toneNumbers', 'koreanPronunciation', 'koreanMeaning', 'naturalnessNote'],
}

const incomingSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    transcriptTraditionalChinese: { type: 'string' },
    pinyin: { type: ['string', 'null'] },
    koreanTranslation: { type: 'string' },
    intentSummary: { type: 'string' },
    numbers: {
      type: 'array', maxItems: 12,
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          original: { type: 'string' }, meaning: { type: 'string' },
          value: { type: ['string', 'null'] }, unit: { type: ['string', 'null'] },
        },
        required: ['original', 'meaning'],
      },
    },
    uncertainty: { type: ['string', 'null'] },
    suggestedReplies: {
      type: 'array', minItems: 2, maxItems: 4,
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          label: { type: 'string' }, korean: { type: 'string' }, traditionalChinese: { type: 'string' },
          pinyin: { type: 'string' }, koreanPronunciation: { type: 'string' },
        },
        required: ['label', 'korean', 'traditionalChinese', 'pinyin', 'koreanPronunciation'],
      },
    },
  },
  required: ['transcriptTraditionalChinese', 'koreanTranslation', 'intentSummary', 'numbers', 'suggestedReplies'],
}

const outboundSystem = `You are a Taiwan Mandarin travel speech coach for a Korean traveler.
The traveler will actually say the sentence aloud in Taiwan. Use natural spoken Taiwan Mandarin in Traditional Chinese only.
Prefer short, memorable, polite, conversational sentences. Avoid textbook, bureaucratic, literary, Mainland-specific, or overly fluent phrasing.
Preserve numbers, money, dates, weights, addresses, names, and reservation times exactly.
Return Traditional Chinese, Hanyu Pinyin with tone marks, the same pinyin with tone numbers, Korean pronunciation for approximate speaking, Korean meaning, and one short naturalness note. Add a shorter alternative when useful.
Use Taiwan vocabulary such as 鮭魚, 計程車, 捷運, 外帶, 內用, 發票.
For fish markets, explicitly confirm unit price, weight, ingredient price, cooking fee, and total before preparation.
Pinyin must never be replaced by Korean pronunciation. Korean pronunciation is only a practical aid.`

const incomingSystem = `You interpret spoken Taiwan Mandarin for a Korean family traveler. Transcribe in Traditional Chinese and translate to clear Korean.
Never omit, normalize, or silently change spoken numbers. Extract prices, weights, quantities, times, room numbers, plates, addresses, and reservation details separately.
For each number provide the exact original phrase, Korean meaning, a digits-only decimal value when known, and a normalized unit.
In Taiwan fish-market context, 台斤 is exactly 600 g. Use unit TWD/台斤 for a unit price, 台斤 for a weight, and TWD for a fee or total. Never confuse 台斤 with kg.
Do not perform arithmetic. The app calculates totals deterministically. Note uncertainty honestly. Suggest 2–4 short, polite replies in natural spoken Taiwan Mandarin with pinyin and Korean pronunciation.`

const contextPrompts: Record<string, string> = {
  '일반': 'General Taiwan travel conversation.',
  '귀후어항': 'At Guihou Fishing Harbor in New Taipei. Focus on fish freshness, market price, 台斤 weight, cooking fee, total, sashimi and nigiri. Three travelers. No salmon sashimi. No lobster, crab, or high-end seafood.',
  '식당': 'At a restaurant in Taiwan. Keep ordering language short and polite.',
  '택시': 'In a Taiwan taxi. Use 計程車 and concise directions.',
  '호텔': 'At a hotel front desk in Taiwan.',
  '쇼핑': 'Shopping in Taiwan. Confirm quantity, size, and total clearly.',
  '예약': 'Confirming a reservation. Preserve names, date, time, and party size exactly.',
}

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeResult(value: unknown, action: string) {
  const result = asObject(value)
  if (action === 'translate-outbound') {
    const required = ['traditionalChinese', 'pinyin', 'toneNumbers', 'koreanPronunciation', 'koreanMeaning', 'naturalnessNote']
    if (required.some((key) => !cleanString(result[key]))) throw new Error('invalid_outbound')
    if (result.shortAlternative === null) delete result.shortAlternative
    return result
  }
  const required = ['transcriptTraditionalChinese', 'koreanTranslation', 'intentSummary']
  if (required.some((key) => !cleanString(result[key])) || !Array.isArray(result.numbers) || !Array.isArray(result.suggestedReplies)) throw new Error('invalid_incoming')
  if (result.pinyin === null) delete result.pinyin
  if (result.uncertainty === null) delete result.uncertainty
  return result
}

function extractJson(text: string) {
  try { return JSON.parse(text) as unknown } catch {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start < 0 || end <= start) throw new Error('json_parse_failed')
    return JSON.parse(text.slice(start, end + 1)) as unknown
  }
}

async function callGemini(apiKey: string, model: string, systemInstruction: string, parts: JsonRecord[], schema: JsonRecord, timeoutMs: number) {
  const payload = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1800,
      responseMimeType: 'application/json',
      responseJsonSchema: schema,
    },
  }

  let lastStatus = 500
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(`${GEMINI_ENDPOINT}/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      lastStatus = response.status
      if (!response.ok) {
        if (attempt === 0 && (response.status === 429 || response.status >= 500)) {
          await new Promise((resolve) => setTimeout(resolve, 450))
          continue
        }
        throw new Error(response.status === 429 ? 'provider_rate_limited' : 'provider_failed')
      }
      const responseBody = asObject(await response.json())
      const candidates = Array.isArray(responseBody.candidates) ? responseBody.candidates : []
      const first = asObject(candidates[0])
      const content = asObject(first.content)
      const responseParts = Array.isArray(content.parts) ? content.parts : []
      const text = responseParts.map((part) => cleanString(asObject(part).text)).filter(Boolean).join('')
      if (!text) throw new Error('empty_provider_response')
      return extractJson(text)
    } catch (error) {
      if (attempt === 0 && (error instanceof DOMException || lastStatus >= 500)) {
        await new Promise((resolve) => setTimeout(resolve, 450))
        continue
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }
  throw new Error('provider_failed')
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(request) })
  if (request.method !== 'POST') return json(request, { ok: false, error: 'method_not_allowed' }, 405)
  const origin = request.headers.get('origin')
  if (origin && !isAllowedOrigin(origin)) return json(request, { ok: false, error: 'origin_not_allowed' }, 403)
  if (!isAuthorizedRequest(request)) return json(request, { ok: false, error: 'unauthorized' }, 401)
  if (hitRateLimit(request)) return json(request, { ok: false, error: 'rate_limited' }, 429)

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > 6_000_000) return json(request, { ok: false, error: 'request_too_large' }, 413)

  const apiKey = Deno.env.get('GEMINI_API_KEY') ?? ''
  const model = Deno.env.get('GEMINI_MODEL')?.trim() || DEFAULT_MODEL
  if (!apiKey) return json(request, { ok: false, error: 'server_not_configured' }, 503)

  let body: JsonRecord
  try { body = asObject(await request.json()) } catch { return json(request, { ok: false, error: 'invalid_json' }, 400) }
  const action = cleanString(body.action)
  const context = cleanString(body.context) || '일반'
  const contextPrompt = contextPrompts[context] ?? contextPrompts['일반']

  try {
    let raw: unknown
    if (action === 'translate-outbound') {
      const text = cleanString(body.text)
      if (!text || text.length > MAX_TEXT_LENGTH) return json(request, { ok: false, error: 'invalid_text' }, 400)
      raw = await callGemini(apiKey, model, outboundSystem, [{ text: `Context: ${contextPrompt}\nKorean sentence: ${text}` }], outboundSchema, 18_000)
    } else if (action === 'translate-incoming-text') {
      const text = cleanString(body.text)
      if (!text || text.length > MAX_TEXT_LENGTH) return json(request, { ok: false, error: 'invalid_text' }, 400)
      raw = await callGemini(apiKey, model, incomingSystem, [{ text: `Context: ${contextPrompt}\nInterpret this Taiwan Mandarin text: ${text}` }], incomingSchema, 18_000)
    } else if (action === 'interpret-audio') {
      const audioBase64 = cleanString(body.audioBase64)
      const mimeType = cleanString(body.mimeType).toLowerCase()
      if (!audioBase64 || audioBase64.length > MAX_AUDIO_BASE64_LENGTH || !/^audio\/(mp4|webm|mpeg|mp3|wav|x-m4a|aac|ogg)(;|$)/.test(mimeType)) {
        return json(request, { ok: false, error: 'invalid_audio' }, 400)
      }
      raw = await callGemini(apiKey, model, incomingSystem, [
        { text: `Context: ${contextPrompt}\nTranscribe and interpret this short recording.` },
        { inlineData: { mimeType, data: audioBase64 } },
      ], incomingSchema, 38_000)
    } else {
      return json(request, { ok: false, error: 'unknown_action' }, 400)
    }

    return json(request, { ok: true, data: normalizeResult(raw, action), model })
  } catch (error) {
    const code = error instanceof Error ? error.message : 'provider_failed'
    if (code === 'provider_rate_limited') return json(request, { ok: false, error: 'provider_rate_limited' }, 429)
    if (code === 'provider_failed') return json(request, { ok: false, error: 'provider_unavailable' }, 502)
    return json(request, { ok: false, error: 'ai_response_invalid' }, 502)
  }
})

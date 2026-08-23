import type { TaiwanLanguageContext, TaiwanListeningResult, TaiwanSpeechResult } from './geminiTaiwan'

export const TAIWAN_LANGUAGE_CONSENT_KEY = 'minsung-tour-gemini-consent-v1'
export const TAIWAN_LANGUAGE_HISTORY_KEY = 'minsung-tour-taiwan-language-history-v1'
export const TAIWAN_LANGUAGE_FAVORITES_KEY = 'minsung-tour-taiwan-language-favorites-v1'
export const TAIWAN_LANGUAGE_RECENTS_KEY = 'minsung-tour-taiwan-language-recents-v1'

export type TaiwanLanguageHistoryItem =
  | { id: string; direction: 'outbound'; context: TaiwanLanguageContext; input: string; output: TaiwanSpeechResult; timestamp: number }
  | { id: string; direction: 'incoming'; context: TaiwanLanguageContext; input: string; output: TaiwanListeningResult; timestamp: number }

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

export function readLanguageHistory() {
  return readJson<TaiwanLanguageHistoryItem[]>(TAIWAN_LANGUAGE_HISTORY_KEY, []).slice(0, 30)
}

export function saveLanguageHistory(item: TaiwanLanguageHistoryItem) {
  const next = [item, ...readLanguageHistory().filter((entry) => !(entry.direction === item.direction && entry.input === item.input))].slice(0, 30)
  window.localStorage.setItem(TAIWAN_LANGUAGE_HISTORY_KEY, JSON.stringify(next))
  return next
}

export function clearLanguageHistory() {
  window.localStorage.removeItem(TAIWAN_LANGUAGE_HISTORY_KEY)
}

export function readStringList(key: string, fallback: readonly string[] = []) {
  return readJson<string[]>(key, [...fallback])
}

export function saveStringList(key: string, values: string[]) {
  window.localStorage.setItem(key, JSON.stringify(values))
}

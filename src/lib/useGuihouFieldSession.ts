import { useCallback, useEffect, useState } from 'react'
import type { GuihouSeafoodItem } from './guihouPrice'

export interface GuihouFieldSession {
  version: number
  visitedAt?: string
  currentStep: number
  completedSteps: number[]
  shortlistedFreshStalls: number[]
  selectedFreshStalls: number[]
  selectedCookStall?: number
  items: GuihouSeafoodItem[]
  notes?: string
  languageFavorites?: string[]
  customPhrases?: string[]
  mealLimit?: number
  timerStartedAt?: string
  freshnessConfirmed?: boolean
  lastUpdatedAt: string
}

export const GUIHOU_SESSION_KEY = 'minsung-tour-guihou-field-session-v1'
const SESSION_VERSION = 1

export function createDefaultGuihouSession(): GuihouFieldSession {
  return {
    version: SESSION_VERSION,
    currentStep: 0,
    completedSteps: [],
    shortlistedFreshStalls: [],
    selectedFreshStalls: [],
    items: [],
    languageFavorites: [],
    customPhrases: [],
    lastUpdatedAt: new Date().toISOString(),
  }
}

const uniqueNumbers = (value: unknown) => Array.isArray(value) ? [...new Set(value.filter((item): item is number => Number.isInteger(item) && item >= 0))] : []
const uniqueStrings = (value: unknown) => Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean))] : []

export function sanitizeGuihouSession(value: unknown): GuihouFieldSession {
  const fallback = createDefaultGuihouSession()
  if (!value || typeof value !== 'object') return fallback
  const raw = value as Partial<GuihouFieldSession>
  const currentStep = Number.isInteger(raw.currentStep) ? Math.min(10, Math.max(0, raw.currentStep ?? 0)) : 0
  const items = Array.isArray(raw.items) ? raw.items.filter((item): item is GuihouSeafoodItem => Boolean(item && typeof item === 'object' && typeof item.id === 'string' && typeof item.nameKo === 'string' && ['per-taijin', 'per-kg', 'fixed'].includes(item.priceMode))) : []
  return {
    ...fallback,
    visitedAt: typeof raw.visitedAt === 'string' ? raw.visitedAt : undefined,
    currentStep,
    completedSteps: uniqueNumbers(raw.completedSteps).filter((step) => step <= 10),
    shortlistedFreshStalls: uniqueNumbers(raw.shortlistedFreshStalls),
    selectedFreshStalls: uniqueNumbers(raw.selectedFreshStalls),
    selectedCookStall: Number.isInteger(raw.selectedCookStall) ? raw.selectedCookStall : undefined,
    items,
    notes: typeof raw.notes === 'string' ? raw.notes.slice(0, 2000) : undefined,
    languageFavorites: uniqueStrings(raw.languageFavorites),
    customPhrases: uniqueStrings(raw.customPhrases).slice(0, 20),
    mealLimit: typeof raw.mealLimit === 'number' && Number.isFinite(raw.mealLimit) && raw.mealLimit > 0 ? raw.mealLimit : undefined,
    timerStartedAt: typeof raw.timerStartedAt === 'string' ? raw.timerStartedAt : undefined,
    freshnessConfirmed: raw.freshnessConfirmed === true,
    lastUpdatedAt: typeof raw.lastUpdatedAt === 'string' ? raw.lastUpdatedAt : fallback.lastUpdatedAt,
  }
}

function readInitialSession() {
  try {
    const raw = window.localStorage.getItem(GUIHOU_SESSION_KEY)
    return sanitizeGuihouSession(raw ? JSON.parse(raw) : null)
  } catch {
    return createDefaultGuihouSession()
  }
}

export function useGuihouFieldSession() {
  const [session, setSession] = useState<GuihouFieldSession>(readInitialSession)

  useEffect(() => {
    window.localStorage.setItem(GUIHOU_SESSION_KEY, JSON.stringify(session))
  }, [session])

  const update = useCallback((recipe: (current: GuihouFieldSession) => GuihouFieldSession) => {
    setSession((current) => ({ ...recipe(current), version: SESSION_VERSION, lastUpdatedAt: new Date().toISOString() }))
  }, [])

  const toggleStep = useCallback((step: number) => update((current) => {
    const completed = current.completedSteps.includes(step)
      ? current.completedSteps.filter((item) => item !== step)
      : [...current.completedSteps, step].sort((a, b) => a - b)
    const currentStep = completed ? Math.min(step, current.currentStep) : Math.min(10, Math.max(current.currentStep, step + 1))
    return { ...current, completedSteps: completed, currentStep, visitedAt: current.visitedAt ?? new Date().toISOString() }
  }), [update])

  const toggleShortlist = useCallback((stall: number) => update((current) => ({
    ...current,
    shortlistedFreshStalls: current.shortlistedFreshStalls.includes(stall)
      ? current.shortlistedFreshStalls.filter((item) => item !== stall)
      : [...current.shortlistedFreshStalls, stall],
  })), [update])

  const toggleSelectedFresh = useCallback((stall: number) => update((current) => ({
    ...current,
    selectedFreshStalls: current.selectedFreshStalls.includes(stall)
      ? current.selectedFreshStalls.filter((item) => item !== stall)
      : [...current.selectedFreshStalls, stall],
  })), [update])

  const reset = useCallback(() => {
    const next = createDefaultGuihouSession()
    window.localStorage.removeItem(GUIHOU_SESSION_KEY)
    setSession(next)
  }, [])

  return { session, update, toggleStep, toggleShortlist, toggleSelectedFresh, reset }
}

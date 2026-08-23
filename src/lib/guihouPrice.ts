export type GuihouPriceMode = 'per-taijin' | 'per-kg' | 'fixed'

export interface GuihouSeafoodItem {
  id: string
  nameKo: string
  nameZh?: string
  stallNo?: number
  priceMode: GuihouPriceMode
  unitPrice?: number
  weightTaijin?: number
  weightGrams?: number
  fixedPrice?: number
  cookingMethod?: string
  cookingFee?: number
  confirmed?: boolean
}

export interface GuihouPriceLine {
  ingredientCost: number
  cookingFee: number
  total: number
  grams?: number
  valid: boolean
  issue?: string
}

const positive = (value: number | undefined) => Number.isFinite(value) && (value ?? 0) >= 0
export const taijinToGuihouGrams = (taijin: number) => Math.round(taijin * 600 * 10) / 10

export function calculateGuihouItem(item: GuihouSeafoodItem): GuihouPriceLine {
  const hasInvalidCookingFee = item.cookingFee !== undefined && (!Number.isFinite(item.cookingFee) || item.cookingFee < 0)
  const cookingFee = hasInvalidCookingFee ? 0 : item.cookingFee ?? 0
  if (hasInvalidCookingFee) return { ingredientCost: 0, cookingFee: 0, total: 0, valid: false, issue: '조리비는 0 이상이어야 합니다.' }

  if (item.priceMode === 'fixed') {
    if (!positive(item.fixedPrice)) return { ingredientCost: 0, cookingFee, total: cookingFee, valid: false, issue: '고정 가격을 입력해 주세요.' }
    const ingredientCost = Math.round(item.fixedPrice ?? 0)
    return { ingredientCost, cookingFee: Math.round(cookingFee), total: Math.round(ingredientCost + cookingFee), valid: true }
  }

  if (!positive(item.unitPrice) || (item.unitPrice ?? 0) === 0) return { ingredientCost: 0, cookingFee, total: cookingFee, valid: false, issue: '단가를 입력해 주세요.' }

  if (item.priceMode === 'per-taijin') {
    if (!positive(item.weightTaijin) || (item.weightTaijin ?? 0) === 0) return { ingredientCost: 0, cookingFee, total: cookingFee, valid: false, issue: '무게(台斤)를 입력해 주세요.' }
    const ingredientCost = Math.round((item.unitPrice ?? 0) * (item.weightTaijin ?? 0))
    return { ingredientCost, cookingFee: Math.round(cookingFee), total: Math.round(ingredientCost + cookingFee), grams: taijinToGuihouGrams(item.weightTaijin ?? 0), valid: true }
  }

  if (!positive(item.weightGrams) || (item.weightGrams ?? 0) === 0) return { ingredientCost: 0, cookingFee, total: cookingFee, valid: false, issue: '무게(g)를 입력해 주세요.' }
  const ingredientCost = Math.round((item.unitPrice ?? 0) * ((item.weightGrams ?? 0) / 1000))
  return { ingredientCost, cookingFee: Math.round(cookingFee), total: Math.round(ingredientCost + cookingFee), grams: item.weightGrams, valid: true }
}

export function calculateGuihouCart(items: GuihouSeafoodItem[]) {
  const lines = items.map((item) => ({ item, calculation: calculateGuihouItem(item) }))
  const ingredientCost = lines.reduce((sum, line) => sum + line.calculation.ingredientCost, 0)
  const cookingFee = lines.reduce((sum, line) => sum + line.calculation.cookingFee, 0)
  return { lines, ingredientCost, cookingFee, total: ingredientCost + cookingFee, valid: lines.length > 0 && lines.every((line) => line.calculation.valid) }
}

export function getGuihouLimitState(total: number, limit?: number) {
  if (!Number.isFinite(limit) || (limit ?? 0) <= 0) return 'none' as const
  const ratio = total / (limit ?? 1)
  if (ratio >= 1) return 'over' as const
  if (ratio >= .8) return 'near' as const
  return 'safe' as const
}

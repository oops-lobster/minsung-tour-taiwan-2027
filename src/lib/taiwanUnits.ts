export interface TaiwanMarketNumber {
  original: string
  meaning: string
  value?: string
  unit?: string
}

export interface TaiwanMarketCalculation {
  grams?: number
  ingredientCost?: number
  estimatedTotal?: number
}

export const taijinToGrams = (taijin: number) => Math.round(taijin * 600 * 10) / 10

export const calculateTaiwanMarketPrice = (pricePerTaijin: number, taijin: number, cookingFee = 0) => ({
  grams: taijinToGrams(taijin),
  ingredientCost: Math.round(pricePerTaijin * taijin),
  estimatedTotal: Math.round(pricePerTaijin * taijin + cookingFee),
})

function numeric(value?: string) {
  if (!value) return undefined
  const parsed = Number(value.replace(/[^0-9.\-]/g, ''))
  return Number.isFinite(parsed) ? parsed : undefined
}

export function deriveTaiwanMarketCalculation(numbers: TaiwanMarketNumber[]): TaiwanMarketCalculation | null {
  const pricePerTaijin = numbers.find((item) => /twd\s*\/\s*台?斤|每.*台?斤/i.test(`${item.unit ?? ''} ${item.meaning}`))
  const taijin = numbers.find((item) => /^(?:台?斤|jin)$/i.test(item.unit?.trim() ?? '') || /重量|무게/.test(item.meaning))
  const cookingFee = numbers.find((item) => /料理費|조리비/.test(`${item.original} ${item.meaning}`))
  const price = numeric(pricePerTaijin?.value)
  const weight = numeric(taijin?.value)
  const fee = numeric(cookingFee?.value) ?? 0
  if (price === undefined || weight === undefined) return null
  return calculateTaiwanMarketPrice(price, weight, fee)
}

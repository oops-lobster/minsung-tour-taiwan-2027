import { useMemo } from 'react'
import { AlertTriangle, CheckCircle2, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { calculateGuihouCart, getGuihouLimitState, type GuihouSeafoodItem } from '../lib/guihouPrice'
import type { GuihouFieldSession } from '../lib/useGuihouFieldSession'

const itemTypes = [
  ['사시미', '生魚片'], ['생선', '魚'], ['오징어', '小卷／透抽'], ['새우', '蝦'], ['조개', '貝類'], ['게', '螃蟹'], ['기타', '其他'],
] as const

const money = (value: number) => `NT$${Math.round(value).toLocaleString('ko-KR')}`
const parseOptionalNumber = (value: string) => value === '' ? undefined : Number(value)

interface GuihouPriceCalculatorProps {
  session: GuihouFieldSession
  update: (recipe: (current: GuihouFieldSession) => GuihouFieldSession) => void
}

export function GuihouPriceCalculator({ session, update }: GuihouPriceCalculatorProps) {
  const cart = useMemo(() => calculateGuihouCart(session.items), [session.items])
  const limitState = getGuihouLimitState(cart.total, session.mealLimit)

  const addItem = (nameKo: string, nameZh: string) => update((current) => ({
    ...current,
    items: [...current.items, { id: crypto.randomUUID(), nameKo, nameZh, priceMode: 'per-taijin', confirmed: false }],
  }))

  const updateItem = (id: string, patch: Partial<GuihouSeafoodItem>) => update((current) => ({
    ...current,
    items: current.items.map((item) => item.id === id ? { ...item, ...patch } : item),
  }))

  const removeItem = (id: string) => {
    if (!window.confirm('이 항목을 계산 목록에서 지울까요?')) return
    update((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }))
  }

  return (
    <section className="guihou-calculator" aria-labelledby="guihou-calculator-title">
      <header className="guihou-section-heading">
        <span>DETERMINISTIC · LOCAL ONLY</span>
        <h2 id="guihou-calculator-title">가격 계산</h2>
        <p>1台斤은 정확히 600g입니다. 계산과 오늘 상한선은 이 기기에만 저장되고 AI나 Supabase로 전송되지 않습니다.</p>
      </header>

      <section className="guihou-limit-card" aria-labelledby="guihou-limit-title">
        <ShieldCheck aria-hidden="true" />
        <div><h3 id="guihou-limit-title">오늘 상한선 설정</h3><p>개인 숫자는 공개 사이트 코드에 남지 않아요.</p></div>
        <label htmlFor="guihou-meal-limit"><span>NT$</span><input id="guihou-meal-limit" type="number" min="0" step="100" inputMode="numeric" value={session.mealLimit ?? ''} placeholder="이 기기에만 저장" onChange={(event) => update((current) => ({ ...current, mealLimit: parseOptionalNumber(event.target.value) }))} /></label>
      </section>

      <div className="guihou-item-quick-add" role="group" aria-label="해산물 빠른 추가">
        {itemTypes.map(([ko, zh]) => <button type="button" onClick={() => addItem(ko, zh)} key={ko}><Plus aria-hidden="true" /> {ko}</button>)}
      </div>

      <div className="guihou-item-list">
        {session.items.map((item, index) => {
          const line = cart.lines[index].calculation
          return (
            <fieldset className={`guihou-item-card ${item.confirmed ? 'is-confirmed' : ''}`} key={item.id}>
              <legend>{index + 1}. {item.nameKo}</legend>
              <div className="guihou-item-card__grid">
                <label><span>항목 이름</span><input value={item.nameKo} onChange={(event) => updateItem(item.id, { nameKo: event.target.value })} /></label>
                <label><span>중국어</span><input lang="zh-Hant" value={item.nameZh ?? ''} onChange={(event) => updateItem(item.id, { nameZh: event.target.value })} /></label>
                <label><span>1층 점포번호</span><input type="number" min="1" inputMode="numeric" value={item.stallNo ?? ''} onChange={(event) => updateItem(item.id, { stallNo: parseOptionalNumber(event.target.value) })} /></label>
                <label><span>가격 방식</span><select value={item.priceMode} onChange={(event) => updateItem(item.id, { priceMode: event.target.value as GuihouSeafoodItem['priceMode'] })}><option value="per-taijin">NT$ / 台斤</option><option value="per-kg">NT$ / kg</option><option value="fixed">고정 가격</option></select></label>
                {item.priceMode === 'fixed' ? (
                  <label><span>고정 가격 NT$</span><input type="number" min="0" inputMode="decimal" value={item.fixedPrice ?? ''} onChange={(event) => updateItem(item.id, { fixedPrice: parseOptionalNumber(event.target.value) })} /></label>
                ) : (
                  <>
                    <label><span>단가 NT$ / {item.priceMode === 'per-taijin' ? '台斤' : 'kg'}</span><input type="number" min="0" inputMode="decimal" value={item.unitPrice ?? ''} onChange={(event) => updateItem(item.id, { unitPrice: parseOptionalNumber(event.target.value) })} /></label>
                    {item.priceMode === 'per-taijin'
                      ? <label><span>무게 台斤</span><input type="number" min="0" step="0.1" inputMode="decimal" value={item.weightTaijin ?? ''} onChange={(event) => updateItem(item.id, { weightTaijin: parseOptionalNumber(event.target.value) })} /></label>
                      : <label><span>무게 g</span><input type="number" min="0" inputMode="decimal" value={item.weightGrams ?? ''} onChange={(event) => updateItem(item.id, { weightGrams: parseOptionalNumber(event.target.value) })} /></label>}
                  </>
                )}
                <label><span>조리 방법</span><input value={item.cookingMethod ?? ''} placeholder="찜·구이·사시미" onChange={(event) => updateItem(item.id, { cookingMethod: event.target.value })} /></label>
                <label><span>조리비 NT$</span><input type="number" min="0" inputMode="decimal" value={item.cookingFee ?? ''} onChange={(event) => updateItem(item.id, { cookingFee: parseOptionalNumber(event.target.value) })} /></label>
              </div>
              <div className="guihou-item-card__total" aria-live="polite">
                <span>재료 {money(line.ingredientCost)}</span><span>조리 {money(line.cookingFee)}</span><strong>합계 {money(line.total)}</strong>{line.grams !== undefined && <small>{line.grams.toLocaleString('ko-KR')}g</small>}
              </div>
              {!line.valid && <p className="guihou-item-card__issue"><AlertTriangle aria-hidden="true" /> {line.issue}</p>}
              <div className="guihou-item-card__actions"><label className="guihou-confirm-check"><input type="checkbox" checked={Boolean(item.confirmed)} onChange={(event) => updateItem(item.id, { confirmed: event.target.checked })} /><span><CheckCircle2 aria-hidden="true" /> 가격·무게·조리비 확인 완료</span></label><button type="button" onClick={() => removeItem(item.id)}><Trash2 aria-hidden="true" /> 삭제</button></div>
            </fieldset>
          )
        })}
        {session.items.length === 0 && <div className="guihou-empty">위 버튼으로 첫 항목을 추가하세요. 예: 사시미 → 단가 → 무게 → 조리비.</div>}
      </div>

      <aside className={`guihou-cart-total is-${limitState}`} aria-live="polite">
        <div><span>재료비 예상</span><strong>{money(cart.ingredientCost)}</strong></div>
        <div><span>조리비</span><strong>{money(cart.cookingFee)}</strong></div>
        <div className="is-total"><span>예상 합계</span><strong>{money(cart.total)}</strong></div>
        {limitState === 'near' && <p><AlertTriangle aria-hidden="true" /> 이 기기에 설정한 상한선의 80%를 넘었습니다.</p>}
        {limitState === 'over' && <p><AlertTriangle aria-hidden="true" /> 이 기기에 설정한 오늘 상한선을 넘었습니다. 손질 전에 다시 확인하세요.</p>}
      </aside>
    </section>
  )
}

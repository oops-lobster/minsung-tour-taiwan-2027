import { useMemo, useState } from 'react'
import { LockKeyhole, Plus, Trash2, X } from 'lucide-react'

const STORAGE_KEY = 'minsung-tour-expenses-v2'
const PIN = '250818'
const categories = ['식사', '술', '교통', '관광', '쇼핑', '기타'] as const
type ExpenseCategory = typeof categories[number]

interface Expense {
  id: string
  amount: number
  category: ExpenseCategory
  note: string
  createdAt: string
}

const loadExpenses = (): Expense[] => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) as Expense[] : []
  } catch {
    return []
  }
}

const taipeiDateKey = (date: Date) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Taipei',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(date)

export function ExpenseManager({ exchangeRate }: { exchangeRate: number }) {
  const [open, setOpen] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('식사')
  const [note, setNote] = useState('')
  const [formMessage, setFormMessage] = useState('')

  const saveExpenses = (next: Expense[]) => {
    setExpenses(next)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const close = () => {
    setOpen(false)
    setUnlocked(false)
    setPin('')
    setPinError('')
    setFormMessage('')
  }

  const unlock = (event: React.FormEvent) => {
    event.preventDefault()
    if (pin !== PIN) {
      setPinError('PIN이 맞지 않습니다.')
      return
    }
    setUnlocked(true)
    setPinError('')
  }

  const addExpense = (event: React.FormEvent) => {
    event.preventDefault()
    const parsedAmount = Number(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormMessage('0보다 큰 TWD 금액을 입력해 주세요.')
      return
    }
    const next: Expense[] = [{
      id: crypto.randomUUID(),
      amount: parsedAmount,
      category,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    }, ...expenses]
    saveExpenses(next)
    setAmount('')
    setNote('')
    setFormMessage('지출을 저장했습니다.')
  }

  const removeExpense = (expense: Expense) => {
    if (!window.confirm(`${expense.amount.toLocaleString()} TWD 기록을 삭제할까요?`)) return
    saveExpenses(expenses.filter((item) => item.id !== expense.id))
  }

  const todayKey = taipeiDateKey(new Date())
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const todayTotal = expenses
    .filter((expense) => taipeiDateKey(new Date(expense.createdAt)) === todayKey)
    .reduce((sum, expense) => sum + expense.amount, 0)
  const categoryTotals = useMemo(() => categories.map((item) => ({
    category: item,
    total: expenses.filter((expense) => expense.category === item).reduce((sum, expense) => sum + expense.amount, 0),
  })), [expenses])

  return (
    <>
      <button className="private-access" type="button" onClick={() => setOpen(true)} aria-label="민성 모드 열기">
        <LockKeyhole size={18} aria-hidden="true" />
        <span>민성 모드</span>
      </button>
      {open && (
        <div className="private-modal" role="dialog" aria-modal="true" aria-labelledby="private-title">
          <button className="private-modal__scrim" type="button" onClick={close} aria-label="민성 모드 닫기" />
          <section className="private-modal__panel">
            <header>
              <div><small>PRIVATE LOCAL LEDGER</small><h2 id="private-title">민성 모드</h2></div>
              <button type="button" onClick={close} aria-label="닫기"><X size={22} aria-hidden="true" /></button>
            </header>
            {!unlocked ? (
              <form className="pin-form" onSubmit={unlock}>
                <LockKeyhole size={34} strokeWidth={1.5} aria-hidden="true" />
                <p>현지 지출 관리만 잠금 뒤에 표시됩니다.</p>
                <label htmlFor="private-pin">6자리 PIN</label>
                <input
                  id="private-pin"
                  type="password"
                  value={pin}
                  onChange={(event) => setPin(event.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="off"
                  autoFocus
                  aria-invalid={Boolean(pinError)}
                  aria-describedby="pin-error"
                />
                <p className="form-message form-message--error" id="pin-error" role="alert">{pinError}</p>
                <button type="submit">잠금 해제</button>
              </form>
            ) : (
              <div className="expense-manager">
                <div className="expense-summary">
                  <div><span>오늘 지출</span><strong>{todayTotal.toLocaleString()} TWD</strong></div>
                  <div><span>누적 지출</span><strong>{total.toLocaleString()} TWD</strong></div>
                  <div><span>원화 환산</span><strong>약 {Math.round(total * exchangeRate).toLocaleString()}원</strong></div>
                </div>
                <form className="expense-form" onSubmit={addExpense}>
                  <div>
                    <label htmlFor="expense-amount">금액 (TWD)</label>
                    <input id="expense-amount" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" />
                  </div>
                  <div>
                    <label htmlFor="expense-category">카테고리</label>
                    <select id="expense-category" value={category} onChange={(event) => setCategory(event.target.value as ExpenseCategory)}>
                      {categories.map((item) => <option value={item} key={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="expense-form__note">
                    <label htmlFor="expense-note">메모</label>
                    <input id="expense-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={80} />
                  </div>
                  <button type="submit"><Plus size={18} aria-hidden="true" /> 지출 추가</button>
                  <p className="form-message" aria-live="polite">{formMessage}</p>
                </form>
                <section className="expense-ratios" aria-labelledby="expense-ratio-title">
                  <h3 id="expense-ratio-title">카테고리별 비율</h3>
                  {categoryTotals.map((item) => {
                    const percentage = total ? Math.round((item.total / total) * 100) : 0
                    return (
                      <div className="expense-ratio" key={item.category}>
                        <span>{item.category}</span><strong>{percentage}%</strong>
                        <i><b style={{ width: `${percentage}%` }} /></i>
                      </div>
                    )
                  })}
                </section>
                <section className="expense-history" aria-labelledby="expense-history-title">
                  <h3 id="expense-history-title">최근 기록</h3>
                  {expenses.length === 0 && <p>아직 저장된 지출이 없습니다.</p>}
                  {expenses.map((expense) => (
                    <article key={expense.id}>
                      <div><strong>{expense.amount.toLocaleString()} TWD</strong><span>{expense.category}{expense.note ? ` · ${expense.note}` : ''}</span></div>
                      <button type="button" onClick={() => removeExpense(expense)} aria-label={`${expense.amount} TWD 지출 삭제`}><Trash2 size={18} aria-hidden="true" /></button>
                    </article>
                  ))}
                </section>
                <p className="privacy-note">이 기기에만 저장됩니다. 카드번호·계좌정보·예약번호는 입력하거나 저장하지 마세요.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  )
}

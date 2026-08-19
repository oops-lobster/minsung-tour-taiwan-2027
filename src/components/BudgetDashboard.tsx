import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  LockKeyhole,
  LogOut,
  Pencil,
  Plus,
  ReceiptText,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Trash2,
  WalletCards,
  X,
} from 'lucide-react'
import { BudgetApiError, callBudgetApi, isBudgetApiConfigured, PRIVATE_SESSION_KEY } from '../lib/supabase'
import { MinsungTasks } from './MinsungTasks'
import type {
  BudgetItem,
  BudgetSnapshot,
  Currency,
  Expense,
  Reservation,
  ReservationPayment,
  TripSettings,
} from '../types/budget'

const dayOptions = ['한국 출국', 'Day 1', 'Day 2', 'Day 3', 'Day 4', '공통', '한국 귀국']
const categoryOptions = ['교통', '식비/주류', '관광/체험', '카페/간식', '쇼핑/기타', '예비비']

const krw = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 })
const number = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 })

function convertToKrw(amount: number, currency: Currency, rate: number) {
  return currency === 'KRW' ? amount : amount * rate
}

function money(amount: number, currency: Currency) {
  return currency === 'KRW' ? krw.format(amount) : `NT$${number.format(amount)}`
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    reservation_in_progress: '예약 절차 진행 중',
    deposit_bank_approval_pending: '예약금 송금 승인 대기',
    bank_approval_pending: '은행 승인 대기',
    scheduled: '예정',
    paid: '결제 완료',
    pending: '지불 예정',
  }
  return labels[status] ?? status.replaceAll('_', ' ')
}

function apiMessage(error: unknown) {
  return error instanceof Error ? error.message : '요청을 처리하지 못했습니다.'
}

type BudgetDraft = Pick<BudgetItem, 'trip_day' | 'category' | 'item_name' | 'currency' | 'planned_amount' | 'status' | 'priority' | 'vendor' | 'memo' | 'sort_order'> & { id?: string }
type ExpenseDraft = Pick<Expense, 'spent_at' | 'trip_day' | 'category' | 'item_name' | 'currency' | 'amount' | 'payment_method' | 'payment_status' | 'vendor' | 'memo' | 'budget_item_id'> & { id?: string }

function BudgetItemSheet({ item, nextOrder, onClose, onSave }: {
  item: BudgetItem | null
  nextOrder: number
  onClose: () => void
  onSave: (draft: BudgetDraft) => Promise<void>
}) {
  const [draft, setDraft] = useState<BudgetDraft>(() => item ? {
    id: item.id,
    trip_day: item.trip_day,
    category: item.category,
    item_name: item.item_name,
    currency: item.currency,
    planned_amount: Number(item.planned_amount),
    status: item.status,
    priority: item.priority,
    vendor: item.vendor,
    memo: item.memo,
    sort_order: item.sort_order,
  } : {
    trip_day: 'Day 1', category: '교통', item_name: '', currency: 'TWD', planned_amount: 0,
    status: '예정', priority: 1, vendor: '', memo: '', sort_order: nextOrder,
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [onClose])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await onSave(draft)
      onClose()
    } catch (error) {
      setMessage(apiMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="private-modal" role="dialog" aria-modal="true" aria-labelledby="budget-item-sheet-title">
      <button className="private-modal__scrim" type="button" onClick={onClose} aria-label="닫기" />
      <section className="private-modal__panel budget-sheet">
        <header><div><small>PLAN ITEM</small><h2 id="budget-item-sheet-title">{item ? '계획 예산 수정' : '계획 예산 추가'}</h2></div><button type="button" onClick={onClose} aria-label="닫기"><X size={20} /></button></header>
        <form className="budget-editor-form" onSubmit={submit}>
          <label>Day<select value={draft.trip_day} onChange={(event) => setDraft({ ...draft, trip_day: event.target.value })}>{dayOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>카테고리<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{categoryOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="budget-editor-form__wide">항목명<input required value={draft.item_name} onChange={(event) => setDraft({ ...draft, item_name: event.target.value })} /></label>
          <label>통화<select value={draft.currency} onChange={(event) => setDraft({ ...draft, currency: event.target.value as Currency })}><option>KRW</option><option>TWD</option></select></label>
          <label>계획 금액<input required min="0" step="0.01" inputMode="decimal" type="number" value={draft.planned_amount} onChange={(event) => setDraft({ ...draft, planned_amount: Number(event.target.value) })} /></label>
          <label>상태<input required value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })} /></label>
          <label>업체<input value={draft.vendor ?? ''} onChange={(event) => setDraft({ ...draft, vendor: event.target.value })} /></label>
          <label className="budget-editor-form__wide">메모<textarea rows={3} value={draft.memo ?? ''} onChange={(event) => setDraft({ ...draft, memo: event.target.value })} /></label>
          {message && <p className="form-message form-message--error" role="alert">{message}</p>}
          <button className="budget-save-button" type="submit" disabled={saving}>{saving ? '저장 중…' : 'Supabase에 저장'}</button>
        </form>
      </section>
    </div>
  )
}

function ExpenseSheet({ expense, settings, budgetItems, onClose, onSave }: {
  expense: Expense | null
  settings: TripSettings
  budgetItems: BudgetItem[]
  onClose: () => void
  onSave: (draft: ExpenseDraft) => Promise<void>
}) {
  const [draft, setDraft] = useState<ExpenseDraft>(() => expense ? {
    id: expense.id,
    spent_at: expense.spent_at,
    trip_day: expense.trip_day,
    category: expense.category,
    item_name: expense.item_name,
    currency: expense.currency,
    amount: Number(expense.amount),
    payment_method: expense.payment_method,
    payment_status: expense.payment_status,
    vendor: expense.vendor,
    memo: expense.memo,
    budget_item_id: expense.budget_item_id,
  } : {
    spent_at: settings.start_date, trip_day: 'Day 1', category: '교통', item_name: '', currency: 'TWD', amount: 0,
    payment_method: '현금', payment_status: 'paid', vendor: '', memo: '', budget_item_id: null,
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [onClose])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await onSave(draft)
      onClose()
    } catch (error) {
      setMessage(apiMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="private-modal" role="dialog" aria-modal="true" aria-labelledby="expense-sheet-title">
      <button className="private-modal__scrim" type="button" onClick={onClose} aria-label="닫기" />
      <section className="private-modal__panel budget-sheet">
        <header><div><small>ACTUAL EXPENSE</small><h2 id="expense-sheet-title">{expense ? '실제 지출 수정' : '실제 지출 추가'}</h2></div><button type="button" onClick={onClose} aria-label="닫기"><X size={20} /></button></header>
        <form className="budget-editor-form" onSubmit={submit}>
          <label>날짜<input required type="date" min={settings.start_date} max={settings.end_date} value={draft.spent_at} onChange={(event) => setDraft({ ...draft, spent_at: event.target.value })} /></label>
          <label>Day<select value={draft.trip_day} onChange={(event) => setDraft({ ...draft, trip_day: event.target.value })}>{dayOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>카테고리<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{categoryOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="budget-editor-form__wide">항목명<input required value={draft.item_name} onChange={(event) => setDraft({ ...draft, item_name: event.target.value })} /></label>
          <label>통화<select value={draft.currency} onChange={(event) => setDraft({ ...draft, currency: event.target.value as Currency })}><option>KRW</option><option>TWD</option></select></label>
          <label>금액<input required min="0" step="0.01" inputMode="decimal" type="number" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: Number(event.target.value) })} /></label>
          <label>결제수단<input value={draft.payment_method ?? ''} onChange={(event) => setDraft({ ...draft, payment_method: event.target.value })} /></label>
          <label>지불상태<select value={draft.payment_status} onChange={(event) => setDraft({ ...draft, payment_status: event.target.value })}><option value="paid">결제 완료</option><option value="pending">지불 예정</option></select></label>
          <label>업체<input value={draft.vendor ?? ''} onChange={(event) => setDraft({ ...draft, vendor: event.target.value })} /></label>
          <label className="budget-editor-form__wide">계획 항목 연결<select value={draft.budget_item_id ?? ''} onChange={(event) => setDraft({ ...draft, budget_item_id: event.target.value || null })}><option value="">연결하지 않음</option>{budgetItems.map((item) => <option value={item.id} key={item.id}>{item.trip_day} · {item.item_name}</option>)}</select></label>
          <label className="budget-editor-form__wide">메모<textarea rows={3} value={draft.memo ?? ''} onChange={(event) => setDraft({ ...draft, memo: event.target.value })} /></label>
          {message && <p className="form-message form-message--error" role="alert">{message}</p>}
          <button className="budget-save-button" type="submit" disabled={saving}>{saving ? '저장 중…' : 'Supabase에 저장'}</button>
        </form>
      </section>
    </div>
  )
}

function SettingsCard({ settings, onSave }: { settings: TripSettings; onSave: (values: Pick<TripSettings, 'total_budget_krw' | 'twd_krw_rate'>) => Promise<void> }) {
  const [total, setTotal] = useState(settings.total_budget_krw)
  const [rate, setRate] = useState(settings.twd_krw_rate)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => { setTotal(settings.total_budget_krw); setRate(settings.twd_krw_rate) }, [settings])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await onSave({ total_budget_krw: total, twd_krw_rate: rate })
      setMessage('저장했습니다.')
    } catch (error) {
      setMessage(apiMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <details className="budget-settings">
      <summary><Settings2 size={19} /> 기준 설정 <span>예산·환율</span></summary>
      <form onSubmit={submit}>
        <label>총 예산 (KRW)<input min="0" inputMode="numeric" type="number" value={total} onChange={(event) => setTotal(Number(event.target.value))} /></label>
        <label>TWD/KRW 기준환율<input min="0.01" step="0.01" inputMode="decimal" type="number" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></label>
        <button type="submit" disabled={saving}>{saving ? '저장 중…' : '설정 저장'}</button>
        {message && <p className="form-message" aria-live="polite">{message}</p>}
      </form>
    </details>
  )
}

function ReservationCard({ reservation, payments, rate, onPaymentChange }: {
  reservation: Reservation
  payments: ReservationPayment[]
  rate: number
  onPaymentChange: (payment: ReservationPayment, status: string) => Promise<void>
}) {
  const paid = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + Number(payment.amount), 0)
  const outstanding = Math.max(0, Number(reservation.total_amount) - paid)
  const progress = reservation.total_amount > 0 ? Math.min(100, paid / Number(reservation.total_amount) * 100) : 0

  return (
    <article className="reservation-budget-card">
      <header><div><small>{reservation.service_dates.join(' · ')}</small><h3>{reservation.vendor}</h3><p>{reservation.service_name}</p></div><span>{statusLabel(reservation.status)}</span></header>
      <div className="reservation-budget-card__total"><strong>{money(Number(reservation.total_amount), reservation.currency)}</strong><small>{krw.format(convertToKrw(Number(reservation.total_amount), reservation.currency, rate))}</small></div>
      <div className="reservation-progress" aria-label={`결제 진행률 ${Math.round(progress)}%`}><i style={{ width: `${progress}%` }} /></div>
      <p className="reservation-progress__legend"><span>결제 {money(paid, reservation.currency)}</span><strong>남음 {money(outstanding, reservation.currency)}</strong></p>
      <div className="reservation-payment-list">
        {payments.map((payment) => (
          <label key={payment.id}>
            <span><strong>{payment.label}</strong><small>{payment.due_date ?? '일정 확인 중'} · {money(Number(payment.amount), payment.currency)}</small></span>
            <select aria-label={`${payment.label} 상태`} value={payment.status} onChange={(event) => void onPaymentChange(payment, event.target.value)}>
              <option value="scheduled">예정</option><option value="bank_approval_pending">은행 승인 대기</option><option value="paid">결제 완료</option>
            </select>
          </label>
        ))}
      </div>
      {reservation.memo && <p className="reservation-budget-card__memo">{reservation.memo}</p>}
    </article>
  )
}

function PrivateAreaHeader({ mode, loading, onRefresh, onLock }: {
  mode: 'budget' | 'minsung'
  loading: boolean
  onRefresh?: () => void
  onLock: () => void
}) {
  return (
    <section className="budget-dashboard__hero">
      <div className="page-shell">
        <div><small>PRIVATE TRAVEL DESK · SUPABASE LIVE</small><h1>{mode === 'budget' ? '가족여행 예산' : '민성이 챙길 것'}</h1><p>{mode === 'budget' ? 'Excel은 백업으로 남기고, 지금부터 이 화면을 운영 원본으로 사용합니다.' : '생각나면 추가하고, 끝나면 체크하는 작은 여행 준비 노트입니다.'}</p></div>
        <div className="budget-dashboard__actions">{onRefresh && <button type="button" onClick={onRefresh} disabled={loading}><RefreshCw className={loading ? 'is-spinning' : ''} size={18} /> 새로고침</button>}<button type="button" onClick={onLock}><LogOut size={18} /> 잠그기</button></div>
      </div>
      <nav className="private-area-tabs page-shell" aria-label="개인 관리 메뉴"><a className={mode === 'budget' ? 'is-active' : ''} href="#budget" aria-current={mode === 'budget' ? 'page' : undefined}><WalletCards size={18} /> 예산</a><a className={mode === 'minsung' ? 'is-active' : ''} href="#minsung" aria-current={mode === 'minsung' ? 'page' : undefined}><CheckCircle2 size={18} /> 민성</a></nav>
    </section>
  )
}

export function BudgetDashboard({ mode = 'budget' }: { mode?: 'budget' | 'minsung' }) {
  const [sessionToken, setSessionToken] = useState(() => window.sessionStorage.getItem(PRIVATE_SESSION_KEY) ?? '')
  const [snapshot, setSnapshot] = useState<BudgetSnapshot | null>(null)
  const [loading, setLoading] = useState(Boolean(sessionToken && mode === 'budget'))
  const [message, setMessage] = useState('')
  const [pin, setPin] = useState('')
  const [unlocking, setUnlocking] = useState(false)
  const [dayFilter, setDayFilter] = useState('전체')
  const [categoryFilter, setCategoryFilter] = useState('전체')
  const [budgetSheet, setBudgetSheet] = useState<BudgetItem | 'new' | null>(null)
  const [expenseSheet, setExpenseSheet] = useState<Expense | 'new' | null>(null)

  const expireSession = useCallback(() => {
    window.sessionStorage.removeItem(PRIVATE_SESSION_KEY)
    setSessionToken('')
    setSnapshot(null)
  }, [])

  const loadSnapshot = useCallback(async (token: string) => {
    setLoading(true)
    setMessage('')
    try {
      const result = await callBudgetApi<{ ok: true; data: BudgetSnapshot }>('snapshot', {}, token)
      setSnapshot(result.data)
    } catch (error) {
      if (error instanceof BudgetApiError && (error.status === 401 || error.code === 'session_expired')) expireSession()
      setMessage(apiMessage(error))
    } finally {
      setLoading(false)
    }
  }, [expireSession])

  useEffect(() => { if (sessionToken && mode === 'budget') void loadSnapshot(sessionToken) }, [sessionToken, mode, loadSnapshot])

  const unlock = async (event: FormEvent) => {
    event.preventDefault()
    setUnlocking(true)
    setMessage('')
    try {
      const result = await callBudgetApi<{ ok: true; token: string; expires_at: string }>('unlock', { pin })
      window.sessionStorage.setItem(PRIVATE_SESSION_KEY, result.token)
      setSessionToken(result.token)
      setPin('')
    } catch (error) {
      setMessage(apiMessage(error))
    } finally {
      setUnlocking(false)
    }
  }

  const lock = async () => {
    if (sessionToken) void callBudgetApi('lock', {}, sessionToken).catch(() => undefined)
    expireSession()
  }

  const metrics = useMemo(() => {
    if (!snapshot) return null
    const rate = Number(snapshot.settings.twd_krw_rate)
    const planned = snapshot.budgetItems.reduce((sum, item) => sum + convertToKrw(Number(item.planned_amount), item.currency, rate), 0)
    const actual = snapshot.expenses.reduce((sum, expense) => sum + convertToKrw(Number(expense.amount), expense.currency, rate), 0)
    const paidStatuses = new Set(['paid', 'completed'])
    const unpaid = snapshot.reservationPayments.filter((payment) => !paidStatuses.has(payment.status)).reduce((sum, payment) => sum + convertToKrw(Number(payment.amount), payment.currency, rate), 0)
    const reserve = Math.max(0, Number(snapshot.settings.total_budget_krw) - planned)
    return { planned, actual, unpaid, reserve, remaining: Number(snapshot.settings.total_budget_krw) - actual, roomRate: snapshot.settings.total_budget_krw > 0 ? reserve / Number(snapshot.settings.total_budget_krw) * 100 : 0 }
  }, [snapshot])

  const filteredItems = useMemo(() => snapshot?.budgetItems.filter((item) => (dayFilter === '전체' || item.trip_day === dayFilter) && (categoryFilter === '전체' || item.category === categoryFilter)) ?? [], [snapshot, dayFilter, categoryFilter])

  const saveBudgetItem = async (draft: BudgetDraft) => {
    const result = await callBudgetApi<{ ok: true; item: BudgetItem }>('budget_item_upsert', { item: draft }, sessionToken)
    setSnapshot((current) => current ? { ...current, budgetItems: draft.id ? current.budgetItems.map((item) => item.id === result.item.id ? result.item : item) : [...current.budgetItems, result.item] } : current)
  }

  const deleteBudgetItem = async (item: BudgetItem) => {
    if (!window.confirm(`‘${item.item_name}’ 계획을 삭제할까요?`)) return
    const previous = snapshot
    setSnapshot((current) => current ? { ...current, budgetItems: current.budgetItems.filter((entry) => entry.id !== item.id) } : current)
    try {
      await callBudgetApi('budget_item_delete', { id: item.id }, sessionToken)
    } catch (error) {
      setSnapshot(previous)
      setMessage(`삭제를 되돌렸습니다. ${apiMessage(error)}`)
    }
  }

  const saveExpense = async (draft: ExpenseDraft) => {
    const result = await callBudgetApi<{ ok: true; expense: Expense }>('expense_upsert', { expense: draft }, sessionToken)
    setSnapshot((current) => current ? { ...current, expenses: draft.id ? current.expenses.map((expense) => expense.id === result.expense.id ? result.expense : expense) : [result.expense, ...current.expenses] } : current)
  }

  const deleteExpense = async (expense: Expense) => {
    if (!window.confirm(`‘${expense.item_name}’ 지출을 삭제할까요?`)) return
    const previous = snapshot
    setSnapshot((current) => current ? { ...current, expenses: current.expenses.filter((entry) => entry.id !== expense.id) } : current)
    try {
      await callBudgetApi('expense_delete', { id: expense.id }, sessionToken)
    } catch (error) {
      setSnapshot(previous)
      setMessage(`삭제를 되돌렸습니다. ${apiMessage(error)}`)
    }
  }

  const updatePayment = async (payment: ReservationPayment, status: string) => {
    const previous = snapshot
    const optimistic = { ...payment, status, paid_at: status === 'paid' ? new Date().toISOString().slice(0, 10) : null }
    setSnapshot((current) => current ? { ...current, reservationPayments: current.reservationPayments.map((entry) => entry.id === payment.id ? optimistic : entry) } : current)
    try {
      const result = await callBudgetApi<{ ok: true; payment: ReservationPayment }>('reservation_payment_update', { payment: { id: payment.id, status, paid_at: optimistic.paid_at } }, sessionToken)
      setSnapshot((current) => current ? { ...current, reservationPayments: current.reservationPayments.map((entry) => entry.id === payment.id ? result.payment : entry) } : current)
    } catch (error) {
      setSnapshot(previous)
      setMessage(`결제 상태를 되돌렸습니다. ${apiMessage(error)}`)
    }
  }

  const saveSettings = async (values: Pick<TripSettings, 'total_budget_krw' | 'twd_krw_rate'>) => {
    const previous = snapshot
    setSnapshot((current) => current ? { ...current, settings: { ...current.settings, ...values } } : current)
    try {
      const result = await callBudgetApi<{ ok: true; settings: TripSettings }>('settings_update', { settings: values }, sessionToken)
      setSnapshot((current) => current ? { ...current, settings: result.settings } : current)
    } catch (error) {
      setSnapshot(previous)
      throw error
    }
  }

  if (!sessionToken) {
    return (
      <div className="portal-view budget-dashboard budget-dashboard--locked">
        <section className="budget-lock" aria-labelledby="budget-lock-title">
          <div className="page-shell">
            <span className="budget-lock__icon"><LockKeyhole size={30} /></span>
            <small>PRIVATE BUDGET</small>
            <h1 id="budget-lock-title">{mode === 'budget' ? '가족여행 예산' : '민성이 챙길 것'}</h1>
            <p>개인 여행 관리는 PIN을 입력하면 열립니다.</p>
            {!isBudgetApiConfigured ? <p className="form-message form-message--error">배포 환경의 Supabase 공개 변수를 확인해 주세요.</p> : (
              <form className="budget-pin-form" onSubmit={unlock}>
                <label htmlFor="budget-pin">6자리 PIN</label>
                <input id="budget-pin" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))} autoFocus />
                <button type="submit" disabled={unlocking || pin.length !== 6}>{unlocking ? '확인 중…' : '열기'}</button>
              </form>
            )}
            {message && <p className="form-message form-message--error" role="alert">{message}</p>}
            <span className="budget-lock__privacy"><ShieldCheck size={16} /> 계좌·카드·여권 정보는 저장하지 않습니다.</span>
          </div>
        </section>
      </div>
    )
  }

  if (mode === 'minsung') {
    return (
      <div className="portal-view budget-dashboard">
        <PrivateAreaHeader mode="minsung" loading={false} onLock={() => void lock()} />
        <MinsungTasks sessionToken={sessionToken} onSessionExpired={expireSession} />
      </div>
    )
  }

  if (loading && !snapshot) return <div className="budget-loading" role="status"><RefreshCw className="is-spinning" size={26} /> 예산을 안전하게 불러오는 중…</div>
  if (!snapshot || !metrics) return <div className="budget-loading budget-loading--error"><p>{message || '예산 데이터를 불러오지 못했습니다.'}</p><button type="button" onClick={() => void loadSnapshot(sessionToken)}>다시 시도</button><button type="button" onClick={expireSession}>PIN 다시 입력</button></div>

  const rate = Number(snapshot.settings.twd_krw_rate)
  const nextOrder = Math.max(0, ...snapshot.budgetItems.map((item) => item.sort_order)) + 10

  return (
    <div className="portal-view budget-dashboard">
      <PrivateAreaHeader mode="budget" loading={loading} onRefresh={() => void loadSnapshot(sessionToken)} onLock={() => void lock()} />

      <section className="budget-workspace section-pad">
        <div className="page-shell">
          {message && <div className="budget-alert" role="alert"><span>{message}</span><button type="button" onClick={() => setMessage('')} aria-label="알림 닫기"><X size={17} /></button></div>}

          <div className="budget-metrics">
            <article><WalletCards size={20} /><span>총 예산</span><strong>{krw.format(Number(snapshot.settings.total_budget_krw))}</strong></article>
            <article><CalendarDays size={20} /><span>계획 합계</span><strong>{krw.format(metrics.planned)}</strong></article>
            <article><ReceiptText size={20} /><span>실제 지출</span><strong>{krw.format(metrics.actual)}</strong></article>
            <article className={metrics.remaining < 0 ? 'is-over' : ''}><CircleDollarSign size={20} /><span>남은 예산</span><strong>{krw.format(metrics.remaining)}</strong></article>
          </div>

          <div className="budget-secondary-metrics">
            <p><span>기준환율</span><strong>NT$1 = {number.format(rate)}원</strong></p>
            <p><span>예약 미지급</span><strong>{krw.format(metrics.unpaid)}</strong></p>
            <p><span>예비비</span><strong>{krw.format(metrics.reserve)}</strong></p>
            <p><span>계획 대비 여유</span><strong>{number.format(metrics.roomRate)}%</strong></p>
          </div>

          <SettingsCard settings={snapshot.settings} onSave={saveSettings} />

          <section className="budget-section" aria-labelledby="budget-plan-title">
            <header className="budget-section__header"><div><small>PLAN</small><h2 id="budget-plan-title">계획 예산</h2><p>{snapshot.budgetItems.length}개 항목 · 현재 환율로 원화 환산</p></div><button type="button" onClick={() => setBudgetSheet('new')}><Plus size={18} /> 항목 추가</button></header>
            <div className="budget-filters">
              <label>Day<select value={dayFilter} onChange={(event) => setDayFilter(event.target.value)}><option>전체</option>{dayOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
              <label>카테고리<select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option>전체</option>{categoryOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
            </div>
            {filteredItems.length === 0 ? <p className="budget-empty">선택한 조건에 맞는 계획 항목이 없습니다.</p> : (
              <div className="budget-item-list">
                {filteredItems.map((item) => (
                  <article key={item.id}>
                    <div className="budget-item-list__meta"><span>{item.trip_day}</span><small>{item.category}</small></div>
                    <div className="budget-item-list__copy"><h3>{item.item_name}</h3><p>{item.vendor || '업체 미지정'} · {item.status}</p>{item.memo && <small>{item.memo}</small>}</div>
                    <div className="budget-item-list__amount"><strong>{money(Number(item.planned_amount), item.currency)}</strong><small>{krw.format(convertToKrw(Number(item.planned_amount), item.currency, rate))}</small></div>
                    <div className="budget-row-actions"><button type="button" onClick={() => setBudgetSheet(item)} aria-label={`${item.item_name} 수정`}><Pencil size={17} /></button><button type="button" onClick={() => void deleteBudgetItem(item)} aria-label={`${item.item_name} 삭제`}><Trash2 size={17} /></button></div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="budget-section" aria-labelledby="expense-title">
            <header className="budget-section__header"><div><small>ACTUAL</small><h2 id="expense-title">실제 지출</h2><p>현장에서 결제한 내역을 바로 기록합니다.</p></div><button className="expense-add-button" type="button" onClick={() => setExpenseSheet('new')}><Plus size={18} /> 지출 추가</button></header>
            {snapshot.expenses.length === 0 ? <p className="budget-empty"><ReceiptText size={24} />아직 실제 지출이 없습니다. 여행 중 첫 결제부터 여기에 기록해요.</p> : (
              <div className="expense-list">
                {snapshot.expenses.map((expense) => (
                  <article key={expense.id}><div><small>{expense.spent_at} · {expense.trip_day} · {expense.category}</small><h3>{expense.item_name}</h3><p>{expense.vendor || expense.payment_method || '결제 정보 없음'} · {statusLabel(expense.payment_status)}</p></div><strong>{money(Number(expense.amount), expense.currency)}<small>{krw.format(convertToKrw(Number(expense.amount), expense.currency, rate))}</small></strong><span className="budget-row-actions"><button type="button" onClick={() => setExpenseSheet(expense)} aria-label={`${expense.item_name} 수정`}><Pencil size={17} /></button><button type="button" onClick={() => void deleteExpense(expense)} aria-label={`${expense.item_name} 삭제`}><Trash2 size={17} /></button></span></article>
                ))}
              </div>
            )}
          </section>

          <section className="budget-section" aria-labelledby="reservation-budget-title">
            <header className="budget-section__header"><div><small>RESERVATIONS</small><h2 id="reservation-budget-title">예약·결제</h2><p>예약 상태와 분할 결제 일정을 함께 봅니다.</p></div><CreditCard size={25} /></header>
            <div className="reservation-budget-grid">
              {snapshot.reservations.map((reservation) => <ReservationCard key={reservation.id} reservation={reservation} payments={snapshot.reservationPayments.filter((payment) => payment.reservation_id === reservation.id)} rate={rate} onPaymentChange={updatePayment} />)}
            </div>
          </section>

          <p className="budget-source-note"><CheckCircle2 size={17} /> Supabase가 운영 원본입니다. 항공권·숙박비는 예산 범위에서 제외합니다.</p>
        </div>
      </section>

      {budgetSheet && <BudgetItemSheet item={budgetSheet === 'new' ? null : budgetSheet} nextOrder={nextOrder} onClose={() => setBudgetSheet(null)} onSave={saveBudgetItem} />}
      {expenseSheet && <ExpenseSheet expense={expenseSheet === 'new' ? null : expenseSheet} settings={snapshot.settings} budgetItems={snapshot.budgetItems} onClose={() => setExpenseSheet(null)} onSave={saveExpense} />}
    </div>
  )
}

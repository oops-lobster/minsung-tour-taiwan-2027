export type Currency = 'KRW' | 'TWD'

export interface TripSettings {
  trip_id: string
  total_budget_krw: number
  twd_krw_rate: number
  start_date: string
  end_date: string
  travelers: number
  scope_note: string
  updated_at: string
}

export interface BudgetItem {
  id: string
  trip_id: string
  trip_day: string
  category: string
  item_name: string
  currency: Currency
  planned_amount: number
  status: string
  priority: number
  vendor: string | null
  memo: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  trip_id: string
  spent_at: string
  trip_day: string
  category: string
  item_name: string
  currency: Currency
  amount: number
  payment_method: string | null
  payment_status: string
  vendor: string | null
  memo: string | null
  budget_item_id: string | null
  created_at: string
  updated_at: string
}

export interface Reservation {
  id: string
  trip_id: string
  vendor: string
  service_name: string
  service_dates: string[]
  currency: Currency
  total_amount: number
  status: string
  conditions: Record<string, string>
  cancellation_note: string | null
  memo: string | null
  created_at: string
  updated_at: string
}

export interface ReservationPayment {
  id: string
  reservation_id: string
  label: string
  amount: number
  currency: Currency
  due_date: string | null
  paid_at: string | null
  status: string
  payment_method: string | null
  memo: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface BudgetSnapshot {
  settings: TripSettings
  budgetItems: BudgetItem[]
  expenses: Expense[]
  reservations: Reservation[]
  reservationPayments: ReservationPayment[]
}

export interface TripTask {
  id: string
  trip_id: string
  title: string
  due_month: string | null
  note: string | null
  completed: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

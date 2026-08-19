import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Circle, ListTodo, Plus, RefreshCw, Trash2, X } from 'lucide-react'
import { BudgetApiError, callTripTasksApi } from '../lib/supabase'
import type { TripTask } from '../types/budget'

function formatMonth(value: string | null) {
  if (!value) return '예정 시기 없음'
  const [year, month] = value.split('-')
  return `${year}년 ${Number(month)}월`
}

function sortTasks(tasks: TripTask[]) {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed)
    if (!a.completed) {
      if (a.due_month && !b.due_month) return -1
      if (!a.due_month && b.due_month) return 1
      if (a.due_month && b.due_month && a.due_month !== b.due_month) return a.due_month.localeCompare(b.due_month)
    }
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order
    return a.created_at.localeCompare(b.created_at)
  })
}

function AddTaskSheet({ onClose, onSave }: { onClose: () => void; onSave: (values: { title: string; due_month: string | null; note: string | null }) => Promise<void> }) {
  const [title, setTitle] = useState('')
  const [dueMonth, setDueMonth] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [onClose])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setMessage('')
    try {
      await onSave({ title: title.trim(), due_month: dueMonth ? `${dueMonth}-01` : null, note: note.trim() || null })
      onClose()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '저장하지 못했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="private-modal" role="dialog" aria-modal="true" aria-labelledby="task-sheet-title">
      <button className="private-modal__scrim" type="button" onClick={onClose} aria-label="닫기" />
      <section className="private-modal__panel task-sheet">
        <header><div><small>NEW NOTE</small><h2 id="task-sheet-title">할 일 추가</h2></div><button type="button" onClick={onClose} aria-label="닫기"><X size={20} /></button></header>
        <form className="task-form" onSubmit={submit}>
          <label>제목<input required maxLength={160} placeholder="예: 85TD 예약하기" value={title} onChange={(event) => setTitle(event.target.value)} autoFocus /></label>
          <label>예정 시기 <span>선택</span><input type="month" value={dueMonth} onChange={(event) => setDueMonth(event.target.value)} /></label>
          <label>메모 <span>선택</span><textarea maxLength={2000} rows={5} value={note} onChange={(event) => setNote(event.target.value)} /></label>
          {message && <p className="form-message form-message--error" role="alert">{message}</p>}
          <div className="task-form__actions"><button type="button" onClick={onClose}>취소</button><button type="submit" disabled={saving || !title.trim()}>{saving ? '추가 중…' : '추가'}</button></div>
        </form>
      </section>
    </div>
  )
}

export function MinsungTasks({ sessionToken, onSessionExpired }: { sessionToken: string; onSessionExpired: () => void }) {
  const [tasks, setTasks] = useState<TripTask[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set())

  const handleError = useCallback((error: unknown) => {
    if (error instanceof BudgetApiError && (error.status === 401 || error.code === 'session_expired')) onSessionExpired()
    setMessage(error instanceof Error ? error.message : '할 일을 불러오지 못했습니다.')
  }, [onSessionExpired])

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setMessage('')
    try {
      const result = await callTripTasksApi<{ ok: true; tasks: TripTask[] }>('list', {}, sessionToken)
      setTasks(sortTasks(result.tasks))
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [handleError, sessionToken])

  useEffect(() => { void loadTasks() }, [loadTasks])

  const counts = useMemo(() => ({
    remaining: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
  }), [tasks])

  const addTask = async (values: { title: string; due_month: string | null; note: string | null }) => {
    const result = await callTripTasksApi<{ ok: true; task: TripTask }>('create', values, sessionToken)
    setTasks((current) => sortTasks([...current, result.task]))
  }

  const toggleTask = async (task: TripTask) => {
    if (busyIds.has(task.id)) return
    const previous = tasks
    const optimistic = { ...task, completed: !task.completed }
    setBusyIds((current) => new Set(current).add(task.id))
    setTasks((current) => sortTasks(current.map((entry) => entry.id === task.id ? optimistic : entry)))
    setMessage('')
    try {
      const result = await callTripTasksApi<{ ok: true; task: TripTask }>('toggle', { id: task.id, completed: optimistic.completed }, sessionToken)
      setTasks((current) => sortTasks(current.map((entry) => entry.id === task.id ? result.task : entry)))
    } catch (error) {
      setTasks(previous)
      handleError(error)
      setMessage('저장하지 못했습니다. 원래 상태로 되돌렸습니다.')
    } finally {
      setBusyIds((current) => { const next = new Set(current); next.delete(task.id); return next })
    }
  }

  const deleteTask = async (task: TripTask) => {
    if (busyIds.has(task.id) || !window.confirm(`'${task.title}'을 삭제할까요?`)) return
    const previous = tasks
    setBusyIds((current) => new Set(current).add(task.id))
    setTasks((current) => current.filter((entry) => entry.id !== task.id))
    setMessage('')
    try {
      await callTripTasksApi('delete', { id: task.id }, sessionToken)
    } catch (error) {
      setTasks(previous)
      handleError(error)
      setMessage('삭제하지 못했습니다. 항목을 복구했습니다.')
    } finally {
      setBusyIds((current) => { const next = new Set(current); next.delete(task.id); return next })
    }
  }

  return (
    <section className="minsung-tasks section-pad" aria-labelledby="minsung-tasks-title">
      <div className="page-shell">
        <header className="task-page-header">
          <div><small>PERSONAL TRAVEL NOTE</small><h2 id="minsung-tasks-title">민성이 챙길 것</h2><p>여행 전까지 생각나는 일은 여기에 바로 적어둡니다.</p></div>
          <button type="button" onClick={() => setShowAdd(true)}><Plus size={18} /> 할 일 추가</button>
        </header>

        <div className="task-stats"><p><span>남은 일</span><strong>{counts.remaining}개</strong></p><p><span>완료</span><strong>{counts.completed}개</strong></p><button type="button" onClick={() => void loadTasks()} disabled={loading} aria-label="할 일 새로고침"><RefreshCw className={loading ? 'is-spinning' : ''} size={18} /></button></div>

        {message && <div className="budget-alert" role="alert"><span>{message}</span><button type="button" onClick={() => setMessage('')} aria-label="알림 닫기"><X size={17} /></button></div>}

        {loading ? <div className="task-state" role="status"><RefreshCw className="is-spinning" size={22} /> 할 일을 불러오는 중...</div> : tasks.length === 0 ? (
          <div className="task-empty"><ListTodo size={30} /><h3>지금은 챙길 일이 없습니다.</h3><p>생각나는 일이 생기면 바로 추가해두세요.</p><button type="button" onClick={() => setShowAdd(true)}><Plus size={18} /> 첫 할 일 추가</button></div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <article className={task.completed ? 'is-completed' : ''} key={task.id}>
                <button className="task-check" type="button" role="checkbox" aria-checked={task.completed} aria-label={`${task.title} ${task.completed ? '미완료로 되돌리기' : '완료하기'}`} disabled={busyIds.has(task.id)} onClick={() => void toggleTask(task)}>{task.completed ? <Check size={20} /> : <Circle size={20} />}</button>
                <div><h3>{task.title}</h3><time dateTime={task.due_month ?? undefined}>{formatMonth(task.due_month)}</time>{task.note && <p>{task.note}</p>}</div>
                <button className="task-delete" type="button" disabled={busyIds.has(task.id)} onClick={() => void deleteTask(task)} aria-label={`${task.title} 삭제`}><Trash2 size={18} /><span>삭제</span></button>
              </article>
            ))}
          </div>
        )}
      </div>
      {showAdd && <AddTaskSheet onClose={() => setShowAdd(false)} onSave={addTask} />}
    </section>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, CloudDownload, Database, RefreshCw, ShieldCheck, Wifi, WifiOff } from 'lucide-react'

type OfflineState = 'unsupported' | 'checking' | 'not-saved' | 'saving' | 'ready' | 'update' | 'error'

interface CacheStatus {
  ready: boolean
  coreReady: boolean
  version: string
  count: number
  total: number
  coreCount: number
  coreTotal: number
  size: number
}

interface WorkerReply extends Partial<CacheStatus> {
  ok?: boolean
  error?: string
}

const savedAtKey = 'minsung-yehliu-offline-saved-at'
const testedAtKey = 'minsung-yehliu-offline-tested-at'

function formatBytes(value: number) {
  if (!value) return '크기 확인 전'
  return `${(value / 1024 / 1024).toFixed(1)} MB`
}

async function askWorker(type: string, timeout = 50000): Promise<WorkerReply> {
  const registration = await navigator.serviceWorker.ready
  const worker = navigator.serviceWorker.controller ?? registration.active ?? registration.waiting
  if (!worker) throw new Error('오프라인 작업자를 시작하지 못했습니다.')

  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()
    const timeoutId = window.setTimeout(() => reject(new Error('저장 시간이 너무 길어 중단했습니다. 네트워크를 확인해 주세요.')), timeout)
    channel.port1.onmessage = (event: MessageEvent<WorkerReply>) => {
      window.clearTimeout(timeoutId)
      if (event.data?.ok === false) reject(new Error(event.data.error ?? '오프라인 저장에 실패했습니다.'))
      else resolve(event.data)
    }
    worker.postMessage({ type }, [channel.port2])
  })
}

export function YehliuOfflineStatus({ focusOnMount = false, guideName = '예류', returnHref = '#guide/yehliu' }: { focusOnMount?: boolean; guideName?: string; returnHref?: string }) {
  const [state, setState] = useState<OfflineState>('checking')
  const [status, setStatus] = useState<CacheStatus | null>(null)
  const [online, setOnline] = useState(navigator.onLine)
  const [message, setMessage] = useState('오프라인 저장 상태를 확인하고 있습니다.')
  const [savedAt, setSavedAt] = useState(() => window.localStorage.getItem(savedAtKey) ?? '')
  const [testedAt, setTestedAt] = useState(() => window.localStorage.getItem(testedAtKey) ?? '')
  const [persistentStorage, setPersistentStorage] = useState<'checking' | 'granted' | 'denied'>('checking')

  const checkStatus = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      setState('unsupported')
      setMessage('이 브라우저는 오프라인 저장을 지원하지 않습니다. Safari 또는 Chrome 최신 버전을 사용해 주세요.')
      return
    }

    try {
      const reply = await askWorker('GET_YEHLIU_CACHE_STATUS', 15000)
      const nextStatus: CacheStatus = {
        ready: Boolean(reply.ready),
        coreReady: Boolean(reply.coreReady ?? reply.ready),
        version: reply.version ?? '확인 중',
        count: reply.count ?? 0,
        total: reply.total ?? 0,
        coreCount: reply.coreCount ?? reply.count ?? 0,
        coreTotal: reply.coreTotal ?? reply.total ?? 0,
        size: reply.size ?? 0,
      }
      setStatus(nextStatus)
      setState(nextStatus.ready ? 'ready' : 'not-saved')
      setMessage(nextStatus.ready
        ? `${guideName} 가이드가 이 기기에 저장되어 있습니다. 비행기 모드에서도 열 수 있어요.`
        : '출발 전에 온라인 상태에서 한 번 저장해 주세요.')
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : '오프라인 저장 상태를 확인하지 못했습니다.')
    }
  }, [])

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if ('serviceWorker' in navigator) {
      navigator.storage?.persisted?.().then((granted) => setPersistentStorage(granted ? 'granted' : 'denied')).catch(() => setPersistentStorage('denied'))
      const handleControllerChange = () => window.location.reload()
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) setState('update')
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing
          installing?.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              setState('update')
              setMessage('새 가이드 버전이 준비되었습니다. 업데이트하면 최신 내용을 다시 저장합니다.')
            }
          })
        })
      }).catch(() => undefined)
      void checkStatus()
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
      }
    }

    setState('unsupported')
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [checkStatus])

  const save = async () => {
    if (!online) {
      setState('error')
      setMessage('현재 오프라인입니다. 인터넷에 연결한 뒤 다시 저장해 주세요.')
      return
    }

    setState('saving')
    setMessage('가이드·지도·사진·앱 화면을 이 기기에 저장하고 있습니다. 잠시만 기다려 주세요.')
    try {
      const persisted = navigator.storage?.persist ? await navigator.storage.persist().catch(() => false) : false
      setPersistentStorage(persisted ? 'granted' : 'denied')
      const reply = await askWorker('CACHE_YEHLIU_GUIDE')
      const now = new Date().toISOString()
      window.localStorage.setItem(savedAtKey, now)
      setSavedAt(now)
      setStatus({ ready: true, coreReady: Boolean(reply.coreReady ?? true), version: reply.version ?? '최신', count: reply.count ?? 0, total: reply.total ?? 0, coreCount: reply.coreCount ?? reply.count ?? 0, coreTotal: reply.coreTotal ?? reply.total ?? 0, size: reply.size ?? 0 })
      setMessage('저장은 끝났습니다. 오프라인 제어를 연결하기 위해 화면을 한 번 자동으로 다시 엽니다.')
      window.location.reload()
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : '오프라인 저장에 실패했습니다.')
    }
  }

  const update = async () => {
    setState('saving')
    setMessage('새 버전을 적용하고 가이드를 다시 저장하고 있습니다.')
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.update()
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        return
      }
      const reply = await askWorker('REFRESH_YEHLIU_GUIDE')
      setStatus({
        ready: true,
        coreReady: Boolean(reply.coreReady ?? true),
        version: reply.version ?? '최신',
        count: reply.count ?? 0,
        total: reply.total ?? 0,
        coreCount: reply.coreCount ?? reply.count ?? 0,
        coreTotal: reply.coreTotal ?? reply.total ?? 0,
        size: reply.size ?? 0,
      })
      setState('ready')
      setMessage('최신 가이드로 업데이트했습니다.')
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : '업데이트에 실패했습니다.')
    }
  }

  const Icon = online ? Wifi : WifiOff
  const actionLabel = state === 'ready' ? '다시 저장' : state === 'saving' ? '저장 중…' : '오프라인 가이드 저장'
  const confirmAirplaneTest = () => {
    const now = new Date().toISOString()
    window.localStorage.setItem(testedAtKey, now)
    setTestedAt(now)
  }

  return (
    <section className={`yehliu-offline yehliu-offline--${state}`} id="yehliu-offline" data-return-href={returnHref} tabIndex={focusOnMount ? -1 : undefined} aria-labelledby="yehliu-offline-title">
      <div className="yehliu-offline__icon" aria-hidden="true">
        {state === 'ready' ? <CheckCircle2 /> : state === 'saving' ? <CloudDownload /> : <Database />}
      </div>
      <div className="yehliu-offline__copy">
        <span className="yehliu-offline__network"><Icon size={16} aria-hidden="true" /> {online ? '현재 온라인' : '현재 오프라인'}</span>
        <h2 id="yehliu-offline-title">출발 전, {guideName} 가이드 한 번 저장</h2>
        <p aria-live="polite">{message}</p>
        {status && (
          <dl className="yehliu-offline__meta">
            <div><dt>파일</dt><dd>{status.count}/{status.total}개</dd></div>
            <div><dt>핵심 파일</dt><dd>{status.coreReady ? '정상' : `${status.coreCount}/${status.coreTotal}`}</dd></div>
            <div><dt>저장 크기</dt><dd>{formatBytes(status.size)}</dd></div>
            <div><dt>버전</dt><dd>{status.version}</dd></div>
          </dl>
        )}
        {savedAt && <small>마지막 저장: {new Date(savedAt).toLocaleString('ko-KR')}</small>}
        <small>저장 보호: {persistentStorage === 'checking' ? '확인 중' : persistentStorage === 'granted' ? '영구 저장 허용됨' : '브라우저가 영구 저장을 허용하지 않음'} · 허용돼도 기기 설정에 따라 삭제될 수 있습니다.</small>
        {testedAt && <small>마지막 오프라인 확인 완료: {new Date(testedAt).toLocaleString('ko-KR')}</small>}
        <small>iPhone Safari의 비공개 브라우징은 저장 공간을 지울 수 있어요. 홈 화면에서 일반 모드로 열어 주세요.</small>
      </div>
      <div className="yehliu-offline__actions">
        {state === 'update' && (
          <button type="button" onClick={update}><RefreshCw size={18} aria-hidden="true" /> 새 버전 적용</button>
        )}
        {state !== 'unsupported' && state !== 'update' && (
          <button type="button" onClick={save} disabled={state === 'saving'}>
            {state === 'saving' ? <RefreshCw className="is-spinning" size={18} aria-hidden="true" /> : <CloudDownload size={18} aria-hidden="true" />}
            {actionLabel}
          </button>
        )}
        <button className="is-secondary" type="button" onClick={() => void checkStatus()} disabled={state === 'saving'}><RefreshCw size={18} aria-hidden="true" /> 오프라인 점검</button>
        <button className="is-secondary" type="button" onClick={confirmAirplaneTest}><CheckCircle2 size={18} aria-hidden="true" /> 비행기 모드 새로고침 확인 완료</button>
        <p>최종 확인은 비행기 모드로 바꾸고 이 페이지를 새로고침해 주세요.</p>
        <span><ShieldCheck size={17} aria-hidden="true" /> 저장 후 통신이 끊겨도 핵심 기능 유지</span>
      </div>
    </section>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  Check,
  ChevronRight,
  Clipboard,
  Clock3,
  Copy,
  Ear,
  ExternalLink,
  Heart,
  Languages,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
  Square,
  Star,
  Trash2,
  Volume2,
  WifiOff,
  X,
} from 'lucide-react'
import {
  defaultTaiwanFavoriteIds,
  guiHouMealMemo,
  guiHouOrderSteps,
  listeningRequestPhraseIds,
  taiwanPhraseCategories,
  taiwanPhrases,
  type TaiwanPhrase,
} from '../data/taiwanPhrases'
import {
  blobToBase64,
  interpretAudio,
  isTaiwanAiConfigured,
  taiwanLanguageContexts,
  translateForSpeaking,
  type TaiwanLanguageContext,
  type TaiwanListeningReply,
  type TaiwanListeningResult,
  type TaiwanSpeechResult,
} from '../lib/geminiTaiwan'
import {
  clearLanguageHistory,
  readLanguageHistory,
  readStringList,
  saveLanguageHistory,
  saveStringList,
  TAIWAN_LANGUAGE_CONSENT_KEY,
  TAIWAN_LANGUAGE_FAVORITES_KEY,
  TAIWAN_LANGUAGE_RECENTS_KEY,
  type TaiwanLanguageHistoryItem,
} from '../lib/taiwanLanguageStorage'
import { googleTranslateUrl } from '../lib/paths'
import { getPreferredTaiwanVoice, isSpeechSynthesisSupported, speakTaiwan, stopTaiwanSpeech } from '../lib/taiwanSpeech'
import { calculateTaiwanMarketPrice, deriveTaiwanMarketCalculation } from '../lib/taiwanUnits'
import { SectionHeader } from './SectionHeader'

type LanguageMode = 'outbound' | 'incoming' | 'phrasebook'

const modes: Array<{ id: LanguageMode; label: string; icon: typeof Languages }> = [
  { id: 'outbound', label: '내가 말할 것', icon: Languages },
  { id: 'incoming', label: '상대 말 듣기', icon: Ear },
  { id: 'phrasebook', label: '현장 치트시트', icon: Clipboard },
]

const aiErrorMessages: Record<string, string> = {
  offline: '현재 오프라인이라 AI 번역은 사용할 수 없어요. 저장된 현장 문장은 계속 사용할 수 있습니다.',
  timeout: 'AI 응답이 늦어 연결을 멈췄어요. 잠시 뒤 한 번만 다시 시도해 주세요.',
  rate_limited: '요청이 잠시 많아요. 1분 뒤 다시 시도해 주세요.',
  provider_rate_limited: 'Gemini 사용량이 잠시 많아요. 조금 뒤 다시 시도해 주세요.',
  invalid_audio: '녹음 파일을 읽지 못했어요. 3–20초 정도로 다시 녹음해 주세요.',
  not_configured: 'AI 연결 설정을 확인하고 있어요. 오프라인 치트시트는 바로 사용할 수 있습니다.',
}

function errorMessage(error: unknown) {
  const code = error instanceof Error ? error.message : ''
  return aiErrorMessages[code] ?? 'AI 연결이 안 돼요. 오프라인 치트시트는 그대로 사용할 수 있습니다.'
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value)
}

function SpeechControls({ text, primaryLabel = '한번 듣기', onStartRecording }: { text: string; primaryLabel?: string; onStartRecording?: () => void }) {
  const supported = isSpeechSynthesisSupported()
  const [speaking, setSpeaking] = useState(false)
  const [copied, setCopied] = useState(false)

  const speak = async (rate: number) => {
    setSpeaking(true)
    try { await speakTaiwan(text, rate) } catch { /* text remains available */ } finally { setSpeaking(false) }
  }

  const copy = async () => {
    try {
      await copyText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1_500)
    } catch { setCopied(false) }
  }

  return (
    <div className="taiwan-speech-controls">
      <button type="button" className="is-primary" onClick={() => void speak(.75)} disabled={!supported || speaking}>
        <Volume2 size={18} aria-hidden="true" /> {speaking ? '읽는 중…' : primaryLabel} <small>0.75x</small>
      </button>
      <button type="button" onClick={() => void speak(1)} disabled={!supported || speaking}>1.0x</button>
      <button type="button" onClick={() => void copy()}><Copy size={17} aria-hidden="true" /> {copied ? '복사됨' : '복사'}</button>
      {onStartRecording && <button type="button" onClick={onStartRecording}><Mic size={17} aria-hidden="true" /> 바로 녹음</button>}
    </div>
  )
}

function BigChineseOverlay({ phrase, onClose }: { phrase: Pick<TaiwanPhrase, 'traditionalChinese' | 'korean'>; onClose: () => void }) {
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [onClose])

  return (
    <div className="taiwan-show-overlay" role="dialog" aria-modal="true" aria-label="상대에게 보여줄 중국어">
      <button type="button" className="taiwan-show-overlay__close" onClick={onClose} aria-label="닫기"><X size={25} /></button>
      <small>MINSUNG TOUR · TAIWAN</small>
      <strong lang="zh-Hant">{phrase.traditionalChinese}</strong>
      <p>{phrase.korean}</p>
      <button type="button" onClick={() => void speakTaiwan(phrase.traditionalChinese, .82)}><Volume2 size={21} /> 중국어 듣기</button>
    </div>
  )
}

function TaiwanSpeechCard({ korean, result, onShow }: { korean: string; result: TaiwanSpeechResult; onShow: () => void }) {
  const [practiceHidden, setPracticeHidden] = useState(false)
  const practiceTimer = useRef<number | null>(null)

  useEffect(() => () => { if (practiceTimer.current) window.clearTimeout(practiceTimer.current) }, [])

  const startPractice = () => {
    setPracticeHidden(false)
    practiceTimer.current = window.setTimeout(() => setPracticeHidden(true), 3_000)
  }

  const fullCopy = [korean, result.traditionalChinese, result.pinyin, result.koreanPronunciation, result.koreanMeaning].join('\n')

  return (
    <article className={`taiwan-result-card ${practiceHidden ? 'is-practicing' : ''}`} aria-live="polite">
      <div className="taiwan-result-card__label"><span>한국어</span><button type="button" onClick={() => void copyText(fullCopy)}><Copy size={15} /> 전체 복사</button></div>
      <p className="taiwan-result-card__korean">{korean}</p>
      <div className="taiwan-result-card__arrow"><ArrowRight size={18} aria-hidden="true" /></div>
      <span className="taiwan-result-card__eyebrow">대만에서 이렇게</span>
      <strong className="taiwan-result-card__chinese" lang="zh-Hant">{result.traditionalChinese}</strong>
      <p className="taiwan-result-card__pinyin" lang="en">{result.pinyin}</p>
      <p className="taiwan-result-card__tones" lang="en">{result.toneNumbers}</p>
      <p className="taiwan-result-card__pronunciation">{result.koreanPronunciation}</p>
      {practiceHidden && <button className="taiwan-practice-reveal" type="button" onClick={() => setPracticeHidden(false)}>정답 보기</button>}
      <SpeechControls text={result.traditionalChinese} />
      <div className="taiwan-result-card__actions">
        <button type="button" onClick={startPractice}><Clock3 size={17} /> 3초 보고 말하기</button>
        <button type="button" onClick={onShow}>상대에게 보여주기</button>
      </div>
      <div className="taiwan-natural-note"><Sparkles size={17} aria-hidden="true" /><p><strong>현장 느낌</strong>{result.naturalnessNote}</p></div>
      <p className="taiwan-pronunciation-note">한글 발음은 보조 도구예요. 정확한 성조는 병음과 듣기 버튼을 기준으로 해주세요.</p>
      {result.shortAlternative && (
        <details className="taiwan-short-alternative">
          <summary>더 짧게 말하기</summary>
          <strong lang="zh-Hant">{result.shortAlternative.traditionalChinese}</strong>
          <p lang="en">{result.shortAlternative.pinyin}</p>
          <p>{result.shortAlternative.koreanPronunciation}</p>
          <SpeechControls text={result.shortAlternative.traditionalChinese} primaryLabel="짧은 문장 듣기" />
        </details>
      )}
    </article>
  )
}

function ConsentNotice({ consented, onConsent }: { consented: boolean; onConsent: () => void }) {
  if (consented) return (
    <div className="taiwan-consent taiwan-consent--done"><ShieldCheck size={20} /><span>AI 전송 안내 확인됨 · 기록은 이 기기에만 저장</span></div>
  )
  return (
    <section className="taiwan-consent" aria-labelledby="taiwan-consent-title">
      <ShieldCheck size={24} aria-hidden="true" />
      <div>
        <strong id="taiwan-consent-title">AI를 쓰기 전에 한 번만 확인해 주세요</strong>
        <p>입력한 문장 또는 녹음한 음성이 Google Gemini API로 전송됩니다. 여권번호, 카드번호, 예약번호 같은 민감한 정보는 넣지 마세요. 녹음과 번역 기록은 서버에 저장하지 않습니다.</p>
      </div>
      <button type="button" onClick={onConsent}><Check size={18} /> 확인하고 사용하기</button>
    </section>
  )
}

function ContextChips({ value, onChange }: { value: TaiwanLanguageContext; onChange: (value: TaiwanLanguageContext) => void }) {
  return (
    <div className="taiwan-context-chips" role="group" aria-label="대화 상황">
      {taiwanLanguageContexts.map((context) => <button type="button" className={value === context ? 'is-active' : ''} aria-pressed={value === context} onClick={() => onChange(context)} key={context}>{context}</button>)}
    </div>
  )
}

function OutboundMode({ consented, onNeedConsent, onHistory }: { consented: boolean; onNeedConsent: () => void; onHistory: (item: TaiwanLanguageHistoryItem) => void }) {
  const [text, setText] = useState('오늘 뭐가 제일 신선하고 가격 괜찮아요?')
  const [context, setContext] = useState<TaiwanLanguageContext>('귀후어항')
  const [result, setResult] = useState<TaiwanSpeechResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => () => controllerRef.current?.abort(), [])

  const submit = async () => {
    const input = text.trim()
    if (!input || loading) return
    if (!consented) { onNeedConsent(); setError('위의 AI 전송 안내를 먼저 확인해 주세요.'); return }
    setLoading(true)
    setError('')
    controllerRef.current = new AbortController()
    try {
      const next = await translateForSpeaking(input, context, controllerRef.current.signal)
      setResult(next)
      onHistory(saveLanguageHistory({ id: crypto.randomUUID(), direction: 'outbound', context, input, output: next, timestamp: Date.now() })[0])
    } catch (requestError) { setError(errorMessage(requestError)) } finally { setLoading(false) }
  }

  return (
    <div className="taiwan-mode-grid">
      <section className="taiwan-input-card">
        <span className="taiwan-card-kicker">SPEAK LIKE A PREPARED TRAVELER</span>
        <h2>하고 싶은 말을 적어주세요</h2>
        <p>길고 어려운 번역보다, 대만 현장에서 바로 꺼내 말할 수 있는 문장으로 바꿔드려요.</p>
        <label htmlFor="taiwan-outbound-input">한국어 문장</label>
        <textarea id="taiwan-outbound-input" value={text} maxLength={1_200} onChange={(event) => setText(event.target.value)} rows={5} />
        <ContextChips value={context} onChange={setContext} />
        <button className="taiwan-main-action" type="button" onClick={() => void submit()} disabled={loading || !text.trim()}>
          <Sparkles size={20} aria-hidden="true" /> {loading ? '대만식 표현을 만드는 중…' : '대만식으로 바꾸기'}
        </button>
        {error && <p className="taiwan-ai-error" role="alert">{!navigator.onLine && <WifiOff size={18} />}{error}</p>}
        <a className="taiwan-google-fallback" href={googleTranslateUrl(text)} target="_blank" rel="noreferrer">Google Translate 열기 <ExternalLink size={15} /></a>
      </section>
      <div className="taiwan-result-slot">
        {result ? <TaiwanSpeechCard korean={text} result={result} onShow={() => setShowOverlay(true)} /> : (
          <div className="taiwan-empty-result"><Languages size={34} /><strong>번체·병음·한글 발음을 한 장에</strong><p>상황을 고르고 문장을 바꾸면 이곳에 결과가 표시됩니다.</p></div>
        )}
      </div>
      {showOverlay && result && <BigChineseOverlay phrase={{ korean: text, traditionalChinese: result.traditionalChinese }} onClose={() => setShowOverlay(false)} />}
    </div>
  )
}

function getRecorderMimeType() {
  if (typeof MediaRecorder === 'undefined') return ''
  return ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'].find((type) => MediaRecorder.isTypeSupported(type)) ?? ''
}

function ReplyPanel({ reply, onShow }: { reply: TaiwanListeningReply; onShow: () => void }) {
  return (
    <article className="taiwan-reply-panel">
      <small>{reply.label}</small><strong lang="zh-Hant">{reply.traditionalChinese}</strong>
      <p lang="en">{reply.pinyin}</p><p>{reply.koreanPronunciation}</p>
      <SpeechControls text={reply.traditionalChinese} />
      <button type="button" onClick={onShow}>상대에게 보여주기</button>
    </article>
  )
}

function IncomingResult({ result, onReply }: { result: TaiwanListeningResult; onReply: (reply: TaiwanListeningReply) => void }) {
  const calculation = deriveTaiwanMarketCalculation(result.numbers)
  return (
    <section className="taiwan-listening-result" aria-live="polite">
      <span className="taiwan-card-kicker">HEARD IN TAIWAN</span>
      <h2>들은 말</h2>
      <strong className="taiwan-listening-result__transcript" lang="zh-Hant">{result.transcriptTraditionalChinese}</strong>
      {result.pinyin && <p className="taiwan-listening-result__pinyin" lang="en">{result.pinyin}</p>}
      <div className="taiwan-translation-block"><small>한국어</small><p>{result.koreanTranslation}</p></div>
      {result.numbers.length > 0 && (
        <div className="taiwan-number-watch">
          <header><Calculator size={22} /><div><strong>숫자 꼭 보기</strong><span>가격·무게는 거래 전에 다시 확인하세요.</span></div></header>
          <ul>{result.numbers.map((number, index) => <li key={`${number.original}-${index}`}><strong>{number.original}</strong><span>{number.meaning}</span>{number.value && <b>{number.value} {number.unit}</b>}</li>)}</ul>
          {calculation && <div className="taiwan-derived-total">
            {calculation.grams !== undefined && <span><small>무게 환산</small><strong>약 {calculation.grams.toLocaleString()}g</strong></span>}
            {calculation.ingredientCost !== undefined && <span><small>재료비 추정</small><strong>NT${calculation.ingredientCost.toLocaleString()}</strong></span>}
            {calculation.estimatedTotal !== undefined && <span><small>예상 합계</small><strong>NT${calculation.estimatedTotal.toLocaleString()}</strong></span>}
          </div>}
        </div>
      )}
      <div className="taiwan-intent"><small>의미</small><p>{result.intentSummary}</p>{result.uncertainty && <p className="taiwan-uncertainty"><AlertTriangle size={16} />{result.uncertainty}</p>}</div>
      <div className="taiwan-suggested-replies"><small>이렇게 답하기</small>{result.suggestedReplies.map((reply) => <button type="button" onClick={() => onReply(reply)} key={reply.label}>{reply.label}<ChevronRight size={17} /></button>)}</div>
    </section>
  )
}

function IncomingMode({ consented, onNeedConsent, onHistory }: { consented: boolean; onNeedConsent: () => void; onHistory: (item: TaiwanLanguageHistoryItem) => void }) {
  const requestPhrases = listeningRequestPhraseIds.map((id) => taiwanPhrases.find((phrase) => phrase.id === id)).filter(Boolean) as TaiwanPhrase[]
  const politePhrase = requestPhrases[0]
  const [context, setContext] = useState<TaiwanLanguageContext>('귀후어항')
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<TaiwanListeningResult | null>(null)
  const [selectedReply, setSelectedReply] = useState<TaiwanListeningReply | null>(null)
  const [showPhrase, setShowPhrase] = useState<TaiwanPhrase | TaiwanListeningReply | null>(null)
  const [error, setError] = useState('')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  const supported = typeof navigator.mediaDevices?.getUserMedia === 'function' && typeof MediaRecorder !== 'undefined'

  const cleanupStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = null
  }

  useEffect(() => () => { recorderRef.current?.stop(); cleanupStream(); stopTaiwanSpeech() }, [])

  const processAudio = async (blob: Blob) => {
    if (blob.size > 4_000_000) { setError('녹음이 너무 커요. 20초 안팎으로 다시 녹음해 주세요.'); return }
    setProcessing(true)
    try {
      const audioBase64 = await blobToBase64(blob)
      const next = await interpretAudio(audioBase64, blob.type || 'audio/webm', context)
      setResult(next)
      onHistory(saveLanguageHistory({ id: crypto.randomUUID(), direction: 'incoming', context, input: `${Math.max(1, elapsed)}초 음성`, output: next, timestamp: Date.now() })[0])
    } catch (requestError) { setError(errorMessage(requestError)) } finally { setProcessing(false) }
  }

  const beginWithStream = (stream: MediaStream) => {
    chunksRef.current = []
    streamRef.current = stream
    const mimeType = getRecorderMimeType()
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
    recorderRef.current = recorder
    recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data) }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || 'audio/webm' })
      setRecording(false)
      cleanupStream()
      if (blob.size) void processAudio(blob)
    }
    setElapsed(0)
    setError('')
    recorder.start(500)
    setRecording(true)
    const startedAt = Date.now()
    timerRef.current = window.setInterval(() => {
      const seconds = Math.floor((Date.now() - startedAt) / 1000)
      setElapsed(seconds)
      if (seconds >= 30 && recorder.state === 'recording') recorder.stop()
    }, 250)
  }

  const startRecording = async (afterPhrase = false) => {
    if (!consented) { onNeedConsent(); setError('위의 AI 전송 안내를 먼저 확인해 주세요.'); return }
    if (!navigator.onLine) { setError(aiErrorMessages.offline); return }
    if (!supported || recording || processing) { if (!supported) setError('이 브라우저는 녹음을 지원하지 않아요. 오프라인 문장과 Google Translate를 이용해 주세요.'); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false })
      if (afterPhrase) {
        try { await speakTaiwan(politePhrase.traditionalChinese, .78) } catch { /* continue to recording */ }
        await new Promise((resolve) => window.setTimeout(resolve, 1_000))
      }
      beginWithStream(stream)
    } catch { cleanupStream(); setError('마이크 권한을 허용한 뒤 다시 눌러주세요.') }
  }

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  return (
    <div className="taiwan-incoming-layout">
      <section className="taiwan-record-request">
        <span className="taiwan-card-kicker">ASK BEFORE RECORDING</span>
        <h2>먼저, 이렇게 부탁해요</h2>
        <strong lang="zh-Hant">{politePhrase.traditionalChinese}</strong>
        <p lang="en">{politePhrase.pinyin}</p><p>{politePhrase.koreanPronunciation}</p>
        <SpeechControls text={politePhrase.traditionalChinese} primaryLabel="녹음 부탁 문장 듣기" />
        <div className="taiwan-record-request__shorts">
          {requestPhrases.slice(1).map((phrase) => <button type="button" onClick={() => void speakTaiwan(phrase.traditionalChinese, .78)} key={phrase.id}><Volume2 size={16} /><span><strong lang="zh-Hant">{phrase.traditionalChinese}</strong><small>{phrase.korean}</small></span></button>)}
        </div>
        <button type="button" className="taiwan-listen-record" onClick={() => void startRecording(true)} disabled={!supported || recording || processing}>
          <Volume2 size={19} /><ArrowRight size={17} /><Mic size={19} /> 문장 듣기 · 1초 뒤 녹음
        </button>
        <button type="button" className="taiwan-secondary-show" onClick={() => setShowPhrase(politePhrase)}>상대에게 화면 보여주기</button>
      </section>

      <section className={`taiwan-recorder ${recording ? 'is-recording' : ''}`} aria-live="polite">
        <ContextChips value={context} onChange={setContext} />
        <div className="taiwan-recorder__status">
          <span className="taiwan-recorder__pulse"><Mic size={26} /></span>
          <strong>{recording ? '말씀을 듣고 있어요' : processing ? '들은 말을 정리하고 있어요' : '상대 말 녹음'}</strong>
          <p>{recording ? `${elapsed}초 · 최대 30초` : '3–20초 정도가 가장 좋아요. 음성은 분석 후 저장하지 않습니다.'}</p>
        </div>
        {recording ? (
          <button type="button" className="taiwan-record-button is-stop" onClick={stopRecording}><Square size={20} fill="currentColor" /> 녹음 정지하고 번역</button>
        ) : (
          <button type="button" className="taiwan-record-button" onClick={() => void startRecording()} disabled={!supported || processing}><Mic size={21} /> {processing ? '분석 중…' : '상대 말 녹음 시작'}</button>
        )}
        {!supported && <p className="taiwan-ai-error" role="status">이 브라우저에서는 마이크 녹음을 지원하지 않아요. 치트시트는 그대로 사용할 수 있습니다.</p>}
        {error && <p className="taiwan-ai-error" role="alert">{error}</p>}
      </section>

      {result && <IncomingResult result={result} onReply={setSelectedReply} />}
      {selectedReply && <ReplyPanel reply={selectedReply} onShow={() => setShowPhrase(selectedReply)} />}
      {showPhrase && <BigChineseOverlay phrase={{ korean: 'korean' in showPhrase ? showPhrase.korean : '', traditionalChinese: showPhrase.traditionalChinese }} onClose={() => setShowPhrase(null)} />}
    </div>
  )
}

function UnitCalculator() {
  const [price, setPrice] = useState('800')
  const [weight, setWeight] = useState('1.2')
  const [fee, setFee] = useState('200')
  const values = [price, weight, fee].map((value) => Number(value))
  const result = values.every(Number.isFinite) ? calculateTaiwanMarketPrice(values[0], values[1], values[2]) : null
  return (
    <section className="taiwan-unit-calculator">
      <header><Calculator size={22} /><div><strong>台斤 계산기</strong><span>1 台斤 = 600g</span></div></header>
      <div className="taiwan-unit-calculator__inputs">
        <label>NT$ / 台斤<input type="number" inputMode="decimal" min="0" value={price} onChange={(event) => setPrice(event.target.value)} /></label>
        <label>무게 台斤<input type="number" inputMode="decimal" min="0" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} /></label>
        <label>조리비 NT$<input type="number" inputMode="decimal" min="0" value={fee} onChange={(event) => setFee(event.target.value)} /></label>
      </div>
      {result && <div className="taiwan-unit-calculator__result"><span>약 {result.grams.toLocaleString()}g</span><span>재료비 NT${result.ingredientCost.toLocaleString()}</span><strong>예상 합계 NT${result.estimatedTotal.toLocaleString()}</strong></div>}
      <small>계산값은 참고용입니다. 실제 총액은 손질 전에 계산기로 다시 보여달라고 해주세요.</small>
    </section>
  )
}

function PhraseDetail({ phrase, favorite, onFavorite, onUse, onShow }: { phrase: TaiwanPhrase; favorite: boolean; onFavorite: () => void; onUse: () => void; onShow: () => void }) {
  useEffect(() => onUse(), [phrase.id])
  return (
    <article className="taiwan-phrase-detail">
      <header><span>{phrase.category}{phrase.critical && <b>필수</b>}</span><button type="button" onClick={onFavorite} aria-pressed={favorite}>{favorite ? <Star size={19} fill="currentColor" /> : <Star size={19} />} {favorite ? '즐겨찾기됨' : '즐겨찾기'}</button></header>
      <p>{phrase.korean}</p>
      <strong lang="zh-Hant">{phrase.traditionalChinese}</strong>
      <p className="taiwan-phrase-detail__pinyin" lang="en">{phrase.pinyin}</p>
      <p className="taiwan-phrase-detail__tones" lang="en">{phrase.toneNumbers}</p>
      <p className="taiwan-phrase-detail__pronunciation">{phrase.koreanPronunciation}</p>
      <SpeechControls text={phrase.traditionalChinese} />
      <button className="taiwan-secondary-show" type="button" onClick={onShow}>상대에게 보여주기</button>
      {phrase.usage && <footer><Sparkles size={16} /><span>{phrase.usage}</span></footer>}
    </article>
  )
}

function PhrasebookMode() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('즐겨찾기')
  const [favorites, setFavorites] = useState(() => readStringList(TAIWAN_LANGUAGE_FAVORITES_KEY, defaultTaiwanFavoriteIds))
  const [recents, setRecents] = useState(() => readStringList(TAIWAN_LANGUAGE_RECENTS_KEY))
  const [activeId, setActiveId] = useState<string>(defaultTaiwanFavoriteIds[0])
  const [showOverlay, setShowOverlay] = useState(false)

  const active = taiwanPhrases.find((phrase) => phrase.id === activeId) ?? taiwanPhrases[0]
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    let list = category === '즐겨찾기' ? taiwanPhrases.filter((phrase) => favorites.includes(phrase.id))
      : category === '최근 사용' ? recents.map((id) => taiwanPhrases.find((phrase) => phrase.id === id)).filter(Boolean) as TaiwanPhrase[]
      : taiwanPhrases.filter((phrase) => phrase.category === category)
    if (query) list = list.filter((phrase) => `${phrase.korean} ${phrase.traditionalChinese} ${phrase.pinyin}`.toLowerCase().includes(query))
    return list
  }, [category, favorites, recents, search])

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [id, ...favorites]
    setFavorites(next); saveStringList(TAIWAN_LANGUAGE_FAVORITES_KEY, next)
  }
  const markUsed = () => {
    const next = [active.id, ...recents.filter((id) => id !== active.id)].slice(0, 20)
    if (next.join() !== recents.join()) { setRecents(next); saveStringList(TAIWAN_LANGUAGE_RECENTS_KEY, next) }
  }

  return (
    <div className="taiwan-phrasebook-layout">
      <div className="taiwan-phrasebook-guide">
        <section className="taiwan-order-card">
          <span className="taiwan-card-kicker">GUIHOU HARBOR ORDER</span><h2>어항 주문 순서</h2>
          <ol>{guiHouOrderSteps.map((step) => <li key={step}><span>{guiHouOrderSteps.indexOf(step) + 1}</span>{step}</li>)}</ol>
          <strong>단가 → 무게 → 재료값 → 조리비 → 총액 → 조리</strong>
          <details><summary>우리 셋 추천 주문 메모</summary><p>3명 · 연어회 제외 · 사시미와 니기리 선호 · 랍스터/게는 다음 날 85TD에서</p><ul>{guiHouMealMemo.map((item) => <li key={item}>{item}</li>)}</ul></details>
        </section>
        <UnitCalculator />
      </div>

      <section className="taiwan-phrase-browser">
        <div className="taiwan-phrase-search"><Search size={19} /><input type="search" placeholder="한국어·중국어·병음 검색" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="현장 문장 검색" /></div>
        <div className="taiwan-category-scroll">
          {['즐겨찾기', '최근 사용', ...taiwanPhraseCategories].map((item) => <button type="button" className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)} key={item}>{item === '즐겨찾기' && <Heart size={15} fill="currentColor" />}{item}</button>)}
        </div>
        <div className="taiwan-phrase-browser__body">
          <div className="taiwan-phrase-list" aria-label="현장 문장 목록">
            {filtered.map((phrase) => <button type="button" className={active.id === phrase.id ? 'is-active' : ''} onClick={() => setActiveId(phrase.id)} key={phrase.id}><span>{phrase.korean}</span><strong lang="zh-Hant">{phrase.traditionalChinese}</strong>{phrase.critical && <b>필수</b>}</button>)}
            {filtered.length === 0 && <p>조건에 맞는 문장이 없어요.</p>}
          </div>
          <PhraseDetail phrase={active} favorite={favorites.includes(active.id)} onFavorite={() => toggleFavorite(active.id)} onUse={markUsed} onShow={() => setShowOverlay(true)} />
        </div>
      </section>
      {showOverlay && <BigChineseOverlay phrase={active} onClose={() => setShowOverlay(false)} />}
    </div>
  )
}

function LanguageHistory({ items, onClear }: { items: TaiwanLanguageHistoryItem[]; onClear: () => void }) {
  if (!items.length) return null
  return (
    <details className="taiwan-history">
      <summary><Clock3 size={18} /> 최근 표현 <span>{items.length}</span></summary>
      <div>{items.slice(0, 10).map((item) => <article key={item.id}><small>{item.direction === 'outbound' ? '내가 말할 것' : '상대 말'} · {item.context}</small><strong>{item.input}</strong><p lang={item.direction === 'outbound' ? 'zh-Hant' : undefined}>{item.direction === 'outbound' ? item.output.traditionalChinese : item.output.koreanTranslation}</p></article>)}</div>
      <button type="button" onClick={onClear}><Trash2 size={16} /> 기록 전체 삭제</button>
    </details>
  )
}

export function TaiwanLanguageTools() {
  const [mode, setMode] = useState<LanguageMode>('outbound')
  const [consented, setConsented] = useState(() => window.localStorage.getItem(TAIWAN_LANGUAGE_CONSENT_KEY) === 'yes')
  const [history, setHistory] = useState(() => readLanguageHistory())
  const [online, setOnline] = useState(navigator.onLine)
  const consentRef = useRef<HTMLDivElement | null>(null)
  const voice = getPreferredTaiwanVoice()

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update); window.addEventListener('offline', update)
    if (isSpeechSynthesisSupported()) window.speechSynthesis.addEventListener('voiceschanged', update)
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); window.speechSynthesis?.removeEventListener('voiceschanged', update) }
  }, [])

  const consent = () => { window.localStorage.setItem(TAIWAN_LANGUAGE_CONSENT_KEY, 'yes'); setConsented(true) }
  const needConsent = () => consentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  const addHistory = () => setHistory(readLanguageHistory())
  const clearHistory = () => { clearLanguageHistory(); setHistory([]) }

  return (
    <section className="taiwan-language section-pad">
      <div className="page-shell">
        <SectionHeader eyebrow="TAIWAN LANGUAGE COPILOT" title="대만 회화 AI" description="내가 말할 때도, 상대 말을 들을 때도. 번체·병음·한글 발음을 한 장에서 준비합니다." />
        <div className="taiwan-language-status"><span className={online ? 'is-online' : ''}>{online ? '온라인 · AI 사용 가능' : '오프라인 · 저장 문장 사용 가능'}</span><span>{voice ? `음성: ${voice.name}` : '기기 중국어 음성 자동 선택'}</span></div>
        <nav className="taiwan-mode-tabs" aria-label="대만 회화 모드">
          {modes.map(({ id, label, icon: Icon }) => <button type="button" className={mode === id ? 'is-active' : ''} aria-selected={mode === id} onClick={() => setMode(id)} key={id}><Icon size={20} /><span>{label}</span></button>)}
        </nav>
        <div ref={consentRef}><ConsentNotice consented={consented} onConsent={consent} /></div>
        {!isTaiwanAiConfigured && mode !== 'phrasebook' && <p className="taiwan-config-notice" role="status">AI 서버 연결을 준비 중이어도 현장 치트시트는 오프라인에서 바로 열 수 있어요.</p>}
        {mode === 'outbound' && <OutboundMode consented={consented} onNeedConsent={needConsent} onHistory={addHistory} />}
        {mode === 'incoming' && <IncomingMode consented={consented} onNeedConsent={needConsent} onHistory={addHistory} />}
        {mode === 'phrasebook' && <PhrasebookMode />}
        <LanguageHistory items={history} onClear={clearHistory} />
      </div>
    </section>
  )
}

import { useMemo, useState } from 'react'
import { ExternalLink, Heart, Languages, Plus, Volume2 } from 'lucide-react'
import { guihouPhrases, guihouPriceConfirmationPhraseIds } from '../data/guihouPhrases'
import { speakTaiwan } from '../lib/taiwanSpeech'
import type { GuihouFieldSession } from '../lib/useGuihouFieldSession'

interface GuihouPhrasebookProps {
  session: GuihouFieldSession
  update: (recipe: (current: GuihouFieldSession) => GuihouFieldSession) => void
  priceOnly?: boolean
}

export function GuihouPhrasebook({ session, update, priceOnly = false }: GuihouPhrasebookProps) {
  const [custom, setCustom] = useState('')
  const phrases = useMemo(() => priceOnly ? guihouPriceConfirmationPhraseIds.map((id) => guihouPhrases.find((phrase) => phrase.id === id)!).filter(Boolean) : guihouPhrases, [priceOnly])
  const favorites = session.languageFavorites ?? []

  const toggleFavorite = (id: string) => update((current) => ({
    ...current,
    languageFavorites: (current.languageFavorites ?? []).includes(id)
      ? (current.languageFavorites ?? []).filter((item) => item !== id)
      : [...(current.languageFavorites ?? []), id],
  }))

  const addCustom = () => {
    const value = custom.trim()
    if (!value) return
    update((current) => ({ ...current, customPhrases: [...new Set([...(current.customPhrases ?? []), value])].slice(0, 20) }))
    setCustom('')
  }

  return (
    <section className={`guihou-phrasebook ${priceOnly ? 'guihou-phrasebook--price' : ''}`} aria-labelledby={priceOnly ? 'guihou-price-phrases-title' : 'guihou-phrases-title'}>
      <header className="guihou-section-heading">
        <span>{priceOnly ? 'PRICE CONFIRMATION' : 'OFFLINE · zh-TW TTS'}</span>
        <h2 id={priceOnly ? 'guihou-price-phrases-title' : 'guihou-phrases-title'}>{priceOnly ? '자르기 전에 이 순서로 확인' : '현장 중국어'}</h2>
        <p>화면을 보여주기보다 직접 말하는 흐름입니다. 0.75x로 듣고 따라 말해보세요.</p>
      </header>
      <div className="guihou-phrase-list">
        {phrases.map((phrase, index) => {
          const saved = favorites.includes(phrase.id)
          return (
            <article className={phrase.critical ? 'is-critical' : ''} key={phrase.id}>
              {priceOnly && <span className="guihou-phrase-order">{index + 1}</span>}
              <button className={`guihou-phrase-favorite ${saved ? 'is-saved' : ''}`} type="button" aria-label={`${phrase.korean} ${saved ? '즐겨찾기 해제' : '즐겨찾기'}`} aria-pressed={saved} onClick={() => toggleFavorite(phrase.id)}><Heart aria-hidden="true" /></button>
              <p>{phrase.korean}</p>
              <strong lang="zh-Hant">{phrase.traditionalChinese}</strong>
              <span lang="en">{phrase.pinyin}</span>
              <small lang="en">{phrase.toneNumbers}</small>
              <em>{phrase.koreanPronunciation}</em>
              <div><button type="button" onClick={() => void speakTaiwan(phrase.traditionalChinese, .75)}><Volume2 aria-hidden="true" /> 0.75x 듣기</button><button type="button" onClick={() => void speakTaiwan(phrase.traditionalChinese, 1)}>1.0x 듣기</button></div>
            </article>
          )
        })}
      </div>
      {!priceOnly && (
        <>
          <section className="guihou-custom-phrases" aria-labelledby="guihou-custom-title"><div><small>LOCAL ONLY</small><h3 id="guihou-custom-title">내 표현 추가</h3><p>개인적인 표현은 이 기기에만 저장합니다.</p></div><label htmlFor="guihou-custom-phrase"><span>내 한국어 표현</span><input id="guihou-custom-phrase" value={custom} maxLength={120} onChange={(event) => setCustom(event.target.value)} /></label><button type="button" onClick={addCustom}><Plus aria-hidden="true" /> 저장</button>{(session.customPhrases ?? []).map((phrase) => <span className="guihou-custom-chip" key={phrase}>{phrase}</span>)}</section>
          <a className="guihou-ai-link" href="#tools/language"><Languages aria-hidden="true" /><span><strong>AI로 상대 말 듣기</strong><small>귀후어항 상황 · 가격·무게·조리비·총액을 크게 확인</small></span><ExternalLink aria-hidden="true" /></a>
        </>
      )}
    </section>
  )
}

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  defaultTaiwanFavoriteIds,
  listeningRequestPhraseIds,
  taiwanPhrases,
} from '../src/data/taiwanPhrases.ts'
import {
  calculateTaiwanMarketPrice,
  deriveTaiwanMarketCalculation,
  taijinToGrams,
} from '../src/lib/taiwanUnits.ts'

test('offline phrasebook contains the required Guihou safety flow', () => {
  const requiredChinese = [
    '今天什麼魚比較新鮮？',
    '一斤多少錢？',
    '料理費怎麼算？',
    '全部加起來多少錢？',
    '先不要切，我先確認一下價錢。',
    '可以打在計算機上給我看嗎？',
  ]
  const phrases = new Map(taiwanPhrases.map((phrase) => [phrase.traditionalChinese, phrase]))
  for (const chinese of requiredChinese) {
    const phrase = phrases.get(chinese)
    assert.ok(phrase, `${chinese} should be available offline`)
    assert.ok(phrase.pinyin)
    assert.match(phrase.toneNumbers, /[1-5]/)
    assert.ok(phrase.koreanPronunciation)
  }
  assert.ok(taiwanPhrases.length >= 30)
})

test('recording request phrases are critical, offline, and default favorites', () => {
  for (const id of listeningRequestPhraseIds) {
    const phrase = taiwanPhrases.find((item) => item.id === id)
    assert.ok(phrase)
    assert.equal(phrase.critical, true)
    assert.ok(defaultTaiwanFavoriteIds.includes(id as (typeof defaultTaiwanFavoriteIds)[number]))
  }
  const polite = taiwanPhrases.find((phrase) => phrase.id === 'listen-phone-polite')
  assert.equal(polite?.traditionalChinese, '不好意思，我中文聽得不太好，可以麻煩您對著手機說嗎？')
  assert.equal(polite?.pinyin, 'Bù hǎoyìsi, wǒ Zhōngwén tīng de bú tài hǎo, kěyǐ máfan nín duìzhe shǒujī shuō ma?')
  assert.equal(polite?.toneNumbers, 'bu4 hao3 yi4 si5, wo3 zhong1 wen2 ting1 de5 bu2 tai4 hao3, ke3 yi3 ma2 fan5 nin2 dui4 zhe5 shou3 ji1 shuo1 ma5?')
  assert.equal(polite?.koreanPronunciation, '부 하오이쓰, 워 중원 팅더 부타이 하오, 커이 마판 닌 뚜이저 쇼우지 슈어 마?')
})

test('Taiwan fish-market arithmetic is deterministic and 台斤 is exactly 600g', () => {
  assert.equal(taijinToGrams(1.2), 720)
  assert.deepEqual(calculateTaiwanMarketPrice(800, 1.2, 200), {
    grams: 720,
    ingredientCost: 960,
    estimatedTotal: 1160,
  })
  assert.deepEqual(deriveTaiwanMarketCalculation([
    { original: '一斤八百', meaning: '한 台斤당 가격', value: '800', unit: 'TWD/台斤' },
    { original: '一斤二', meaning: '무게', value: '1.2', unit: '台斤' },
    { original: '料理費兩百', meaning: '조리비', value: '200', unit: 'TWD' },
  ]), { grams: 720, ingredientCost: 960, estimatedTotal: 1160 })
})

test('Edge Function keeps the Gemini key server-side and preserves Taiwan language rules', async () => {
  const source = await readFile(new URL('../supabase/functions/taiwan-language-ai/index.ts', import.meta.url), 'utf8')
  assert.match(source, /Deno\.env\.get\('GEMINI_API_KEY'\)/)
  assert.match(source, /Deno\.env\.get\('SUPABASE_PUBLISHABLE_KEYS'\)/)
  assert.match(source, /isAuthorizedRequest\(request\)/)
  assert.match(source, /gemini-3\.5-flash-lite/)
  assert.match(source, /Traditional Chinese only/)
  assert.match(source, /台斤 is exactly 600 g/)
  assert.match(source, /responseJsonSchema/)
  assert.doesNotMatch(source, /AQ\.[A-Za-z0-9_-]{20,}/)
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeYehliuOperation } from '../scripts/yehliu-operation-parser.mjs'

const item = (title: string, description: string, date: string) => `<item><title><![CDATA[${title}]]></title><link>https://official.example/${encodeURIComponent(title)}</link><description><![CDATA[${description}]]></description><pubDate>${date}</pubDate></item>`

test('Yehliu official notice parser ignores unrelated notices and classifies partial/full', () => {
  const partial = normalizeYehliuOperation(`<rss><channel>${item('野柳地質公園 第一區部分封閉', '燭台石景觀區暫時管制', 'Wed, 20 Aug 2026 01:00:00 GMT')}${item('其他景點封閉', '封園', 'Thu, 21 Aug 2026 01:00:00 GMT')}</channel></rss>`)
  assert.equal(partial.state, 'partial-closure')
  const full = normalizeYehliuOperation(`<rss><channel>${item('野柳地質公園封園', '園區封閉', 'Thu, 21 Aug 2026 01:00:00 GMT')}</channel></rss>`)
  assert.equal(full.state, 'full-closure')
})

test('newer reopening notice overrides an older closure', () => {
  const snapshot = normalizeYehliuOperation(`<rss><channel>${item('野柳地質公園封園', '暫停開放', 'Wed, 20 Aug 2026 01:00:00 GMT')}${item('野柳地質公園恢復開放', '重新開放', 'Thu, 21 Aug 2026 01:00:00 GMT')}</channel></rss>`)
  assert.equal(snapshot.state, 'reopened')
})

test('no related notice is not exaggerated into confirmed normal operation', () => {
  const snapshot = normalizeYehliuOperation('<rss><channel></channel></rss>')
  assert.equal(snapshot.state, 'no-active-closure-notice')
  assert.doesNotMatch(snapshot.matchedReason, /정상 운영 확정/)
})

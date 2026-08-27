import { writeFile } from 'node:fs/promises'
import { normalizeYehliuOperation } from './yehliu-operation-parser.mjs'

const force = process.argv.includes('--force')
const now = new Date()
const activeFrom = new Date('2027-02-14T00:00:00+08:00')
const activeUntil = new Date('2027-02-22T23:59:59+08:00')
if (!force && (now < activeFrom || now > activeUntil)) {
  console.log('Outside D-7 through D+1 snapshot window; nothing to update.')
  process.exit(0)
}

const endpoint = 'https://www.northguan-nsa.gov.tw/user/xmlRss.aspx?Lang=1&SNo=03000118'
let snapshot
try {
  const response = await fetch(endpoint, { headers: { 'user-agent': 'minsung-tour-operation-snapshot/1.0' } })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  snapshot = normalizeYehliuOperation(await response.text(), now.toISOString())
} catch (error) {
  snapshot = { fetchedAt: now.toISOString(), publishedAt: null, sourceUrl: endpoint, sourceTitle: '北觀處最新消息 RSS', state: 'unknown', matchedReason: `공식 공지 확인 실패: ${error instanceof Error ? error.message : 'unknown error'}`, excerpt: '' }
}
await writeFile(new URL('../public/data/yehliu-operation.json', import.meta.url), `${JSON.stringify(snapshot, null, 2)}\n`)
console.log(`${snapshot.state}: ${snapshot.matchedReason}`)

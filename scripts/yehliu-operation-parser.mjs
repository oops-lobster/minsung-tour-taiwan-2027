const decodeEntities = (value = '') => value
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#39;/g, "'").replace(/&quot;/g, '"')

const stripMarkup = (value = '') => decodeEntities(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const field = (xml, name) => stripMarkup(xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] ?? '')

export const parseRssItems = (xml) => [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((match) => ({
  title: field(match[1], 'title'), link: field(match[1], 'link'), description: field(match[1], 'description'),
  publishedAt: field(match[1], 'pubDate') || field(match[1], 'PubDate'),
}))

const has = (text, words) => words.some((word) => text.includes(word))

export const classifyOperationNotice = (item) => {
  const text = `${item.title} ${item.description}`
  if (!text.includes('野柳地質公園')) return null
  if (has(text, ['重新開放', '恢復開放', '恢復營運'])) return 'reopened'
  if (has(text, ['封園', '園區封閉', '全面暫停營業', '暫停開放'])) return 'full-closure'
  if (has(text, ['第一區', '燭台石景觀區', '部分封閉', '部分區域'])) return 'partial-closure'
  return null
}

export const normalizeYehliuOperation = (xml, fetchedAt = new Date().toISOString()) => {
  const relevant = parseRssItems(xml)
    .map((item) => ({ ...item, state: classifyOperationNotice(item) }))
    .filter((item) => item.state)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
  const latest = relevant[0]
  if (!latest) return {
    fetchedAt, publishedAt: null, sourceUrl: 'https://www.northguan-nsa.gov.tw/user/xmlRss.aspx?Lang=1&SNo=03000118',
    sourceTitle: '北觀處最新消息 RSS', state: 'no-active-closure-notice', matchedReason: '野柳地質公園 관련 통제 공지를 찾지 못함', excerpt: '',
  }
  return {
    fetchedAt, publishedAt: latest.publishedAt || null, sourceUrl: latest.link || 'https://www.northguan-nsa.gov.tw/user/xmlRss.aspx?Lang=1&SNo=03000118',
    sourceTitle: latest.title, state: latest.state, matchedReason: latest.title, excerpt: latest.description.slice(0, 240),
  }
}

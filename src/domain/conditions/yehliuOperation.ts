export type YehliuOperationState = 'no-active-closure-notice' | 'partial-closure' | 'full-closure' | 'reopened' | 'unknown'

export interface YehliuOperationSnapshot {
  fetchedAt: string | null; publishedAt: string | null; sourceUrl: string; sourceTitle: string
  state: YehliuOperationState; matchedReason: string; excerpt: string
}

const unknownSnapshot = (reason: string): YehliuOperationSnapshot => ({
  fetchedAt: null, publishedAt: null, sourceUrl: 'https://www.ylgeopark.org.tw/NewsView/Index?type=NT0003',
  sourceTitle: '예류지질공원 긴급 공지', state: 'unknown', matchedReason: reason, excerpt: '',
})

export const normalizeSnapshotFreshness = (snapshot: YehliuOperationSnapshot, now = Date.now()) => {
  if (!snapshot.fetchedAt) return snapshot
  if (now - Date.parse(snapshot.fetchedAt) > 36 * 60 * 60 * 1000) return { ...snapshot, state: 'unknown' as const, matchedReason: '공식 공지 스냅샷이 36시간보다 오래되어 다시 확인이 필요합니다.' }
  return snapshot
}

export const fetchYehliuOperation = async (): Promise<YehliuOperationSnapshot> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/yehliu-operation.json`, { cache: 'no-store' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return normalizeSnapshotFreshness(await response.json() as YehliuOperationSnapshot)
  } catch { return unknownSnapshot('공식 운영상태 스냅샷을 불러오지 못했습니다.') }
}

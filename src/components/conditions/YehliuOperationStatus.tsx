import { AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react'
import type { YehliuOperationSnapshot } from '../../domain/conditions/yehliuOperation'

const labels = {
  'no-active-closure-notice': '공지상 통제 없음', 'partial-closure': '일부 구역 통제', 'full-closure': '전면 폐쇄',
  reopened: '재개방 공지 확인', unknown: '공식 상태 확인 필요',
} as const

export function YehliuOperationStatus({ snapshot }: { snapshot: YehliuOperationSnapshot | null }) {
  const state = snapshot?.state ?? 'unknown'
  const Icon = state === 'unknown' || state === 'full-closure' ? AlertTriangle : ShieldCheck
  return <aside className={`yehliu-operation yehliu-operation--${state}`} aria-label="예류 공식 운영상태">
    <Icon size={19} aria-hidden="true" /><div><strong>{labels[state]}</strong><small>{snapshot?.matchedReason ?? '공식 공지를 아직 불러오지 못했습니다.'}</small></div>
    <a href={snapshot?.sourceUrl ?? 'https://www.ylgeopark.org.tw/NewsView/Index?type=NT0003'} target="_blank" rel="noreferrer">공식 공지 <ExternalLink size={14} aria-hidden="true" /></a>
  </aside>
}

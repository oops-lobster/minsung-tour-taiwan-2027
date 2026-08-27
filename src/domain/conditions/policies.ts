import type { DayConditionPolicy } from './types'

export const dayConditionPolicies: Record<string, DayConditionPolicy> = {
  'day-1': { kind: 'rain-only', dayId: 'day-1', activityWindow: { startHour: 13, endHour: 19 }, affectedActivity: '린안타이·백석호·벽산암 야외 동선' },
  'day-2': { kind: 'multi-factor', dayId: 'day-2', locations: [
    { id: 'yehliu', startHour: 9, endHour: 11 }, { id: 'shifen', startHour: 13, endHour: 15 }, { id: 'jiufen', startHour: 16, endHour: 20 },
  ] },
  'day-3': { kind: 'rain-only', dayId: 'day-3', activityWindow: { startHour: 9, endHour: 17 }, affectedActivity: '용캉제·칭톈제 산책' },
  'day-4': { kind: 'conditional-stop', dayId: 'day-4', affectedPlaceId: 'botanical', activityWindow: { startHour: 8, endHour: 10 } },
}

export interface RainSignal { currentPrecipitation?: number; precipitation?: number; rainProbability?: number }

// mm 단위의 실제·예상 강수와 강수확률을 함께 봅니다. 확률만 높고 강수량이
// 사실상 0인 경우에는 일정을 바꾸지 않아 짧은 예보 변화에 과민 반응하지 않습니다.
export const evaluateRainOnly = (signal: RainSignal) => {
  const rainingNow = (signal.currentPrecipitation ?? 0) >= 0.2
  const meaningfulTotal = (signal.precipitation ?? 0) >= 1
  const probableMeaningfulRain = (signal.rainProbability ?? 0) >= 50 && (signal.precipitation ?? 0) >= 0.2
  return rainingNow || meaningfulTotal || probableMeaningfulRain
}

export const conditionPolicySummaries = [
  { dayId: 'day-1', title: '비만 일정 분기에 사용', detail: '바람만 강하면 기본 일정 유지 · 비면 실내 그룹 선택' },
  { dayId: 'day-2', title: '비·돌풍·파고·운영 공지', detail: '예류·스펀·지우펀 시간대를 함께 판정' },
  { dayId: 'day-3', title: '비면 산책만 축소', detail: '고궁·식사·호텔 휴식·85TD는 유지' },
  { dayId: 'day-4', title: '식물원만 조건부', detail: '비면 식물원 생략 · 체크아웃·비전옥·공항 유지' },
]

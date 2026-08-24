import { days, tripStatuses } from './trip'

const koreaDepartureStatus = tripStatuses.find((status) => status.label === '한국 출발 차량')

if (koreaDepartureStatus) {
  koreaDepartureStatus.detail = '글로벌25시콜리무진 · Genesis G90 Long Wheel Base 4인승'
  koreaDepartureStatus.status = '견적 확정 · 12월 예약 예정'
  koreaDepartureStatus.tone = 'progress'
}

const day1 = days.find((day) => day.id === 'day-1')

if (day1) {
  const departureIndex = day1.schedule.findIndex((item) => item.title.includes('목동 출발'))

  if (departureIndex >= 0) {
    day1.schedule[departureIndex] = {
      ...day1.schedule[departureIndex],
      time: '04:10–04:20',
      title: '목동 출발 · G90 LWB 4인승',
      description: '글로벌25시콜리무진의 Genesis G90 Long Wheel Base 4인승으로 인천공항 제2터미널까지 이동할 계획입니다. 성인 3명과 캐리어 2개 기준 견적은 확인했고 예약금은 없습니다. 현재는 사전 견적 단계이며 2026년 12월 전후 실제 예약을 진행할 예정입니다.',
      transport: '글로벌25시콜리무진 · Genesis G90 LWB 4인승',
      tags: ['견적 확정', '예약금 없음', '12월 예약 예정'],
    }
  }
}

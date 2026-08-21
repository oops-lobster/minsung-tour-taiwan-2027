import { days, tripStatuses } from './trip'
import { getDayPlans } from './weatherPlans'

const dayOne = days.find((day) => day.id === 'day-1')

if (dayOne) {
  const alleyhouse = dayOne.schedule.find((item) => item.title === '弄宅咖啡')
  if (alleyhouse) {
    alleyhouse.description = '2027년 2월 20일 13:30, 성인 3명 좌석을 DM으로 예약 확정했습니다. My灶 점심 뒤 들르는 공통 일정으로, 비가 와도 유지합니다. 점심이 늦어지면 카페 체류만 조금 줄여 다음 일정에 맞춥니다.'
    alleyhouse.tags = ['13:30 예약 확정', '3인', 'Plan A/B 공통']
  }

  if (!tripStatuses.some((status) => status.label === '弄宅咖啡')) {
    const pickupIndex = tripStatuses.findIndex((status) => status.label === 'Day 1 공항 픽업')
    tripStatuses.splice(Math.max(0, pickupIndex + 1), 0, {
      label: '弄宅咖啡',
      detail: 'Day 1 · 13:30 · 성인 3명',
      status: '예약 확정',
      tone: 'confirmed',
      icon: 'meal',
    })
  }

  const planB = getDayPlans(dayOne).find((plan) => plan.id === 'plan-b')
  if (planB) {
    const schedule = planB.schedule
    const myZaoIndex = schedule.findIndex((item) => item.title === 'My灶 점심')

    if (myZaoIndex >= 0 && !schedule.some((item) => item.title === '弄宅咖啡')) {
      schedule.splice(myZaoIndex + 1, 0, {
        time: '13:30–14:10',
        title: '弄宅咖啡',
        localName: '弄宅咖啡 Alleyhouse Coffee',
        description: '2027년 2월 20일 13:30, 성인 3명 예약 확정. 우천 Plan B에서도 그대로 들릅니다. 비 오는 오후의 작은 주택 카페에서 잠깐 쉬고 시립미술관으로 이동합니다.',
        tags: ['13:30 예약 확정', 'Plan A/B 공통'],
        placeId: 'alleyhouse',
      })
    }

    const museumTransfer = schedule.find((item) => item.title === '타이베이 시립미술관 이동')
    if (museumTransfer) {
      museumTransfer.time = '14:10–14:25'
      museumTransfer.description = '弄宅咖啡에서 타이베이 시립미술관까지 택시로 이동합니다.'
    }

    const museum = schedule.find((item) => item.title === '타이베이 시립미술관')
    if (museum) {
      museum.time = '14:25–16:35'
      museum.description = '비 오는 오후에는 백석호 대신 타이베이 현대미술을 천천히 봅니다. 약 2시간 10분을 기본으로 두고, 전시와 현장 상황에 맞춰 조금 조절합니다.'
      museum.tags = ['실내 일정', '약 2시간 10분']
    }

    const teaTransfer = schedule.find((item) => item.title === '동먼 찻집으로 이동')
    if (teaTransfer) {
      teaTransfer.time = '16:35–17:00'
      teaTransfer.description = '미술관 관람을 마치고 동먼의 작은 대만차 찻집으로 택시 이동합니다.'
    }

    planB.route.summary = '공항과 호텔을 거쳐 My灶에서 점심을 먹고, 예약된 弄宅咖啡에서 잠시 쉰 뒤 타이베이 시립미술관과 小隱茶庵으로 이어집니다. 19:00 小統一牛排 저녁은 날씨와 관계없이 고정입니다.'

    const routeStops = planB.route.stops
    const myZaoStopIndex = routeStops.findIndex((stop) => stop.placeId === 'my-zao')
    if (myZaoStopIndex >= 0 && !routeStops.some((stop) => stop.placeId === 'alleyhouse')) {
      routeStops.splice(myZaoStopIndex + 1, 0, {
        placeId: 'alleyhouse',
        label: '弄宅咖啡',
        note: '13:30 · 3인 예약 확정',
      })
    }
  }
}

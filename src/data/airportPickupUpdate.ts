import { imageSourceByFile, imageSources, type ImageSource } from './imageSources'
import { days, tripStatuses, type TimelineItem } from './trip'

const airportPickupPhotos: ImageSource[] = [
  {
    file: 'airport-pickup-mercedes-cabin.webp',
    place: '宇航富豪 Mercedes 항공의자 차량 실내',
    alt: '별빛 천장 조명 아래 독립형 VIP 시트가 배치된 Mercedes 공항 픽업 차량 실내',
    sourceUrl: '',
    author: '宇航富豪 제공',
    license: '예약 상담 시 업체 제공 사진',
    attributionRequired: false,
    retrievedAt: '2026-08-25',
  },
  {
    file: 'airport-pickup-mercedes-vip-seats.webp',
    place: '宇航富豪 Mercedes 항공의자 VIP 시트',
    alt: '도어를 연 상태에서 독립형 항공의자 두 좌석과 넓은 레그룸이 보이는 Mercedes 차량 실내',
    sourceUrl: '',
    author: '宇航富豪 제공',
    license: '예약 상담 시 업체 제공 사진',
    attributionRequired: false,
    retrievedAt: '2026-08-25',
  },
]

for (const photo of airportPickupPhotos) {
  if (!imageSourceByFile[photo.file]) {
    imageSources.push(photo)
    imageSourceByFile[photo.file] = photo
  }
}

const pickupStatus = tripStatuses.find((status) => status.label === 'Day 1 공항 픽업')

if (pickupStatus) {
  pickupStatus.detail = '宇航富豪 · Mercedes 항공의자 · 피켓 포함 NT$1,700'
  pickupStatus.status = '예약 확정'
  pickupStatus.tone = 'confirmed'
}

const day1 = days.find((day) => day.id === 'day-1')

if (day1) {
  day1.transport = 'G90 LWB 출국 · 宇航富豪 Mercedes 항공의자 공항 픽업 · 택시 · 도보'

  const pickupIndex = day1.schedule.findIndex((item) =>
    item.title.includes('공항 픽업 기사 미팅') || item.title.includes('宇航富豪 미팅'),
  )

  if (pickupIndex >= 0) {
    day1.schedule[pickupIndex] = {
      ...day1.schedule[pickupIndex],
      time: '약 10:35–10:55 예상',
      title: '宇航富豪 미팅 · Mercedes 항공의자 차량',
      localName: '宇航富豪 · 優惠升級賓士航空椅',
      description: '2027-02-20 09:50 OZ711편으로 타오위안공항 제2터미널에 도착한 뒤 기사님을 만납니다. 성인 3명, 중형 캐리어 1개와 기내용 캐리어 1개, 연락인 Raymin 조건으로 사진 속 Mercedes 항공의자 차량 배차가 확인되었습니다. 기사님이 수하물을 도와주고 공항 도착 후 85분까지 대기하며, 예약금 없이 이용 당일 기사님께 현금으로 결제합니다. 피켓 서비스가 포함된 최종 차량 요금은 NT$1,700입니다.',
      transport: '宇航富豪 · Mercedes-Benz 항공의자 차량',
      tags: ['예약 확정', '사진 속 차량', '피켓 포함 NT$1,700', '85분 대기', '수하물 도움', '당일 현금 결제'],
      image: 'airport-pickup-mercedes-cabin.webp',
      mapQuery: 'Taipei Garden Hotel',
      placeId: 'hotel',
    }

    const vehicleInfo: TimelineItem = {
      time: '차량 정보',
      title: 'Mercedes 항공의자 · VIP 실내',
      localName: '賓士航空椅',
      description: '업체가 실제 배차 차량으로 확인한 실내입니다. 독립형 항공의자에 전동 리클라이닝·레그레스트·통풍·열선·마사지 기능이 있다고 확인받았습니다. 첫날 공항에서 호텔까지 부모님이 편하게 이동하는 데 초점을 둔 선택입니다.',
      tags: ['독립형 항공의자', '전동 리클라이닝', '레그레스트', '통풍', '열선', '마사지'],
      image: 'airport-pickup-mercedes-vip-seats.webp',
      optional: true,
    }

    const existingInfoIndex = day1.schedule.findIndex((item) => item.title === vehicleInfo.title)
    if (existingInfoIndex >= 0) {
      day1.schedule[existingInfoIndex] = vehicleInfo
    } else {
      day1.schedule.splice(pickupIndex + 1, 0, vehicleInfo)
    }
  }
}

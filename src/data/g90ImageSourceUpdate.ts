import { imageSourceByFile, imageSources, type ImageSource } from './imageSources'

const g90RearSource: ImageSource = {
  file: 'g90-lwb-4seat-rear.webp',
  place: 'Genesis G90 Long Wheel Base 4인승 후석',
  alt: '베이지 가죽 독립 후석 두 자리와 중앙 콘솔, 펼쳐진 레그레스트가 보이는 제네시스 G90 롱휠베이스 4인승 후석',
  sourceUrl: '',
  author: '글로벌25시콜리무진 제공',
  license: '예약 문의 시 업체 제공 사진',
  attributionRequired: false,
  retrievedAt: '2026-08-24',
}

if (!imageSourceByFile[g90RearSource.file]) {
  imageSources.push(g90RearSource)
  imageSourceByFile[g90RearSource.file] = g90RearSource
}

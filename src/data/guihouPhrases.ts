import { taiwanPhrases, type TaiwanPhrase } from './taiwanPhrases.ts'

const additionalPhrases: TaiwanPhrase[] = [
  { id: 'guihou-sashimi-recommend', category: '귀후어항', critical: true, korean: '회로 먹는다면 오늘 어떤 생선이 좋아요?', traditionalChinese: '如果要做生魚片，今天推薦哪一種？', pinyin: 'Rúguǒ yào zuò shēngyúpiàn, jīntiān tuījiàn nǎ yì zhǒng?', toneNumbers: 'ru2 guo3 yao4 zuo4 sheng1 yu2 pian4, jin1 tian1 tui1 jian4 na3 yi4 zhong3?', koreanPronunciation: '루궈 야오 쭤 셩위편, 진톈 퇴지엔 나 이 종?', usage: '생식용 여부와 오늘 추천을 함께 확인할 때' },
  { id: 'guihou-no-salmon', category: '귀후어항', critical: true, korean: '연어 말고 오늘 상태 좋은 다른 생선으로 먹고 싶어요.', traditionalChinese: '不要鮭魚，想吃其他今天比較好的魚。', pinyin: 'Búyào guīyú, xiǎng chī qítā jīntiān bǐjiào hǎo de yú.', toneNumbers: 'bu2 yao4 gui1 yu2, xiang3 chi1 qi2 ta1 jin1 tian1 bi3 jiao4 hao3 de5 yu2.', koreanPronunciation: '부야오 구이위, 샹 츠 치타 진톈 비자오 하오더 위.', usage: '연어를 제외할 때' },
  { id: 'guihou-sashimi-and-nigiri', category: '귀후어항', korean: '사시미와 니기리초밥을 먹고 싶어요.', traditionalChinese: '我們想吃生魚片跟握壽司。', pinyin: 'Wǒmen xiǎng chī shēngyúpiàn gēn wòshòusī.', toneNumbers: 'wo3 men5 xiang3 chi1 sheng1 yu2 pian4 gen1 wo4 shou4 si1.', koreanPronunciation: '워먼 샹 츠 셩위편 건 워쇼우쓰.', usage: '두 가지 구성이 가능한지 물을 때' },
  { id: 'guihou-seafood-subtotal', category: '가격 확인', korean: '해산물 자체 가격은 얼마예요?', traditionalChinese: '海鮮本身多少錢？', pinyin: 'Hǎixiān běnshēn duōshǎo qián?', toneNumbers: 'hai3 xian1 ben3 shen1 duo1 shao3 qian2?', koreanPronunciation: '하이셴 번션 두오샤오 치엔?', usage: '조리비를 빼고 재료값만 확인할 때' },
  { id: 'guihou-sea-view-seat', category: '식당', korean: '바다가 보이는 자리로 안내해주실 수 있을까요?', traditionalChinese: '請問可以安排看得到海的座位嗎？', pinyin: 'Qǐngwèn kěyǐ ānpái kàn de dào hǎi de zuòwèi ma?', toneNumbers: 'qing3 wen4 ke3 yi3 an1 pai2 kan4 de5 dao4 hai3 de5 zuo4 wei4 ma5?', koreanPronunciation: '칭원 커이 안파이 칸더다오 하이더 쭤웨이 마?', usage: '주문 전에 좌석 운영 방식을 확인할 때' },
  { id: 'guihou-crab-check', category: '귀후어항', korean: '지금은 완리게 주산기가 아닌데, 오늘 이 꽃게는 살이 차 있나요?', traditionalChinese: '現在不是萬里蟹的主要產季，今天這隻花蟹肉飽嗎？', pinyin: 'Xiànzài bú shì Wànlǐxiè de zhǔyào chǎnjì, jīntiān zhè zhī huāxiè ròu bǎo ma?', toneNumbers: 'xian4 zai4 bu2 shi4 wan4 li3 xie4 de5 zhu3 yao4 chan3 ji4, jin1 tian1 zhe4 zhi1 hua1 xie4 rou4 bao3 ma5?', koreanPronunciation: '셴짜이 부 스 완리셰더 주야오 찬지, 진톈 저 즈 화셰 로우 바오 마?', usage: '2월에 게 상태를 확인할 때' },
  { id: 'guihou-smalltalk-quality', category: '기본 회화', korean: '대만 쪽 생선 품질이 정말 좋네요.', traditionalChinese: '台灣這邊的魚品質真的很好耶。', pinyin: 'Táiwān zhèbiān de yú pǐnzhí zhēnde hěn hǎo ye.', toneNumbers: 'tai2 wan1 zhe4 bian1 de5 yu2 pin3 zhi2 zhen1 de5 hen3 hao3 ye5.', koreanPronunciation: '타이완 저볜더 위 핀즈 전더 헌 하오 예.', usage: '좋은 생선을 봤을 때 가볍게 칭찬하기' },
  { id: 'guihou-restroom', category: '기본 회화', korean: '화장실과 엘리베이터는 어디예요?', traditionalChinese: '請問洗手間跟電梯在哪裡？', pinyin: 'Qǐngwèn xǐshǒujiān gēn diàntī zài nǎlǐ?', toneNumbers: 'qing3 wen4 xi3 shou3 jian1 gen1 dian4 ti1 zai4 na3 li3?', koreanPronunciation: '칭원 시쇼우지엔 건 뎬티 짜이 나리?', usage: '도착 직후 편의시설을 찾을 때' },
]

const reusedIds = new Set([
  'harbor-fresh-fish', 'harbor-price', 'harbor-price-per-jin', 'harbor-weight', 'harbor-cooking-fee',
  'harbor-fee-included', 'harbor-total', 'harbor-wait-before-cutting', 'harbor-calculator', 'harbor-no-expensive',
  'listen-phone-polite', 'listen-slowly', 'listen-again',
])

export const guihouPhrases = [...taiwanPhrases.filter((phrase) => reusedIds.has(phrase.id)), ...additionalPhrases]

export const guihouPriceConfirmationPhraseIds = [
  'harbor-price-per-jin', 'harbor-weight', 'guihou-seafood-subtotal', 'harbor-cooking-fee',
  'harbor-total', 'harbor-wait-before-cutting',
] as const

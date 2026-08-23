export const taiwanPhraseCategories = [
  '귀후어항',
  '식당',
  '가격 확인',
  '택시',
  '호텔',
  '쇼핑',
  '예약',
  '기본 회화',
] as const

export type TaiwanPhraseCategory = (typeof taiwanPhraseCategories)[number]

export interface TaiwanPhrase {
  id: string
  category: TaiwanPhraseCategory
  korean: string
  traditionalChinese: string
  pinyin: string
  toneNumbers: string
  koreanPronunciation: string
  usage?: string
  critical?: boolean
}

export const defaultTaiwanFavoriteIds = [
  'harbor-fresh-fish',
  'harbor-price-per-jin',
  'harbor-cooking-fee',
  'harbor-total',
  'harbor-wait-before-cutting',
  'harbor-calculator',
  'listen-phone-polite',
  'listen-slowly',
  'listen-again',
] as const

export const listeningRequestPhraseIds = [
  'listen-phone-polite',
  'listen-slowly',
  'listen-again',
] as const

export const taiwanPhrases: TaiwanPhrase[] = [
  {
    id: 'listen-phone-polite', category: '기본 회화', critical: true,
    korean: '죄송하지만 제가 중국어 듣기가 익숙하지 않아서, 휴대폰을 향해 말씀해주실 수 있을까요?',
    traditionalChinese: '不好意思，我中文聽得不太好，可以麻煩您對著手機說嗎？',
    pinyin: 'Bù hǎoyìsi, wǒ Zhōngwén tīng de bú tài hǎo, kěyǐ máfan nín duìzhe shǒujī shuō ma?',
    toneNumbers: 'bu4 hao3 yi4 si5, wo3 zhong1 wen2 ting1 de5 bu2 tai4 hao3, ke3 yi3 ma2 fan5 nin2 dui4 zhe5 shou3 ji1 shuo1 ma5?',
    koreanPronunciation: '부 하오이쓰, 워 중원 팅더 부타이 하오, 커이 마판 닌 뚜이저 쇼우지 슈어 마?',
    usage: '상대방에게 휴대폰을 향해 말해 달라고 정중하게 부탁할 때',
  },
  {
    id: 'listen-phone-short', category: '기본 회화', critical: true,
    korean: '제가 중국어를 잘 못 알아들어요. 휴대폰을 향해 말씀해주실래요?',
    traditionalChinese: '我中文聽不太懂，可以對著手機說嗎？',
    pinyin: 'Wǒ Zhōngwén tīng bú tài dǒng, kěyǐ duìzhe shǒujī shuō ma?',
    toneNumbers: 'wo3 zhong1 wen2 ting1 bu2 tai4 dong3, ke3 yi3 dui4 zhe5 shou3 ji1 shuo1 ma5?',
    koreanPronunciation: '워 중원 팅 부타이 동, 커이 뚜이저 쇼우지 슈어 마?',
    usage: '녹음을 부탁하는 짧은 표현',
  },
  {
    id: 'listen-slowly', category: '기본 회화', critical: true,
    korean: '조금 천천히 말씀해주세요.', traditionalChinese: '請說慢一點。',
    pinyin: 'Qǐng shuō màn yìdiǎn.', toneNumbers: 'qing3 shuo1 man4 yi4 dian3.', koreanPronunciation: '칭 슈어 만 이디얌.',
    usage: '말이 빠를 때',
  },
  {
    id: 'listen-again', category: '기본 회화', critical: true,
    korean: '한 번 더 말씀해주실 수 있을까요?', traditionalChinese: '可以再說一次嗎？',
    pinyin: 'Kěyǐ zài shuō yí cì ma?', toneNumbers: 'ke3 yi3 zai4 shuo1 yi2 ci4 ma5?', koreanPronunciation: '커이 재이 슈어 이 츠 마?',
    usage: '들은 말을 다시 확인할 때',
  },
  {
    id: 'harbor-fresh-fish', category: '귀후어항', critical: true,
    korean: '오늘 어떤 생선이 제일 신선해요?', traditionalChinese: '今天什麼魚比較新鮮？',
    pinyin: 'Jīntiān shénme yú bǐjiào xīnxiān?', toneNumbers: 'jin1 tian1 shen2 me5 yu2 bi3 jiao4 xin1 xian1', koreanPronunciation: '진폐 션머 위 비짜오 신션?',
    usage: '오늘 좋은 생선부터 물어볼 때',
  },
  {
    id: 'harbor-sashimi-nigiri', category: '귀후어항',
    korean: '사시미랑 니기리초밥을 먹고 싶어요. 연어는 빼고 오늘 좋은 생선으로 추천해주세요.',
    traditionalChinese: '我們想吃生魚片跟握壽司，不要鮭魚。請用今天比較好的魚幫我們推薦。',
    pinyin: 'Wǒmen xiǎng chī shēngyúpiàn gēn wòshòusī, búyào guīyú. Qǐng yòng jīntiān bǐjiào hǎo de yú bāng wǒmen tuījiàn.',
    toneNumbers: 'wo3 men5 xiang3 chi1 sheng1 yu2 pian4 gen1 wo4 shou4 si1, bu2 yao4 gui1 yu2. qing3 yong4 jin1 tian1 bi3 jiao4 hao3 de5 yu2 bang1 wo3 men5 tui1 jian4.',
    koreanPronunciation: '워먼 샹 츠 션위편 겐 워슈쓰, 부야오 귀위. 칭 용 진폐 비짜오 하오더 위 방 워먼 퇴진.',
    usage: '연어를 빼고 모둠 회와 초밥을 주문할 때',
  },
  {
    id: 'harbor-three-budget', category: '귀후어항',
    korean: '저희 세 명이고 예산은 대략 2천 대만달러 정도예요. 이 정도로 맞춰주실 수 있어요?',
    traditionalChinese: '我們三個人，預算抓兩千塊左右，可以幫我們配嗎？',
    pinyin: 'Wǒmen sān ge rén, yùsuàn zhuā liǎngqiān kuài zuǒyòu, kěyǐ bāng wǒmen pèi ma?',
    toneNumbers: 'wo3 men5 san1 ge5 ren2, yu4 suan4 zhua1 liang3 qian1 kuai4 zuo3 you4, ke3 yi3 bang1 wo3 men5 pei4 ma5?', koreanPronunciation: '워먼 산거 런, 위쉬안 좌 량쳘 콰이 좌우, 커이 방 워먼 페이 마?',
    usage: '3인 주문 범위를 먼저 맞출 때',
  },
  {
    id: 'harbor-price', category: '가격 확인', korean: '이거 얼마예요?', traditionalChinese: '這個怎麼賣？',
    pinyin: 'Zhège zěnme mài?', toneNumbers: 'zhe4 ge5 zen3 me5 mai4?', koreanPronunciation: '저거 짠머 마이?', usage: '판매 방식과 가격을 물을 때',
  },
  {
    id: 'harbor-price-per-jin', category: '가격 확인', critical: true, korean: '한 台斤(600g)에 얼마예요?', traditionalChinese: '一斤多少錢？',
    pinyin: 'Yì jīn duōshǎo qián?', toneNumbers: 'yi4 jin1 duo1 shao3 qian2?', koreanPronunciation: '이 진 두오샤오 쳨?', usage: '생선 단가를 600g 기준으로 확인할 때',
  },
  {
    id: 'harbor-weight', category: '가격 확인', korean: '이건 대략 무게가 얼마나 돼요?', traditionalChinese: '這個大概多重？',
    pinyin: 'Zhège dàgài duō zhòng?', toneNumbers: 'zhe4 ge5 da4 gai4 duo1 zhong4?', koreanPronunciation: '저거 다가이 두오 중?', usage: '손질 전 무게를 확인할 때',
  },
  {
    id: 'harbor-cooking-fee', category: '가격 확인', critical: true, korean: '조리비는 어떻게 계산해요?', traditionalChinese: '料理費怎麼算？',
    pinyin: 'Liàolǐfèi zěnme suàn?', toneNumbers: 'liao4 li3 fei4 zen3 me5 suan4?', koreanPronunciation: '랴오리페이 짠머 쉬안?', usage: '재료값과 별도인 조리비를 확인할 때',
  },
  {
    id: 'harbor-fee-included', category: '가격 확인', korean: '이 가격에 조리비가 포함돼 있어요?', traditionalChinese: '這個價格有包含料理費嗎？',
    pinyin: 'Zhège jiàgé yǒu bāohán liàolǐfèi ma?', toneNumbers: 'zhe4 ge5 jia4 ge2 you3 bao1 han2 liao4 li3 fei4 ma5?', koreanPronunciation: '저거 짜거 요우 바오한 랴오리페이 마?', usage: '제시된 가격의 포함 범위를 물을 때',
  },
  {
    id: 'harbor-total', category: '가격 확인', critical: true, korean: '전부 합하면 얼마예요?', traditionalChinese: '全部加起來多少錢？',
    pinyin: 'Quánbù jiā qǐlái duōshǎo qián?', toneNumbers: 'quan2 bu4 jia1 qi3 lai2 duo1 shao3 qian2?', koreanPronunciation: '취안부 짜 치라이 두오샤오 쳨?', usage: '재료비와 조리비를 모두 합친 금액을 확인할 때',
  },
  {
    id: 'harbor-wait-before-cutting', category: '가격 확인', critical: true, korean: '아직 자르지 마세요. 가격부터 확인할게요.', traditionalChinese: '先不要切，我先確認一下價錢。',
    pinyin: 'Xiān búyào qiē, wǒ xiān quèrèn yíxià jiàqián.', toneNumbers: 'xian1 bu2 yao4 qie1, wo3 xian1 que4 ren4 yi2 xia4 jia4 qian2.', koreanPronunciation: '셌 부야오 컨, 워 셌 취어런 이샤 짜쳘.', usage: '한마리를 자르기 전 총액을 확인할 때',
  },
  {
    id: 'harbor-calculator', category: '가격 확인', critical: true, korean: '계산기에 찍어서 보여주실 수 있어요?', traditionalChinese: '可以打在計算機上給我看嗎？',
    pinyin: 'Kěyǐ dǎ zài jìsuànjī shàng gěi wǒ kàn ma?', toneNumbers: 'ke3 yi3 da3 zai4 ji4 suan4 ji1 shang4 gei3 wo3 kan4 ma5?', koreanPronunciation: '커이 다 재이 지쉬안지 상 게이 워 칸 마?', usage: '숫자를 잘못 들을 수 있을 때',
  },
  {
    id: 'harbor-no-expensive', category: '귀후어항', korean: '랍스터, 게나 너무 비싼 건 필요 없고 오늘 신선하고 가격 괜찮은 걸로 주세요.', traditionalChinese: '不用龍蝦、蟹蛹或太貴的，今天新鮮、價格合理的就好。',
    pinyin: 'Búyòng lóngxiā, pàngxiè huò tài guì de, jīntiān xīnxiān, jiàgé hélǐ de jiù hǎo.', toneNumbers: 'bu2 yong4 long2 xia1, pang2 xie4 huo4 tai4 gui4 de5, jin1 tian1 xin1 xian1, jia4 ge2 he2 li3 de5 jiu4 hao3.', koreanPronunciation: '부용 롱샤, 팡셰 혹 타이 귀이더, 진폐 신션, 짜거 허리더 지우 하오.', usage: '북해안의 신선도를 가볍게 즐길 때',
  },
  { id: 'restaurant-three', category: '식당', korean: '세 명이에요.', traditionalChinese: '我們三位。', pinyin: 'Wǒmen sān wèi.', toneNumbers: 'wo3 men5 san1 wei4.', koreanPronunciation: '워먼 산 웨이.', usage: '식당에 들어갈 때' },
  { id: 'restaurant-reserved', category: '예약', korean: '민성 이름으로 예약했어요.', traditionalChinese: '我們用 Minseong 的名字訂位。', pinyin: 'Wǒmen yòng Minseong de míngzi dìngwèi.', toneNumbers: 'wo3 men5 yong4 Minseong de5 ming2 zi5 ding4 wei4.', koreanPronunciation: '워먼 용 민성더 밍쓰 딩웨이.', usage: '예약 확인 시' },
  { id: 'restaurant-recommend', category: '식당', korean: '추천 메뉴가 뭐예요?', traditionalChinese: '請問有什麼推薦的菜？', pinyin: 'Qǐngwèn yǒu shénme tuījiàn de cài?', toneNumbers: 'qing3 wen4 you3 shen2 me5 tui1 jian4 de5 cai4?', koreanPronunciation: '칭원 요우 션머 퇴진더 차이?', usage: '가게 대표 메뉴를 물을 때' },
  { id: 'restaurant-not-spicy', category: '식당', korean: '안 맵게 해주세요.', traditionalChinese: '請做不辣的。', pinyin: 'Qǐng zuò bú là de.', toneNumbers: 'qing3 zuo4 bu2 la4 de5.', koreanPronunciation: '칭 좌 부 라더.', usage: '매운 양념을 피할 때' },
  { id: 'restaurant-takeout', category: '식당', korean: '포장해주세요.', traditionalChinese: '請幫我們外帶。', pinyin: 'Qǐng bāng wǒmen wàidài.', toneNumbers: 'qing3 bang1 wo3 men5 wai4 dai4.', koreanPronunciation: '칭 방 워먼 와이다이.', usage: '남은 음식이나 간식을 포장할 때' },
  { id: 'restaurant-bill', category: '식당', korean: '계산해주세요.', traditionalChinese: '麻煩買單，謝謝。', pinyin: 'Máfan mǎidān, xièxie.', toneNumbers: 'ma2 fan5 mai3 dan1, xie4 xie5.', koreanPronunciation: '마판 마이단, 셰셰.', usage: '식사를 마칠 때' },
  { id: 'taxi-destination', category: '택시', korean: '이 주소로 가주세요.', traditionalChinese: '請到這個地址。', pinyin: 'Qǐng dào zhège dìzhǐ.', toneNumbers: 'qing3 dao4 zhe4 ge5 di4 zhi3.', koreanPronunciation: '칭 다오 저거 디지.', usage: '택시 기사에게 주소를 보여줄 때' },
  { id: 'taxi-stop-here', category: '택시', korean: '여기에 세워주세요.', traditionalChinese: '請停在這裡。', pinyin: 'Qǐng tíng zài zhèlǐ.', toneNumbers: 'qing3 ting2 zai4 zhe4 li3.', koreanPronunciation: '칭 팅 재이 저리.', usage: '목적지 근처에서 내릴 때' },
  { id: 'taxi-wait', category: '택시', korean: '여기서 조금 기다려주세요.', traditionalChinese: '請在這裡等我們一下。', pinyin: 'Qǐng zài zhèlǐ děng wǒmen yíxià.', toneNumbers: 'qing3 zai4 zhe4 li3 deng3 wo3 men5 yi2 xia4.', koreanPronunciation: '칭 재이 저리 등 워먼 이샤.', usage: '기사님에게 잠시 대기를 부탁할 때' },
  { id: 'hotel-checkin', category: '호텔', korean: '체크인하러 왔어요.', traditionalChinese: '我們要辦理入住。', pinyin: 'Wǒmen yào bànlǐ rùzhù.', toneNumbers: 'wo3 men5 yao4 ban4 li3 ru4 zhu4.', koreanPronunciation: '워먼 야오 반리 루주.', usage: '호텔 로비에서' },
  { id: 'hotel-luggage', category: '호텔', korean: '짐을 맡길 수 있을까요?', traditionalChinese: '可以幫我們寄放行李嗎？', pinyin: 'Kěyǐ bāng wǒmen jìfàng xínglǐ ma?', toneNumbers: 'ke3 yi3 bang1 wo3 men5 ji4 fang4 xing2 li3 ma5?', koreanPronunciation: '커이 방 워먼 지팡 싱리 마?', usage: '체크인 전·체크아웃 후' },
  { id: 'hotel-taxi', category: '호텔', korean: '택시를 불러주실 수 있을까요?', traditionalChinese: '可以幫我們叫計程車嗎？', pinyin: 'Kěyǐ bāng wǒmen jiào jìchéngchē ma?', toneNumbers: 'ke3 yi3 bang1 wo3 men5 jiao4 ji4 cheng2 che1 ma5?', koreanPronunciation: '커이 방 워먼 짜오 지청차 마?', usage: '호텔에서 택시를 부를 때' },
  { id: 'shopping-other-size', category: '쇼핑', korean: '다른 사이즈가 있어요?', traditionalChinese: '有其他尺寸嗎？', pinyin: 'Yǒu qítā chǐcùn ma?', toneNumbers: 'you3 qi2 ta1 chi3 cun4 ma5?', koreanPronunciation: '요우 치타 츠춘 마?', usage: '옷이나 신발을 고를 때' },
  { id: 'shopping-card', category: '쇼핑', korean: '카드 결제 가능해요?', traditionalChinese: '可以刷卡嗎？', pinyin: 'Kěyǐ shuākǎ ma?', toneNumbers: 'ke3 yi3 shua1 ka3 ma5?', koreanPronunciation: '커이 슈아카 마?', usage: '결제 전' },
  { id: 'booking-time', category: '예약', korean: '오늘 저녁 7시에 세 명 예약했어요.', traditionalChinese: '我們訂了今天晚上七點，三位。', pinyin: 'Wǒmen dìng le jīntiān wǎnshàng qī diǎn, sān wèi.', toneNumbers: 'wo3 men5 ding4 le5 jin1 tian1 wan3 shang4 qi1 dian3, san1 wei4.', koreanPronunciation: '워먼 딩러 진폐 완상 치 디얌, 산 웨이.', usage: '시간과 인원을 확인할 때' },
  { id: 'basic-thanks', category: '기본 회화', korean: '감사합니다.', traditionalChinese: '謝謝。', pinyin: 'Xièxie.', toneNumbers: 'xie4 xie5.', koreanPronunciation: '셰셰.', usage: '도움을 받았을 때' },
  { id: 'basic-sorry', category: '기본 회화', korean: '죄송합니다 / 실례합니다.', traditionalChinese: '不好意思。', pinyin: 'Bù hǎoyìsi.', toneNumbers: 'bu4 hao3 yi4 si5.', koreanPronunciation: '부 하오이쓰.', usage: '말을 거거나 양해를 구할 때' },
  { id: 'basic-restroom', category: '기본 회화', korean: '화장실이 어디예요?', traditionalChinese: '請問洗手間在哪裡？', pinyin: 'Qǐngwèn xǐshǒujiān zài nǎlǐ?', toneNumbers: 'qing3 wen4 xi3 shou3 jian1 zai4 na3 li3?', koreanPronunciation: '칭원 시쇼우진 재이 나리?', usage: '화장실을 찾을 때' },
]

export const guiHouOrderSteps = [
  '오늘 좋은 생선 물어보기',
  '단가 확인',
  '무게 확인',
  '재료값 확인',
  '조리비 확인',
  '총액 확인',
  'OK 한 뒤 손질 시작',
] as const

export const guiHouMealMemo = [
  '제철 모둠 사시미',
  '니기리 8–10피스',
  '오징어·갑오징어 또는 새우',
  '당일 좋은 생선 1마리 구이/찜',
  '채소와 국',
] as const

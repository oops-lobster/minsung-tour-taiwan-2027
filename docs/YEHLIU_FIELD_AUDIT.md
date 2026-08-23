# 예류 현장 가이드 전면 감사 체크리스트

확인일: 2026-08-23
대상 방문: 2027-02-21 09:20–10:45 (10:50 절대 마지노선)

## 감사 전 불일치

- Guide는 숫자 ID, GPS는 문자열 ID와 별도 stop 목록을 써서 입구가 중복 연결됨.
- 방문 완료와 건너뜀 상태가 서로 다른 localStorage key에 저장됨.
- 모든 코스가 같은 full polyline을 그려 Compact도 Deep 우회 구간을 표시함.
- 코스에서 stop을 빼도 번호가 원본 번호를 유지해 중간 번호가 비었음.
- 선택 코스 밖 schematic marker도 클릭·키보드 포커스 가능했음.
- 표시 시간에 화장실·입장·사진 대기·차량 복귀 보행이 충분히 포함되지 않았음.
- GPS 오차가 큰 fix가 동선 이탈 경고를 확정하거나 근사 좌표가 자동 도착될 수 있었음.
- 위치 timestamp 만료, Asia/Taipei 시간대, 브라우저 wake lock 자동 해제를 처리하지 않았음.

## 구현 결정

- canonical stop 8개: `visitor-center` → `candle-potholes` → `mushroom-rocks` → `fossil-zone` → `queens-head` → `shape-structure-zone` → `queens-bookstore` → `vehicle-return`.
- Compact 55–65분: 화석·형상 설명 stop 제외.
- Standard 80–85분(기본): 화석 포함, 형상 우회 제외.
- Deep 95–105분: 형상 우회 포함. 15분 이상 앞선 경우만 선택.
- 공통 session v2 한 개에 코스, 현재 stop, 관찰, 건너뜀, 차량 합류점, 복귀 목표, 보행 속도를 저장함.
- 예전 guide/GPS 저장값은 canonical ID로 병합한 뒤 legacy key를 제거함.
- 코스별 polyline과 route ordinal을 사용하고, 실좌표 관계를 단순화한 자체 SVG 개략도만 제공함.
- approximate zone(`candle-potholes`, `fossil-zone`, `shape-structure-zone`, fallback `vehicle-return`)은 자동 도착하지 않음.
- 위치가 45초 이상 지난 경우 자동 도착·동선 이탈 판단·합류점 저장을 중지함.
- 동선 이탈은 `route gap ± GPS accuracy`로 판정하고, 방향은 POI 직선이 아닌 다음 route waypoint를 우선함.
- 차량 합류점은 사용자가 현장에서 저장하며 GPS 오차가 40m를 넘으면 2차 확인함. 위치는 서버로 전송하지 않음.
- 화장실은 현재 forward route projection 이후의 보행거리로 비교하고 불가능할 때만 직선거리 fallback을 표시함.
- 시간 계산은 항상 `Asia/Taipei`, 목표 10:45, 마지노선 10:50 기준임.

## 좌표·출처 감사

- Exact/OSM POI: Visitor Center, Cute Princess, Queen’s Bookstore, 매표소 화장실, Bookstore 화장실.
- Official exact: Queen’s Head (`25.208802, 121.69310`).
- Approximate: 촛대·포트홀 관찰 zone, 화석 관찰 zone, 형상·구조 관찰 zone, 합류점 미저장 fallback.
- OSM 보행로 객체: 72538299, 72538301, 72538304, 207948073, 207948077, 207948084, 368743164, 368743166, 368743167.
- 운영·안전: [공식 FAQ](https://ylgeopark.org.tw/VisitInformationView/CommonProblem), [공식 접근성 안내](https://www.ylgeopark.org.tw/ServeAndShopView/Accessibility).
- 지형 명칭: [공식 rock list](https://ylgeopark.org.tw/AboutYehliuView/CenturyOldRocks).
- 과학 설명: [자연경관 가치 평가보고서](https://www.forest.gov.tw/file/76536) PDF pp. 19–20, 32, 33–39 (보고서 pp. 13–14, 26, 27–33).
- 위치·관람 순서: 저장소에 기록된 2024 공식 brochure URL과 OSM 객체를 교차 확인함.

## 과학 내용 교정

- 다랴오층 약 2,000만–1,900만 년 전 퇴적 → 성암·결핵 → 약 600만 년 전 펑라이 조산운동 → 수만 년 전 노출 → 현재 풍화·침식 흐름으로 정리함.
- 약 20° 동남 경사와 cuesta를 구조 관찰에 포함함.
- 포트홀과 촛대바위를 같은 과정으로 설명하지 않음.
- 버섯바위는 무경→굵은 목→가는 목→붕괴의 비교 관찰로 설명하며 2,000–4,000년을 확정 연대로 쓰지 않음.
- 실체화석과 생흔화석, 2공/5공 성게, 약 10–20m 얕은 바다 해석을 구분함.
- Queen’s Head는 1962–1963년 절리 파손 뒤의 실루엣이며 붕괴 시점을 단정하지 않음.
- 형상바위 이름은 성인 분류가 아니며 결핵·층리·절리·염풍화 증거를 먼저 보게 함.

## 오프라인·검증

- production cache: 41 files, 7.6MB. 현재 크기는 가족용 정적 사이트에서 합리적이라 전체 앱 shell을 유지함.
- service worker status가 전체 파일과 core shell을 따로 확인함.
- 영구 저장 허용 여부, 오프라인 점검 버튼, 비행기 모드 새로고침 수동 확인 날짜를 표시함.
- `npm test`: 11/11 통과.
- `npm run build`: TypeScript + Vite + service worker 생성 통과.
- 브라우저: 390×844, 768×1024, 1440×1000에서 가로 overflow 0, Vite overlay 0, console error/warning 0.
- 키보드/접근성: tablist/tab/tabpanel, active-route marker만 focus, stop 선택 후 해설 카드 focus, 44px 이상 주요 터치 영역, reduced motion 적용.

## 2027년 현장 재확인

- 운영시간, 입장/퇴장 동선, 제1·2구역 통제, 강풍·파도·호우.
- 화장실 3곳 실제 운영과 무장애 동선.
- 기사·차량번호·실제 정차 구역을 확인한 뒤 합류점을 현장에서 다시 저장.
- Queen’s Head 대기열이 8–10분 이상이면 정면 사진 줄 생략.
- 10:20–10:25 복귀 시작, 10:45 합류, 10:50 절대 마지노선.

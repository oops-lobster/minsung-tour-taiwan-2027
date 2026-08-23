# Codex Prompt — Day 2 맑은 날 일정·예산 최종 확정

Repo: `oops-lobster/minsung-tour-taiwan-2027`
Branch: `main`

## 목적
Day 2(2027-02-21, SUN)의 **비 안 오는 날 Plan A**를 여기서 닫는다. 현재 `main`의 최신 구현을 먼저 확인한 뒤, 이미 반영된 변경은 중복 적용하지 말고 누락/불일치만 정리한다.

Day 2의 핵심 흐름은 다음으로 확정한다.

- 06:30–07:30 Taipei Garden Hotel 조식
- 08:15 로비, 08:30 LUMI New Alphard 40系 출발
- 09:20–10:45 예류지질공원
- 10:55–12:10 龜吼漁夫市集 점심
- 12:10–13:00 스펀 이동·차량 휴식
- 13:00–14:00 스펀폭포 블록
  - 실제 핵심 관람 40–50분
  - 나머지는 출구 이동 + 十分遊客中心 WC + 차량 합류 여유
- 14:10–15:20 스펀 옛거리
  - 4색 풍등 1개를 3인이 함께
  - 간식은 맛보기
  - 커피는 15–20분 이하
  - 15:20 출발 우선
- 15:20 이후 지우펀 이동
- 16:15 전후 지우펀 도착, LUMI 기사와 작별 / 8시간 서비스 종료
- 16:15–17:20 지우펀 홍등 포토워크
  - 基山街 → 昇平戲院 → 豎崎路 홍등계단 → 阿妹茶樓 외관/주변 전망
  - 시간이 맞으면 좁은 산비탈 골목/穿屋巷 유형도 관찰
  - 맑음: 산·바다 전망
  - 약한 비·안개: 젖은 돌계단 + 홍등 반사 자체를 콘텐츠로
  - 폭우면 이 Plan A를 그대로 쓰지 말고 별도 rainy Plan B를 설계할 것
- 17:30–18:45 `阿理廚坊 / A Li Kitchen` 1차
  - 맛이 우선인 대만요리 본식
  - 고량주 1차
  - 예약 전 3인 창가/야경석 확인
  - `金門高粱` 판매 여부 확인
  - 없으면 외부 고량주 반입 및 corkage 확인
- 18:45–19:05 완전히 어두워진 홍등 골목 짧은 야간 산책
- 19:05–20:15 `逸茶酒室 Golden Bar` 2차
  - 대만 크래프트 맥주 중심
  - 사용자는 맥주를 적게 마시는 플랜이 아니라 **넉넉히 마시는 플랜**
  - 가벼운 안주만
  - 1층 창가 또는 2층 전망석 예약 가능 여부 확인
- 20:15–21:00 현장 호출 택시로 Taipei Garden Hotel 복귀
  - 21:00 호텔 도착 목표
- 21:00–21:30 호텔 복귀·샤워·컨디션 체크
- 21:30–23:00 `銀河洞 韓式pocha` 3차는 **optional hidden stage**
  - 호텔에서 도보 약 8–12분
  - 어묵탕/전류 + 소주
  - 피곤하면 즉시 삭제

## Day 2 식사/술 캐릭터

Day 2의 밤은 다음날 Day 3 85TD와 대비되어야 한다.

- Day 2: 산비탈, 홍등, 젖은 돌계단, 대만요리, 고량주, 크래프트 맥주
- Day 3: 고층, 유리창, 정제된 파인다이닝, 타이베이 스카이라인

Day 2에 고급 파인다이닝 분위기를 억지로 넣지 않는다.

## Day 2 예산 — 운영 원본은 Supabase

보호된 budget UI / Supabase만 사용하고 **공개 페이지에 금액을 노출하지 않는다.**

최종 기준:

| 항목 | TWD |
|---|---:|
| Taipei Garden Hotel 조식 3인 | 2,000 |
| LUMI Day 2 배분 | 10,000 |
| 예류지질공원 입장 3인 | 360 |
| 龜吼漁夫市集 점심 3인 | 3,000 |
| 스펀 풍등 | 300 |
| 스펀 간식·커피 | 800 |
| 阿理廚坊 1차 + 고량주 | 2,800 |
| Golden Bar 2차 · 크래프트 맥주 | 2,200 |
| 지우펀 → Taipei Garden Hotel 택시 | 1,000 |
| 銀河洞 한식포차 3차 | 1,200 optional |
| Day 2 맑음 플랜 예비비 | 2,340 |

- 세부 계획 합계(3차 포함, 예비비 제외): **NT$23,660**
- 사용자에게 보여줄 목표값: **약 NT$23,500**
- 상한: **NT$26,000**
- 예비비 2,340을 포함하면 Supabase Day 2 planned total이 정확히 26,000이 되도록 유지한다.

### LUMI 예산 처리 주의
예약 원본은 Day 2 + Day 4 패키지 총액 **NT$15,000**이다. 이를 변경하지 않는다.

예산 화면에서 day attribution만:
- Day 2 = NT$10,000
- Day 4 = NT$5,000

으로 나눈다. `reservations.total_amount`, 계약 조건, 계약금/잔금 구조는 그대로 유지한다.

## 현재 DB 상태 관련
ChatGPT가 2026-08-23 KST에 production Supabase budget_items에 위 Day 2 배분을 이미 적용했다.

Codex는 다음 순서로 처리한다.

1. 먼저 live Supabase를 읽어 실제 값이 위 표와 일치하는지 확인한다.
2. production에 같은 값을 중복 삽입하지 않는다.
3. Git migration history가 live DB 상태를 반영하도록 정리한다.
4. 새 migration이 필요하면 반드시 CLI로 먼저 생성한다.
   - `supabase migration new finalize_day2_sunny_budget`
5. migration은 idempotent한 update/upsert 위주로 작성한다.
6. LUMI reservation 총액 15,000과 payment schedule에는 손대지 않는다.
7. `supabase db advisors`가 가능하면 실행하고 문제를 확인한다.

## 코드에서 확인할 곳

우선 현재 `main`을 확인한다.

- `src/data/day2GuihouUpdate.ts`
- `src/data/trip.ts`
- `src/data/weatherPlans.ts`
- `src/components/DaySection.tsx`
- protected budget 관련 코드/Edge Function
- `docs/CURRENT_CHAT_CHECKPOINT.md`

`day2GuihouUpdate.ts`에는 이미 지우펀 포토워크 → 阿理廚坊 → Golden Bar → 택시 → 호텔 → optional 은하동 흐름이 들어가 있을 수 있다. 있으면 다시 구조를 갈아엎지 말고 정확성만 검증한다.

## Rainy Day 주의
이번 작업에서 확정하는 것은 **Day 2 맑은 날 Plan A**다.

- 비 오는 Day 2를 Plan A의 열화판으로 만들지 않는다.
- rainy Plan B는 다음 대화에서 별도로 설계할 예정.
- 현재 `weatherPlans.ts`를 무리하게 확정하지 않는다.

## 예약 상태
다음은 일정상 확정 후보지만 실제 예약 완료로 표시하면 안 된다.

### 阿理廚坊
- 예약 문의 예정
- 확인할 것:
  - 2027-02-21 17:30 전후, 성인 3명
  - 창가/야경 자리
  - 金門高粱 판매 여부
  - 외부 고량주 반입 가능 여부
  - corkage

### Golden Bar
- 예약 문의 예정
- 확인할 것:
  - 2027-02-21 19:05 전후, 성인 3명
  - 1층 창가 또는 2층 전망석

### 銀河洞 韓式pocha
- 예약 핵심 아님
- 3차 optional
- 2027 방문 직전에 영업시간만 재확인

## UX 요구
- Day 2 timeline에서 16:15 이후 흐름이 한눈에 이해되어야 한다.
- `official Day 2 ending = 21:00 hotel return`이 명확해야 한다.
- 은하동은 본편과 같은 무게로 보이지 않게 **optional / hidden stage**로 표현한다.
- 부모님이 보는 페이지이므로 중국어 장소명만 던지지 말고 한국어 설명을 같이 둔다.
- 예산은 public timeline에 숫자로 노출하지 않는다.

## 체크포인트
`docs/CURRENT_CHAT_CHECKPOINT.md`를 업데이트한다.

새 handoff 핵심:
- Day 2 맑은 날 Plan A는 **닫힘 / finalized**.
- Jiufen 이후 계획까지 확정됨.
- Day 2 공식 종료: **21:00 Taipei Garden Hotel 복귀**.
- 21:30 이후 은하동 3차는 optional.
- 다음 Day 2 작업은 **rainy Plan B 설계**.

## 검증
변경 후 반드시:

1. `npm test`
2. `npm run build`
3. Day 2 timeline의 순서/시간 검증
4. public page에서 budget 금액 노출이 없는지 확인
5. protected budget에서 Day 2 planned total이 **NT$26,000**인지 확인
6. LUMI reservations total이 여전히 **NT$15,000**인지 확인
7. GitHub Pages 배포 후 모바일/데스크톱에서 Day 2 후반부를 확인

## 성공 조건

- Day 2 맑은 날 timeline이 위 확정안과 일치
- 예산: 목표 약 23,500 / 상한 26,000
- Golden Bar 2,200 반영
- 은하동 3차 1,200 optional 반영
- LUMI 계약 원본 15,000 불변
- public budget leak 없음
- rainy Plan B는 아직 열어둠
- 체크포인트가 최신 상태를 설명

완료 후 최종 보고에는 다음만 간결하게 정리한다.
- 변경 파일
- DB 확인 결과
- 테스트/build 결과
- 배포 상태
- 남은 예약 문의 2건(阿理廚坊 / Golden Bar)
- 다음 작업: Day 2 rainy Plan B

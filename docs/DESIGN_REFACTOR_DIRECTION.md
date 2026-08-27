# Taiwan 2027 design refactor direction

## Product brief

- 구체적인 제품: 부모님과 성인 자녀가 함께 쓰는, 2027년 타이완 가족여행용 개인 운영 앱
- 핵심 사용자: 민성과 부모님 2명. 부모님은 큰 글씨와 분명한 상태가 필요하고, 민성은 날씨·운영·주문·지도 정보를 빠르게 판단해야 한다.
- 각 화면의 한 가지 일: 사용자가 지금 무엇을 보고, 어떤 선택을 하고, 다음에 무엇을 눌러야 하는지 즉시 알게 하는 것

이 앱은 여행 판매 페이지나 SaaS 대시보드가 아니라, 세 사람이 여행 당일 펼쳐 보는 잘 편집된 개인 여행 운영책자이자 현장 도구다.

### Tool availability note

작업을 시작한 `e6853af`에는 `.agents/skills/frontend-design/SKILL.md`가 없어 같은 탐색 → 자기비판 → 구현 → viewport 재검토 절차를 먼저 수동 적용했다. 배포 직전 원격 `main`의 `021e70f`에서 해당 스킬이 추가된 것을 확인해 fast-forward하고 전문을 읽은 뒤, 주제 grounding·한 곳에만 쓰는 boldness·기능을 표현하는 구조·사용자 언어 기준으로 결과를 다시 감사했다. `ui-ux-pro-max`는 접근성·반응형 QA 체크에만 보조 사용했다.

## Pass 1 — exploration

### Subject grounding

기능과 연결되는 시각 언어만 사용한다. 여행 일정표의 시간 축은 실제 방문 순서를, 작은 지도는 보조 동선을, 날씨 띠는 일정 선택의 원인을, 현장 메모는 가이드의 다음 행동을 표현한다. 탑승권·영수증·붉은 장식은 여행 분위기를 내기 위한 장식으로 붙이지 않는다.

### Direction A — Journey ribbon (selected)

하루의 시간·장소·조건을 하나의 얇은 이동 띠와 세로 spine으로 잇는 편집형 현장 책자. 일정과 날씨가 같은 정보 문법을 써서 기억되고, 표면 수가 적다. 위험은 띠가 장식처럼 보이는 것과 모바일 밀도이며, 텍스트 라벨과 충분한 여백으로 막는다.

```text
MOBILE                    DESKTOP
[DAY 2 / date]            [DAY 2 title ........ condition]
[title + next time]       [date tabs---------------------]
[condition ribbon]        [metadata row]
[A | B | C]               [condition ribbon + A/B/C]
 09:20 place              | 09:20 place
 | short status           | | short status    details >
 10:55 place              | 10:55 place
```

### Direction B — Field notebook

손글씨가 아닌 차분한 메모 rail과 도장형 상태를 쓰는 현장 노트. 가이드에 강하지만 일정과 예약 화면 전체에 적용하면 여행 당일보다 콘셉트가 앞서고, 부모님에게 상태 도장이 장식처럼 보일 위험이 있어 선택하지 않았다.

```text
MOBILE                    DESKTOP
[DAY NOTE]                [index] | [field note page]
time | note               time    | note / action
     | action             map     | guide
```

### Direction C — Transit board

역 시간표처럼 높은 대비와 촘촘한 데이터 행을 쓰는 운영판. 시간 파악은 빠르지만 가족여행의 온기와 긴 한국어 설명을 담기 어렵고, 375px에서 지나치게 밀집되어 선택하지 않았다.

```text
MOBILE                    DESKTOP
08:30 DEPART              TIME  PLACE   STATUS
09:20 YEHLIU              0830  HOTEL   GO
1055  GUIHOU              0920  YEHLIU  OPEN
```

## Selected token plan

- ink `#153943`: 본문·행동·spine
- paper `#F7F3E9`: 긴 읽기 배경
- mist `#DDEAE7`: 조건·보조 정보
- jade `#287565`: A/확정/진행 가능
- amber `#B97835`: B/주의·대안
- vermilion `#B84A3A`: C/강한 조정, deep red `#812F2A`: D/안전
- display: `Noto Serif KR` + 숫자·영문 fallback `Libre Bodoni`, 34–56px/1.08. 실제 장소와 하루의 thesis에만 제한한다.
- body: `Noto Sans KR`, 17px/1.65 desktop, 모바일 최소 16px/1.62
- utility/data: `Noto Sans KR` 13–15px, 시간·날짜·기상 수치는 tabular-nums
- spacing: 4, 8, 12, 16, 24, 32, 48, 72
- radius: 작은 상태 999px, 표면 14–20px. 중첩 표면에는 추가 radius/shadow를 주지 않는다.
- border/shadow: 1px 선이 기본, 그림자는 떠 있는 핵심 조작부에만 한 번 사용한다.
- confirmed/A는 jade+텍스트, waiting/B는 amber+텍스트, C/D는 vermilion/deep red+행동 문구로 색만 의존하지 않는다.
- 사진은 Day hero와 예약 차량처럼 기억할 장면에만 크게, 도구·가이드는 종이·선·타이포 중심으로 둔다.

## Signature element

`journey ribbon`을 선택했다. 일정 화면에서는 조건과 추천 이유를 담은 얇은 가로 띠가 타임라인 spine으로 이어지고, 현장 가이드에서는 “지금 할 일” 띠가 첫 행동으로 이어진다. 기능 없는 장식 번호는 쓰지 않는다.

의도적으로 감수한 시각적 위험은 익숙한 독립 카드 묶음을 줄이고 하루를 하나의 연속된 ribbon/spine으로 읽게 한 것이다. 장식용 선으로 끝나면 실패하지만, 실제 시간순서·추천 원인·다음 행동을 한 문법으로 묶기 때문에 가족이 여행 당일 더 빠르게 읽는다는 근거가 있다.

## Pass 2 — self-critique

- 다른 여행 앱에 그대로 붙을 수 있는 크림+세리프+둥근 카드 조합을 줄이고, 실제 시간·조건·다음 행동을 ribbon/spine에 연결했다.
- 초기안은 날씨 ribbon, plan picker, timeline 모두 강하게 보여 세 개가 경쟁했다. plan picker를 조용한 segmented control로 낮추고 ribbon 하나만 signature로 남겼다.
- 큰 사진 두 장이 연속되는 기존 일정 첫 화면은 실제 일정 도달을 늦춘다. 선택한 Day hero 하나만 남긴다.
- 카드마다 영어 eyebrow를 붙이는 안을 폐기했다. 영어는 데이터 범주가 필요한 곳에만 남기고 행동 문구는 한국어로 쓴다.
- 상태는 색만 쓰지 않고 `비 때문에 변경`, `돌풍 때문에 변경`, `공식 확인 실패`처럼 원인과 다음 행동을 함께 쓴다.
- 부모님이 5초 안에 시간·장소·다음 행동을 읽도록 timeline summary에는 세 요소만 우선하고 긴 설명·지도·가이드는 닫힌 상세로 둔다.

## Post-build critique

- 375×812, 430×932, 768×1024, 1280×800을 Chrome DevTools device metrics로 강제해 확인했다. macOS headless 창의 최소 너비 때문에 잘못 잘린 첫 캡처는 QA 근거에서 제외했다.
- 일정 첫 화면은 `.day-header` 한 개만 남았고, 모든 타임라인 상세는 기본 닫힘이다. 375px에서도 `scrollWidth === clientWidth`, hero 1개, 열린 details 0개를 확인했다.
- 첫 화면에서 다섯 장의 요약 카드가 경쟁하던 구조를 한 줄 metadata rail로 낮췄다. 계획 선택기는 텍스트 요약을 숨긴 얇은 control로 낮추고 journey ribbon만 강한 상태 장치로 유지했다.
- 모바일에서 고정 `호텔로 돌아가기` 버튼이 날씨 설명과 가이드 목록을 넓게 가리는 문제를 발견했다. 639px 이하에서는 같은 행동과 접근 가능한 전체 이름을 유지하면서 보이는 라벨을 `호텔`로 줄여 겹침 면적을 낮췄다.
- 北海 정적 주문 가이드는 375px에서 상단 행동, 주문 다섯 항목, 총액 확인, 직원 제시 CTA가 가로 넘침 없이 한 화면 흐름으로 읽혔다.
- 색만으로 상태를 구분하지 않고 `추천을 바꾼 원인`, 예류 운영 문구, 다음 행동을 텍스트로 함께 유지했다. reduced-motion에서는 오프닝을 생략하고 전환·스크롤 애니메이션을 사실상 제거한다.
- 시각 효과를 더 얹는 대신 큰 사진은 홈·선택 Day·예류 진입에만 남겼다. 모바일 가독성을 위해 필기체, 금색 장식, 다중 그림자, 촘촘한 transit-board 밀도는 선택하지 않았다.

### Capture paths

- before: `work/qa/before-day2-375.png`, `work/qa/before-day2-1280.png`
- after: `work/qa/cdp-day2-a-375-final.png`, `work/qa/cdp-day2-b-430-detail.png`, `work/qa/cdp-day2-c-768-detail.png`
- supporting: `work/qa/cdp-home-430.png`, `work/qa/cdp-day1-b-375-detail.png`, `work/qa/cdp-weather-375.png`, `work/qa/cdp-guide-hub-430-final.png`, `work/qa/cdp-yehliu-768.png`, `work/qa/cdp-beihai-375.png`, `work/qa/cdp-bookings-1280.png`

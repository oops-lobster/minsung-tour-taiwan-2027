# 민성투어 Taiwan 2027 — Design System

세 사람이 여행 당일 펼쳐 보는 개인 운영책자라는 제품 정의에서 출발한다. 시각 탐색과 자기비판 기록은 `docs/DESIGN_REFACTOR_DIRECTION.md`가 canonical source다.

## Direction

- Quiet family travel operations + edited journey booklet
- 실제 여행 사진은 기억할 장면에만 크게 사용
- 시간·장소·다음 행동이 먼저 보이는 운영책자의 확신
- 부모님도 별도 설명 없이 읽을 수 있는 큰 글씨와 선명한 정보 위계
- 첫 진입에만 짧은 타이포그래피 오프닝, 이후에는 콘텐츠 중심
- 긴 단일 페이지 대신 화면·탭·아코디언을 이용한 progressive disclosure

## Color tokens

| Role | Value | Usage |
|---|---:|---|
| Warm ivory | `#f1eee6` | 전체 배경 |
| Paper white | `#fbfaf6` | 정보 표면 |
| Deep jade | `#082d28` | 핵심 브랜드, 어두운 섹션 |
| Jade | `#123f37` | 링크, 아이콘, 상태 강조 |
| Taipei night | `#07161f` | 히어로·숙소·푸터 |
| Muted vermilion | `#8e3b2d` | 날짜, 활성 탭, 제한적 액센트 |
| Warm sand | `#c8ac7b` | 프리미엄 보조 강조 |
| Ink | `#17201c` | 본문 텍스트 |

현재 구현의 핵심 재해석은 `journey ribbon`이다. Ink `#153943`, mist `#DDEAE7`, action jade `#287565`, caution amber `#B97835`, safety red `#812F2A`를 상태 문구와 함께 사용한다.

색은 기능적 의미와 텍스트 라벨을 함께 사용한다. 주홍색과 금색은 포인트로만 쓰며 중국풍 장식을 만들지 않는다.

## Typography

- Korean display headings: `Noto Serif KR`, `Libre Bodoni`, Georgia fallback
- Korean body and interface: `Noto Sans KR`, system sans-serif fallback
- Editorial Latin and numerals: `Libre Bodoni`, Georgia fallback
- Mobile body: 16px / 1.75
- Desktop body: 18px / 1.75
- Day hero: responsive 39–86px, 한 화면에 하나만 사용
- 모든 숫자·시간은 tabular 숫자를 가능한 범위에서 적용

## Layout

- Mobile-first breakpoints: 375, 640, 900, 1280px
- Content shell: mobile 16px gutter, tablet 24px, desktop 36px, max 1200px
- Desktop header + mobile five-item bottom navigation
- Top-level views: 홈 / 일정 / 예약 / 식사 / 예산
- 일정은 DAY 1–4 탭, 예약은 현황 / 숙소·항공 / 차량·지도 탭
- Hash deep link와 브라우저 back stack 유지
- Touch target 44px minimum
- Card nesting을 피하고 border, whitespace, editorial image composition으로 섹션을 구분
- 일정은 얇은 metadata row → condition ribbon → 조용한 segmented picker → 실제 순서 spine으로 읽힌다.
- 가이드는 registry 한 곳에서 일정 launcher와 현장 hub를 함께 파생한다.

## CSS architecture

- `src/styles/tokens.css`: token, reset, base accessibility
- `src/styles/opening.css`: 첫 진입 모션
- `src/styles/core.css`: 공통 앱·홈·예약·식사
- `src/styles/views/tools.css`: 현지 도구와 언어 UI
- `src/styles/views/private.css`: 보호 예산·민성 TODO
- `src/styles/views/field-guides.css`: 예류·귀후 SPA
- `src/styles/views/schedule.css`: 일정·날씨 기존 호환
- `src/styles/views/refactor.css`: journey ribbon, registry guide, condition UI

## Images

- Wikimedia Commons의 실제 사진만 사용
- Hero는 eager/preload, 나머지는 lazy loading
- Local WebP assets, 1600px width
- 모든 의미 있는 사진에 한국어 alt, 전체 출처는 footer credits에 표시

## Motion

- 첫 세션 진입에만 약 3.2초의 시네마틱 이미지·타이포그래피 오프닝
- 푸터의 `오프닝 다시 보기`로 언제든 재생 가능
- 일반 상호작용 180–300ms
- transform/opacity 중심, 무거운 parallax 금지
- `prefers-reduced-motion`에서는 오프닝과 불필요한 애니메이션 제거

## Accessibility checklist

- WCAG 2.2 AA 대비 목표
- skip link, 올바른 heading hierarchy, main landmark
- visible focus ring
- 모든 지도 링크에 새 창 안내용 접근성 이름
- 375–430px 가로 넘침 없음
- 아이콘만으로 의미를 전달하지 않음

## Anti-patterns

- AI 생성 여행 사진
- 과도한 빨강/금색, gradient, glassmorphism
- 작은 회색 본문
- hover-only 정보
- 데스크톱 우선 고정 폭 레이아웃
- 카드 안에 카드를 반복하는 대시보드 표현

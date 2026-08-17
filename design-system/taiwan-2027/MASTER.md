# 민성투어 Taiwan 2027 — Design System

UI/UX Pro Max의 storytelling hero, editorial typography, mobile-first accessibility 권고를 바탕으로 가족여행 포털에 맞게 확정한 시스템이다.

## Direction

- Premium family travel + editorial travel magazine
- 실제 여행 사진이 화면의 중심
- 따뜻하고 정돈된 여행사 상품 페이지의 신뢰감
- 부모님도 별도 설명 없이 읽을 수 있는 큰 글씨와 선명한 정보 위계
- 첫 진입에만 짧은 타이포그래피 오프닝, 이후에는 콘텐츠 중심
- 긴 단일 페이지 대신 화면·탭·아코디언을 이용한 progressive disclosure

## Color tokens

| Role | Value | Usage |
|---|---:|---|
| Warm ivory | `#f5f1e8` | 전체 배경 |
| Paper white | `#fffdf8` | 정보 표면 |
| Deep jade | `#0b342d` | 핵심 브랜드, 어두운 섹션 |
| Jade | `#155347` | 링크, 아이콘, 상태 강조 |
| Taipei night | `#0c1d2b` | 히어로·숙소·푸터 |
| Muted vermilion | `#a94331` | 날짜, 활성 탭, 제한적 액센트 |
| Warm sand | `#d9c6a5` | 프리미엄 보조 강조 |
| Ink | `#19231f` | 본문 텍스트 |

색은 기능적 의미와 텍스트 라벨을 함께 사용한다. 주홍색과 금색은 포인트로만 쓰며 중국풍 장식을 만들지 않는다.

## Typography

- Korean body and headings: `Noto Sans KR`, system sans-serif fallback
- Editorial Latin and numerals: `Libre Bodoni`, Georgia fallback
- Mobile body: 17px / 1.72
- Desktop body: 18px / 1.72
- Hero: responsive 41–91px, Korean line breaks 우선
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

## Images

- Wikimedia Commons의 실제 사진만 사용
- Hero는 eager/preload, 나머지는 lazy loading
- Local WebP assets, 1600px width
- 모든 의미 있는 사진에 한국어 alt, 전체 출처는 footer credits에 표시

## Motion

- 첫 세션 진입에만 2.2초 이내의 타이포그래피 오프닝
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

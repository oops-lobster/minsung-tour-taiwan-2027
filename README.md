# 민성투어 — Taiwan 2027

부모님과 함께하는 2027년 2월 타이베이 3박 4일 여행을 위한 가족 전용 여행 포털입니다.

여행 전에는 예약·준비 상태를 함께 확인하고, 여행 중에는 모바일에서 날짜별 일정·식사·이동·지도 링크를 빠르게 볼 수 있도록 만들었습니다. 예약번호, 여권번호, 전화번호, 결제정보 같은 민감정보는 저장하지 않습니다.

## 주요 기능

- 첫 진입 타이포그래피 오프닝과 민성투어 워드마크
- 출발일까지 자동 계산되는 D-Day
- 항공·호텔·차량·식사 예약 상태 대시보드
- 홈·일정·예약·식사·예산·현지 도구로 나뉜 앱형 화면 구조
- PIN으로 보호되는 Supabase 예산 대시보드와 `민성` 여행 준비 TODO
- URL 해시 기반 직접 링크와 브라우저 뒤로가기 지원
- 모바일 5개 고정 하단 내비게이션
- DAY 1–4 탭과 눌러서 펼치는 일정 상세
- 예약 현황·숙소/항공·차량/지도 3개 세부 탭
- Day 2 우천 Plan B, Day 3 이자카야 현장 결정 안내
- 실제 장소 사진 18장과 사진별 출처·라이선스
- Google Maps 검색 링크와 기사님께 보여주기 카드
- 항공·숙소·교통·식사·예산·운영 원칙 섹션
- GitHub Pages repository subpath 대응
- 375px부터 1440px까지 반응형 레이아웃
- 키보드 포커스, skip link, reduced motion, 44px 터치 영역

## 기술 스택

- Vite
- React
- TypeScript
- Lucide React icons
- Supabase Postgres + Edge Functions
- CSS custom properties + mobile-first responsive CSS
- GitHub Pages / GitHub Actions

## 로컬 실행

Node.js 24 이상을 권장합니다.

```bash
npm install
npm run dev
```

로컬의 private 관리 화면은 `.env.example`을 참고해 `.env.local`에 아래 두 공개 값을 설정합니다. service role/secret key는 프론트엔드에 넣지 않습니다.

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

프로덕션 빌드 확인:

```bash
npm run build
npm run preview
```

## 콘텐츠 수정 위치

### 일정·예약 상태

`src/data/trip.ts`

- `tripMeta`: 여행 이름, 날짜, 인원
- `tripStatuses`: 준비·예약 상태
- `days`: DAY 1–4 일정과 장소, 설명, 이동수단
- `principles`: 민성투어 운영 원칙
- `driverPlaces`: 기사님께 보여주기 장소
- `mealPlan`: 날짜별 식사 계획

예약이 완료되면 `status`와 `tone`을 함께 바꿉니다.

```ts
{
  status: '예약 완료',
  tone: 'confirmed',
}
```

### 사진과 출처

- 이미지 파일: `public/images/`
- 출처·작가·라이선스·alt text: `src/data/imageSources.ts`

새 사진을 추가할 때는 다음 필드를 모두 기록합니다.

```ts
{
  file: 'place.webp',
  place: '장소명',
  alt: '사진의 내용을 설명하는 한국어 대체 텍스트',
  sourceUrl: '원본 출처 URL',
  author: '촬영자',
  license: 'CC BY-SA 4.0',
  attributionRequired: true,
  retrievedAt: 'YYYY-MM-DD',
}
```

랜덤 블로그, 검색 결과 썸네일, 라이선스가 불명확한 사진, AI 생성 여행 사진은 추가하지 않습니다.

### 새 장소·식당 추가

1. `src/data/trip.ts`에서 해당 날짜의 `schedule` 배열에 항목을 추가합니다.
2. `mapQuery`에는 Google Maps에서 찾을 수 있는 공식 영문명 또는 현지명을 넣습니다.
3. 사진을 쓸 경우 WebP로 최적화해 `public/images/`에 넣습니다.
4. 사진 메타데이터를 `src/data/imageSources.ts`에 추가합니다.
5. `npm run build`로 오탈자와 타입 오류를 확인합니다.

확정되지 않은 예약 시간이나 차량은 임의로 확정하지 말고 `예약 대기`, `견적 문의 중`, `협의 예정`, `현장 결정`으로 표시합니다.

### Private 예산·TODO

- `#budget`: 계획 예산, 실제 지출, 예약 분할 결제, 총예산·환율 설정
- `#minsung`: 개인 여행 준비 TODO 추가·완료·삭제
- `#principles`: 기존 가족여행 원칙
- DB migration: `supabase/migrations/`
- Edge Functions: `supabase/functions/budget-api/`, `supabase/functions/trip-tasks/`

예산과 TODO 테이블은 RLS를 활성화하고 anon/authenticated 직접 권한을 회수했습니다. 브라우저는 PIN 검증으로 받은 임시 세션을 Edge Function에 전달하며, 원문 PIN과 service/secret key는 저장소에 두지 않습니다.

## 이미지 최적화

현재 이미지는 Wikimedia Commons에서 확인한 실제 사진을 1600px 폭 WebP로 저장했습니다. macOS에서 `cwebp`가 설치되어 있다면 다음 형태로 새 사진을 최적화할 수 있습니다.

```bash
cwebp -q 78 -resize 1600 0 source.jpg -o public/images/place.webp
```

히어로 이외의 사진은 `loading="lazy"`로 불러옵니다. 사진을 교체해도 의미 있는 한국어 `alt`와 정확한 라이선스 표기는 유지해야 합니다.

## GitHub Pages 배포

1. GitHub에 새 repository를 만들고 프로젝트를 push합니다.
2. repository의 **Settings → Pages → Build and deployment**에서 Source를 **GitHub Actions**로 선택합니다.
3. `main` branch에 push하면 `.github/workflows/deploy.yml`이 빌드와 배포를 자동 실행합니다.

Actions 빌드에는 repository variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`가 필요합니다.

`vite.config.ts`의 `base: './'` 설정으로 `https://username.github.io/repository-name/` 같은 repository subpath에서도 이미지와 asset이 동작합니다.

## 민감정보 주의

이 repository에는 아래 정보를 절대로 넣지 않습니다.

- 항공·호텔 예약번호
- 가족 실명, 생년월일, 전화번호
- 여권번호 또는 여권 이미지
- 카드번호, 결제내역 원문
- 차량 업체 담당자 개인 연락처

가족에게 공유할 때도 공개 repository에는 여행에 꼭 필요한 비민감 정보만 유지하세요.

## 사진 라이선스

사진별 원본 URL, 작가, 라이선스는 `src/data/imageSources.ts`와 사이트 하단의 **실제 사진 출처와 라이선스**에서 확인할 수 있습니다. Attribution 또는 ShareAlike 조건이 있는 이미지를 재사용할 때는 해당 라이선스 조건을 반드시 지켜야 합니다.

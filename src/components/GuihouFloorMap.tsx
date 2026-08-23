import { Accessibility, ArrowUp, Building2, DoorOpen, Toilet, Waves } from 'lucide-react'
import { guihouCookStalls } from '../data/guihouMarket'

export function GuihouFloorMap() {
  return (
    <figure className="guihou-floor-map" aria-labelledby="guihou-floor-map-title guihou-floor-map-note">
      <figcaption>
        <span>2F · ORIGINAL SCHEMATIC</span>
        <h3 id="guihou-floor-map-title">먹고 쉬는 2층 구조 관계</h3>
        <p id="guihou-floor-map-note">공식 시설 사실만 다시 그린 개념도입니다. 축척·통로·점포의 실제 좌우 위치를 뜻하지 않습니다.</p>
      </figcaption>
      <svg viewBox="0 0 920 520" role="img" aria-label="12개 조리점, 중앙 식사 공간, 화장실, 세면실, 엘리베이터 두 대, 계단 두 곳, 바다 전망 플랫폼의 관계를 나타낸 비축척 개념도">
        <defs>
          <pattern id="guihou-map-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeOpacity=".08" />
          </pattern>
          <linearGradient id="guihou-sea" x1="0" x2="1">
            <stop stopColor="#dcece7" />
            <stop offset="1" stopColor="#c7e2e5" />
          </linearGradient>
        </defs>
        <rect width="920" height="520" rx="32" fill="#f8f3e7" />
        <rect width="920" height="520" rx="32" fill="url(#guihou-map-grid)" />
        <g className="guihou-floor-map__stalls" aria-label="공식 조리점 번호">
          {guihouCookStalls.map((stall, index) => {
            const col = index % 6
            const row = Math.floor(index / 6)
            return (
              <g transform={`translate(${58 + col * 139} ${60 + row * 82})`} key={stall.id}>
                <rect width="118" height="58" rx="15" />
                <text x="18" y="36">#{stall.id}</text>
              </g>
            )
          })}
        </g>
        <g className="guihou-floor-map__seat">
          <rect x="190" y="250" width="515" height="150" rx="28" />
          <text x="447" y="314" textAnchor="middle">바다 전망 식사 공간</text>
          <text x="447" y="348" textAnchor="middle">약 448.8㎡ · 좌석 안내 방식 현장 확인</text>
        </g>
        <g className="guihou-floor-map__facility" transform="translate(44 252)">
          <rect width="126" height="148" rx="24" />
          <text x="63" y="48" textAnchor="middle">WC · 세면실</text>
          <text x="63" y="82" textAnchor="middle">엘리베이터 ×2</text>
          <text x="63" y="116" textAnchor="middle">계단 ×2</text>
        </g>
        <g className="guihou-floor-map__sea">
          <path d="M730 236h150v178H730z" fill="url(#guihou-sea)" />
          <path d="M730 270q38-18 75 0t75 0M730 315q38-18 75 0t75 0M730 360q38-18 75 0t75 0" />
          <text x="805" y="220" textAnchor="middle">전망 플랫폼 → 바다</text>
        </g>
        <g className="guihou-floor-map__route">
          <path d="M108 430H805" />
          <path d="m784 416 21 14-21 14" />
          <text x="108" y="468">1층에서 올라와 조리점 확인 → 좌석 안내 확인 → 전망 플랫폼</text>
        </g>
      </svg>
      <div className="guihou-facility-buttons" aria-label="2층 편의시설 빠른 확인">
        <span><Toilet aria-hidden="true" /> WC</span>
        <span><Accessibility aria-hidden="true" /> 엘리베이터 2대</span>
        <span><ArrowUp aria-hidden="true" /> 계단 2곳</span>
        <span><Waves aria-hidden="true" /> 전망 플랫폼</span>
        <span><Building2 aria-hidden="true" /> 1층으로</span>
        <span><DoorOpen aria-hidden="true" /> 출구</span>
      </div>
    </figure>
  )
}

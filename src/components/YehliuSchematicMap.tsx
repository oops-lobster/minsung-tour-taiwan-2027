import type { KeyboardEvent } from 'react'
import { yehliuRouteModes, yehliuStops, type YehliuRouteId } from '../data/yehliuGuide'

interface YehliuSchematicMapProps {
  routeId: YehliuRouteId
  selectedStop: number
  visited: number[]
  onSelectStop: (stopId: number) => void
}

const markerPositions: Record<number, [number, number]> = {
  0: [76, 286],
  1: [164, 246],
  2: [236, 188],
  3: [324, 222],
  4: [412, 158],
  5: [494, 186],
  6: [584, 112],
  7: [656, 202],
  8: [708, 300],
}

export function YehliuSchematicMap({ routeId, selectedStop, visited, onSelectStop }: YehliuSchematicMapProps) {
  const route = yehliuRouteModes.find((item) => item.id === routeId) ?? yehliuRouteModes[1]
  const points = route.stopIds.map((stopId) => markerPositions[stopId].join(',')).join(' ')

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>, stopId: number) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onSelectStop(stopId)
  }

  return (
    <div className="yehliu-map-shell">
      <svg
        className="yehliu-map"
        viewBox="0 0 780 380"
        role="group"
        aria-label={`예류 제1·2구역 ${route.label} 개략 동선. 번호를 누르면 해당 해설로 이동합니다.`}
      >
        <defs>
          <linearGradient id="yehliu-sea" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dceef0" />
            <stop offset="1" stopColor="#a9cfd2" />
          </linearGradient>
          <linearGradient id="yehliu-land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f4e6c4" />
            <stop offset="1" stopColor="#c9d3aa" />
          </linearGradient>
          <filter id="yehliu-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#133f48" floodOpacity=".22" />
          </filter>
        </defs>

        <rect width="780" height="380" rx="28" fill="url(#yehliu-sea)" />
        <path className="yehliu-map__grid" d="M0 76H780M0 152H780M0 228H780M0 304H780M130 0V380M260 0V380M390 0V380M520 0V380M650 0V380" />
        <path
          className="yehliu-map__peninsula"
          d="M18 362C84 322 94 278 149 247c72-41 104-104 181-110 62-5 108 47 160 27 54-20 84-93 151-98 62-5 88 45 120 100 25 44 36 94 39 146-153 31-306 39-458 41-105 1-217 1-324 9Z"
          fill="url(#yehliu-land)"
        />
        <path className="yehliu-map__shore" d="M18 362C84 322 94 278 149 247c72-41 104-104 181-110 62-5 108 47 160 27 54-20 84-93 151-98 62-5 88 45 120 100" />
        <text className="yehliu-map__water-label" x="38" y="48">EAST CHINA SEA</text>
        <text className="yehliu-map__zone-label" x="185" y="332">제1구역</text>
        <text className="yehliu-map__zone-label" x="532" y="316">제2구역</text>

        <polyline className="yehliu-map__route-shadow" points={points} />
        <polyline className={`yehliu-map__route yehliu-map__route--${routeId}`} points={points} />

        <g className="yehliu-map__facility" aria-label="방문자센터 1층 화장실">
          <rect x="42" y="322" width="48" height="25" rx="12" />
          <text x="66" y="339">WC</text>
        </g>
        <g className="yehliu-map__facility" aria-label="여왕의 서점 화장실">
          <rect x="632" y="231" width="48" height="25" rx="12" />
          <text x="656" y="248">WC</text>
        </g>
        <g className="yehliu-map__facility yehliu-map__facility--outside" aria-label="매표소 옆 화장실, 지도 시작점 바깥">
          <rect x="13" y="286" width="48" height="25" rx="12" />
          <text x="37" y="303">WC</text>
        </g>
        <g className="yehliu-map__caution" aria-label="해안 안전 주의">
          <path d="M505 78 519 104h-28Z" />
          <text x="505" y="99">!</text>
        </g>

        {yehliuStops.map((stop) => {
          const [x, y] = markerPositions[stop.id]
          const isActive = route.stopIds.includes(stop.id)
          const isSelected = selectedStop === stop.id
          const isVisited = visited.includes(stop.id)
          return (
            <g
              className={`yehliu-map__marker ${isActive ? 'is-route-stop' : 'is-skipped'} ${isSelected ? 'is-selected' : ''} ${isVisited ? 'is-visited' : ''}`}
              key={stop.id}
              role="button"
              tabIndex={0}
              aria-label={`${stop.id + 1}번 ${stop.title}${isVisited ? ', 방문 완료' : ''}`}
              aria-pressed={isSelected}
              onClick={() => onSelectStop(stop.id)}
              onKeyDown={(event) => handleKeyDown(event, stop.id)}
              transform={`translate(${x} ${y})`}
            >
              <circle r={isSelected ? 23 : 19} filter="url(#yehliu-shadow)" />
              {isVisited && <path className="yehliu-map__marker-check" d="m-8 0 5 5 11-13" />}
              {!isVisited && <text y="6">{stop.id + 1}</text>}
            </g>
          )
        })}
      </svg>
      <div className="yehliu-map-legend" aria-label="지도 범례">
        <span><i className="is-route" />선택 코스</span>
        <span><i className="is-selected" />현재 해설</span>
        <span><i className="is-toilet">WC</i>화장실</span>
        <span><i className="is-caution">!</i>해안 주의</span>
      </div>
      <p className="yehliu-map-note">동선 이해를 위한 자체 제작 개략도입니다. 정밀 위치·통제구역은 현장 공식 지도와 직원 안내를 따르세요.</p>
    </div>
  )
}

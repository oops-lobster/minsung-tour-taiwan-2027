import type { YehliuStop } from '../data/yehliuGuide'

interface YehliuScienceDiagramProps {
  type: NonNullable<YehliuStop['diagram']>
}

const DiagramLabel = ({ children }: { children: React.ReactNode }) => <text className="yehliu-diagram__label">{children}</text>

export function YehliuScienceDiagram({ type }: YehliuScienceDiagramProps) {
  return (
    <figure className="yehliu-diagram">
      <svg viewBox="0 0 560 250" role="img" aria-labelledby={`yehliu-diagram-${type}`}>
        <title id={`yehliu-diagram-${type}`}>예류 지형 형성과 관찰 포인트를 설명하는 개념도</title>
        <defs>
          <linearGradient id={`rock-${type}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e5c796" />
            <stop offset="1" stopColor="#af8057" />
          </linearGradient>
          <marker id={`arrow-${type}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 8 4 0 8Z" fill="#d45345" />
          </marker>
        </defs>

        {type === 'structure' && (
          <>
            <path className="yehliu-diagram__sea" d="M0 180Q90 158 175 182T350 178T560 180V250H0Z" />
            <g className="yehliu-diagram__strata">
              <path d="m62 192 350-122 38 22L94 216Z" />
              <path d="m94 216 356-124 35 22-350 124Z" />
              <path d="m38 166 350-122 24 26L62 192Z" />
            </g>
            <path className="yehliu-diagram__arrow" d="M446 202 486 138" markerEnd={`url(#arrow-${type})`} />
            <DiagramLabel>약 20° 기울어진 층리</DiagramLabel>
            <text x="420" y="225">융기</text>
          </>
        )}

        {type === 'candle' && (
          <>
            <path className="yehliu-diagram__ground" d="M20 192Q120 142 224 182T540 172V250H20Z" />
            <ellipse className="yehliu-diagram__hole" cx="140" cy="173" rx="72" ry="30" />
            <ellipse className="yehliu-diagram__hole-inner" cx="140" cy="173" rx="35" ry="14" />
            <circle cx="140" cy="174" r="7" fill="#6f6b61" />
            <path className="yehliu-diagram__rock" d="M342 192Q365 156 380 104L416 94Q431 145 456 192Z" />
            <ellipse cx="398" cy="101" rx="24" ry="12" fill="#6e6758" />
            <DiagramLabel>자갈 회전 + 소금 풍화</DiagramLabel>
            <text x="344" y="52">단단한 결핵이 남은 촛대</text>
          </>
        )}

        {type === 'mushroom' && (
          <>
            {[98, 238, 382].map((x, index) => (
              <g transform={`translate(${x} 0)`} key={x}>
                <path className="yehliu-diagram__rock" d={index === 0 ? 'M-48 204Q-34 150-25 115H25Q35 150 48 204Z' : index === 1 ? 'M-28 204Q-18 150-17 112H17Q18 150 28 204Z' : 'M-15 204Q-8 150-10 110H10Q8 150 15 204Z'} />
                <ellipse cx="0" cy="104" rx={index === 0 ? 50 : 45} ry="25" fill="#99714e" />
                <text x="0" y="235" textAnchor="middle">{['목 없음', '굵은 목', '가는 목'][index]}</text>
              </g>
            ))}
            <path className="yehliu-diagram__arrow" d="M150 92H188M290 92h42" markerEnd={`url(#arrow-${type})`} />
            <DiagramLabel>서로 다른 바위에서 생애 단계 비교</DiagramLabel>
          </>
        )}

        {type === 'fossil' && (
          <>
            <path className="yehliu-diagram__ground" d="M20 206V74H540V206Z" />
            <g transform="translate(155 137)">
              <circle r="58" fill="#c39a68" stroke="#72553f" strokeWidth="4" />
              {[0, 72, 144, 216, 288].map((angle) => <path d="M0 0V-45" stroke="#72553f" strokeWidth="5" transform={`rotate(${angle})`} key={angle} />)}
              <circle r="10" fill="#f5e4be" />
            </g>
            <path d="M326 188C330 125 380 118 382 74M382 119c46 0 50 34 84 47M382 144c-36 0-43 30-57 45" fill="none" stroke="#72553f" strokeWidth="12" strokeLinecap="round" />
            <text x="155" y="40" textAnchor="middle">실체화석 · 몸</text>
            <text x="405" y="40" textAnchor="middle">생흔화석 · 행동</text>
          </>
        )}

        {type === 'queen' && (
          <>
            <path className="yehliu-diagram__ground" d="M20 210Q240 190 540 210V250H20Z" />
            <path className="yehliu-diagram__rock" d="M245 210Q260 172 258 130L238 112Q236 90 270 66L331 77 344 109 320 129Q310 174 322 210Z" />
            <path d="M273 74 288 100 272 129" fill="none" stroke="#d45345" strokeWidth="5" strokeDasharray="7 5" />
            <path className="yehliu-diagram__arrow" d="M110 114H224" markerEnd={`url(#arrow-${type})`} />
            <text x="60" y="100">관찰 각도</text>
            <text x="338" y="70">절리 파손 흔적</text>
            <DiagramLabel>cap–neck 차별풍화의 한 장면</DiagramLabel>
          </>
        )}

        {type === 'shape' && (
          <>
            <path className="yehliu-diagram__ground" d="M20 210Q140 155 270 196T540 172V250H20Z" />
            <path d="M85 195 170 72 255 193M132 126l77 2M122 145l96 4M112 164l116 6" fill="none" stroke="#735840" strokeWidth="10" strokeLinecap="round" />
            <path d="M315 195 350 72M393 193 430 74M348 109l78 10M337 148l78 10" fill="none" stroke="#735840" strokeWidth="10" strokeLinecap="round" />
            <path className="yehliu-diagram__arrow" d="M480 56 444 91" markerEnd={`url(#arrow-${type})`} />
            <text x="302" y="42">이름보다 층리·절리</text>
            <DiagramLabel>산화 띠와 균열 방향을 먼저 보기</DiagramLabel>
          </>
        )}
      </svg>
      <figcaption>과정 이해용 개념도 · 실제 바위 사진 아님</figcaption>
    </figure>
  )
}

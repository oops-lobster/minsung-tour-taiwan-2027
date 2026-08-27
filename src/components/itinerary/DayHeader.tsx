import type { TripDay } from '../../data/trip'
import { imageSourceByFile } from '../../data/imageSources'
import { imagePath } from '../../lib/paths'

export function DayHeader({ day }: { day: TripDay }) {
  const source = imageSourceByFile[day.cover]
  const next = day.schedule[0]
  return (
    <header className="day-header" aria-labelledby="day-header-title">
      <img src={imagePath(day.cover)} alt={source.alt} width="1600" height="1067" loading="eager" />
      <div className="day-header__scrim" />
      <div className="day-header__copy page-shell">
        <p><strong>{day.day}</strong><span>{day.date} {day.weekday}</span></p>
        <div><span>{day.theme}</span><h1 id="day-header-title">{day.title}</h1><p>{day.lead}</p></div>
        <aside><small>첫 일정</small><strong>{next.time}</strong><span>{next.title}</span></aside>
      </div>
    </header>
  )
}

import { days } from './trip'

const dayOne = days.find((day) => day.id === 'day-1')
const taoyuanArrival = dayOne?.schedule.find((item) => item.title === '타오위안공항 도착')

if (taoyuanArrival) {
  taoyuanArrival.time = '09:50'
}

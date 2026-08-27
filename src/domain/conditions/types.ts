export type ConditionTrigger = 'rain' | 'wind' | 'wave' | 'official-operation' | 'safety'

export type DayConditionPolicy =
  | { kind: 'rain-only'; dayId: 'day-1' | 'day-3'; activityWindow: { startHour: number; endHour: number }; affectedActivity: string }
  | { kind: 'multi-factor'; dayId: 'day-2'; locations: Array<{ id: string; startHour: number; endHour: number }> }
  | { kind: 'conditional-stop'; dayId: 'day-4'; affectedPlaceId: 'botanical'; activityWindow: { startHour: number; endHour: number } }

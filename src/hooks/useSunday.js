import { useEffect, useMemo } from 'react'
import { useArchiveStore } from '../store'
import { currentMonthKey, isFirstSunday, seededIndex } from '../utils/date'

/**
 * Логика ежемесячного «возвращения»: в первое воскресенье месяца
 * контора возвращает одну телеграмму из ящика. Выбор фиксируется
 * в сторе при первом показе месяца — новые записи его не сдвигают.
 */
export function useSunday() {
  const entries = useArchiveStore((s) => s.entries)
  const sundaySeen = useArchiveStore((s) => s.sundaySeen)
  const sundayPick = useArchiveStore((s) => s.sundayPick)
  const markSundaySeen = useArchiveStore((s) => s.markSundaySeen)
  const setSundayPick = useArchiveStore((s) => s.setSundayPick)

  const monthKey = currentMonthKey()
  const todayIsSunday = isFirstSunday()
  const pending = todayIsSunday && sundaySeen !== monthKey && entries.length > 0

  const entry = useMemo(() => {
    if (entries.length === 0) return null
    if (sundayPick?.monthKey === monthKey) {
      const picked = entries.find((e) => e.id === sundayPick.id)
      if (picked) return picked
    }
    const sorted = [...entries].sort((a, b) => a.id.localeCompare(b.id))
    return sorted[seededIndex(monthKey, sorted.length)]
  }, [entries, monthKey, sundayPick])

  // Фиксируем выбор месяца, как только он состоялся
  useEffect(() => {
    if (entry && sundayPick?.monthKey !== monthKey) {
      setSundayPick({ monthKey, id: entry.id })
    }
  }, [entry, monthKey, sundayPick, setSundayPick])

  return { todayIsSunday, pending, entry, monthKey, markSundaySeen }
}

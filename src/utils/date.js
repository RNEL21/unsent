export const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

export const MONTHS_RU_GEN = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

export const MONTHS_SHORT = [
  'янв', 'фев', 'мар', 'апр', 'май', 'июн',
  'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
]

export function monthKeyOf(timestamp) {
  const d = new Date(timestamp)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function currentMonthKey() {
  return monthKeyOf(Date.now())
}

export function monthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return `${MONTHS_RU[month - 1]} ${year}`
}

export function monthShortLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return `${MONTHS_SHORT[month - 1]} ${String(year).slice(2)}`
}

export function formatDate(timestamp) {
  const d = new Date(timestamp)
  return `${d.getDate()} ${MONTHS_RU_GEN[d.getMonth()]} ${d.getFullYear()}`
}

export function formatDateTime(timestamp) {
  const d = new Date(timestamp)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${d.getDate()} ${MONTHS_RU_GEN[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`
}

/** Первое воскресенье месяца для переданной даты (Date). */
export function firstSundayOfMonth(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const offset = (7 - first.getDay()) % 7
  return new Date(date.getFullYear(), date.getMonth(), 1 + offset)
}

export function isFirstSunday(date = new Date()) {
  const sunday = firstSundayOfMonth(date)
  return (
    date.getFullYear() === sunday.getFullYear() &&
    date.getMonth() === sunday.getMonth() &&
    date.getDate() === sunday.getDate()
  )
}

/** Стабильный индекс записи для «возвращения» — один и тот же в течение месяца. */
export function seededIndex(monthKey, length) {
  if (length === 0) return -1
  let hash = 0
  for (let i = 0; i < monthKey.length; i++) {
    hash = (hash * 31 + monthKey.charCodeAt(i)) >>> 0
  }
  return hash % length
}

/**
 * Лампа знает час. Возвращает CSS-переменные пятна света:
 * глубокой ночью — узкий тёплый круг, днём — широкий и слабый.
 */
export function lampVars(date = new Date()) {
  const h = date.getHours()
  if (h >= 22 || h < 5) return { spread: 0.82, glow: 0.3 }
  if (h < 8) return { spread: 0.95, glow: 0.22 }
  if (h < 18) return { spread: 1.25, glow: 0.12 }
  return { spread: 1.05, glow: 0.2 }
}

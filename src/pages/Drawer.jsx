import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useArchive } from '../hooks/useArchive'
import FiledForm from '../components/FiledForm'
import { monthLabel } from '../utils/date'

/**
 * Ящик: сортировочный шкаф конторы. Телеграммы поданы по месяцам
 * с картонными разделителями; поиск идёт по тексту и заметкам.
 */
export default function Drawer() {
  const { entries, monthKeys } = useArchive()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeMonth = searchParams.get('month')
  const [query, setQuery] = useState('')

  const setActiveMonth = (key) => {
    setSearchParams(key ? { month: key } : {}, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries
      .filter((e) => {
        if (activeMonth && e.monthKey !== activeMonth) return false
        if (
          q &&
          !e.text.toLowerCase().includes(q) &&
          !(e.note || '').toLowerCase().includes(q) &&
          !(e.to || '').toLowerCase().includes(q)
        )
          return false
        return true
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [entries, activeMonth, query])

  // Группировка по месяцам для разделителей (только без фильтра и поиска)
  const grouped = useMemo(() => {
    if (activeMonth || query.trim()) return null
    const map = new Map()
    for (const e of filtered) {
      if (!map.has(e.monthKey)) map.set(e.monthKey, [])
      map.get(e.monthKey).push(e)
    }
    return [...map.entries()]
  }, [filtered, activeMonth, query])

  const counts = useMemo(() => {
    const map = new Map()
    for (const e of entries) map.set(e.monthKey, (map.get(e.monthKey) || 0) + 1)
    return map
  }, [entries])

  return (
    <main className="drawer">
      <h1 className="drawer__title">Ящик</h1>
      <p className="drawer__sub">
        {entries.length > 0
          ? 'Принято и не передано. Здесь лежит всё — и ничего не пропадает.'
          : 'Сортировочный шкаф конторы.'}
      </p>

      {entries.length > 0 && (
        <>
          <input
            type="search"
            className="drawer__search"
            placeholder="Поиск по недосказанному…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Поиск по записям"
          />

          <div className="drawer__months">
            <button
              type="button"
              className={`tab${activeMonth === null ? ' tab--active' : ''}`}
              onClick={() => setActiveMonth(null)}
            >
              Все · {entries.length}
            </button>
            {monthKeys.map((key) => (
              <button
                key={key}
                type="button"
                className={`tab${activeMonth === key ? ' tab--active' : ''}`}
                onClick={() => setActiveMonth(activeMonth === key ? null : key)}
              >
                {monthLabel(key)} · {counts.get(key)}
              </button>
            ))}
          </div>
        </>
      )}

      {filtered.length === 0 ? (
        <div className="drawer__empty">
          {entries.length === 0
            ? 'Ящик пуст. Всё, что вы не отправите, появится здесь — и никуда не денется.'
            : 'Ничего не нашлось. Возможно, вы искали то, что так и не написали.'}
        </div>
      ) : grouped ? (
        grouped.map(([key, monthEntries]) => (
          <section key={key}>
            <div className="month-divider">
              <span className="month-divider__label">{monthLabel(key)}</span>
              <span className="month-divider__rule" />
            </div>
            {monthEntries.map((entry) => (
              <FiledForm key={entry.id} entry={entry} />
            ))}
          </section>
        ))
      ) : (
        filtered.map((entry) => <FiledForm key={entry.id} entry={entry} />)
      )}
    </main>
  )
}

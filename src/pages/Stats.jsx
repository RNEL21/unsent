import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useArchive } from '../hooks/useArchive'
import { exportArchive } from '../utils/export'
import { MONTHS_SHORT, monthLabel } from '../utils/date'

function plural(n, one, few, many) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

/**
 * Учёт: книга приёма конторы. Сколько принято, активность за год,
 * рекордсмены — и выгрузка архива, потому что «никуда не денется»
 * должно быть правдой, а не обещанием.
 */
export default function Stats() {
  const { entries } = useArchive()

  const stats = useMemo(() => {
    const byMonth = new Map()
    for (const e of entries) {
      const bucket = byMonth.get(e.monthKey) || { count: 0, chars: 0 }
      bucket.count += 1
      bucket.chars += e.text.length
      byMonth.set(e.monthKey, bucket)
    }

    const months = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      months.push({ key, ...(byMonth.get(key) || { count: 0, chars: 0 }) })
    }

    const maxCount = Math.max(0, ...months.map((m) => m.count))

    let verbose = null
    let quiet = null
    for (const [key, v] of byMonth) {
      if (!verbose || v.chars > verbose.chars) verbose = { key, ...v }
      if (!quiet || v.count < quiet.count) quiet = { key, ...v }
    }

    return { months, maxCount, verbose, quiet }
  }, [entries])

  return (
    <main className="ledger">
      <h1 className="ledger__title">Учёт</h1>
      <p className="ledger__sub">Книга приёма: что хотели сказать и не сказали — в цифрах.</p>

      <p className="ledger__count">{entries.length}</p>
      <p className="ledger__count-label">
        {plural(entries.length, 'телеграмма принята', 'телеграммы принято', 'телеграмм принято')} —
        и ни одна не передана
      </p>

      <p className="ledger__section">Приём за год</p>
      <div className="heat">
        {stats.months.map((m) => {
          const heat = stats.maxCount === 0 ? 0 : m.count / stats.maxCount
          const label = `${monthLabel(m.key)}: ${m.count} ${plural(m.count, 'запись', 'записи', 'записей')}`
          const style =
            m.count > 0
              ? { background: `rgba(232, 176, 75, ${0.16 + heat * 0.6})`, borderColor: 'transparent' }
              : undefined
          // Значение живёт под ячейкой, на тёмном фоне — заливка кодирует жар,
          // цифра всегда читается (AA).
          return m.count > 0 ? (
            <Link
              key={m.key}
              to={`/drawer?month=${m.key}`}
              className="heat__cell"
              aria-label={label}
              title={label}
              style={style}
            />
          ) : (
            <div key={m.key} className="heat__cell" aria-label={label} title={label} />
          )
        })}
      </div>
      <div className="heat__months" aria-hidden="true">
        {stats.months.map((m) => (
          <span key={m.key} className="heat__month">
            <span>{MONTHS_SHORT[Number(m.key.split('-')[1]) - 1]}</span>
            <span className="heat__value">{m.count > 0 ? m.count : '·'}</span>
          </span>
        ))}
      </div>

      <div className="ledger__duo">
        <div className="ledger-card">
          <p className="ledger-card__label">Самый многословный месяц</p>
          {stats.verbose ? (
            <>
              <p className="ledger-card__value">{monthLabel(stats.verbose.key)}</p>
              <p className="ledger-card__detail">
                {stats.verbose.chars.toLocaleString('ru-RU')} знаков недосказанного
              </p>
            </>
          ) : (
            <p className="ledger-card__detail">Пока тишина.</p>
          )}
        </div>
        <div className="ledger-card">
          <p className="ledger-card__label">Самый тихий месяц</p>
          {stats.quiet ? (
            <>
              <p className="ledger-card__value">{monthLabel(stats.quiet.key)}</p>
              <p className="ledger-card__detail">
                всего {stats.quiet.count}{' '}
                {plural(stats.quiet.count, 'запись', 'записи', 'записей')} — держали в себе
              </p>
            </>
          ) : (
            <p className="ledger-card__detail">Пока тишина.</p>
          )}
        </div>
      </div>

      <p className="ledger__section">Выгрузка</p>
      <div className="ledger__export">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => exportArchive(entries, 'json')}
          disabled={entries.length === 0}
        >
          Архив в JSON
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => exportArchive(entries, 'txt')}
          disabled={entries.length === 0}
        >
          Архив в текст
        </button>
        <p className="ledger__export-note">
          Записи живут только в этом браузере и никуда не отправляются. Очистка данных
          сайта удалит их безвозвратно — выгрузка делает обещание «никуда не денется»
          правдой.
        </p>
      </div>
    </main>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useArchive } from '../hooks/useArchive'
import { useSunday } from '../hooks/useSunday'
import { formatDate, monthLabel } from '../utils/date'
import { sessionSet } from '../utils/session'

/**
 * Возвращение: раз в месяц контора возвращает одну телеграмму из ящика.
 * Можно вернуть её, дописать мысль — или отложить встречу: ритуал не ловушка.
 */
export default function Sunday() {
  const { entry, monthKey, markSundaySeen } = useSunday()
  const { addNote } = useArchive()
  const navigate = useNavigate()
  const [writing, setWriting] = useState(false)
  const [note, setNote] = useState('')

  const release = () => {
    markSundaySeen()
    sessionSet('sunday-redirected', '1')
  }

  const handleBack = () => {
    release()
    navigate('/drawer')
  }

  const handleLater = () => {
    release()
    navigate('/')
  }

  const handleSaveNote = () => {
    if (!note.trim() || !entry) return
    addNote(entry.id, note.trim())
    release()
    setWriting(false)
    setNote('')
  }

  if (!entry) {
    return (
      <main className="sunday">
        <h1 className="sunday__title">Пока нечего возвращать</h1>
        <div className="sunday__empty">
          Ящик ещё пуст. Сдайте первую телеграмму, которую никогда не отправите, —
          <br />и в следующее воскресенье контора вернёт её вам.
        </div>
      </main>
    )
  }

  return (
    <main className="sunday">
      <h1 className="sunday__title">Контора возвращает телеграмму</h1>
      <p className="sunday__sub">
        {monthLabel(monthKey)}. Раз в месяц ящик отдаёт одну запись обратно. Прочитайте —
        и решите, что с ней делать.
      </p>

      <motion.article
        className="blank sunday__blank"
        initial={{ y: 200, rotateX: 22, opacity: 0 }}
        animate={{ y: 0, rotateX: 0, opacity: 1 }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1000 }}
      >
        <div className="blank__head">
          <span className="blank__title">Телеграмма</span>
          <span className="stamp">{formatDate(entry.createdAt)}</span>
        </div>
        {entry.to && (
          <div className="field">
            <span className="field__label">Кому</span>
            <p className="sunday__text">{entry.to}</p>
          </div>
        )}
        <p className="sunday__text">{entry.text}</p>
        {entry.note && <div className="sunday__note">Дописано позже: {entry.note}</div>}
      </motion.article>

      {writing ? (
        <div className="sunday__note-box">
          <textarea
            className="sunday__note-textarea"
            placeholder="Что вы думаете об этом сейчас, спустя время?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            autoFocus
          />
          <div className="sunday__actions">
            <button
              type="button"
              className="btn-stamp"
              onClick={handleSaveNote}
              disabled={!note.trim()}
            >
              Дописать и вернуть в ящик
            </button>
            <button type="button" className="btn-ghost" onClick={() => setWriting(false)}>
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div className="sunday__actions">
          <button type="button" className="btn-stamp" onClick={handleBack}>
            Обратно в ящик
          </button>
          <button type="button" className="btn-ghost" onClick={() => setWriting(true)}>
            Дописать мысль
          </button>
          <button type="button" className="sunday__later" onClick={handleLater}>
            В другой раз
          </button>
        </div>
      )}
    </main>
  )
}

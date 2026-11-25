import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatDate } from '../utils/date'

function excerpt(text, max = 90) {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max)}…` : clean
}

/**
 * Поданная телеграмма в сортировочном шкафу: торец бланка с датой-штампом.
 * Наведение приподнимает бланк к свету; клик разворачивает формуляр.
 */
export default function FiledForm({ entry }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        className="filed"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="filed__row">
          <span className="filed__date">{formatDate(entry.createdAt)}</span>
          {entry.to && <span className="filed__to">кому: {entry.to}</span>}
        </span>
        <span className="filed__excerpt">{excerpt(entry.text)}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="filed-open"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="filed-open__inner blank"
              initial={{ rotateX: -50, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: -50, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 900 }}
            >
              <div className="blank__head">
                <span className="blank__title">Телеграмма</span>
                <span className="blank__meta">{formatDate(entry.createdAt)}</span>
              </div>
              {entry.to && (
                <div className="field">
                  <span className="field__label">Кому</span>
                  <p className="sunday__text">{entry.to}</p>
                </div>
              )}
              <p className="sunday__text">{entry.text}</p>
              {entry.note && (
                <div className="filed-open__note">
                  <span className="filed-open__note-label">Дописано позже</span>
                  <p className="filed-open__note-text">{entry.note}</p>
                </div>
              )}
              <button type="button" className="filed-open__close" onClick={() => setOpen(false)}>
                Сложить обратно
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

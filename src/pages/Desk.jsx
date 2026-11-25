import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useArchive } from '../hooks/useArchive'
import { useSunday } from '../hooks/useSunday'
import SendAnimation from '../components/SendAnimation'
import { formatDate } from '../utils/date'
import { sessionGet, sessionSet } from '../utils/session'

/**
 * Приём: бланк телеграммы под лампой. Черновик автосохраняется,
 * запись коммитится в момент клика — анимация изображает путь листа.
 */
export default function Desk() {
  const { draft, setDraft, addEntry } = useArchive()
  const { pending } = useSunday()
  const navigate = useNavigate()
  const [sending, setSending] = useState(null)
  const [hint, setHint] = useState(false)

  const sendDemo = import.meta.env.DEV && new URLSearchParams(window.location.search).has('send-demo')

  // В первое воскресенье месяца контора зовёт — один раз за сессию, не ловушкой.
  useEffect(() => {
    if (sendDemo) return
    if (pending && !sessionGet('sunday-redirected')) {
      sessionSet('sunday-redirected', '1')
      navigate('/sunday', { replace: true })
    }
  }, [pending, navigate, sendDemo])

  // Только для разработки: ?send-demo запускает ритуал сдачи с демо-текстом
  // (без записи в архив) — для скриншотов и проверки хореографии.
  useEffect(() => {
    if (!sendDemo) return
    const t = setTimeout(
      () => setSending({ text: 'Мам, я не злюсь. Я просто устал объяснять по телефону, почему не приеду на праздники. Дело не в тебе.' }),
      400
    )
    return () => clearTimeout(t)
  }, [sendDemo])

  const handleSend = () => {
    if (sending) return
    if (draft.text.trim().length === 0) {
      // Кнопка всегда живая: пустой бланк не сдают, а объясняют почему.
      setHint(true)
      document.getElementById('desk-text')?.focus()
      setTimeout(() => setHint(false), 2600)
      return
    }
    // Коммит до анимации: закрытая вкладка больше не крадёт текст.
    addEntry({ to: draft.to, text: draft.text.trim() })
    setSending({ text: draft.text.trim() })
  }

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <main className="desk">
      <div className="blank desk__blank">
        <div className="blank__head">
          <span className="blank__title">Телеграмма</span>
          <span className="blank__meta">
            Принято: {formatDate(Date.now())}
            <br />
            знаков: {draft.text.length}
          </span>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="desk-to">
            Кому
          </label>
          <input
            id="desk-to"
            className="field__line"
            type="text"
            placeholder="необязательно — можно никому"
            value={draft.to}
            onChange={(e) => setDraft({ to: e.target.value })}
            disabled={!!sending}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="desk-text">
            Текст
          </label>
          <textarea
            id="desk-text"
            className="field__area"
            placeholder="Пишите так, будто это никто не прочитает. Так и будет."
            value={draft.text}
            onChange={(e) => setDraft({ text: e.target.value })}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={!!sending}
          />
        </div>

        <div className="blank__foot">
          <span className="blank__assurance" role={hint ? 'alert' : undefined}>
            {hint
              ? 'Пустую телеграмму не примут — напишите хоть слово.'
              : 'Никуда не отправится. Останется в ящике.'}
          </span>
          <button type="button" className="btn-stamp" onClick={handleSend} disabled={!!sending}>
            Сдать в ящик
          </button>
        </div>
      </div>

      <div className="drawer-slot" />
      {(draft.text || draft.to) && !sending && (
        <div className="draft-status" role="status">
          черновик сохранён
        </div>
      )}

      <AnimatePresence>
        {sending && <SendAnimation text={sending.text} onDone={() => setSending(null)} />}
      </AnimatePresence>
    </main>
  )
}

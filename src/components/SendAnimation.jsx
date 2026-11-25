import { useCallback, useEffect, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Ритуал сдачи телеграммы. Запись к этому моменту уже сохранена;
 * эта сцена лишь показывает путь бланка от приёмной книги в ящик.
 */
export default function SendAnimation({ text, onDone }) {
  const stub = useAnimationControls()
  const blank = useAnimationControls()
  const crease = useAnimationControls()
  const stack = useAnimationControls()
  const slot = useAnimationControls()
  const doneText = useAnimationControls()
  const finished = useRef(false)
  const stageRef = useRef(null)
  const skipRef = useRef(null)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    onDone()
  }, [onDone])

  useEffect(() => {
    let cancelled = false
    stageRef.current?.focus({ preventScroll: true })
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    async function run() {
      if (reduced) {
        doneText.start({ opacity: 1, y: 0, transition: { duration: 0.2 } })
        await new Promise((resolve) => setTimeout(resolve, 750))
        if (!cancelled) finish()
        return
      }

      // Бумага приподнимается, а перфорированный корешок отходит рывком.
      const tear = stub.start({
        x: [0, -2, 24],
        y: [0, 4, -23],
        rotate: [0, -1, 7],
        opacity: [1, 1, 0],
        transition: { duration: 0.48, times: [0, 0.3, 1], ease: ['easeOut', [0.5, 0, 0.9, 0.4]] },
      })
      const lift = blank.start({
        y: [0, -13, -7],
        rotate: [0, -1.2, 0.4],
        rotateX: [0, -3, 0],
        transition: { duration: 0.48, times: [0, 0.52, 1], ease: EASE },
      })
      await Promise.all([tear, lift])
      if (cancelled || finished.current) return

      // Сгиб: бланк становится компактнее, а линия сгиба ловит свет лампы.
      await Promise.all([
        blank.start({
          scaleY: 0.54,
          y: -3,
          rotateX: -7,
          rotate: -1.2,
          transition: { duration: 0.46, ease: EASE },
        }),
        crease.start({ opacity: [0, 0.92, 0.35], transition: { duration: 0.46, times: [0, 0.72, 1], ease: 'easeOut' } }),
      ])
      if (cancelled || finished.current) return

      // Небольшая пауза после сгиба — бланк успевает осесть перед отправкой.
      await new Promise((resolve) => setTimeout(resolve, 420))
      if (cancelled || finished.current) return

      // Стопка скользит к щели; тёплая полоска под столом отвечает вспышкой.
      const drop = stack.start({
        y: '39vh',
        x: '-1vw',
        scale: 0.46,
        rotate: -3,
        opacity: [1, 1, 0],
        transition: { duration: 0.78, ease: [0.5, 0, 0.9, 0.62] },
      })
      slot.start({
        opacity: [0.38, 1, 0.76],
        scaleX: [0.88, 1.12, 1],
        transition: { duration: 0.78, ease: EASE },
      })
      doneText.start({ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.32, ease: EASE } })
      await drop
      if (cancelled || finished.current) return

      await new Promise((resolve) => setTimeout(resolve, 560))
      if (!cancelled) finish()
    }

    run()
    return () => {
      cancelled = true
    }
    // The sequence intentionally starts once per mounted ritual.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      skipRef.current?.focus()
      return
    }
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      finish()
    }
  }

  return (
    <motion.div
      className="send-stage"
      ref={stageRef}
      role="dialog"
      aria-modal="true"
      aria-label="Ритуал сдачи телеграммы"
      onClick={finish}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.24 } }}
      exit={{ opacity: 0, transition: { duration: 0.24 } }}
    >
      <motion.div className="send-stack" animate={stack}>
        <motion.div className="send-stub" initial={{ opacity: 1 }} animate={stub}>
          <span className="send-stub__label">Приёмная книга</span>
        </motion.div>

        <motion.div className="send-blank" initial={{ scaleY: 1, opacity: 1 }} animate={blank}>
          <div className="send-blank__head">Телеграмма</div>
          <div className="send-blank__text">{text}</div>
          <motion.div className="send-blank__crease" initial={{ opacity: 0 }} animate={crease} />
        </motion.div>

      </motion.div>

      <motion.div className="send-slot" initial={{ opacity: 0.38, scaleX: 0.88 }} animate={slot} />
      <motion.div className="send-done" initial={{ opacity: 0, y: 12 }} animate={doneText}>
        Принято. В ящике.
      </motion.div>
      <button ref={skipRef} className="send-skip" type="button" onClick={finish}>
        Нажмите, чтобы пропустить
      </button>
    </motion.div>
  )
}

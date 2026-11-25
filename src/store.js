import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { currentMonthKey, monthKeyOf } from './utils/date'

// localStorage может отсутствовать (приватный режим) — не роняем приложение,
// архив просто проживёт в памяти вкладки.
const safeStorage = createJSONStorage(() => {
  try {
    const testKey = '__unsent_probe__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return window.localStorage
  } catch {
    const memory = new Map()
    return {
      getItem: (k) => (memory.has(k) ? memory.get(k) : null),
      setItem: (k, v) => memory.set(k, v),
      removeItem: (k) => memory.delete(k),
    }
  }
})

export const useArchiveStore = create(
  persist(
    (set) => ({
      entries: [],
      // Черновик на столе: переживает перезагрузку и закрытие вкладки.
      draft: { to: '', text: '' },
      // monthKey месяца, в котором «возвращение» уже показали
      sundaySeen: null,
      // Какая телеграмма возвращается в этом месяце — выбор фиксируется
      // при первом показе и не сдвигается от новых записей.
      sundayPick: null,

      setDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),

      setSundayPick: (pick) => set({ sundayPick: pick }),

      // Запись коммитится в момент клика — анимация лишь изображает путь листа.
      addEntry: ({ to, text }) => {
        const now = Date.now()
        const entry = {
          id: crypto.randomUUID(),
          to: to?.trim() || null,
          text,
          createdAt: now,
          monthKey: monthKeyOf(now),
          note: null,
        }
        set((state) => ({ entries: [entry, ...state.entries], draft: { to: '', text: '' } }))
        return entry
      },

      addNote: (id, note) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, note } : e)),
        })),

      markSundaySeen: () => set({ sundaySeen: currentMonthKey() }),
    }),
    { name: 'unsent-archive', storage: safeStorage }
  )
)

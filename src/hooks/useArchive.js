import { useMemo } from 'react'
import { useArchiveStore } from '../store'

/**
 * CRUD над архивом неотправленных текстов.
 * Запись: { id, to: string|null, text, createdAt, monthKey, note: string|null }
 * Удаления нет — это принцип продукта; взамен — экспорт (utils/export.js).
 */
export function useArchive() {
  const entries = useArchiveStore((s) => s.entries)
  const draft = useArchiveStore((s) => s.draft)
  const setDraft = useArchiveStore((s) => s.setDraft)
  const addEntry = useArchiveStore((s) => s.addEntry)
  const addNote = useArchiveStore((s) => s.addNote)

  const monthKeys = useMemo(
    () => [...new Set(entries.map((e) => e.monthKey))].sort().reverse(),
    [entries]
  )

  return { entries, monthKeys, draft, setDraft, addEntry, addNote }
}

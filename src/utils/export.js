import { formatDate } from './date'

function triggerDownload(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Выгрузка архива: записи не удаляются никогда, но должны уметь уезжать с владельцем. */
export function exportArchive(entries, format) {
  const stamp = new Date().toISOString().slice(0, 10)
  if (format === 'json') {
    triggerDownload(
      `neotpravlennoe-${stamp}.json`,
      JSON.stringify({ exportedAt: new Date().toISOString(), entries }, null, 2),
      'application/json'
    )
    return
  }
  const text = entries
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((e) => {
      const head = `— ${formatDate(e.createdAt)}${e.to ? ` — кому: ${e.to}` : ''} —`
      const note = e.note ? `\n\nДописано позже:\n${e.note}` : ''
      return `${head}\n\n${e.text}${note}`
    })
    .join('\n\n\n')
  triggerDownload(`neotpravlennoe-${stamp}.txt`, text, 'text/plain;charset=utf-8')
}

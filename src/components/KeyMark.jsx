/**
 * Знак конторы: телеграфный ключ азбуки Морзе, вид сбоку.
 * Латунь — currentColor (в шапке окрашен в --lamp), тёплая точка —
 * контакт, замыкающий цепь: единственный огонёк на знаке.
 */
export default function KeyMark({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* свечение контакта */}
      <circle cx="18.5" cy="11.9" r="3.4" fill="#e8b04b" opacity="0.26" />
      {/* основание */}
      <path d="M5 25h22" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      {/* задняя стойка с осью */}
      <path d="M10 25v-10.7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      {/* рычаг */}
      <path d="M8 14.7L22.5 10" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      {/* ручка */}
      <circle cx="24.3" cy="9.3" r="2.6" fill="currentColor" />
      {/* передняя стойка-контакт */}
      <path d="M18.5 25v-12.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      {/* контактная точка */}
      <circle cx="18.5" cy="11.9" r="1.25" fill="#f3cd88" />
    </svg>
  )
}

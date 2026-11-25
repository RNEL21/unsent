// sessionStorage может быть заблокирован — не роняем приложение,
// просто живём без межстраничной памяти сессии.
export function sessionGet(key) {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

export function sessionSet(key, value) {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // молча живём без флага
  }
}

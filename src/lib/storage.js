const KEY = 'ingles-ya:progress'
const API_KEY = 'ingles-ya:anthropic-key'

const today = () => new Date().toISOString().slice(0, 10)
const yesterday = () => new Date(Date.now() - 864e5).toISOString().slice(0, 10)

const empty = { xp: 0, streak: 0, lastDay: null, learned: {}, bestQuiz: 0 }

export function loadProgress() {
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return { ...empty }
  }
}

export function saveProgress(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    // almacenamiento no disponible: el progreso vive solo en esta sesión
  }
}

// Suma XP y actualiza la racha diaria.
export function addXp(p, amount) {
  const t = today()
  let streak = p.streak
  if (p.lastDay !== t) streak = p.lastDay === yesterday() ? p.streak + 1 : 1
  return { ...p, xp: p.xp + amount, streak, lastDay: t }
}

export const getApiKey = () => {
  try {
    return localStorage.getItem(API_KEY) || ''
  } catch {
    return ''
  }
}

export const setApiKey = (k) => {
  try {
    if (k) localStorage.setItem(API_KEY, k)
    else localStorage.removeItem(API_KEY)
  } catch {
    // ignorar
  }
}

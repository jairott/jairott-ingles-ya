export const canSpeak = () => 'speechSynthesis' in window

export function speak(text, rate = 0.9) {
  if (!canSpeak()) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = rate
  window.speechSynthesis.speak(u)
}

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
export const canListen = () => Boolean(Recognition)

// Escucha una frase en inglés y devuelve la transcripción.
export function listen() {
  return new Promise((resolve, reject) => {
    if (!Recognition) return reject(new Error('unsupported'))
    const r = new Recognition()
    r.lang = 'en-US'
    r.interimResults = false
    r.maxAlternatives = 1
    r.onresult = (e) => resolve(e.results[0][0].transcript)
    r.onerror = (e) => reject(new Error(e.error))
    r.onnomatch = () => resolve('')
    r.start()
  })
}

const norm = (s) =>
  s.toLowerCase().replace(/[^a-z0-9\s']/g, '').replace(/\s+/g, ' ').trim()

// Porcentaje de palabras de la frase objetivo que se dijeron.
export function similarity(target, heard) {
  const t = norm(target).split(' ').filter(Boolean)
  const h = new Set(norm(heard).split(' ').filter(Boolean))
  if (!t.length) return 0
  return Math.round((t.filter((w) => h.has(w)).length / t.length) * 100)
}

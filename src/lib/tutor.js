import { getApiKey } from './storage'

const SYSTEM = `Eres un tutor amable de inglés para un hispanohablante de nivel principiante-intermedio.
Reglas:
- Conversa en inglés sencillo, con frases cortas, y haz una pregunta al final para continuar.
- Si el usuario cometió un error, corrígelo al final dentro de una línea que empiece con "Corrección:", explicada en español.
- Si el usuario escribe en español, responde en inglés sencillo y anímalo a intentarlo en inglés.
- Máximo 80 palabras por respuesta.`

// messages: [{ role: 'user' | 'assistant', content: string }]
export async function askTutor(messages) {
  const key = getApiKey()
  if (!key) throw new Error('NO_KEY')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-5-5',
      max_tokens: 400,
      system: SYSTEM,
      messages,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Error ${res.status}`)
  }
  const data = await res.json()
  return data.content.map((b) => b.text || '').join('')
}

import { getApiKey } from './storage'

const SYSTEM = `Eres un tutor amable de inglés para un hispanohablante de nivel principiante-intermedio.
Reglas:
- Conversa en inglés sencillo, con frases cortas, y haz una pregunta al final para continuar.
- Si el usuario cometió un error, corrígelo al final dentro de una línea que empiece con "Corrección:", explicada en español.
- Si el usuario escribe en español, responde en inglés sencillo y anímalo a intentarlo en inglés.
- Máximo 80 palabras por respuesta.`

// Alias que apunta al modelo Flash vigente del nivel gratuito de Gemini.
const MODEL = 'gemini-flash-latest'

// messages: [{ role: 'user' | 'assistant', content: string }]
export async function askTutor(messages) {
  const key = getApiKey()
  if (!key) throw new Error('NO_KEY')

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: { maxOutputTokens: 400 },
      }),
    },
  )

  if (res.status === 429) throw new Error('LIMIT')
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Error ${res.status}`)
  }
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('')
  if (!text) throw new Error('Respuesta vacía')
  return text
}

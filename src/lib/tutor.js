import { getApiKey } from './storage'

const SYSTEM_NORMAL = `Eres un tutor amable de inglés para un hispanohablante de nivel principiante-intermedio.
Reglas:
- Conversa en inglés sencillo, con frases cortas, y haz una pregunta al final para continuar.
- Si el usuario cometió un error, corrígelo al final dentro de una línea que empiece con "Corrección:", explicada en español.
- Si el usuario escribe en español, responde en inglés sencillo y anímalo a intentarlo en inglés.
- Máximo 80 palabras por respuesta.`

const SYSTEM_INTENSE = `Eres un tutor de inglés estricto, uno a uno, para un hispanohablante de nivel principiante-intermedio. Estás en una conversación hablada: el usuario te habla y su voz se transcribe, así que ignora la puntuación y las mayúsculas faltantes.
Después de CADA mensaje del usuario sigue este formato exacto:
1. Si hay errores (gramática, tiempo verbal, preposición, vocabulario, orden de palabras o una pronunciación que probablemente falló), escribe una línea "Corrección: <la frase completa corregida, en inglés>".
2. En otra línea "Por qué: <explicación breve en español, máximo 2 líneas>".
3. En otra línea "Repite: <la frase correcta>" para que el usuario la diga en voz alta.
4. Después continúa la conversación en inglés sencillo con una sola pregunta.
Si no hubo errores, empieza con "Perfect." y sube un poco la dificultad.
Si el usuario habla en español, dile en inglés sencillo cómo decirlo y pídele que lo repita en inglés.
No seas condescendiente ni agregues elogios largos. Máximo 100 palabras por respuesta.`

// Alias que apunta al modelo Flash vigente del nivel gratuito de Gemini.
const MODEL = 'gemini-flash-latest'

// messages: [{ role: 'user' | 'assistant', content: string }]
export async function askTutor(messages, { intense = false } = {}) {
  const key = getApiKey()
  if (!key) throw new Error('NO_KEY')

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: intense ? SYSTEM_INTENSE : SYSTEM_NORMAL }] },
        contents: messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: { maxOutputTokens: 500 },
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

// Texto que se lee en voz alta (en inglés): quita las explicaciones en español.
export function speakable(text, intense) {
  return text
    .replace(/[*_`#]/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !/^por qu[eé]/i.test(l))
    .map((l) => {
      if (/^(correcci[oó]n|repite)\s*:/i.test(l)) return intense ? l.replace(/^[^:]+:\s*/, '') : null
      return l
    })
    .filter(Boolean)
    .map((l) => l.replace(/[.\s]+$/, ''))
    .join('. ')
}

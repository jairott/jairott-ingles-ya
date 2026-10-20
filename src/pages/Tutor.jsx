import { useEffect, useRef, useState } from 'react'
import { askTutor } from '../lib/tutor'
import { getApiKey, setApiKey } from '../lib/storage'
import { speak, listen, canListen } from '../lib/speech'

const START = [
  { role: 'assistant', content: "Hi! I'm your English tutor. What did you do today?" },
]

export default function Tutor({ gain }) {
  const [messages, setMessages] = useState(START)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [hasKey, setHasKey] = useState(Boolean(getApiKey()))
  const [keyInput, setKeyInput] = useState('')
  const end = useRef(null)

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const content = text.trim()
    if (!content || busy) return
    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setError('')
    setBusy(true)
    try {
      // La API exige que el primer mensaje sea del usuario.
      const reply = await askTutor(next.slice(1))
      setMessages([...next, { role: 'assistant', content: reply }])
      gain(3)
    } catch (e) {
      setError(
        e.message === 'NO_KEY' ? 'Falta la llave de API.' : `No se pudo contactar al tutor: ${e.message}`,
      )
    }
    setBusy(false)
  }

  const dictate = async () => {
    try {
      send(await listen())
    } catch {
      setError('No pude escucharte. Intenta de nuevo.')
    }
  }

  if (!hasKey) {
    return (
      <div className="card space-y-3">
        <h2 className="font-bold">Configura tu tutor con IA</h2>
        <p className="text-sm text-slate-600">
          Pega tu llave de API de Anthropic (console.anthropic.com). Se guarda solo en este
          navegador y se usa únicamente para hablar con Claude.
        </p>
        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="sk-ant-…"
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
        />
        <button
          className="btn-primary w-full"
          disabled={!keyInput.trim()}
          onClick={() => {
            setApiKey(keyInput.trim())
            setHasKey(true)
          }}
        >
          Guardar
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
              m.role === 'user'
                ? 'ml-auto bg-brand-600 text-white'
                : 'bg-white border border-slate-100'
            }`}
          >
            {m.content}
            {m.role === 'assistant' && (
              <button className="ml-2" onClick={() => speak(m.content)} aria-label="Escuchar">
                🔊
              </button>
            )}
          </div>
        ))}
        {busy && <p className="text-sm text-slate-400">El tutor está escribiendo…</p>}
        <div ref={end} />
      </div>

      {error && <p className="py-1 text-sm text-red-600">{error}</p>}

      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe en inglés…"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2"
        />
        {canListen() && (
          <button type="button" className="btn-ghost" onClick={dictate} disabled={busy}>
            🎤
          </button>
        )}
        <button className="btn-primary" disabled={busy || !input.trim()}>
          Enviar
        </button>
      </form>
      <button
        className="mt-2 text-xs text-slate-400"
        onClick={() => {
          setApiKey('')
          setHasKey(false)
        }}
      >
        Cambiar llave de API
      </button>
    </div>
  )
}

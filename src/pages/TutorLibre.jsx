import { useEffect, useRef, useState } from 'react'
import { askTutor, speakable } from '../lib/tutor'
import { getApiKey, setApiKey } from '../lib/storage'
import { speak, listen, canListen } from '../lib/speech'

const START = [
  { role: 'assistant', content: "Hi! I'm your English tutor. Let's practice. What did you do today?" },
]

export default function TutorLibre({ gain, back }) {
  const [messages, setMessages] = useState(START)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [hasKey, setHasKey] = useState(Boolean(getApiKey()))
  const [keyInput, setKeyInput] = useState('')
  const [intense, setIntense] = useState(true)
  const [live, setLive] = useState(false)
  const [listening, setListening] = useState(false)

  // Refs: el bucle de voz corre fuera del render y necesita el estado más reciente.
  const messagesRef = useRef(START)
  const busyRef = useRef(false)
  const liveRef = useRef(false)
  const intenseRef = useRef(true)
  const end = useRef(null)

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    intenseRef.current = intense
  }, [intense])

  useEffect(
    () => () => {
      liveRef.current = false
      window.speechSynthesis?.cancel()
    },
    [],
  )

  const commit = (next) => {
    messagesRef.current = next
    setMessages(next)
  }

  const stopLive = () => {
    liveRef.current = false
    setLive(false)
    setListening(false)
    window.speechSynthesis?.cancel()
  }

  const listenOnce = async () => {
    if (!liveRef.current) return
    setListening(true)
    try {
      const text = await listen()
      setListening(false)
      if (!liveRef.current) return
      if (text.trim()) send(text)
      else listenOnce()
    } catch (e) {
      setListening(false)
      if (liveRef.current && e.message === 'no-speech') return listenOnce()
      stopLive()
      setError(
        e.message === 'not-allowed'
          ? 'Permite el micrófono en tu navegador.'
          : 'Se detuvo la conversación en vivo. Presiona de nuevo para continuar.',
      )
    }
  }

  const send = async (text) => {
    const content = text.trim()
    if (!content || busyRef.current) return
    const next = [...messagesRef.current, { role: 'user', content }]
    commit(next)
    setInput('')
    setError('')
    busyRef.current = true
    setBusy(true)
    try {
      // El primer mensaje del historial debe ser del usuario.
      const reply = await askTutor(next.slice(1), { intense: intenseRef.current })
      commit([...next, { role: 'assistant', content: reply }])
      gain(3)
      if (liveRef.current) speak(speakable(reply, intenseRef.current), 0.9, listenOnce)
    } catch (e) {
      stopLive()
      setError(
        e.message === 'LIMIT'
          ? 'Llegaste al límite gratuito por ahora. Prueba la práctica guiada o vuelve más tarde.'
          : `No se pudo contactar al tutor: ${e.message}`,
      )
    }
    busyRef.current = false
    setBusy(false)
  }

  const startLive = () => {
    setError('')
    liveRef.current = true
    setLive(true)
    const last = messagesRef.current[messagesRef.current.length - 1]
    speak(speakable(last.content, intenseRef.current), 0.9, listenOnce)
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
        <button onClick={back} className="text-left text-sm text-slate-500">← Tutor</button>
        <h2 className="font-bold">Conversación libre (Gemini gratis)</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>Entra a aistudio.google.com e inicia sesión con tu cuenta de Google.</li>
          <li>Presiona “Get API key” y crea una llave.</li>
          <li>Pégala aquí. Se guarda solo en este navegador.</li>
        </ol>
        <p className="text-xs text-slate-500">
          No escribas datos personales en la conversación: Google puede usar el nivel gratuito para mejorar sus productos.
        </p>
        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="AIza…"
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
      <div className="mb-2 flex items-center justify-between">
        <button onClick={() => { stopLive(); back() }} className="text-sm text-slate-500">← Tutor</button>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={intense} onChange={(e) => setIntense(e.target.checked)} />
          Corrección intensa
        </label>
      </div>

      {canListen() && (
        <button
          className={live ? 'btn-ghost mb-2 border-red-300 text-red-700' : 'btn-primary mb-2'}
          onClick={live ? stopLive : startLive}
        >
          {live
            ? listening
              ? '⏹ Escuchando… (toca para detener)'
              : busy
                ? '⏹ Pensando… (toca para detener)'
                : '⏹ Hablando… (toca para detener)'
            : '🎙️ Conversación en vivo por voz'}
        </button>
      )}

      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
              m.role === 'user' ? 'ml-auto bg-brand-600 text-white' : 'border border-slate-100 bg-white'
            }`}
          >
            {m.content}
            {m.role === 'assistant' && (
              <button
                className="ml-2"
                onClick={() => speak(speakable(m.content, intense))}
                aria-label="Escuchar"
              >
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
          <button type="button" className="btn-ghost" onClick={dictate} disabled={busy || live}>🎤</button>
        )}
        <button className="btn-primary" disabled={busy || !input.trim()}>Enviar</button>
      </form>
      <button
        className="mt-2 text-xs text-slate-400"
        onClick={() => {
          stopLive()
          setApiKey('')
          setHasKey(false)
        }}
      >
        Cambiar llave de API
      </button>
    </div>
  )
}

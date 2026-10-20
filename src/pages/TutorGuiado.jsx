import { useEffect, useRef, useState } from 'react'
import { DIALOGUES, isGoodReply } from '../data/dialogues'
import { speak, listen, canListen } from '../lib/speech'

export default function TutorGuiado({ gain, back }) {
  const [scene, setScene] = useState(null)
  const [step, setStep] = useState(0)
  const [log, setLog] = useState([])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const end = useRef(null)

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' })
  }, [log])

  const start = (d) => {
    setScene(d)
    setStep(0)
    setLog([{ from: 'bot', text: d.steps[0].bot }])
    speak(d.steps[0].bot)
  }

  const reply = (text) => {
    const t = text.trim()
    if (!t || step >= scene.steps.length) return
    const s = scene.steps[step]
    const ok = isGoodReply(s, t)
    if (ok) gain(5)
    const feedback = ok
      ? { from: 'tip', text: '✅ ¡Bien!' }
      : { from: 'tip', text: `💡 Podrías decir: “${s.model}”` }
    const nextStep = step + 1
    const out = [...log, { from: 'user', text: t }, feedback]
    if (nextStep < scene.steps.length) {
      out.push({ from: 'bot', text: scene.steps[nextStep].bot })
      speak(scene.steps[nextStep].bot)
    } else {
      out.push({ from: 'tip', text: '🎉 Terminaste el diálogo.' })
    }
    setLog(out)
    setStep(nextStep)
    setInput('')
    setError('')
  }

  const dictate = async () => {
    try {
      reply(await listen())
    } catch {
      setError('No pude escucharte. Intenta de nuevo.')
    }
  }

  if (!scene) {
    return (
      <div className="space-y-3">
        <button onClick={back} className="text-sm text-slate-500">← Tutor</button>
        <h2 className="text-lg font-bold">Práctica guiada</h2>
        {DIALOGUES.map((d) => (
          <button key={d.id} onClick={() => start(d)} className="card flex w-full items-center gap-3 text-left hover:bg-brand-50">
            <span className="text-3xl">{d.emoji}</span>
            <span className="font-semibold">{d.title}</span>
          </button>
        ))}
      </div>
    )
  }

  const finished = step >= scene.steps.length

  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col">
      <button onClick={() => setScene(null)} className="mb-2 text-left text-sm text-slate-500">
        ← {scene.title}
      </button>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {log.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
              m.from === 'user'
                ? 'ml-auto bg-brand-600 text-white'
                : m.from === 'tip'
                  ? 'bg-amber-50 text-slate-700'
                  : 'border border-slate-100 bg-white'
            }`}
          >
            {m.text}
            {m.from === 'bot' && (
              <button className="ml-2" onClick={() => speak(m.text)} aria-label="Escuchar">🔊</button>
            )}
          </div>
        ))}
        <div ref={end} />
      </div>

      {error && <p className="py-1 text-sm text-red-600">{error}</p>}

      {finished ? (
        <button className="btn-primary mt-2" onClick={() => setScene(null)}>Elegir otro diálogo</button>
      ) : (
        <form
          className="mt-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            reply(input)
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Responde en inglés…"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2"
          />
          {canListen() && (
            <button type="button" className="btn-ghost" onClick={dictate}>🎤</button>
          )}
          <button className="btn-primary" disabled={!input.trim()}>Enviar</button>
        </form>
      )}
    </div>
  )
}

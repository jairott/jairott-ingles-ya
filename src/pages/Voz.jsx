import { useState } from 'react'
import { ALL_WORDS } from '../data/lessons'
import { speak, listen, canListen, similarity } from '../lib/speech'

const pick = () => ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)]

export default function Voz({ gain }) {
  const [w, setW] = useState(pick)
  const [heard, setHeard] = useState(null)
  const [score, setScore] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const record = async () => {
    setBusy(true)
    setError('')
    try {
      const text = await listen()
      const s = similarity(w.en, text)
      setHeard(text)
      setScore(s)
      if (s >= 80) gain(10)
    } catch (e) {
      setError(
        e.message === 'not-allowed'
          ? 'Permite el micrófono en tu navegador.'
          : 'No pude escucharte. Intenta de nuevo.',
      )
    }
    setBusy(false)
  }

  const next = () => {
    setW(pick())
    setHeard(null)
    setScore(null)
    setError('')
  }

  if (!canListen()) {
    return (
      <div className="card">
        Tu navegador no soporta reconocimiento de voz. Usa Safari o Chrome en el celular o
        la computadora.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Practica tu pronunciación</h2>
      <div className="card text-center">
        <p className="text-sm text-slate-500">Di en voz alta:</p>
        <p className="mt-2 text-3xl font-bold">{w.en}</p>
        <p className="text-sm text-slate-500">{w.es}</p>
        <button className="btn-ghost mt-4" onClick={() => speak(w.en, 0.8)}>
          🔊 Escuchar cómo se dice
        </button>
      </div>

      <button className="btn-primary w-full" disabled={busy} onClick={record}>
        {busy ? 'Escuchando…' : '🎤 Hablar'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {score !== null && (
        <div className="card text-center">
          <p className="text-4xl font-bold">{score}%</p>
          <p className="mt-1 text-sm text-slate-500">Escuché: “{heard || '…'}”</p>
          <p className="mt-2 font-semibold">
            {score >= 80 ? '¡Excelente! +10 puntos' : 'Casi. Escucha y vuelve a intentar.'}
          </p>
          <button className="btn-ghost mt-3" onClick={next}>
            Siguiente frase →
          </button>
        </div>
      )}
    </div>
  )
}

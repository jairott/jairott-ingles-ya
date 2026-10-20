import { useMemo, useState } from 'react'
import { ALL_WORDS } from '../data/lessons'

const TOTAL = 10

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

function buildQuiz() {
  return shuffle(ALL_WORDS)
    .slice(0, TOTAL)
    .map((w) => {
      const wrong = shuffle(ALL_WORDS.filter((x) => x.es !== w.es))
        .slice(0, 3)
        .map((x) => x.es)
      return { q: w.en, answer: w.es, options: shuffle([w.es, ...wrong]) }
    })
}

export default function Quiz({ progress, gain, setBest }) {
  const [round, setRound] = useState(0)
  const quiz = useMemo(buildQuiz, [round])
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [chosen, setChosen] = useState(null)

  const restart = () => {
    setRound((r) => r + 1)
    setI(0)
    setScore(0)
    setChosen(null)
  }

  if (i >= TOTAL) {
    return (
      <div className="card space-y-3 text-center">
        <p className="text-4xl font-bold">
          {score} / {TOTAL}
        </p>
        <p>{score >= 8 ? '¡Excelente!' : score >= 5 ? '¡Bien! Sigue practicando.' : 'Repasa las lecciones y vuelve a intentar.'}</p>
        <p className="text-sm text-slate-500">Mejor puntaje: {progress.bestQuiz} / {TOTAL}</p>
        <button className="btn-primary w-full" onClick={restart}>
          Otro quiz
        </button>
      </div>
    )
  }

  const item = quiz[i]

  const choose = (opt) => {
    if (chosen) return
    setChosen(opt)
    if (opt === item.answer) {
      setScore((s) => s + 1)
      gain(2)
    }
  }

  const next = () => {
    const finalScore = score
    if (i === TOTAL - 1) setBest(finalScore)
    setChosen(null)
    setI(i + 1)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Pregunta {i + 1}/{TOTAL}
      </p>
      <div className="card text-center">
        <p className="text-sm text-slate-500">¿Qué significa?</p>
        <p className="mt-2 text-3xl font-bold">{item.q}</p>
      </div>
      <div className="space-y-2">
        {item.options.map((o) => {
          const state = !chosen
            ? 'bg-white border-slate-200'
            : o === item.answer
              ? 'bg-brand-100 border-brand-500'
              : o === chosen
                ? 'bg-red-100 border-red-400'
                : 'bg-white border-slate-200 opacity-60'
          return (
            <button
              key={o}
              onClick={() => choose(o)}
              className={`w-full rounded-xl border px-4 py-3 text-left font-medium ${state}`}
            >
              {o}
            </button>
          )
        })}
      </div>
      {chosen && (
        <button className="btn-primary w-full" onClick={next}>
          {i === TOTAL - 1 ? 'Ver resultado' : 'Siguiente'}
        </button>
      )}
    </div>
  )
}

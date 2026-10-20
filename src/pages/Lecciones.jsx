import { useState } from 'react'
import { LESSONS, wordKey } from '../data/lessons'
import { speak } from '../lib/speech'

export default function Lecciones({ progress, markLearned }) {
  const [lesson, setLesson] = useState(null)
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)

  if (!lesson) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Elige una lección</h2>
        {LESSONS.map((l) => {
          const done = l.words.filter((w) => progress.learned[wordKey(l.id, w.en)]).length
          return (
            <button
              key={l.id}
              onClick={() => {
                setLesson(l)
                setI(0)
                setFlipped(false)
              }}
              className="card flex w-full items-center gap-3 text-left hover:bg-brand-50"
            >
              <span className="text-3xl">{l.emoji}</span>
              <span className="flex-1">
                <span className="block font-semibold">{l.title}</span>
                <span className="text-sm text-slate-500">
                  {l.level} · {done}/{l.words.length}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  const w = lesson.words[i]
  const last = i === lesson.words.length - 1

  const next = () => {
    markLearned(wordKey(lesson.id, w.en))
    setFlipped(false)
    if (last) setLesson(null)
    else setI(i + 1)
  }

  return (
    <div className="space-y-4">
      <button onClick={() => setLesson(null)} className="text-sm text-slate-500">
        ← Lecciones
      </button>
      <p className="text-sm text-slate-500">
        {lesson.title} · {i + 1}/{lesson.words.length}
      </p>

      <button
        onClick={() => setFlipped(!flipped)}
        className="card flex min-h-56 w-full flex-col items-center justify-center text-center"
      >
        <span className="text-3xl font-bold">{flipped ? w.es : w.en}</span>
        {flipped ? (
          <span className="mt-4 text-sm italic text-slate-500">{w.ex}</span>
        ) : (
          <span className="mt-4 text-xs text-slate-400">Toca para ver la traducción</span>
        )}
      </button>

      <div className="flex gap-3">
        <button className="btn-ghost flex-1" onClick={() => speak(w.en)}>
          🔊 Escuchar
        </button>
        <button className="btn-ghost flex-1" onClick={() => speak(w.ex)}>
          🔊 Ejemplo
        </button>
      </div>
      <button className="btn-primary w-full" onClick={next}>
        {last ? 'Terminar lección' : 'Ya la sé → siguiente'}
      </button>
    </div>
  )
}

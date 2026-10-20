import { ALL_WORDS } from '../data/lessons'

export default function Inicio({ progress, go }) {
  const learned = Object.keys(progress.learned).length
  const pct = Math.round((learned / ALL_WORDS.length) * 100)

  return (
    <div className="space-y-4">
      <div className="card">
        <p className="text-sm text-slate-500">Tu progreso</p>
        <p className="mt-1 text-2xl font-bold">
          {learned} / {ALL_WORDS.length} palabras
        </p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Mejor quiz: {progress.bestQuiz} / 10 · Racha: {progress.streak} día(s)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          ['lecciones', '📚', 'Aprender palabras'],
          ['voz', '🎤', 'Practicar pronunciación'],
          ['tutor', '🤖', 'Hablar con el tutor'],
          ['quiz', '🏆', 'Hacer un quiz'],
        ].map(([id, icon, label]) => (
          <button key={id} onClick={() => go(id)} className="card text-left hover:bg-brand-50">
            <span className="text-3xl">{icon}</span>
            <p className="mt-2 font-semibold">{label}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { loadProgress, saveProgress, addXp } from './lib/storage'
import Inicio from './pages/Inicio'
import Lecciones from './pages/Lecciones'
import Voz from './pages/Voz'
import Tutor from './pages/Tutor'
import Quiz from './pages/Quiz'

const TABS = [
  { id: 'inicio', label: 'Inicio', icon: '🏠' },
  { id: 'lecciones', label: 'Lecciones', icon: '📚' },
  { id: 'voz', label: 'Voz', icon: '🎤' },
  { id: 'tutor', label: 'Tutor', icon: '🤖' },
  { id: 'quiz', label: 'Quiz', icon: '🏆' },
]

export default function App() {
  const [tab, setTab] = useState('inicio')
  const [progress, setProgress] = useState(loadProgress)

  const update = (fn) =>
    setProgress((p) => {
      const next = fn(p)
      saveProgress(next)
      return next
    })

  const gain = (xp) => update((p) => addXp(p, xp))
  const markLearned = (key) =>
    update((p) => (p.learned[key] ? p : addXp({ ...p, learned: { ...p.learned, [key]: true } }, 5)))
  const setBest = (score) => update((p) => ({ ...p, bestQuiz: Math.max(p.bestQuiz, score) }))

  const props = { progress, gain, markLearned, setBest, go: setTab }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col">
      <header className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-xl font-extrabold text-brand-700">InglesYa</h1>
        <div className="flex gap-3 text-sm font-semibold">
          <span title="Racha">🔥 {progress.streak}</span>
          <span title="Puntos">⭐ {progress.xp}</span>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24">
        {tab === 'inicio' && <Inicio {...props} />}
        {tab === 'lecciones' && <Lecciones {...props} />}
        {tab === 'voz' && <Voz {...props} />}
        {tab === 'tutor' && <Tutor {...props} />}
        {tab === 'quiz' && <Quiz {...props} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white">
        <ul className="mx-auto flex max-w-xl">
          {TABS.map((t) => (
            <li key={t.id} className="flex-1">
              <button
                onClick={() => setTab(t.id)}
                className={`flex w-full flex-col items-center py-2 text-xs font-medium ${
                  tab === t.id ? 'text-brand-700' : 'text-slate-500'
                }`}
              >
                <span className="text-xl">{t.icon}</span>
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

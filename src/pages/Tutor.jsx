import { useState } from 'react'
import TutorGuiado from './TutorGuiado'
import TutorLibre from './TutorLibre'

export default function Tutor(props) {
  const [mode, setMode] = useState(null)
  const back = () => setMode(null)

  if (mode === 'guiado') return <TutorGuiado {...props} back={back} />
  if (mode === 'libre') return <TutorLibre {...props} back={back} />

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold">Tutor de inglés</h2>
      <button onClick={() => setMode('guiado')} className="card w-full text-left hover:bg-brand-50">
        <span className="text-3xl">🎭</span>
        <p className="mt-2 font-semibold">Práctica guiada</p>
        <p className="text-sm text-slate-500">Diálogos de la vida real. Gratis, sin llave y sin internet.</p>
      </button>
      <button onClick={() => setMode('libre')} className="card w-full text-left hover:bg-brand-50">
        <span className="text-3xl">💬</span>
        <p className="mt-2 font-semibold">Conversación libre con IA</p>
        <p className="text-sm text-slate-500">Habla de lo que quieras. Usa una llave gratis de Google Gemini.</p>
      </button>
    </div>
  )
}

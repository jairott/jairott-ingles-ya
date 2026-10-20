# InglesYa

App personal para aprender inglés (React + Vite + Tailwind).

- **Lecciones:** tarjetas de vocabulario por tema, con audio.
- **Voz:** repites una palabra y la app calcula qué tan bien la dijiste (Web Speech API).
- **Tutor con IA:** conversación en inglés con Claude, que corrige en español.
  Requiere una llave de API de Anthropic; se guarda solo en tu navegador.
- **Quiz y progreso:** 10 preguntas, puntos y racha diaria (guardados en `localStorage`).

## Uso

```bash
npm install
npm run dev
```

La práctica de voz funciona mejor en Safari o Chrome.

## Agregar lecciones

Edita `src/data/lessons.js`: cada lección tiene `words` con `en`, `es` y un ejemplo `ex`.

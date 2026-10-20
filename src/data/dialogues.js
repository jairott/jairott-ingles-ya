// Cada paso: el tutor dice `bot`; la respuesta del usuario es válida si contiene
// alguna de las frases de `keys`. `model` es una respuesta de ejemplo.
export const DIALOGUES = [
  {
    id: 'restaurante',
    title: 'En el restaurante',
    emoji: '🍽️',
    steps: [
      { bot: 'Good evening! Welcome. How many people?', keys: ['two', 'one', 'three', 'four', 'table for'], model: 'A table for two, please.' },
      { bot: 'Here is the menu. What would you like to drink?', keys: ['water', 'juice', 'soda', 'coffee', 'tea', 'beer', 'like'], model: "I would like a glass of water, please." },
      { bot: 'Great! And what would you like to eat?', keys: ['chicken', 'pizza', 'burger', 'salad', 'steak', 'pasta', 'i would like', "i'll have", 'i will have'], model: 'I would like the chicken, please.' },
      { bot: 'Here is your food. Is everything okay?', keys: ['delicious', 'good', 'great', 'yes', 'thank'], model: 'Yes, it is delicious. Thank you!' },
      { bot: 'Would you like anything else?', keys: ['bill', 'check', 'no', 'thank'], model: 'No, thank you. The bill, please.' },
    ],
  },
  {
    id: 'presentarse',
    title: 'Presentarse',
    emoji: '👋',
    steps: [
      { bot: 'Hi! What is your name?', keys: ['my name is', "i am", "i'm", 'name'], model: 'My name is Jairo.' },
      { bot: 'Nice to meet you! Where are you from?', keys: ['from', 'mexico', 'texas', 'live'], model: 'I am from Mexico.' },
      { bot: 'What do you do for work?', keys: ['i work', 'i am a', "i'm a", 'work', 'business', 'job'], model: 'I work in finance.' },
      { bot: 'That sounds interesting! Why are you learning English?', keys: ['because', 'to', 'want', 'work', 'travel', 'need'], model: 'Because I want to talk with more people.' },
    ],
  },
  {
    id: 'direcciones',
    title: 'Pedir direcciones',
    emoji: '🧭',
    steps: [
      { bot: 'Hello! Can I help you?', keys: ['excuse me', 'where', 'help', 'yes'], model: 'Excuse me, where is the bank?' },
      { bot: 'The bank is near here. Go straight ahead for two blocks.', keys: ['thank', 'straight', 'two blocks', 'ok', 'okay'], model: 'Okay, straight ahead. Thank you!' },
      { bot: 'Then turn left at the gas station. You can not miss it.', keys: ['left', 'thank', 'gas station', 'ok', 'okay'], model: 'Turn left at the gas station. Thank you very much!' },
    ],
  },
  {
    id: 'compras',
    title: 'De compras',
    emoji: '🛍️',
    steps: [
      { bot: 'Hi! Are you looking for something?', keys: ['jacket', 'shirt', 'shoes', 'looking for', 'need', 'yes'], model: 'Yes, I am looking for a jacket.' },
      { bot: 'This one is very nice. What size do you wear?', keys: ['small', 'medium', 'large', 'size', 'wear'], model: 'I wear a medium.' },
      { bot: 'It is 60 dollars.', keys: ['how much', 'discount', 'expensive', 'cheap', 'take', 'buy', 'ok', 'okay'], model: 'Do you have a discount?' },
      { bot: 'Sure, 10 percent off. How will you pay?', keys: ['cash', 'card', 'credit', 'pay'], model: 'I will pay in cash.' },
    ],
  },
]

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s']/g, ' ').replace(/\s+/g, ' ')

export const isGoodReply = (step, reply) => {
  const r = ` ${norm(reply)} `
  return step.keys.some((k) => r.includes(` ${norm(k).trim()} `) || r.includes(norm(k).trim()))
}

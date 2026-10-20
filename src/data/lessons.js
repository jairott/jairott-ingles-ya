export const LESSONS = [
  {
    id: 'saludos',
    title: 'Saludos y presentaciones',
    emoji: '👋',
    level: 'Principiante',
    words: [
      { en: 'Hello', es: 'Hola', ex: 'Hello, my name is Jairo.' },
      { en: 'Good morning', es: 'Buenos días', ex: 'Good morning, how are you?' },
      { en: 'Good night', es: 'Buenas noches', ex: 'Good night, see you tomorrow.' },
      { en: 'How are you?', es: '¿Cómo estás?', ex: 'Hi Maria, how are you?' },
      { en: 'Nice to meet you', es: 'Mucho gusto', ex: 'Nice to meet you, I am Carlos.' },
      { en: 'Thank you', es: 'Gracias', ex: 'Thank you for your help.' },
      { en: 'Please', es: 'Por favor', ex: 'Please, sit down.' },
      { en: 'See you later', es: 'Hasta luego', ex: 'I have to go. See you later!' },
    ],
  },
  {
    id: 'comida',
    title: 'Comida y restaurante',
    emoji: '🍽️',
    level: 'Principiante',
    words: [
      { en: 'Water', es: 'Agua', ex: 'Can I have a glass of water?' },
      { en: 'Menu', es: 'Menú', ex: 'Can I see the menu, please?' },
      { en: 'Bill', es: 'Cuenta', ex: 'The bill, please.' },
      { en: 'Chicken', es: 'Pollo', ex: 'I would like the chicken.' },
      { en: 'Hungry', es: 'Con hambre', ex: 'I am very hungry.' },
      { en: 'Delicious', es: 'Delicioso', ex: 'This food is delicious.' },
      { en: 'To drink', es: 'Beber / tomar', ex: 'What do you want to drink?' },
      { en: 'Breakfast', es: 'Desayuno', ex: 'I eat breakfast at seven.' },
    ],
  },
  {
    id: 'trabajo',
    title: 'Trabajo y negocios',
    emoji: '💼',
    level: 'Intermedio',
    words: [
      { en: 'Meeting', es: 'Reunión', ex: 'We have a meeting at ten.' },
      { en: 'Customer', es: 'Cliente', ex: 'The customer is waiting.' },
      { en: 'Payment', es: 'Pago', ex: 'The payment is due on Friday.' },
      { en: 'Loan', es: 'Préstamo', ex: 'He asked for a small loan.' },
      { en: 'Deadline', es: 'Fecha límite', ex: 'The deadline is tomorrow.' },
      { en: 'To schedule', es: 'Programar / agendar', ex: 'Let us schedule a call.' },
      { en: 'Salary', es: 'Sueldo', ex: 'My salary is paid every month.' },
      { en: 'Boss', es: 'Jefe', ex: 'My boss is very friendly.' },
    ],
  },
  {
    id: 'viajes',
    title: 'Viajes y direcciones',
    emoji: '✈️',
    level: 'Intermedio',
    words: [
      { en: 'Where is the bathroom?', es: '¿Dónde está el baño?', ex: 'Excuse me, where is the bathroom?' },
      { en: 'Turn left', es: 'Gire a la izquierda', ex: 'Turn left at the corner.' },
      { en: 'Turn right', es: 'Gire a la derecha', ex: 'Turn right after the bank.' },
      { en: 'Straight ahead', es: 'Todo derecho', ex: 'Go straight ahead for two blocks.' },
      { en: 'Hotel room', es: 'Habitación de hotel', ex: 'We rented a small hotel room.' },
      { en: 'Gas station', es: 'Gasolinera', ex: 'There is a gas station nearby.' },
      { en: 'Ticket', es: 'Boleto', ex: 'I need a ticket to El Paso.' },
      { en: 'Luggage', es: 'Equipaje', ex: 'Where is my luggage?' },
    ],
  },
  {
    id: 'compras',
    title: 'Compras',
    emoji: '🛍️',
    level: 'Principiante',
    words: [
      { en: 'How much is it?', es: '¿Cuánto cuesta?', ex: 'How much is it? It looks great.' },
      { en: 'Cheap', es: 'Barato', ex: 'This jacket is cheap.' },
      { en: 'Expensive', es: 'Caro', ex: 'That is too expensive.' },
      { en: 'Discount', es: 'Descuento', ex: 'Do you have a discount?' },
      { en: 'Size', es: 'Talla', ex: 'What size do you wear?' },
      { en: 'Receipt', es: 'Recibo', ex: 'Can I have the receipt?' },
      { en: 'Cash', es: 'Efectivo', ex: 'I will pay in cash.' },
      { en: 'Credit card', es: 'Tarjeta de crédito', ex: 'Do you take credit cards?' },
    ],
  },
]

export const wordKey = (lessonId, en) => `${lessonId}:${en}`

export const ALL_WORDS = LESSONS.flatMap((l) =>
  l.words.map((w) => ({ ...w, lessonId: l.id, key: wordKey(l.id, w.en) })),
)

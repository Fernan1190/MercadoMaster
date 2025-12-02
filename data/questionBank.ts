
import { QuizQuestion } from '../types';

export interface BankQuestion extends QuizQuestion {
  tags: string[]; // e.g., ['#risk', '#crypto', '#psychology']
}

export const QUESTION_BANK: BankQuestion[] = [
  // --- GENERAL / BASICS ---
  {
    type: 'true_false',
    question: "¿Es posible perder más dinero del que invertiste al comprar una acción normal (sin apalancamiento)?",
    options: ["Verdadero", "Falso"],
    correctIndex: 1,
    correctAnswerText: "Falso",
    difficulty: "easy",
    explanation: "Con acciones al contado (spot), lo máximo que puedes perder es el 100% de tu inversión si la empresa quiebra (precio = 0).",
    tags: ['#basics', '#risk', '#stocks'],
    pedagogicalGoal: "Responsabilidad Limitada"
  },
  {
    type: 'multiple_choice',
    question: "¿Qué significa 'Diversificar' tu portafolio?",
    options: ["Comprar muchas criptomonedas diferentes", "Invertir todo en la empresa más segura", "Repartir el capital entre distintos tipos de activos (Acciones, Bonos, Real Estate)", "Tener cuentas en varios bancos"],
    correctIndex: 2,
    correctAnswerText: "Repartir el capital entre distintos tipos de activos (Acciones, Bonos, Real Estate)",
    difficulty: "easy",
    explanation: "Diversificar reduce el riesgo sistémico. Si un sector cae, otros pueden subir, equilibrando tu cuenta.",
    tags: ['#basics', '#strategy', '#risk'],
    pedagogicalGoal: "Gestión de Riesgo"
  },

  // --- TECHNICAL ANALYSIS ---
  {
    type: 'multiple_choice',
    question: "Si el RSI (Índice de Fuerza Relativa) está por encima de 70, ¿qué suele indicar?",
    options: ["El activo está Sobrecomprado (caro)", "El activo está Sobrevendido (barato)", "El volumen es bajo", "Es momento de comprar fuerte"],
    correctIndex: 0,
    correctAnswerText: "El activo está Sobrecomprado (caro)",
    difficulty: "medium",
    explanation: "Un RSI > 70 sugiere que el precio ha subido muy rápido y podría corregir (bajar) pronto.",
    tags: ['#technical', '#indicators', '#rsi'],
    pedagogicalGoal: "Lectura de Indicadores"
  },
  {
    type: 'candle_chart',
    question: "Ves una vela con una 'mecha' inferior muy larga después de una caída. ¿Qué sugiere?",
    chartData: { trend: 'doji_reversal', indicatorHint: "Rechazo de precios bajos" },
    options: ["SUBIRÁ (Martillo)", "BAJARÁ (Continuación)"],
    correctIndex: 0,
    correctAnswerText: "SUBIRÁ (Martillo)",
    difficulty: "medium",
    explanation: "Una mecha larga abajo significa que los vendedores intentaron bajar el precio, pero los compradores lo empujaron de vuelta arriba (Fuerza alcista).",
    tags: ['#technical', '#candles', '#patterns'],
    pedagogicalGoal: "Price Action"
  },
  {
    type: 'binary_prediction',
    question: "El precio rompe una resistencia clave de $100 pero con MUY POCO volumen. ¿Qué haces?",
    options: ["Comprar ruptura", "Esperar / No operar"],
    correctIndex: 1,
    correctAnswerText: "Esperar / No operar",
    difficulty: "hard",
    explanation: "Una ruptura sin volumen suele ser una 'Trampa de Toros' (False Breakout). Es probable que el precio vuelva a caer.",
    tags: ['#technical', '#volume', '#strategy'],
    pedagogicalGoal: "Confirmación de Tendencia"
  },

  // --- CRYPTO SPECIFIC ---
  {
    type: 'true_false',
    question: "¿Bitcoin es completamente anónimo?",
    options: ["Verdadero", "Falso"],
    correctIndex: 1,
    correctAnswerText: "Falso",
    difficulty: "medium",
    explanation: "Bitcoin es pseudónimo. Todas las transacciones son públicas en la Blockchain. Si alguien vincula tu wallet a tu identidad, puede ver todo tu historial.",
    tags: ['#crypto', '#privacy', '#bitcoin'],
    pedagogicalGoal: "Mitos de Cripto"
  },
  {
    type: 'ordering',
    question: "Ordena por Capitalización de Mercado (histórica general):",
    correctOrder: ["Bitcoin (BTC)", "Ethereum (ETH)", "Solana (SOL)", "Pepe (Meme)"],
    difficulty: "medium",
    explanation: "Bitcoin es el rey, seguido por Ethereum. Las Altcoins y Memecoins suelen tener valoraciones mucho menores.",
    tags: ['#crypto', '#marketcap'],
    pedagogicalGoal: "Jerarquía del Mercado"
  },
  {
    type: 'matching',
    question: "Conecta el concepto con su función:",
    pairs: [
      { left: "Mineros", right: "Seguridad y Validación" },
      { left: "Nodos", right: "Historial y Propagación" },
      { left: "Devs", right: "Mejora del Código" }
    ],
    difficulty: "hard",
    explanation: "Los mineros gastan energía para asegurar la red, los nodos guardan la copia de la blockchain y los desarrolladores proponen mejoras.",
    tags: ['#crypto', '#tech', '#bitcoin'],
    pedagogicalGoal: "Ecosistema Blockchain"
  },
  {
    type: 'sentiment_swipe',
    question: "Analiza estas noticias para Ethereum:",
    sentimentCards: [
      { text: "La actualización reduce gas fees un 90%", sentiment: "bullish" },
      { text: "Hackeo en un puente de la red", sentiment: "bearish" },
      { text: "Blackrock solicita ETF de ETH", sentiment: "bullish" }
    ],
    difficulty: "medium",
    explanation: "Mejoras tecnológicas e interés institucional son positivos. Hackeos y fallos de seguridad son negativos.",
    tags: ['#crypto', '#ethereum', '#news'],
    pedagogicalGoal: "Análisis Fundamental Cripto"
  },

  // --- PSYCHOLOGY & STRATEGY ---
  {
    type: 'risk_slider',
    question: "Acabas de perder 3 operaciones seguidas. ¿Cuánto deberías arriesgar en la siguiente?",
    riskScenario: { correctValue: 10, tolerance: 10, minLabel: "Mínimo (Proteger)", maxLabel: "Doble o Nada" },
    difficulty: "hard",
    explanation: "Cuando estás en racha perdedora (Tilt), debes REDUCIR el riesgo drásticamente o dejar de operar para proteger tu capital emocional y financiero.",
    tags: ['#psychology', '#risk', '#strategy'],
    pedagogicalGoal: "Gestión Emocional"
  },
  {
    type: 'multiple_choice',
    question: "¿Qué es el FOMO?",
    options: ["Fear Of Missing Out (Miedo a perderse algo)", "Fear Of Money Over (Miedo a perder dinero)", "Future Of Market Operations", "Ninguna"],
    correctIndex: 0,
    correctAnswerText: "Fear Of Missing Out (Miedo a perderse algo)",
    difficulty: "easy",
    explanation: "Es la emoción que te hace comprar cuando todo sube verticalmente, generalmente justo antes de que caiga.",
    tags: ['#psychology', '#acronyms'],
    pedagogicalGoal: "Psicología de Masas"
  },

  // --- MACRO ---
  {
    type: 'binary_prediction',
    question: "La inflación sube al 10%. ¿Qué suele pasar con el poder adquisitivo de tus ahorros en efectivo?",
    options: ["Aumenta", "Disminuye"],
    correctIndex: 1,
    correctAnswerText: "Disminuye",
    difficulty: "easy",
    explanation: "La inflación erosiona el valor del dinero fiat. Necesitas invertir para al menos mantener tu poder de compra.",
    tags: ['#macro', '#basics'],
    pedagogicalGoal: "Economía Básica"
  }
];

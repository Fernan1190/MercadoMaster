import { QuizQuestion } from '../types';

export interface BankQuestion extends QuizQuestion {
  tags: string[]; 
}

export const QUESTION_BANK: BankQuestion[] = [
  // --- BASICS ---
  {
    type: 'true_false',
    question: "¿Es posible perder más dinero del que invertiste en acciones spot?",
    options: ["Verdadero", "Falso"],
    correctIndex: 1,
    correctAnswerText: "Falso",
    difficulty: "easy",
    explanation: "En spot, el límite es 0.",
    tags: ['#basics', '#risk', '#stocks']
  },
  
  // --- NEW: FUNDAMENTAL ANALYSIS ---
  {
    type: 'multiple_choice',
    question: "¿Qué ratio indica si una acción está barata respecto a sus beneficios?",
    options: ["RSI", "PER (Price to Earnings)", "MACD"],
    correctIndex: 1,
    correctAnswerText: "PER (Price to Earnings)",
    difficulty: "medium",
    explanation: "PER bajo = potencialmente barata.",
    tags: ['#fundamental', '#stocks', '#valuation']
  },
  {
    type: 'matching',
    question: "Relaciona conceptos contables:",
    pairs: [
      { left: "Activo", right: "Posees" },
      { left: "Pasivo", right: "Debes" },
      { left: "Patrimonio", right: "Valor Neto" }
    ],
    difficulty: "medium",
    explanation: "Ecuación contable básica.",
    tags: ['#fundamental', '#accounting']
  },

  // --- NEW: TECHNICAL ANALYSIS ---
  {
    type: 'binary_prediction',
    question: "El precio rebota en una línea de tendencia alcista. ¿Qué haces?",
    options: ["Comprar", "Vender"],
    correctIndex: 0,
    correctAnswerText: "Comprar",
    difficulty: "medium",
    explanation: "La tendencia es tu amiga.",
    tags: ['#technical', '#trend']
  },

  // --- NEW: CRYPTO ADVANCED ---
  {
    type: 'multiple_choice',
    question: "¿Qué es una Layer 2 (Capa 2)?",
    options: ["Una estafa", "Solución de escalado (rápida/barata)", "Un nuevo Bitcoin"],
    correctIndex: 1,
    correctAnswerText: "Solución de escalado (rápida/barata)",
    difficulty: "hard",
    explanation: "Ayudan a Ethereum a ser usable.",
    tags: ['#crypto', '#tech', '#ethereum']
  },
  {
    type: 'sentiment_swipe',
    question: "Analiza sentimiento cripto:",
    sentimentCards: [
      { text: "EEUU aprueba ETF de Bitcoin", sentiment: "bullish" },
      { text: "Binance sufre hackeo masivo", sentiment: "bearish" },
      { text: "Inflación baja, FED baja tipos", sentiment: "bullish" }
    ],
    difficulty: "medium",
    explanation: "Adopción institucional y macroeconomía afectan mucho.",
    tags: ['#crypto', '#news']
  },

  // --- PSYCHOLOGY ---
  {
    type: 'risk_slider',
    question: "El mercado cae un 50% (Bear Market). Tienes cash. ¿Nivel de compra?",
    riskScenario: { correctValue: 80, tolerance: 20, minLabel: "Vender", maxLabel: "Comprar Fuerte" },
    difficulty: "hard",
    explanation: "Compra cuando haya sangre en las calles.",
    tags: ['#psychology', '#strategy']
  }

  {
    type: 'cloze',
    question: "Completa la definición:",
    clozeText: "El {0} mide cuánto tarda una inversión en recuperar su coste.",
    clozeOptions: ["PER", "RSI", "Volumen", "ROI"],
    correctAnswerText: "PER", // Debe coincidir exactamente con una opción
    difficulty: "medium",
    explanation: "El Price-to-Earnings Ratio indica los años necesarios para recuperar la inversión vía beneficios.",
    tags: ['#fundamental', '#stocks']
  }
];
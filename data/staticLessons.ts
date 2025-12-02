import { LessonContent } from '../types';

// Database of static, handcrafted lessons to ensure high quality for initial levels
// Key format: "pathId-unitId-levelIndex" (e.g., "stocks-s1-1")
export const STATIC_LESSONS: Record<string, LessonContent> = {
  // --- STOCKS PATH ---
  
  // Unit 1: Fundamentos (s1)
  "stocks-s1-1": {
    id: "stocks-s1-1",
    title: "¿Qué es una Acción?",
    isBossLevel: false,
    generatedBy: "static",
    slides: [
      {
        title: "La Analogía de la Pizza",
        content: "Imagina que tienes una pizzería muy exitosa, pero quieres abrir 10 locales más. No tienes dinero suficiente. \n\nDecides 'cortar' tu empresa en 1000 pedazos (acciones) y vender cada pedazo a $100. Quien compre un pedazo es dueño de una pequeña parte de tu pizzería.",
        analogy: "Una acción es como una rebanada de la empresa.",
        icon: "🍕",
        keyTerms: ["Acción", "Capital", "Propiedad"]
      },
      {
        title: "Derechos de Propiedad",
        content: "Al comprar una acción, no eres dueño de la silla o el horno, eres dueño de una fracción de las **ganancias futuras** y tienes derecho a voto en decisiones importantes de la empresa.",
        analogy: "Eres copropietario, no un cliente.",
        icon: "👑"
      }
    ],
    quiz: [
      {
        type: "multiple_choice",
        question: "Si compras una acción de Apple, ¿qué obtienes realmente?",
        options: ["Un iPhone gratis", "Una parte de la propiedad de la empresa", "Deuda que Apple te tiene que pagar", "Nada, es solo un papel"],
        correctIndex: 1,
        correctAnswerText: "Una parte de la propiedad de la empresa",
        difficulty: "easy",
        explanation: "Las acciones representan capital social (equity), lo que significa que posees una fracción del negocio.",
        pedagogicalGoal: "Concepto de Acción"
      },
      {
        type: "true_false",
        question: "¿El dueño de una acción es responsable de las deudas de la empresa con sus bienes personales?",
        options: ["Verdadero", "Falso"],
        correctIndex: 1,
        correctAnswerText: "Falso",
        difficulty: "medium",
        explanation: "Esa es la ventaja de la 'Responsabilidad Limitada'. Lo máximo que puedes perder es lo que invertiste en la acción.",
        pedagogicalGoal: "Responsabilidad Limitada"
      }
    ]
  },
  "stocks-s1-2": {
      id: "stocks-s1-2",
      title: "Riesgo vs Recompensa",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "El Balancín Financiero",
              content: "En finanzas, no hay almuerzos gratis. Si quieres ganar más dinero (Recompensa), debes estar dispuesto a asumir más posibilidad de perderlo (Riesgo). \n\nLos Bonos del gobierno son seguros pero pagan poco. Las acciones tecnológicas son volátiles pero pueden multiplicar tu dinero.",
              analogy: "A mayor velocidad (rendimiento), mayor riesgo de choque.",
              icon: "⚖️"
          }
      ],
      quiz: [
          {
              type: "risk_slider",
              question: "Ajusta el nivel de riesgo para un estudiante de 20 años con $500 que quiere aprender y crecer su capital.",
              riskScenario: { correctValue: 80, tolerance: 20, minLabel: "Conservador (Bonos)", maxLabel: "Agresivo (Acciones)" },
              difficulty: "medium",
              explanation: "Al ser joven y tener poco capital, tienes tiempo para recuperarte de caídas, por lo que puedes permitirte asumir más riesgo para buscar mayor crecimiento.",
              pedagogicalGoal: "Perfil de Riesgo"
          }
      ]
  },
  "stocks-s1-3": {
      id: "stocks-s1-3",
      title: "Tendencias de Mercado",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "Tendencia Alcista (Bullish)",
              content: "Una **Tendencia Alcista** se define por una serie de máximos y mínimos cada vez más altos. Los compradores tienen el control y empujan el precio hacia arriba con fuerza.",
              analogy: "Es como subir una escalera: das un paso atrás para descansar, pero luego subes dos más.",
              icon: "🚀",
              visualType: "chart_line",
              visualMeta: { trend: "up", label: "Máximos Crecientes" }
          },
          {
              title: "Tendencia Bajista (Bearish)",
              content: "Por el contrario, una **Tendencia Bajista** ocurre cuando el precio crea máximos y mínimos cada vez más bajos. El pánico o la toma de ganancias dominan.",
              analogy: "Una pelota cayendo por una colina.",
              icon: "📉",
              visualType: "chart_line",
              visualMeta: { trend: "down", label: "Mínimos Decrecientes" }
          }
      ],
      quiz: [
          {
              type: "candle_chart",
              question: "¿Qué tipo de tendencia muestra este patrón de velas?",
              chartData: { trend: 'up', indicatorHint: "Mínimos crecientes" },
              difficulty: "easy",
              explanation: "Es una tendencia alcista clara.",
              options: ["Alcista (Bullish)", "Bajista (Bearish)"],
              correctIndex: 0,
              correctAnswerText: "Alcista (Bullish)"
          }
      ]
  },
  "stocks-s1-4": {
      id: "stocks-s1-4",
      title: "Soportes y Resistencias",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "Pisos y Techos",
              content: "El precio no se mueve aleatoriamente. Rebota en zonas clave.\n\n**Soporte (Piso):** Donde el precio suele dejar de bajar y rebota. Es buen lugar para comprar.\n**Resistencia (Techo):** Donde el precio suele dejar de subir. Buen lugar para vender.",
              analogy: "Es como una pelota rebotando en una habitación.",
              icon: "🚧",
              deepDive: {
                  title: "¿Por qué ocurre?",
                  content: "Porque los inversores tienen memoria. Si Amazon estaba barata a $100 ayer, muchos querrán comprar si vuelve a $100 hoy."
              }
          }
      ],
      quiz: [
          {
              type: "binary_prediction",
              question: "El precio de una acción toca una Resistencia fuerte por tercera vez. ¿Qué es más probable que ocurra?",
              options: ["Rompe y sube", "Rebota y baja"],
              correctIndex: 1,
              correctAnswerText: "Rebota y baja",
              difficulty: "medium",
              explanation: "Las resistencias suelen rechazar el precio. Si rompe, se convierte en soporte, pero la probabilidad inicial es el rechazo.",
              pedagogicalGoal: "Estructura de Mercado"
          }
      ]
  },
  "stocks-s1-5": {
      id: "stocks-s1-5",
      title: "Volumen: El Combustible",
      isBossLevel: true, // Boss Level!
      generatedBy: "static",
      slides: [
          {
              title: "¿Verdad o Mentira?",
              content: "El **Volumen** es la cantidad de acciones que se compraron y vendieron en un periodo. Es el detector de mentiras del mercado.\n\nSi el precio sube pero el volumen es bajo, es una subida débil (trampa). Si sube con mucho volumen, es una subida real.",
              analogy: "El precio es el coche, el volumen es la gasolina.",
              icon: "⛽",
              proTip: "Nunca operes una ruptura de soporte/resistencia sin confirmar con volumen."
          }
      ],
      quiz: [
          {
              type: "multiple_choice",
              question: "Una acción rompe su máximo histórico, pero el volumen es muy bajo. ¿Qué deberías pensar?",
              options: ["Es una compra segura", "Es una trampa (Falsa ruptura)", "El mercado está cerrado", "Es irrelevante"],
              correctIndex: 1,
              correctAnswerText: "Es una trampa (Falsa ruptura)",
              difficulty: "hard",
              explanation: "Sin 'gasolina' (volumen), el coche (precio) no llegará lejos y probablemente retrocederá.",
              pedagogicalGoal: "Validación con Volumen"
          },
          {
              type: "binary_prediction",
              question: "El precio cae fuerte con un volumen GIGANTE (Pánico). ¿Qué suele pasar después?",
              options: ["Sigue cayendo eternamente", "Posible rebote (Capitulación)"],
              correctIndex: 1,
              correctAnswerText: "Posible rebote (Capitulación)",
              difficulty: "medium",
              explanation: "Un pico extremo de volumen en una caída suele indicar que 'todos los que querían vender ya vendieron', dejando espacio para compradores.",
              pedagogicalGoal: "Psicología de Masas"
          }
      ]
  },

  // --- CRYPTO PATH ---

  // Unit 1: Blockchain 101 (c1)
  "crypto-c1-1": {
      id: "crypto-c1-1",
      title: "El Oro Digital",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "¿Por qué Bitcoin?",
              content: "El dinero normal (Fiat) es impreso por gobiernos infinitamente, lo que causa inflación. Bitcoin es diferente: solo existirán **21 millones**.\n\nEs descentralizado: nadie lo controla, ningún banco puede congelar tu cuenta.",
              analogy: "Bitcoin es como oro que puedes teletransportar por internet.",
              icon: "🪙"
          }
      ],
      quiz: [
          {
              type: "multiple_choice",
              question: "¿Cuál es el límite máximo de Bitcoins que existirán jamás?",
              options: ["Infinito, se pueden imprimir más", "21 Millones", "100 Millones", "Depende de los mineros"],
              correctIndex: 1,
              correctAnswerText: "21 Millones",
              difficulty: "easy",
              explanation: "La escasez programada (Hard Cap) es lo que le da valor frente al dinero fiat que se devalúa.",
              pedagogicalGoal: "Escasez Digital"
          }
      ]
  },
   "crypto-c1-2": {
      id: "crypto-c1-2",
      title: "La Blockchain",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "La Cadena de Bloques",
              content: "Imagina un libro contable compartido por todo el mundo. Cada vez que alguien hace una transacción, se anota en una página (Bloque). Cuando la página se llena, se sella criptográficamente y se une a la anterior.\n\nNadie puede arrancar una página sin que todos se den cuenta.",
              analogy: "Un grupo de WhatsApp donde nadie puede borrar mensajes.",
              icon: "🔗"
          }
      ],
      quiz: [
          {
              type: "ordering",
              question: "Ordena el proceso de una transacción en Bitcoin:",
              correctOrder: ["Usuario envía BTC", "Transacción va a la Mempool", "Mineros crean un Bloque", "Bloque se añade a la Blockchain"],
              difficulty: "medium",
              explanation: "Es un proceso secuencial: Envío -> Espera (Mempool) -> Confirmación (Minería) -> Inmutabilidad (Blockchain).",
              pedagogicalGoal: "Funcionamiento Blockchain"
          }
      ]
  },
  "crypto-c1-3": {
      id: "crypto-c1-3",
      title: "Hot vs Cold Wallets",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "¿Dónde guardo mis Criptos?",
              content: "**Hot Wallet**: Conectada a internet (Metamask, Exchange). Es cómoda para trading pero menos segura.\n\n**Cold Wallet**: Desconectada (Ledger, Trezor). Es como una caja fuerte física, ideal para guardar ahorros a largo plazo.",
              analogy: "Hot Wallet es tu billetera del bolsillo. Cold Wallet es tu caja fuerte en casa.",
              icon: "🛡️"
          }
      ],
      quiz: [
          {
              type: "matching",
              question: "Empareja el tipo de wallet con su característica:",
              pairs: [
                  { left: "Hot Wallet", right: "Conectada a Internet" },
                  { left: "Cold Wallet", right: "Máxima Seguridad Offline" },
                  { left: "Exchange", right: "Custodia de Terceros" }
              ],
              difficulty: "medium",
              explanation: "Las Hot Wallets son para uso diario, las Cold Wallets para seguridad (HODL), y los Exchanges custodian tus claves por ti.",
              pedagogicalGoal: "Seguridad Cripto"
          }
      ]
  },
  "crypto-c1-4": {
      id: "crypto-c1-4",
      title: "Minería (Proof of Work)",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "El Sudoku Más Difícil",
              content: "Los mineros no 'buscan' monedas en la tierra. Usan ordenadores potentes para resolver un problema matemático muy difícil.\n\nEl primero que lo resuelve, gana el derecho a añadir el siguiente bloque a la cadena y recibe Bitcoins nuevos como recompensa.",
              analogy: "Es como una lotería donde compras más boletos si tienes más potencia de cálculo.",
              icon: "⛏️",
              commonPitfall: "Mucha gente cree que minar es gratis. Requiere mucha electricidad y hardware costoso."
          }
      ],
      quiz: [
          {
              type: "true_false",
              question: "¿Cualquier ordenador casero puede minar Bitcoin rentablemente hoy en día?",
              options: ["Verdadero", "Falso"],
              correctIndex: 1,
              correctAnswerText: "Falso",
              difficulty: "easy",
              explanation: "Hoy en día se necesitan chips especializados (ASICs) porque la dificultad de la red es extremadamente alta.",
              pedagogicalGoal: "Realidad de la Minería"
          }
      ]
  },
  "crypto-c1-5": {
      id: "crypto-c1-5",
      title: "El Halving",
      isBossLevel: true, // Boss Level!
      generatedBy: "static",
      slides: [
          {
              title: "El Shock de Oferta",
              content: "Cada 4 años, la cantidad de Bitcoins que ganan los mineros se corta a la mitad. Esto se llama **Halving**.\n\nSi la demanda se mantiene igual pero la oferta nueva se reduce a la mitad, el precio tiende a subir por escasez.",
              analogy: "Imagina que de repente las minas de oro producen la mitad de oro. El oro existente valdría más.",
              icon: "✂️"
          }
      ],
      quiz: [
          {
              type: "ordering",
              question: "Ordena la recompensa por bloque de Bitcoin históricamente:",
              correctOrder: ["50 BTC (2009)", "25 BTC (2012)", "12.5 BTC (2016)", "6.25 BTC (2020)"],
              difficulty: "medium",
              explanation: "El protocolo divide la emisión por 2 cada 210,000 bloques (aprox 4 años).",
              pedagogicalGoal: "Historia Monetaria"
          },
          {
              type: "multiple_choice",
              question: "¿Qué efecto suele tener el Halving en el precio a largo plazo (históricamente)?",
              options: ["El precio se desploma a cero", "Inicia un ciclo alcista (Bull Run)", "No pasa nada", "Bitcoin deja de funcionar"],
              correctIndex: 1,
              correctAnswerText: "Inicia un ciclo alcista (Bull Run)",
              difficulty: "easy",
              explanation: "Históricamente, el año posterior al Halving ha sido muy alcista debido al shock de oferta.",
              pedagogicalGoal: "Ciclos de Mercado"
          }
      ]
  }
};
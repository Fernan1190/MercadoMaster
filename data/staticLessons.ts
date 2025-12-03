import { LessonContent } from '../types';

// Database of static, handcrafted lessons to ensure high quality
export const STATIC_LESSONS: Record<string, LessonContent> = {
  // ============================================================================
  // RUTA: INVERSOR DE BOLSA (STOCKS)
  // ============================================================================

  // --- UNIDAD 1: Fundamentos del Mercado ---
  "stocks-s1-1": {
      id: "stocks-s1-1",
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
              riskScenario: { correctValue: 80, tolerance: 20, minLabel: "Conservador", maxLabel: "Agresivo" },
              difficulty: "medium",
              explanation: "Al ser joven y tener poco capital, tienes tiempo para recuperarte de caídas, por lo que puedes permitirte asumir más riesgo para buscar mayor crecimiento.",
              pedagogicalGoal: "Perfil de Riesgo"
          }
      ]
  },
  "stocks-s1-3": {
    id: "stocks-s1-3",
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
      }
    ]
  },
  "stocks-s1-4": {
      id: "stocks-s1-4",
      title: "Soportes y Resistencias",
      isBossLevel: false,
      generatedBy: "static",
      slides: [{ title: "Pisos y Techos", content: "El precio rebota en zonas clave.", analogy: "Pelota rebotando.", icon: "🚧" }],
      quiz: [{ type: "binary_prediction", question: "El precio toca resistencia.", options: ["Rompe", "Rebota"], correctIndex: 1, correctAnswerText: "Rebota", difficulty: "medium", explanation: "Suele rebotar." }]
  },
  "stocks-s1-5": {
      id: "stocks-s1-5",
      title: "Volumen: El Combustible",
      isBossLevel: true,
      generatedBy: "static",
      slides: [{ title: "Gasolina", content: "Volumen es combustible.", icon: "⛽" }],
      quiz: [{ type: "multiple_choice", question: "Subida sin volumen.", options: ["Compra", "Trampa"], correctIndex: 1, correctAnswerText: "Trampa", difficulty: "hard", explanation: "Trampa." }]
  },

  // --- UNIDAD 2: Análisis Fundamental (NUEVO) ---
  "stocks-s2-1": {
      id: "stocks-s2-1",
      title: "El Balance General",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "La Foto de la Empresa",
              content: "El **Balance General** nos dice qué tiene la empresa y qué debe en un momento exacto.\n\n**Activos:** Lo que posee (Dinero, Fábricas).\n**Pasivos:** Lo que debe (Deudas, Préstamos).\n**Patrimonio:** Lo que queda para los dueños.",
              analogy: "Es como mirar tu cuenta bancaria + tu casa - tu hipoteca.",
              icon: "📸",
              keyTerms: ["Activos", "Pasivos", "Patrimonio"]
          }
      ],
      quiz: [
          {
              type: "matching",
              question: "Clasifica estos conceptos contables:",
              pairs: [
                  { left: "Fábrica", right: "Activo" },
                  { left: "Préstamo Bancario", right: "Pasivo" },
                  { left: "Dinero en Caja", right: "Activo" }
              ],
              difficulty: "easy",
              explanation: "Los activos ponen dinero en tu bolsillo, los pasivos lo sacan."
          }
      ]
  },
  "stocks-s2-2": {
      id: "stocks-s2-2",
      title: "PER: ¿Barato o Caro?",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "Price to Earnings (PER)",
              content: "El **PER** nos dice cuántos años tardaríamos en recuperar nuestra inversión con los beneficios actuales.\n\nSi una empresa vale $100 por acción y gana $5 al año, su PER es 20. Estás pagando 20 veces sus beneficios.",
              analogy: "Si compras un bar por 100k y gana 10k al año, tardas 10 años en recuperarlo (PER 10).",
              icon: "🏷️",
              visualType: "chart_volume",
              visualMeta: { label: "Comparación de PER" }
          }
      ],
      quiz: [
          {
              type: "binary_prediction",
              question: "Tesla tiene un PER de 60 y Ford de 7. ¿Cuál espera el mercado que crezca más rápido?",
              options: ["Tesla", "Ford"],
              correctIndex: 0,
              correctAnswerText: "Tesla",
              difficulty: "medium",
              explanation: "Un PER alto suele indicar que los inversores esperan un crecimiento futuro explosivo."
          }
      ]
  },
  "stocks-s2-3": {
      id: "stocks-s2-3",
      title: "Ventajas Competitivas",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "El Foso Económico (Moat)",
              content: "Warren Buffett busca empresas con 'Fosos'. Son barreras que protegen a la empresa de sus rivales.\n\nEjemplos: Marca potente (Coca-Cola), Coste de cambio (Apple), Efecto Red (Facebook).",
              analogy: "Un castillo (la empresa) rodeado por un foso con cocodrilos.",
              icon: "🏰"
          }
      ],
      quiz: [
          {
              type: "multiple_choice",
              question: "¿Cuál de estas es una ventaja competitiva tipo 'Coste de Cambio'?",
              options: ["Precio bajo", "Que sea difícil irse a la competencia", "Mejor logo", "Ventas globales"],
              correctIndex: 1,
              correctAnswerText: "Que sea difícil irse a la competencia",
              difficulty: "medium",
              explanation: "El coste de cambio atrapa al cliente (ej: cambiar todo el software de una empresa)."
          }
      ]
  },
  "stocks-s2-4": { id: "stocks-s2-4", title: "Dividendos", isBossLevel: false, generatedBy: "static", slides: [{title: "Renta Pasiva", content: "Parte del beneficio que se paga al accionista.", icon: "💸"}], quiz: [{type: "true_false", question: "¿La acción baja cuando paga dividendo?", options: ["Verdadero", "Falso"], correctIndex: 0, correctAnswerText: "Verdadero", difficulty: "hard", explanation: "El dinero sale de la caja de la empresa."}] },
  "stocks-s2-5": { id: "stocks-s2-5", title: "BOSS: Analista", isBossLevel: true, generatedBy: "static", slides: [{title: "Valoración", content: "Une todo lo aprendido.", icon: "🕵️‍♂️"}], quiz: [{type: "multiple_choice", question: "Empresa sin deuda y con marca fuerte. ¿Es segura?", options: ["Sí", "No"], correctIndex: 0, correctAnswerText: "Sí", difficulty: "medium", explanation: "Son señales de calidad."}] },

  // --- UNIDAD 3: Análisis Técnico (NUEVO) ---
  "stocks-s3-1": {
      id: "stocks-s3-1",
      title: "Tipos de Gráficos",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "Líneas vs Velas",
              content: "El gráfico de línea es simple, pero esconde información. El gráfico de **Velas Japonesas** muestra apertura, cierre, máximo y mínimo de cada sesión.",
              icon: "📊",
              visualType: "chart_candle",
              visualMeta: { trend: "up", label: "Velas Japonesas" }
          }
      ],
      quiz: [
          {
              type: "multiple_choice",
              question: "¿Qué gráfico usan los traders profesionales?",
              options: ["Línea", "Pastel", "Velas Japonesas"],
              correctIndex: 2,
              correctAnswerText: "Velas Japonesas",
              difficulty: "easy",
              explanation: "Las velas dan mucha más información sobre la psicología del mercado."
          }
      ]
  },
  "stocks-s3-2": {
      id: "stocks-s3-2",
      title: "Medias Móviles",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "Suavizando el Ruido",
              content: "Una **Media Móvil (MA)** es el precio promedio de los últimos X días. Ayuda a ver la tendencia real ignorando el ruido diario.",
              analogy: "Como el promedio de notas de un alumno, ignora un mal examen puntual.",
              icon: "〰️",
              visualType: "chart_line",
              visualMeta: { trend: "volatile", showIndicators: true, label: "Precio vs Media" }
          }
      ],
      quiz: [
          {
              type: "binary_prediction",
              question: "El precio cruza por encima de su media móvil de 200 días. ¿Es una señal...?",
              options: ["Alcista", "Bajista"],
              correctIndex: 0,
              correctAnswerText: "Alcista",
              difficulty: "medium",
              explanation: "Romper la media al alza suele indicar inicio de tendencia positiva (Golden Cross)."
          }
      ]
  },
  // ... (s3-3, s3-4, s3-5 simplificados para brevedad, pero funcionales)
  "stocks-s3-3": { id: "stocks-s3-3", title: "RSI y MACD", isBossLevel: false, generatedBy: "static", slides: [{title: "Indicadores", content: "Ayudan a ver si está caro o barato.", icon: "🧭"}], quiz: [{type: "multiple_choice", question: "RSI en 80 significa:", options: ["Sobrecompra", "Sobreventa"], correctIndex: 0, correctAnswerText: "Sobrecompra", difficulty: "medium", explanation: "Posible bajada inminente."}] },
  "stocks-s3-4": { id: "stocks-s3-4", title: "Estructura de Mercado", isBossLevel: false, generatedBy: "static", slides: [{title: "HH y HL", content: "Higher Highs y Higher Lows.", icon: "🏗️"}], quiz: [{type: "true_false", question: "¿En tendencia bajista hay máximos decrecientes?", options: ["Verdadero", "Falso"], correctIndex: 0, correctAnswerText: "Verdadero", difficulty: "medium", explanation: "Sí, cada rebote es más bajo que el anterior."}] },
  "stocks-s3-5": { id: "stocks-s3-5", title: "BOSS: Chartista", isBossLevel: true, generatedBy: "static", slides: [{title: "Patrones", content: "El gráfico habla.", icon: "🔮"}], quiz: [{type: "candle_chart", question: "Doble techo en resistencia. ¿Qué haces?", chartData: {trend: 'doji_reversal'}, options: ["Vender", "Comprar"], correctIndex: 0, correctAnswerText: "Vender", difficulty: "hard", explanation: "El doble techo es un patrón de reversión bajista."}] },


  // ============================================================================
  // RUTA: EXPERTO CRIPTO
  // ============================================================================

  // --- UNIDAD 1: Blockchain 101 (YA EXISTENTE) ---
  "crypto-c1-1": {
      id: "crypto-c1-1",
      title: "El Oro Digital",
      isBossLevel: false,
      generatedBy: "static",
      slides: [{ title: "Escasez", content: "Solo 21 millones de BTC.", icon: "🪙" }],
      quiz: [{ type: "multiple_choice", question: "¿Límite de BTC?", options: ["Infinito", "21M"], correctIndex: 1, correctAnswerText: "21M", difficulty: "easy", explanation: "Hard Cap." }]
  },
  "crypto-c1-2": {
      id: "crypto-c1-2",
      title: "La Blockchain",
      isBossLevel: false,
      generatedBy: "static",
      slides: [{ title: "Cadena de Bloques", content: "Libro contable público.", icon: "🔗" }],
      quiz: [{ type: "ordering", question: "Ordena tx bitcoin:", correctOrder: ["Envío", "Mempool", "Minería", "Blockchain"], difficulty: "medium", explanation: "Secuencia lógica." }]
  },
  "crypto-c1-3": { id: "crypto-c1-3", title: "Wallets", isBossLevel: false, generatedBy: "static", slides: [{title: "Hot vs Cold", content: "Internet vs Offline", icon: "🛡️"}], quiz: [{type: "matching", question: "Empareja", pairs: [{left: "Hot", right: "Online"}, {left: "Cold", right: "Offline"}], difficulty: "easy", explanation: "Seguridad vs Comodidad."}] },
  "crypto-c1-4": { id: "crypto-c1-4", title: "Minería", isBossLevel: false, generatedBy: "static", slides: [{title: "PoW", content: "Gastar energía para validar.", icon: "⛏️"}], quiz: [{type: "true_false", question: "¿Cualquiera mina con laptop?", options: ["Verdadero", "Falso"], correctIndex: 1, correctAnswerText: "Falso", difficulty: "easy", explanation: "Necesitas ASICs."}] },
  "crypto-c1-5": { id: "crypto-c1-5", title: "Halving", isBossLevel: true, generatedBy: "static", slides: [{title: "Shock de Oferta", content: "Cada 4 años la emisión baja a la mitad.", icon: "✂️"}], quiz: [{type: "multiple_choice", question: "Efecto del Halving", options: ["Baja precio", "Sube precio"], correctIndex: 1, correctAnswerText: "Sube precio", difficulty: "easy", explanation: "Escasez."}] },

  // --- UNIDAD 2: Bitcoin & Ethereum (NUEVO) ---
  "crypto-c2-1": {
      id: "crypto-c2-1",
      title: "El Trilema",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "El Problema Imposible",
              content: "Es difícil tener las tres a la vez:\n1. **Seguridad**\n2. **Descentralización**\n3. **Escalabilidad** (Rapidez)\n\nBitcoin elige Seguridad y Descentralización, pero es lento.",
              analogy: "Bueno, Bonito y Barato. Elige dos.",
              icon: "⚠️",
              visualType: "diagram_flow",
              visualMeta: { label: "Trilema Blockchain" }
          }
      ],
      quiz: [
          {
              type: "multiple_choice",
              question: "Solana es muy rápida pero a veces se apaga. ¿Qué sacrifica?",
              options: ["Escalabilidad", "Descentralización", "Precio"],
              correctIndex: 1,
              correctAnswerText: "Descentralización",
              difficulty: "medium",
              explanation: "Para ser rápido, a menudo se centralizan los servidores."
          }
      ]
  },
  "crypto-c2-2": {
      id: "crypto-c2-2",
      title: "Smart Contracts",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "Código es Ley",
              content: "Ethereum introdujo los **Contratos Inteligentes**. Programas que se ejecutan solos.\n\nEjemplo: 'Si es viernes, envía 1 ETH a mamá'. Nadie intermediario.",
              analogy: "Máquina expendedora: metes moneda, sale producto. Sin vendedor.",
              icon: "📜"
          }
      ],
      quiz: [
          {
              type: "true_false",
              question: "¿Necesitas un abogado para ejecutar un Smart Contract?",
              options: ["Verdadero", "Falso"],
              correctIndex: 1,
              correctAnswerText: "Falso",
              difficulty: "easy",
              explanation: "Se ejecuta automáticamente por código en la blockchain."
          }
      ]
  },
  "crypto-c2-3": {
      id: "crypto-c2-3",
      title: "Gas Fees",
      isBossLevel: false,
      generatedBy: "static",
      slides: [{ title: "El Peaje", content: "Pagas por usar la red.", icon: "⛽" }],
      quiz: [{ type: "binary_prediction", question: "Red congestionada.", options: ["Gas sube", "Gas baja"], correctIndex: 0, correctAnswerText: "Gas sube", difficulty: "easy", explanation: "Oferta y demanda." }]
  },
  "crypto-c2-4": {
      id: "crypto-c2-4",
      title: "PoW vs PoS",
      isBossLevel: false,
      generatedBy: "static",
      slides: [{ title: "Consenso", content: "Minería vs Staking.", icon: "⚔️" }],
      quiz: [{ type: "matching", question: "Empareja:", pairs: [{left: "Bitcoin", right: "PoW"}, {left: "Ethereum", right: "PoS"}], difficulty: "medium", explanation: "ETH es PoS." }]
  },
  "crypto-c2-5": {
      id: "crypto-c2-5",
      title: "BOSS: Arquitecto",
      isBossLevel: true,
      generatedBy: "static",
      slides: [{ title: "Construcción", content: "Aplicando lógica.", icon: "🏗️" }],
      quiz: [{ type: "multiple_choice", question: "App de préstamos descentralizada. ¿Qué red?", options: ["Bitcoin", "Ethereum"], correctIndex: 1, correctAnswerText: "Ethereum", difficulty: "hard", explanation: "Necesitas Smart Contracts." }]
  },

  // --- UNIDAD 3: Trading Cripto (NUEVO) ---
  "crypto-c3-1": {
      id: "crypto-c3-1",
      title: "Exchanges",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "CEX vs DEX",
              content: "**CEX (Binance):** Una empresa custodia tu dinero. Fácil pero arriesgado.\n**DEX (Uniswap):** Tú tienes el control, operas directo en la blockchain.",
              analogy: "CEX es un Banco. DEX es un mercadillo callejero.",
              icon: "🏦"
          }
      ],
      quiz: [
          {
              type: "true_false",
              question: "En un DEX, ¿tienes que dar tu DNI (KYC)?",
              options: ["Verdadero", "Falso"],
              correctIndex: 1,
              correctAnswerText: "Falso",
              difficulty: "medium",
              explanation: "Los DEX son anónimos y sin permiso."
          }
      ]
  },
  "crypto-c3-2": {
      id: "crypto-c3-2",
      title: "Stablecoins",
      isBossLevel: false,
      generatedBy: "static",
      slides: [
          {
              title: "Dólares Digitales",
              content: "Las **Stablecoins** (USDT, USDC) valen siempre $1. Sirven para refugiarte cuando el mercado cae sin salir a dinero fiat.",
              analogy: "Fichas de casino que valen dinero real.",
              icon: "💵"
          }
      ],
      quiz: [
          {
              type: "multiple_choice",
              question: "¿Para qué usas USDT?",
              options: ["Hacerte rico rápido", "Proteger valor (Refugio)", "Votar"],
              correctIndex: 1,
              correctAnswerText: "Proteger valor (Refugio)",
              difficulty: "easy",
              explanation: "No sube de precio, mantiene el valor del dólar."
          }
      ]
  },
  "crypto-c3-3": { id: "crypto-c3-3", title: "Pares de Trading", isBossLevel: false, generatedBy: "static", slides: [{title: "BTC/USD", content: "Qué compras con qué.", icon: "💱"}], quiz: [{type: "matching", question: "Relaciona", pairs: [{left: "BTC/USD", right: "Dólares"}, {left: "ETH/BTC", right: "Bitcoin"}], difficulty: "medium", explanation: "Moneda base vs cotizada."}] },
  "crypto-c3-4": { id: "crypto-c3-4", title: "Volatilidad", isBossLevel: false, generatedBy: "static", slides: [{title: "Montaña Rusa", content: "Cripto se mueve rápido.", icon: "🎢"}], quiz: [{type: "risk_slider", question: "Riesgo en Altcoins pequeñas.", riskScenario: {correctValue: 90, tolerance: 10, minLabel: "Bajo", maxLabel: "Extremo"}, difficulty: "easy", explanation: "Altísimo riesgo."}] },
  "crypto-c3-5": { id: "crypto-c3-5", title: "BOSS: Trader DeFi", isBossLevel: true, generatedBy: "static", slides: [{title: "DeFi Master", content: "Finanzas del futuro.", icon: "🌐"}], quiz: [{type: "sentiment_swipe", question: "Noticias DeFi", sentimentCards: [{text: "Protocolo hackeado", sentiment: "bearish"}, {text: "Nuevo DEX sin comisiones", sentiment: "bullish"}], difficulty: "medium", explanation: "Seguridad es clave."}] }
};
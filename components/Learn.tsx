
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Book, Star, Lock, CheckCircle, XCircle, ArrowRight, Home, Zap, Award, Volume2, ArrowLeft, Loader2, Play, TrendingUp, TrendingDown, Bitcoin, Heart, HeartCrack, Coins, Puzzle, ListOrdered, BrainCircuit, Skull, Timer, Hammer, Shield, Snowflake, Eye, VolumeX, Lightbulb, Bot, Backpack, Wand2, Forward, BookMarked, HelpCircle, PackageOpen, Gift, MapPin, Volume1, AlertTriangle, Terminal, ChevronDown, ChevronUp, Info, MousePointerClick, ThumbsUp, ThumbsDown, Cloud, Trees, Cpu, Rocket, Mountain, Target, PieChart, Activity, Sliders } from 'lucide-react';
import { UserStats, PathId, LessonContent, Unit, LearningPath, QuestionType, GameMode } from '../types';
import { getLesson } from '../services/contentService'; // CHANGED IMPORT
import { simplifyText } from '../services/geminiService';
import { LessonMap } from './learn/LessonMap';
import { LessonTheory } from './learn/LessonTheory';
import { LessonOverlays } from './learn/LessonOverlays';

const PATHS: Record<PathId, LearningPath> = {
  [PathId.STOCKS]: {
    id: PathId.STOCKS,
    title: "Inversor de Bolsa",
    description: "Domina Wall Street desde cero",
    icon: "📈",
    themeColor: "indigo",
    units: [
      { id: 's1', title: "Fundamentos del Mercado", description: "Qué es la bolsa y por qué se mueve", color: "indigo", totalLevels: 10, biome: 'forest' },
      { id: 's2', title: "Análisis Fundamental", description: "Leer balances y entender valor", color: "blue", totalLevels: 15, biome: 'ocean' },
      { id: 's3', title: "Análisis Técnico", description: "Gráficos, tendencias y velas", color: "sky", totalLevels: 20, biome: 'neon' },
      { id: 's4', title: "Psicología del Trading", description: "Control emocional y disciplina", color: "violet", totalLevels: 15, biome: 'volcano' },
      { id: 's5', title: "Estrategias Avanzadas", description: "Opciones, futuros y hedging", color: "purple", totalLevels: 40, biome: 'space' },
    ]
  },
  [PathId.CRYPTO]: {
    id: PathId.CRYPTO,
    title: "Experto Cripto",
    description: "Blockchain, Bitcoin y DeFi",
    icon: "🚀",
    themeColor: "violet",
    units: [
      { id: 'c1', title: "Blockchain 101", description: "La tecnología del futuro", color: "violet", totalLevels: 10, biome: 'neon' },
      { id: 'c2', title: "Bitcoin & Ethereum", description: "Las monedas principales", color: "fuchsia", totalLevels: 15, biome: 'space' },
      { id: 'c3', title: "Trading Cripto", description: "Volatilidad y Exchanges", color: "purple", totalLevels: 20, biome: 'volcano' },
      { id: 'c4', title: "DeFi & Web3", description: "Finanzas descentralizadas", color: "pink", totalLevels: 25, biome: 'ocean' },
      { id: 'c5', title: "NFTs y Metaverso", description: "Propiedad digital", color: "rose", totalLevels: 30, biome: 'forest' },
    ]
  }
};

interface LearnProps {
  stats: UserStats;
  updateStats: (xp: number, pathId: PathId, levelIncrement: number, perfectRun: boolean) => void;
  deductHeart: () => void;
  buyHearts: () => boolean;
  useItem: (type: 'hint5050' | 'timeFreeze' | 'skip') => boolean;
  addBookmark: (term: string) => void;
  onOpenChest: (chestId: string) => void;
}

type LessonPhase = 'intro' | 'theory' | 'quiz' | 'outro';

export const Learn: React.FC<LearnProps> = ({ stats, updateStats, deductHeart, buyHearts, useItem, addBookmark, onOpenChest }) => {
  const [selectedPathId, setSelectedPathId] = useState<PathId | null>(null);
  const [activeLesson, setActiveLesson] = useState<LessonContent | null>(null);
  const [phase, setPhase] = useState<LessonPhase>('intro');
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('standard');
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [simplifiedSlide, setSimplifiedSlide] = useState<string | null>(null);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [lootBoxOpen, setLootBoxOpen] = useState(false);
  const [terminalMode, setTerminalMode] = useState(false);

  // Quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizHistory, setQuizHistory] = useState<boolean[]>([]);
  const [combo, setCombo] = useState(0);
  const [shake, setShake] = useState(false);
  const [explanationOverride, setExplanationOverride] = useState<string | null>(null);

  // Minigame States
  const [riskSliderValue, setRiskSliderValue] = useState(50);
  const [portfolioState, setPortfolioState] = useState<{ [key: string]: number }>({});
  const [sentimentState, setSentimentState] = useState<{ index: number; correctCount: number; answers: boolean[] }>({ index: 0, correctCount: 0, answers: [] });
  
  // Sound
  const [isMuted, setIsMuted] = useState(false);
  useEffect(() => { (window as any).isMuted = isMuted; }, [isMuted]);

  // Boss / Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Matching/Ordering State
  const [matchingState, setMatchingState] = useState<{
    selectedId: string | null;
    matchedIds: string[];
    shuffledItems: { id: string, text: string, type: 'left' | 'right', pairId: number }[];
  }>({ selectedId: null, matchedIds: [], shuffledItems: [] });

  const [orderingState, setOrderingState] = useState<{
    pool: string[];
    userOrder: string[];
  }>({ pool: [], userOrder: [] });

  // Game Over
  const [showGameOver, setShowGameOver] = useState(false);

  const playSound = (type: 'success' | 'fail' | 'pop' | 'levelUp' | 'chest' | 'swipe' | 'process') => {
    if ((window as any).isMuted) return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
  
    const t = ctx.currentTime;
    if (type === 'success') {
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(1000, t + 0.1);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    } else if (type === 'fail') {
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.3);
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    } else if (type === 'process') {
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.linearRampToValueAtTime(400, t + 0.5);
      gain.gain.setValueAtTime(0.02, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.5);
    } else {
       osc.frequency.setValueAtTime(800, t);
       gain.gain.setValueAtTime(0.05, t);
       gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    }

    osc.start();
    osc.stop(t + (type === 'process' ? 0.5 : 0.3));
  };
  const speakText = (text: string) => { if (isMuted) return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'es-ES'; window.speechSynthesis.speak(u); };

  // Timer Effect
  useEffect(() => {
    let timer: any;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      if (gameMode === 'time_trial') {
          setTimerActive(false);
          setPhase('outro');
      } else {
          setTimerActive(false);
          handleTimeUp();
      }
    }
    return () => clearInterval(timer);
  }, [timeLeft, timerActive, gameMode]);

  // INITIALIZE MINIGAMES WHEN QUESTION CHANGES
  useEffect(() => {
    if (!activeLesson || !activeLesson.quiz[currentQuestionIndex]) return;
    const q = activeLesson.quiz[currentQuestionIndex];

    // Reset simple states
    setSelectedOption(null);
    setRiskSliderValue(50);

    if (q.type === 'matching' && q.pairs) {
        const items = q.pairs.flatMap((p, i) => [
            { id: `l-${i}`, text: p.left, type: 'left', pairId: i },
            { id: `r-${i}`, text: p.right, type: 'right', pairId: i }
        ]);
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        setMatchingState({ selectedId: null, matchedIds: [], shuffledItems: items as any });
    }

    if (q.type === 'ordering' && q.correctOrder) {
        const pool = [...q.correctOrder];
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        setOrderingState({ pool, userOrder: [] });
    }

    if (q.type === 'portfolio_balancing' && q.portfolioAssets) {
        const init: any = {};
        q.portfolioAssets.forEach(a => init[a.name] = 0);
        setPortfolioState(init);
    }

    if (q.type === 'sentiment_swipe') {
        setSentimentState({ index: 0, correctCount: 0, answers: [] });
    }

  }, [activeLesson, currentQuestionIndex]);

  const handleStartGameMode = async (mode: GameMode) => {
      setGameMode(mode);
      if (stats.hearts <= 0) { setShowGameOver(true); return; }
      
      setIsLoading(true);
      setLoadingMessage(mode === 'survival' ? "Preparando Supervivencia..." : "Calibrando Reloj...");
      setLoadingProgress(10);
      playSound('process');

      // Use ContentService (getLesson) instead of generateLesson
      // We pass a dummy path/unit for game modes
      try {
          const lesson = await getLesson(PathId.STOCKS, 's1', 1, "Modo Juego", "Desafío");
          setLoadingProgress(100);
          
          setTimeout(() => {
              setActiveLesson(lesson);
              setIsLoading(false);
              setPhase('quiz'); 
              setCurrentQuestionIndex(0);
              
              if (mode === 'time_trial') {
                  setTimeLeft(60); 
                  setTimerActive(true);
              } else if (mode === 'survival') {
                  setTimeLeft(0);
                  setTimerActive(false);
              }
          }, 500);
      } catch (e) {
          setIsLoading(false);
      }
  };

  const startLevel = async (unit: Unit, absoluteLevelIndex: number, levelInUnit: number) => {
    if (!selectedPathId) return;
    setGameMode('standard');
    if (stats.hearts <= 0) { setShowGameOver(true); return; }
    
    setCurrentUnit(unit);
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingMessage("Cargando Contenido...");
    playSound('process');

    const progressInterval = setInterval(() => {
       setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 15;
       });
    }, 100); // Faster loading simulation since it's likely static

    try {
        // USE CONTENT SERVICE
        const lesson = await getLesson(selectedPathId, unit.id, levelInUnit, PATHS[selectedPathId].title, unit.title);
        
        clearInterval(progressInterval);
        setLoadingProgress(100);
        
        setTimeout(() => {
            setActiveLesson(lesson);
            setIsLoading(false);
            setPhase('theory');
            setCurrentSlideIndex(0);
            setCurrentQuestionIndex(0);
            setQuizHistory([]);
        }, 300);
    } catch (e) { 
        clearInterval(progressInterval);
        setIsLoading(false);
        console.error("Lesson Load Failed", e);
    }
  };

  const handleTimeUp = () => {
     setIsCorrect(false);
     setShowFeedback(true);
     setShake(true);
     deductHeart();
  };

  const handleExplainAgain = async () => {
      if (!activeLesson) return;
      const q = activeLesson.quiz[currentQuestionIndex];
      setIsSimplifying(true);
      const newExpl = await simplifyText("Explica por qué la respuesta correcta es la correcta para: " + q.question);
      setExplanationOverride(newExpl);
      setIsSimplifying(false);
  };

  // --- INTERACTION HANDLERS ---

  const handleMatchClick = (item: any) => {
      if (matchingState.matchedIds.includes(item.id)) return;
      if (!matchingState.selectedId) {
          setMatchingState(prev => ({ ...prev, selectedId: item.id }));
      } else {
          if (matchingState.selectedId === item.id) {
              setMatchingState(prev => ({ ...prev, selectedId: null }));
              return;
          }
          const first = matchingState.shuffledItems.find(i => i.id === matchingState.selectedId);
          const second = item;
          
          if (first?.pairId === second.pairId) {
              playSound('pop');
              setMatchingState(prev => ({ ...prev, selectedId: null, matchedIds: [...prev.matchedIds, first!.id, second.id] }));
          } else {
              setShake(true);
              playSound('fail');
              setTimeout(() => setShake(false), 500);
              setMatchingState(prev => ({ ...prev, selectedId: null }));
          }
      }
  };

  const handleOrderClick = (text: string, isRemoval: boolean) => {
      if (isRemoval) {
          setOrderingState(prev => ({ pool: [...prev.pool, text], userOrder: prev.userOrder.filter(t => t !== text) }));
      } else {
          setOrderingState(prev => ({ userOrder: [...prev.userOrder, text], pool: prev.pool.filter(t => t !== text) }));
      }
      playSound('pop');
  };

  const handleSentimentSwipe = (sentiment: 'bullish' | 'bearish') => {
      if (!activeLesson) return;
      const q = activeLesson.quiz[currentQuestionIndex];
      const card = q.sentimentCards?.[sentimentState.index];
      if (!card) return;

      const isCorrect = card.sentiment === sentiment;
      setSentimentState(prev => ({
          index: prev.index + 1,
          correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
          answers: [...prev.answers, isCorrect]
      }));
      playSound(isCorrect ? 'pop' : 'fail');
  };

  const checkAnswer = () => {
    if (!activeLesson) return;
    if (gameMode !== 'time_trial') setTimerActive(false);

    const q = activeLesson.quiz?.[currentQuestionIndex];
    if (!q) return;

    let correct = false;

    if (q.type === 'matching') {
        correct = matchingState.matchedIds.length === matchingState.shuffledItems.length;
    } 
    else if (q.type === 'ordering') {
        correct = JSON.stringify(orderingState.userOrder) === JSON.stringify(q.correctOrder);
    }
    else if (q.type === 'portfolio_balancing') {
        const total = Object.values(portfolioState).reduce((a, b) => a + b, 0);
        // Add tolerance for floating point math
        if (Math.abs(total - 100) > 1) { alert("El total debe sumar 100%"); return; }
        
        let currentRisk = 0;
        q.portfolioAssets!.forEach(a => {
            currentRisk += (portfolioState[a.name] || 0) / 100 * a.riskScore;
        });
        const target = q.portfolioTargetRisk || 50;
        correct = Math.abs(currentRisk - target) <= 15; // Tolerance
    }
    else if (q.type === 'risk_slider') {
        const target = q.riskScenario?.correctValue || 50;
        const tol = q.riskScenario?.tolerance || 15;
        correct = Math.abs(riskSliderValue - target) <= tol;
    }
    else if (q.type === 'candle_chart') {
        const trend = q.chartData?.trend;
        correct = (trend === 'up' && selectedOption === 0) || (trend === 'down' && selectedOption === 1);
    }
    else if (q.type === 'sentiment_swipe') {
        correct = sentimentState.correctCount >= (q.sentimentCards?.length || 0) * 0.8; 
    }
    else {
        // Multiple Choice / True False - Hybrid Validation
        const indexMatch = selectedOption === q.correctIndex;
        let textMatch = false;
        if (selectedOption !== null && q.options && q.options[selectedOption]) {
            const selectedText = q.options[selectedOption].replace(/^[a-z0-9][\)\.]\s*/i, "").trim().toLowerCase();
            const correctText = (q.correctAnswerText || "").replace(/^[a-z0-9][\)\.]\s*/i, "").trim().toLowerCase();
            textMatch = selectedText === correctText;
        }
        correct = indexMatch || textMatch;
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setCombo(c => c + 1);
      playSound('success');
    } else {
      setCombo(0);
      setShake(true);
      deductHeart();
      playSound('fail');
      if (gameMode === 'survival') {
          setTimeout(() => setShowGameOver(true), 1000);
      }
    }
  };

  const nextQuestion = () => {
    if (!activeLesson) return;
    
    // FULL STATE RESET
    setExplanationOverride(null);
    setShowFeedback(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setShake(false);
    
    if (stats.hearts === 0 && gameMode !== 'time_trial') { setShowGameOver(true); return; }

    if (currentQuestionIndex < activeLesson.quiz.length - 1) {
      setCurrentQuestionIndex(p => p + 1);
    } else {
      setPhase('outro');
      playSound('levelUp');
      setTimeout(() => setLootBoxOpen(true), 500);
    }
  };

  const closeLesson = () => {
    if (!selectedPathId) return;
    const baseXP = gameMode === 'survival' ? 100 : 25;
    updateStats(baseXP, selectedPathId, gameMode === 'standard' ? 1 : 0, quizHistory.every(Boolean));
    setActiveLesson(null);
    setPhase('intro');
  };

  if (isLoading || showGameOver || phase === 'outro') {
     return <LessonOverlays 
        isLoading={isLoading} 
        loadingMessage={loadingMessage} 
        loadingProgress={loadingProgress}
        showGameOver={showGameOver} 
        onBuyHearts={() => { if(buyHearts()) setShowGameOver(false); }}
        onCloseGameOver={() => { setActiveLesson(null); setShowGameOver(false); }}
        phase={phase} 
        lootBoxOpen={lootBoxOpen} 
        setLootBoxOpen={setLootBoxOpen} 
        onCloseLesson={closeLesson}
        onCancelLoading={() => setIsLoading(false)} // New
        rewardAmount={activeLesson?.isBossLevel ? 50 : 25}
     />;
  }

  if (!activeLesson) {
     return (
        <LessonMap 
           paths={PATHS} 
           selectedPathId={selectedPathId} 
           stats={stats} 
           onSelectPath={setSelectedPathId} 
           onStartLevel={startLevel}
           onStartGameMode={handleStartGameMode}
           onUpdateStats={updateStats}
           playSound={playSound}
           onOpenChest={onOpenChest}
        />
     );
  }

  const q = activeLesson.quiz[currentQuestionIndex];
  
  // Safe Fallback for Malformed Minigame Data
  // If a minigame question is missing required data, fallback to rendering a basic error or skipping
  const isMinigameBroken = 
      (q.type === 'portfolio_balancing' && !q.portfolioAssets) || 
      (q.type === 'sentiment_swipe' && !q.sentimentCards) ||
      (q.type === 'matching' && !q.pairs);

  if (isMinigameBroken) {
      // Auto-skip broken questions if they slip through sanitization
      setTimeout(() => nextQuestion(), 100);
      return <div className="flex justify-center items-center h-full text-white">Optimizando lección...</div>;
  }

  return (
    <div className={`fixed inset-0 bg-slate-950 z-50 flex flex-col overflow-hidden ${terminalMode ? 'font-mono text-green-400' : ''}`}>
       <div className="bg-slate-900/80 backdrop-blur-md p-3 md:p-4 flex items-center justify-between border-b border-slate-800 relative z-[100] shadow-lg">
           <button onClick={() => setActiveLesson(null)} className="text-slate-400 hover:text-white p-2 transition-colors"><XCircle size={24}/></button>
           
           {gameMode === 'time_trial' && (
               <div className="text-2xl font-black text-white flex items-center gap-2">
                   <Timer className={timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-blue-500'} /> 
                   {timeLeft}s
               </div>
           )}

           <div className="flex gap-3 items-center">
              {gameMode === 'survival' && <div className="text-red-500 font-bold uppercase animate-pulse">Muerte Súbita</div>}
              <div className="flex items-center text-red-500 font-bold gap-1 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 relative overflow-hidden">
                 <Heart size={18} fill="currentColor"/> {stats.hearts}
              </div>
           </div>
       </div>

       {phase === 'theory' ? (
          <LessonTheory 
             activeLesson={activeLesson} 
             currentSlideIndex={currentSlideIndex} 
             terminalMode={terminalMode}
             simplifiedSlide={simplifiedSlide}
             setCurrentSlideIndex={setCurrentSlideIndex}
             setPhase={setPhase}
             onSpeak={speakText}
             onBookmark={addBookmark}
             onSimplify={async () => {}} 
          />
       ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center bg-slate-950 relative">
             <div className="bg-grid-pattern absolute inset-0 opacity-10 pointer-events-none"></div>
             
             <div className="max-w-3xl w-full relative z-10 mt-4 pb-32">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-widest">{q.type.replace(/_/g, ' ')}</span>
                    <div className="flex gap-1">
                        {activeLesson.quiz.map((_, i) => (
                            <div key={i} className={`w-3 h-1 rounded-full ${i === currentQuestionIndex ? 'bg-white' : i < currentQuestionIndex ? 'bg-green-500' : 'bg-slate-800'}`}></div>
                        ))}
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center drop-shadow-md">{q.question}</h2>
                
                {/* --- MULTIPLE CHOICE / TRUE FALSE --- */}
                {['multiple_choice', 'true_false', 'binary_prediction'].includes(q.type) && (
                      <div className="grid gap-4">
                         {q.options?.map((opt, i) => (
                            <button key={i} disabled={showFeedback} onClick={() => !showFeedback && setSelectedOption(i)}
                               className={`w-full p-5 rounded-2xl text-left transition-all text-lg font-medium shadow-lg border-2 relative overflow-hidden group
                                  ${selectedOption === i 
                                    ? 'bg-blue-600 border-blue-400 text-white' 
                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-750'}
                                  ${showFeedback && i === q.correctIndex ? '!bg-green-500 !border-green-400 !text-slate-900' : ''}
                                  ${showFeedback && selectedOption === i && i !== q.correctIndex ? '!bg-red-500 !border-red-400 !text-white' : ''}
                               `}
                            >
                               {opt}
                            </button>
                         ))}
                      </div>
                )}

                {/* --- CANDLE CHART PREDICTION --- */}
                {q.type === 'candle_chart' && (
                    <div className="flex flex-col items-center">
                        <div className="w-full h-64 bg-slate-900 rounded-2xl border border-slate-700 mb-6 relative overflow-hidden flex items-center justify-center p-4">
                            {/* Fake SVG Chart - Dynamic based on Trend */}
                            <svg viewBox="0 0 200 100" className="w-full h-full">
                                {q.chartData?.trend === 'up' ? (
                                   <>
                                      <line x1="20" y1="80" x2="20" y2="60" stroke="#ef4444" strokeWidth="2"/>
                                      <rect x="15" y="65" width="10" height="10" fill="#ef4444"/>
                                      <line x1="50" y1="70" x2="50" y2="40" stroke="#22c55e" strokeWidth="2"/>
                                      <rect x="45" y="45" width="10" height="20" fill="#22c55e"/>
                                      <line x1="80" y1="50" x2="80" y2="20" stroke="#22c55e" strokeWidth="2"/>
                                      <rect x="75" y="25" width="10" height="20" fill="#22c55e"/>
                                   </>
                                ) : (
                                   <>
                                      <line x1="20" y1="40" x2="20" y2="20" stroke="#22c55e" strokeWidth="2"/>
                                      <rect x="15" y="25" width="10" height="10" fill="#22c55e"/>
                                      <line x1="50" y1="50" x2="50" y2="80" stroke="#ef4444" strokeWidth="2"/>
                                      <rect x="45" y="55" width="10" height="20" fill="#ef4444"/>
                                      <line x1="80" y1="60" x2="80" y2="90" stroke="#ef4444" strokeWidth="2"/>
                                      <rect x="75" y="65" width="10" height="20" fill="#ef4444"/>
                                   </>
                                )}
                                {/* The 'Next' Prediction Spot */}
                                <rect x="110" y="20" width="40" height="60" fill="none" stroke="#fff" strokeDasharray="4" opacity="0.5"/>
                                <text x="120" y="55" fill="#fff" fontSize="20" opacity="0.5">?</text>
                            </svg>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <button onClick={() => setSelectedOption(0)} className={`p-6 rounded-2xl border-2 font-bold flex flex-col items-center gap-2 ${selectedOption === 0 ? 'bg-green-600 border-green-400 text-white' : 'bg-slate-800 border-slate-700 text-green-400'}`}>
                                <TrendingUp size={32}/> SUBIRÁ
                            </button>
                            <button onClick={() => setSelectedOption(1)} className={`p-6 rounded-2xl border-2 font-bold flex flex-col items-center gap-2 ${selectedOption === 1 ? 'bg-red-600 border-red-400 text-white' : 'bg-slate-800 border-slate-700 text-red-400'}`}>
                                <TrendingDown size={32}/> BAJARÁ
                            </button>
                        </div>
                    </div>
                )}

                {/* --- MATCHING GAME --- */}
                {q.type === 'matching' && (
                    <div className="grid grid-cols-2 gap-4">
                        {matchingState.shuffledItems.map(item => {
                            const isMatched = matchingState.matchedIds.includes(item.id);
                            const isSelected = matchingState.selectedId === item.id;
                            
                            if (isMatched) return <div key={item.id} className="opacity-0 pointer-events-none p-4"></div>;

                            return (
                                <button 
                                    key={item.id}
                                    onClick={() => handleMatchClick(item)}
                                    disabled={showFeedback}
                                    className={`p-6 rounded-xl border-2 font-bold text-sm transition-all
                                        ${isSelected ? 'bg-blue-500 border-blue-400 text-white scale-105' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}
                                    `}
                                >
                                    {item.text}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* --- ORDERING GAME --- */}
                {q.type === 'ordering' && (
                    <div className="space-y-8">
                        <div className="min-h-[100px] p-4 bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col gap-2">
                            {orderingState.userOrder.length === 0 && <p className="text-slate-500 text-center italic">Toca las opciones en orden correcto...</p>}
                            {orderingState.userOrder.map((text, i) => (
                                <button key={i} onClick={() => !showFeedback && handleOrderClick(text, true)} className="bg-blue-600 text-white p-3 rounded-lg font-bold shadow-md animate-bounce-in flex justify-between">
                                    <span>{i + 1}. {text}</span> <XCircle size={16}/>
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {orderingState.pool.map((text, i) => (
                                <button key={i} onClick={() => !showFeedback && handleOrderClick(text, false)} className="bg-slate-800 text-slate-300 border border-slate-700 p-3 rounded-lg font-bold hover:bg-slate-700 transition-colors">
                                    {text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- RISK SLIDER --- */}
                {q.type === 'risk_slider' && (
                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 text-center">
                        <div className="text-6xl font-black mb-8" style={{ color: `hsl(${120 - (riskSliderValue * 1.2)}, 70%, 50%)` }}>
                            {riskSliderValue}%
                        </div>
                        <input 
                            type="range" min="0" max="100" 
                            value={riskSliderValue} 
                            onChange={(e) => setRiskSliderValue(Number(e.target.value))}
                            className="w-full h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
                            disabled={showFeedback}
                        />
                        <div className="flex justify-between mt-4 text-xs font-bold uppercase text-slate-500">
                            <span>{q.riskScenario?.minLabel || "Conservador"}</span>
                            <span>{q.riskScenario?.maxLabel || "Arriesgado"}</span>
                        </div>
                    </div>
                )}

                {/* --- PORTFOLIO BALANCING --- */}
                {q.type === 'portfolio_balancing' && q.portfolioAssets && (
                    <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-6">
                        <div className="flex justify-between font-bold text-white mb-2">
                            <span>Total Asignado:</span>
                            <span className={`${Math.abs(Object.values(portfolioState).reduce((a,b)=>a+b,0) - 100) < 1 ? 'text-green-400' : 'text-red-400'}`}>
                                {Object.values(portfolioState).reduce((a,b)=>a+b,0)}%
                            </span>
                        </div>
                        {q.portfolioAssets.map((asset, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm text-slate-300 mb-1">
                                    <span>{asset.name}</span>
                                    <span>{portfolioState[asset.name] || 0}%</span>
                                </div>
                                <input 
                                    type="range" min="0" max="100" step="5"
                                    value={portfolioState[asset.name] || 0}
                                    onChange={(e) => setPortfolioState(prev => ({ ...prev, [asset.name]: Number(e.target.value) }))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    disabled={showFeedback}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* --- SENTIMENT SWIPE --- */}
                {q.type === 'sentiment_swipe' && q.sentimentCards && (
                    <div className="relative h-64 w-full max-w-sm mx-auto">
                        {sentimentState.index < q.sentimentCards.length ? (
                            <div className="absolute inset-0 bg-slate-800 rounded-2xl border border-slate-600 p-6 flex flex-col items-center justify-center text-center shadow-2xl animate-in zoom-in">
                                <p className="text-xl font-bold text-white mb-6">{q.sentimentCards[sentimentState.index].text}</p>
                                <div className="flex gap-4 w-full">
                                    <button onClick={() => handleSentimentSwipe('bearish')} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white border border-red-500 p-4 rounded-xl transition-all">
                                        <TrendingDown className="mx-auto mb-1"/> BAJISTA
                                    </button>
                                    <button onClick={() => handleSentimentSwipe('bullish')} className="flex-1 bg-green-500/20 hover:bg-green-500 text-green-500 hover:text-white border border-green-500 p-4 rounded-xl transition-all">
                                        <TrendingUp className="mx-auto mb-1"/> ALCISTA
                                    </button>
                                </div>
                                <div className="mt-4 text-xs text-slate-500 uppercase font-bold">
                                    Tarjeta {sentimentState.index + 1} de {q.sentimentCards.length}
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                                ¡Completado! Dale a comprobar.
                            </div>
                        )}
                    </div>
                )}

             </div>

             {/* Feedback Footer */}
             {showFeedback && (
                 <div className={`fixed bottom-0 left-0 w-full p-4 md:p-6 border-t border-slate-800 backdrop-blur-xl transition-colors duration-300 z-[100] ${isCorrect ? 'bg-green-900/90' : 'bg-red-900/90'}`}>
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-4 flex gap-4 animate-slide-up">
                            <div className={`p-3 rounded-full h-fit shadow-lg ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                {isCorrect ? <CheckCircle className="text-slate-900" size={32} /> : <XCircle className="text-white" size={32}/>}
                            </div>
                            <div>
                                <h3 className={`font-black text-xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{isCorrect ? '¡EXCELENTE!' : 'CASI...'}</h3>
                                <p className="text-slate-200 mt-1">{explanationOverride || q?.explanation}</p>
                                {!isCorrect && (
                                    <button onClick={handleExplainAgain} className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg flex items-center gap-2">
                                        <Bot size={12}/> No entiendo, explícamelo mejor
                                    </button>
                                )}
                            </div>
                        </div>
                        <button onClick={nextQuestion} className="w-full py-4 rounded-2xl font-black tracking-wide shadow-xl bg-white text-slate-900 hover:bg-slate-200">
                            CONTINUAR
                        </button>
                    </div>
                 </div>
             )}
             
             {!showFeedback && (
                 <div className="fixed bottom-0 left-0 w-full p-4 z-50 bg-slate-900/90 border-t border-slate-800">
                     <button onClick={checkAnswer} 
                        disabled={
                            (q.type === 'matching' && matchingState.matchedIds.length !== matchingState.shuffledItems.length) ||
                            (q.type === 'ordering' && orderingState.pool.length > 0) ||
                            (q.type === 'sentiment_swipe' && sentimentState.index < (q.sentimentCards?.length || 0)) ||
                            (['multiple_choice', 'true_false', 'binary_prediction', 'candle_chart'].includes(q.type) && selectedOption === null)
                        } 
                        className="w-full max-w-3xl mx-auto block py-4 rounded-2xl font-black bg-blue-600 text-white disabled:bg-slate-800 disabled:text-slate-500 transition-all">
                         COMPROBAR
                     </button>
                 </div>
             )}
          </div>
       )}
    </div>
  );
};
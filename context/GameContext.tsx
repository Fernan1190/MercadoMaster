import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef, useMemo } from 'react';
import { UserStats, PathId, DailyQuest, Transaction, Achievement, CandleData } from '../types';
import { INITIAL_PRICES, generateNextCandle } from '../services/marketSimulator';
import { ACHIEVEMENTS } from '../data/achievements';

const INITIAL_QUESTS: DailyQuest[] = [
  { id: 'q1', text: 'Gana 50 XP', target: 50, progress: 0, completed: false, reward: 50, type: 'xp' },
  { id: 'q2', text: 'Completa 2 Lecciones', target: 2, progress: 0, completed: false, reward: 100, type: 'lessons' },
  { id: 'q3', text: 'Racha Perfecta', target: 1, progress: 0, completed: false, reward: 200, type: 'perfect' },
];

const INITIAL_STATS: UserStats = {
  xp: 0,
  level: 1,
  league: 'Bronze',
  streak: 1,
  balance: 10000,
  hearts: 5,
  portfolio: {}, 
  transactions: [],
  unlockedAchievements: [],
  maxHearts: 5,
  masterCoins: 350, 
  completedLessons: [],
  levelRatings: {},
  lessonNotes: {}, // <--- Inicializado
  pathProgress: { [PathId.STOCKS]: 0, [PathId.CRYPTO]: 0 },
  inventory: { hint5050: 3, timeFreeze: 2, skip: 1, streakFreeze: 1, doubleXp: 0 },
  bookmarks: [],
  dailyQuests: INITIAL_QUESTS,
  theme: 'default',
  unlockedThemes: ['default'],
  prestige: 0,
  stakedCoins: 0,
  minedCoins: 0,
  quickNotes: "",
  openedChests: []
};

type SoundType = 'success' | 'error' | 'cash' | 'pop' | 'levelUp' | 'click' | 'chest';

interface MarketState {
    prices: { [symbol: string]: number };
    history: { [symbol: string]: CandleData[] }; 
    trend: { [symbol: string]: 'up' | 'down' | 'neutral' };
}

interface GameContextType {
  stats: UserStats;
  latestAchievement: Achievement | null;
  clearAchievement: () => void;
  market: MarketState;
  actions: {
    updateStats: (xpGained: number, pathId?: PathId, levelIncrement?: number, perfectRun?: boolean) => void;
    deductHeart: () => void;
    buyHearts: () => boolean;
    useItem: (type: 'hint5050' | 'timeFreeze' | 'skip') => boolean;
    addBookmark: (term: string) => void;
    saveLessonNote: (lessonId: string, note: string) => void; // <--- NUEVA ACCIÓN
    mineCoin: () => void;
    stakeCoins: () => void;
    unstakeCoins: () => void;
    openChest: (chestId: string) => void;
    toggleTheme: () => void;
    updateNotes: (notes: string) => void;
    getThemeClass: () => string;
    buyAsset: (symbol: string, amount: number, price: number) => boolean;
    sellAsset: (symbol: string, amount: number, price: number) => boolean;
    playSound: (type: SoundType) => void;
    buyShopItem: (itemId: keyof UserStats['inventory'], cost: number) => boolean;
    buyTheme: (themeId: string, cost: number) => boolean;
    equipTheme: (themeId: any) => void;
  };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('mercadoMasterStats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.portfolio) parsed.portfolio = {};
        if (!parsed.transactions) parsed.transactions = [];
        if (!parsed.unlockedAchievements) parsed.unlockedAchievements = [];
        if (!parsed.unlockedThemes) parsed.unlockedThemes = ['default'];
        if (!parsed.lessonNotes) parsed.lessonNotes = {}; // Migración segura
        return parsed;
      } catch (e) { return INITIAL_STATS; }
    }
    return INITIAL_STATS;
  });

  const [marketState, setMarketState] = useState<MarketState>({
      prices: INITIAL_PRICES,
      history: {},
      trend: {}
  });
  
  const [latestAchievement, setLatestAchievement] = useState<Achievement | null>(null);
  const prevAchievementsCount = useRef(stats.unlockedAchievements.length);

  useEffect(() => {
    const initialHistory: any = {};
    const initialTrend: any = {};
    Object.keys(INITIAL_PRICES).forEach(symbol => {
      // @ts-ignore
      let currentPrice = INITIAL_PRICES[symbol];
      const history = [];
      for(let i=0; i<30; i++) {
         const candle = generateNextCandle(currentPrice);
         candle.time = `${10 + Math.floor(i/60)}:${i%60}`;
         history.push(candle);
         currentPrice = candle.close;
      }
      initialHistory[symbol] = history;
      initialTrend[symbol] = 'neutral';
    });
    setMarketState({ prices: INITIAL_PRICES, history: initialHistory, trend: initialTrend });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketState(prev => {
        const newHistory: any = { ...prev.history };
        const newPrices: any = { ...prev.prices };
        const newTrend: any = { ...prev.trend };
        let hasChanges = false;

        Object.keys(prev.prices).forEach(symbol => {
          const history = prev.history[symbol];
          if (!history || history.length === 0) return;
          const lastCandle = history[history.length - 1];
          const nextCandle = generateNextCandle(lastCandle.close);
          newPrices[symbol] = nextCandle.close;
          newTrend[symbol] = nextCandle.close > lastCandle.close ? 'up' : 'down';
          newHistory[symbol] = [...history.slice(1), nextCandle];
          hasChanges = true;
        });

        if (!hasChanges) return prev;
        return { prices: newPrices, history: newHistory, trend: newTrend };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('mercadoMasterStats', JSON.stringify(stats));
  }, [stats]);

  const playSound = useCallback((type: SoundType) => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    switch (type) {
      case 'cash': osc.type = 'sine'; osc.frequency.setValueAtTime(1200, now); osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1); gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3); break;
      case 'error': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, now); gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.2); osc.start(now); osc.stop(now + 0.2); break;
      case 'pop': osc.type = 'triangle'; osc.frequency.setValueAtTime(600, now); gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05); osc.start(now); osc.stop(now + 0.05); break;
      case 'success': osc.type = 'sine'; osc.frequency.setValueAtTime(600, now); gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3); break;
      case 'levelUp': [440, 554, 659, 880].forEach((f,i) => { const o=ctx.createOscillator(); const g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value=f; g.gain.setValueAtTime(0.05, now+i*0.1); g.gain.exponentialRampToValueAtTime(0.001,now+i*0.1+0.3); o.start(now+i*0.1); o.stop(now+i*0.1+0.3); }); break;
      case 'click': osc.type = 'square'; osc.frequency.setValueAtTime(800, now); gain.gain.setValueAtTime(0.02, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03); osc.start(now); osc.stop(now + 0.03); break;
      case 'chest': osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.linearRampToValueAtTime(800, now + 0.5); gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.5); osc.start(now); osc.stop(now + 0.5); break;
    }
  }, []);

  useEffect(() => {
    if (stats.unlockedAchievements.length > prevAchievementsCount.current) {
      const lastId = stats.unlockedAchievements[stats.unlockedAchievements.length - 1];
      const ach = ACHIEVEMENTS.find(a => a.id === lastId);
      if (ach) { setLatestAchievement(ach); playSound('levelUp'); }
      prevAchievementsCount.current = stats.unlockedAchievements.length;
    }
  }, [stats.unlockedAchievements, playSound]);

  const calculateAchievements = (currentStats: UserStats): Partial<UserStats> => {
    const newUnlocked: string[] = [];
    let xpBonus = 0; let coinsBonus = 0;
    ACHIEVEMENTS.forEach(ach => {
      if (!currentStats.unlockedAchievements.includes(ach.id) && ach.condition(currentStats)) {
        newUnlocked.push(ach.id); xpBonus += 100; coinsBonus += 50;
      }
    });
    if (newUnlocked.length > 0) {
      return { unlockedAchievements: [...currentStats.unlockedAchievements, ...newUnlocked], xp: currentStats.xp + xpBonus, masterCoins: currentStats.masterCoins + coinsBonus };
    }
    return {};
  };

  const updateStats = useCallback((xpGained: number, pathId?: PathId, levelIncrement: number = 0, perfectRun: boolean = false) => {
    setStats(prev => {
      let next = { ...prev };
      const newPathProgress = { ...next.pathProgress };
      if (pathId) newPathProgress[pathId] = (newPathProgress[pathId] || 0) + levelIncrement;
      const coinsGained = Math.floor(xpGained / 2);
      const newQuests = next.dailyQuests.map(q => {
        if (q.completed) return q;
        let newProgress = q.progress;
        if (q.type === 'xp') newProgress += xpGained;
        if (q.type === 'lessons' && levelIncrement > 0) newProgress += 1;
        if (q.type === 'perfect' && perfectRun) newProgress += 1;
        return { ...q, progress: newProgress, completed: newProgress >= q.target };
      });
      next = { ...next, xp: next.xp + xpGained, masterCoins: next.masterCoins + coinsGained, pathProgress: newPathProgress, dailyQuests: newQuests };
      const newLevel = Math.floor(next.xp / 500) + 1;
      if (newLevel > next.level) next.level = newLevel;
      return { ...next, ...calculateAchievements(next) };
    });
  }, []);

  const mineCoin = useCallback(() => { 
    playSound('pop'); 
    setStats(prev => {
        const next = { ...prev, masterCoins: prev.masterCoins + 1, minedCoins: (prev.minedCoins || 0) + 1 };
        return { ...next, ...calculateAchievements(next) };
    }); 
  }, [playSound]);

  const buyAsset = useCallback((symbol: string, amount: number, currentPrice: number) => {
    const totalCost = amount * currentPrice;
    if (stats.balance >= totalCost) {
      const newTx: Transaction = { id: Date.now().toString(), type: 'buy', symbol, amount, price: currentPrice, timestamp: new Date().toLocaleString() };
      setStats(prev => {
        if (prev.balance < totalCost) return prev;
        const next = { ...prev, balance: prev.balance - totalCost, portfolio: { ...prev.portfolio, [symbol]: (prev.portfolio[symbol] || 0) + amount }, transactions: [newTx, ...(prev.transactions || [])] };
        return { ...next, ...calculateAchievements(next) };
      });
      return true; 
    }
    return false; 
  }, [stats.balance]);

  const sellAsset = useCallback((symbol: string, amount: number, currentPrice: number) => {
    const currentQty = stats.portfolio[symbol] || 0;
    if (currentQty >= amount) {
      const totalGain = amount * currentPrice;
      const newTx: Transaction = { id: Date.now().toString(), type: 'sell', symbol, amount, price: currentPrice, timestamp: new Date().toLocaleString() };
      setStats(prev => {
        if ((prev.portfolio[symbol] || 0) < amount) return prev;
        const next = { ...prev, balance: prev.balance + totalGain, portfolio: { ...prev.portfolio, [symbol]: (prev.portfolio[symbol] || 0) - amount }, transactions: [newTx, ...(prev.transactions || [])] };
        return { ...next, ...calculateAchievements(next) };
      });
      return true;
    }
    return false;
  }, [stats.portfolio]);

  const buyShopItem = useCallback((itemId: keyof UserStats['inventory'], cost: number) => {
     if (stats.masterCoins >= cost) {
         playSound('cash');
         setStats(prev => {
             const next = { 
                 ...prev, 
                 masterCoins: prev.masterCoins - cost,
                 inventory: { ...prev.inventory, [itemId]: prev.inventory[itemId] + 1 }
             };
             return next;
         });
         return true;
     }
     playSound('error');
     return false;
  }, [stats.masterCoins, playSound]);

  const buyTheme = useCallback((themeId: string, cost: number) => {
      if (stats.masterCoins >= cost && !stats.unlockedThemes.includes(themeId)) {
          playSound('cash');
          setStats(prev => ({
              ...prev,
              masterCoins: prev.masterCoins - cost,
              unlockedThemes: [...prev.unlockedThemes, themeId],
              theme: themeId as any 
          }));
          return true;
      }
      playSound('error');
      return false;
  }, [stats.masterCoins, stats.unlockedThemes, playSound]);

  const equipTheme = useCallback((themeId: any) => {
      if (stats.unlockedThemes.includes(themeId)) {
          playSound('click');
          setStats(prev => ({ ...prev, theme: themeId }));
      }
  }, [stats.unlockedThemes, playSound]);

  // NUEVO: Guardar Notas de Lección
  const saveLessonNote = useCallback((lessonId: string, note: string) => {
      setStats(prev => ({
          ...prev,
          lessonNotes: { ...prev.lessonNotes, [lessonId]: note }
      }));
  }, []);

  const deductHeart = useCallback(() => { playSound('error'); setStats(prev => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) })); }, [playSound]);
  const buyHearts = useCallback(() => { if (stats.masterCoins >= 300) { setStats(prev => ({ ...prev, masterCoins: prev.masterCoins - 300, hearts: prev.maxHearts })); playSound('cash'); return true; } playSound('error'); return false; }, [stats.masterCoins, playSound]);
  const useItem = useCallback((type: 'hint5050' | 'timeFreeze' | 'skip') => { return true; }, []);
  const addBookmark = useCallback((term: string) => { if (!stats.bookmarks.includes(term)) setStats(prev => ({ ...prev, bookmarks: [...prev.bookmarks, term] })); }, [stats.bookmarks]);
  const stakeCoins = useCallback(() => { if (stats.masterCoins >= 100) setStats(prev => ({ ...prev, masterCoins: prev.masterCoins - 100, stakedCoins: (prev.stakedCoins || 0) + 100 })); }, [stats.masterCoins]);
  const unstakeCoins = useCallback(() => { if (stats.stakedCoins > 0) setStats(prev => ({ ...prev, masterCoins: prev.masterCoins + prev.stakedCoins, stakedCoins: 0 })); }, [stats.stakedCoins]);
  const openChest = useCallback((chestId: string) => { if (stats.openedChests.includes(chestId)) return; playSound('chest'); setStats(prev => ({ ...prev, masterCoins: prev.masterCoins + 20, openedChests: [...prev.openedChests, chestId] })); }, [stats.openedChests, playSound]);
  const toggleTheme = useCallback(() => { playSound('click'); const themes: UserStats['theme'][] = ['default', 'cyberpunk', 'terminal']; const nextIndex = (themes.indexOf(stats.theme) + 1) % themes.length; setStats(prev => ({ ...prev, theme: themes[nextIndex] })); }, [stats.theme, playSound]);
  const updateNotes = useCallback((notes: string) => setStats(prev => ({ ...prev, quickNotes: notes })), []);
  const getThemeClass = useCallback(() => { if (stats.theme === 'cyberpunk') return 'bg-slate-950 font-mono text-cyan-400 selection:bg-pink-500'; if (stats.theme === 'terminal') return 'bg-black font-mono text-green-500 selection:bg-green-700'; return 'bg-slate-950 text-slate-100 font-sans selection:bg-green-500 selection:text-slate-900'; }, [stats.theme]);
  const clearAchievement = useCallback(() => setLatestAchievement(null), []);

  const contextValue = useMemo(() => ({
    stats, latestAchievement, clearAchievement, market: marketState,
    actions: { updateStats, mineCoin, buyAsset, sellAsset, deductHeart, buyHearts, useItem, addBookmark, stakeCoins, unstakeCoins, openChest, toggleTheme, updateNotes, getThemeClass, playSound, buyShopItem, buyTheme, equipTheme, saveLessonNote }
  }), [stats, marketState, latestAchievement, updateStats, mineCoin, buyAsset, sellAsset, deductHeart, buyHearts, useItem, addBookmark, stakeCoins, unstakeCoins, openChest, toggleTheme, updateNotes, getThemeClass, playSound, buyShopItem, buyTheme, equipTheme, saveLessonNote]);

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
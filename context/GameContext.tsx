import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserStats, PathId, DailyQuest } from '../types';

// Estado Inicial (El mismo que tenías)
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
  maxHearts: 5,
  masterCoins: 350, 
  completedLessons: [],
  levelRatings: {},
  pathProgress: {
    [PathId.STOCKS]: 0,
    [PathId.CRYPTO]: 0
  },
  inventory: {
    hint5050: 3,
    timeFreeze: 2,
    skip: 1,
    streakFreeze: 1,
    doubleXp: 0
  },
  bookmarks: [],
  dailyQuests: INITIAL_QUESTS,
  theme: 'default',
  prestige: 0,
  stakedCoins: 0,
  minedCoins: 0,
  quickNotes: "",
  openedChests: []
};

// Definimos qué funciones y datos serán visibles para toda la app
interface GameContextType {
  stats: UserStats;
  actions: {
    updateStats: (xpGained: number, pathId?: PathId, levelIncrement?: number, perfectRun?: boolean) => void;
    deductHeart: () => void;
    buyHearts: () => boolean;
    useItem: (type: 'hint5050' | 'timeFreeze' | 'skip') => boolean;
    addBookmark: (term: string) => void;
    mineCoin: () => void;
    stakeCoins: () => void;
    unstakeCoins: () => void;
    openChest: (chestId: string) => void;
    toggleTheme: () => void;
    updateNotes: (notes: string) => void;
    getThemeClass: () => string;
    buyAsset: (symbol: string, amount: number, price: number) => void;
    sellAsset: (symbol: string, amount: number, price: number) => void;
  };
  market: {
    prices: { [symbol: string]: number };
    history: { [symbol: string]: any[] }; // CandleData[]
  };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // 1. Inicializar estado (Buscando en localStorage primero)
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('mercadoMasterStats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error cargando partida guardada", e);
        return INITIAL_STATS;
      }
    }
    return INITIAL_STATS;
  });

  // 2. Persistencia Automática: Cada vez que stats cambia, guardamos
  useEffect(() => {
    localStorage.setItem('mercadoMasterStats', JSON.stringify(stats));
  }, [stats]);

  // Lógica de Niveles (Efecto secundario)
  useEffect(() => {
    const newLevel = Math.floor(stats.xp / 500) + 1;
    if (newLevel > stats.level) {
      setStats(prev => ({ ...prev, level: newLevel }));
      // Aquí podrías añadir un sonido de level up global si quisieras
    }
  }, [stats.xp, stats.level]);

  // --- ACCIONES (La lógica extraída de App.tsx) ---

  const updateStats = (xpGained: number, pathId?: PathId, levelIncrement: number = 0, perfectRun: boolean = false) => {
    setStats(prev => {
      const newPathProgress = { ...prev.pathProgress };
      if (pathId) {
         newPathProgress[pathId] = (newPathProgress[pathId] || 0) + levelIncrement;
      }
      
      const coinsGained = Math.floor(xpGained / 2);
      
      // Update Quests
      const newQuests = prev.dailyQuests.map(q => {
        if (q.completed) return q;
        let newProgress = q.progress;
        
        if (q.type === 'xp') newProgress += xpGained;
        if (q.type === 'lessons' && levelIncrement > 0) newProgress += 1;
        if (q.type === 'perfect' && perfectRun) newProgress += 1;

        const isCompleted = newProgress >= q.target;
        return { ...q, progress: newProgress, completed: isCompleted };
      });

      const questRewards = newQuests
         .filter((q, i) => q.completed && !prev.dailyQuests[i].completed)
         .reduce((sum, q) => sum + q.reward, 0);

      return {
        ...prev,
        xp: prev.xp + xpGained,
        masterCoins: prev.masterCoins + coinsGained + questRewards,
        pathProgress: newPathProgress,
        dailyQuests: newQuests
      };
    });
  };

  const deductHeart = () => {
    setStats(prev => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));
  };

  const buyHearts = () => {
    if (stats.masterCoins >= 300) {
      setStats(prev => ({
        ...prev,
        masterCoins: prev.masterCoins - 300,
        hearts: prev.maxHearts
      }));
      return true;
    }
    return false;
  };

  const useItem = (type: 'hint5050' | 'timeFreeze' | 'skip') => {
    if (stats.inventory[type] > 0) {
      setStats(prev => ({
        ...prev,
        inventory: { ...prev.inventory, [type]: prev.inventory[type] - 1 }
      }));
      return true;
    }
    const costs = { hint5050: 50, timeFreeze: 100, skip: 150 };
    if (stats.masterCoins >= costs[type]) {
      setStats(prev => ({
        ...prev,
        masterCoins: prev.masterCoins - costs[type]
      }));
      return true;
    }
    return false;
  };

  const addBookmark = (term: string) => {
    if (!stats.bookmarks.includes(term)) {
      setStats(prev => ({ ...prev, bookmarks: [...prev.bookmarks, term] }));
    }
  };

  const mineCoin = () => {
     setStats(prev => ({
        ...prev,
        masterCoins: prev.masterCoins + 1,
        minedCoins: (prev.minedCoins || 0) + 1
     }));
  };

  const stakeCoins = () => {
     if (stats.masterCoins >= 100) {
        setStats(prev => ({
           ...prev,
           masterCoins: prev.masterCoins - 100,
           stakedCoins: (prev.stakedCoins || 0) + 100
        }));
     }
  };

  const unstakeCoins = () => {
     if (stats.stakedCoins > 0) {
        setStats(prev => ({
           ...prev,
           masterCoins: prev.masterCoins + prev.stakedCoins,
           stakedCoins: 0
        }));
     }
  };
  
  const openChest = (chestId: string) => {
    if (stats.openedChests.includes(chestId)) return;
    setStats(prev => ({
        ...prev,
        masterCoins: prev.masterCoins + 20,
        openedChests: [...prev.openedChests, chestId]
    }));
  };

  const toggleTheme = () => {
     const themes: UserStats['theme'][] = ['default', 'cyberpunk', 'terminal'];
     const nextIndex = (themes.indexOf(stats.theme) + 1) % themes.length;
     setStats(prev => ({ ...prev, theme: themes[nextIndex] }));
  };
  
  const updateNotes = (notes: string) => {
     setStats(prev => ({ ...prev, quickNotes: notes }));
  };

  const getThemeClass = () => {
     if (stats.theme === 'cyberpunk') return 'bg-slate-950 font-mono text-cyan-400 selection:bg-pink-500';
     if (stats.theme === 'terminal') return 'bg-black font-mono text-green-500 selection:bg-green-700';
     return 'bg-slate-950 text-slate-100 font-sans selection:bg-green-500 selection:text-slate-900';
  };

  return (
    <GameContext.Provider value={{ 
      stats, 
      actions: { 
        updateStats, deductHeart, buyHearts, useItem, addBookmark, 
        mineCoin, stakeCoins, unstakeCoins, openChest, toggleTheme, 
        updateNotes, getThemeClass 
      } 
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// ESTADO DEL MERCADO (Volátil, no se guarda en localStorage)
  const [marketPrices, setMarketPrices] = useState(INITIAL_PRICES as any);
  // Aquí podrías añadir lógica para actualizar precios cada X segundos usando marketSimulator

  // --- NUEVAS ACCIONES DE TRADING ---

  const buyAsset = (symbol: string, amount: number, currentPrice: number) => {
    const totalCost = amount * currentPrice;
    if (stats.balance >= totalCost) {
      setStats(prev => ({
        ...prev,
        balance: prev.balance - totalCost,
        portfolio: {
          ...prev.portfolio,
          [symbol]: (prev.portfolio[symbol] || 0) + amount
        }
      }));
      return true; // Éxito
    }
    return false; // Fondos insuficientes
  };

  const sellAsset = (symbol: string, amount: number, currentPrice: number) => {
    const currentQty = stats.portfolio[symbol] || 0;
    if (currentQty >= amount) {
      const totalGain = amount * currentPrice;
      setStats(prev => ({
        ...prev,
        balance: prev.balance + totalGain,
        portfolio: {
          ...prev.portfolio,
          [symbol]: currentQty - amount
        }
      }));
      return true;
    }
    return false;
  };
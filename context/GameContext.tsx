import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserStats, PathId, DailyQuest, Transaction } from '../types';
import { INITIAL_PRICES } from '../services/marketSimulator';

// ... (INITIAL_QUESTS y INITIAL_STATS se mantienen igual que antes) ...
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

interface GameContextType {
  stats: UserStats;
  market: {
    prices: { [symbol: string]: number };
    history: { [symbol: string]: any[] }; 
  };
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
    // CAMBIO IMPORTANTE AQUÍ: Ahora devuelven boolean
    buyAsset: (symbol: string, amount: number, price: number) => boolean;
    sellAsset: (symbol: string, amount: number, price: number) => boolean;
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
        return parsed;
      } catch (e) {
        console.error("Error cargando partida", e);
        return INITIAL_STATS;
      }
    }
    return INITIAL_STATS;
  });

  const [marketPrices, setMarketPrices] = useState(INITIAL_PRICES);

  useEffect(() => {
    localStorage.setItem('mercadoMasterStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    const newLevel = Math.floor(stats.xp / 500) + 1;
    if (newLevel > stats.level) {
      setStats(prev => ({ ...prev, level: newLevel }));
    }
  }, [stats.xp, stats.level]);

  // ... (Funciones de updateStats, deductHeart, etc. se mantienen igual) ...
  const updateStats = (xpGained: number, pathId?: PathId, levelIncrement: number = 0, perfectRun: boolean = false) => {
    setStats(prev => {
      const newPathProgress = { ...prev.pathProgress };
      if (pathId) newPathProgress[pathId] = (newPathProgress[pathId] || 0) + levelIncrement;
      
      const coinsGained = Math.floor(xpGained / 2);
      const newQuests = prev.dailyQuests.map(q => {
        if (q.completed) return q;
        let newProgress = q.progress;
        if (q.type === 'xp') newProgress += xpGained;
        if (q.type === 'lessons' && levelIncrement > 0) newProgress += 1;
        if (q.type === 'perfect' && perfectRun) newProgress += 1;
        return { ...q, progress: newProgress, completed: newProgress >= q.target };
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

  const deductHeart = () => setStats(prev => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));
  
  const buyHearts = () => {
    if (stats.masterCoins >= 300) {
      setStats(prev => ({ ...prev, masterCoins: prev.masterCoins - 300, hearts: prev.maxHearts }));
      return true;
    }
    return false;
  };

  const useItem = (type: 'hint5050' | 'timeFreeze' | 'skip') => {
    if (stats.inventory[type] > 0) {
      setStats(prev => ({ ...prev, inventory: { ...prev.inventory, [type]: prev.inventory[type] - 1 } }));
      return true;
    }
    if (stats.masterCoins >= (type === 'hint5050' ? 50 : type === 'timeFreeze' ? 100 : 150)) {
      setStats(prev => ({ ...prev, masterCoins: prev.masterCoins - (type === 'hint5050' ? 50 : type === 'timeFreeze' ? 100 : 150) }));
      return true;
    }
    return false;
  };

  const addBookmark = (term: string) => {
    if (!stats.bookmarks.includes(term)) setStats(prev => ({ ...prev, bookmarks: [...prev.bookmarks, term] }));
  };

  const mineCoin = () => setStats(prev => ({ ...prev, masterCoins: prev.masterCoins + 1, minedCoins: (prev.minedCoins || 0) + 1 }));
  
  const stakeCoins = () => {
     if (stats.masterCoins >= 100) setStats(prev => ({ ...prev, masterCoins: prev.masterCoins - 100, stakedCoins: (prev.stakedCoins || 0) + 100 }));
  };

  const unstakeCoins = () => {
     if (stats.stakedCoins > 0) setStats(prev => ({ ...prev, masterCoins: prev.masterCoins + prev.stakedCoins, stakedCoins: 0 }));
  };
  
  const openChest = (chestId: string) => {
    if (stats.openedChests.includes(chestId)) return;
    setStats(prev => ({ ...prev, masterCoins: prev.masterCoins + 20, openedChests: [...prev.openedChests, chestId] }));
  };

  const toggleTheme = () => {
     const themes: UserStats['theme'][] = ['default', 'cyberpunk', 'terminal'];
     const nextIndex = (themes.indexOf(stats.theme) + 1) % themes.length;
     setStats(prev => ({ ...prev, theme: themes[nextIndex] }));
  };
  
  const updateNotes = (notes: string) => setStats(prev => ({ ...prev, quickNotes: notes }));

  const getThemeClass = () => {
     if (stats.theme === 'cyberpunk') return 'bg-slate-950 font-mono text-cyan-400 selection:bg-pink-500';
     if (stats.theme === 'terminal') return 'bg-black font-mono text-green-500 selection:bg-green-700';
     return 'bg-slate-950 text-slate-100 font-sans selection:bg-green-500 selection:text-slate-900';
  };

  // --- TRADING LOGIC ---

  const buyAsset = (symbol: string, amount: number, currentPrice: number) => {
    const totalCost = amount * currentPrice;
    if (stats.balance >= totalCost) {
      const newTx: Transaction = {
        id: Date.now().toString(),
        type: 'buy',
        symbol,
        amount,
        price: currentPrice,
        timestamp: new Date().toLocaleString()
      };

      setStats(prev => ({
        ...prev,
        balance: prev.balance - totalCost,
        portfolio: {
          ...prev.portfolio,
          [symbol]: (prev.portfolio[symbol] || 0) + amount
        },
        transactions: [newTx, ...(prev.transactions || [])]
      }));
      return true; // ÉXITO
    }
    return false; // FALLO (Fondos insuficientes)
  };

  const sellAsset = (symbol: string, amount: number, currentPrice: number) => {
    const currentQty = stats.portfolio[symbol] || 0;
    if (currentQty >= amount) {
      const totalGain = amount * currentPrice;
      const newTx: Transaction = {
        id: Date.now().toString(),
        type: 'sell',
        symbol,
        amount,
        price: currentPrice,
        timestamp: new Date().toLocaleString()
      };

      setStats(prev => ({
        ...prev,
        balance: prev.balance + totalGain,
        portfolio: {
          ...prev.portfolio,
          [symbol]: currentQty - amount
        },
        transactions: [newTx, ...(prev.transactions || [])]
      }));
      return true; // ÉXITO
    }
    return false; // FALLO (No tienes activo)
  };

  return (
    <GameContext.Provider value={{ 
      stats, 
      market: {
        prices: marketPrices,
        history: {} 
      },
      actions: { 
        updateStats, deductHeart, buyHearts, useItem, addBookmark, 
        mineCoin, stakeCoins, unstakeCoins, openChest, toggleTheme, 
        updateNotes, getThemeClass,
        buyAsset, sellAsset
      } 
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
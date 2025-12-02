
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Learn } from './components/Learn';
import { Dashboard } from './components/Dashboard';
import { UserStats, PathId, DailyQuest } from './types';

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

export default function App() {
  const [view, setView] = useState('dashboard');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  
  // Voice Greeting Effect
  useEffect(() => {
    const hasGreeted = sessionStorage.getItem('hasGreeted');
    if (!hasGreeted) {
      setTimeout(() => {
        const msg = new SpeechSynthesisUtterance(`Hola Trader, bienvenido de nuevo. Tu racha es de ${stats.streak} días.`);
        msg.lang = 'es-ES';
        window.speechSynthesis.speak(msg);
        sessionStorage.setItem('hasGreeted', 'true');
      }, 1000);
    }
  }, []);

  // Determine Level based on XP
  useEffect(() => {
    const newLevel = Math.floor(stats.xp / 500) + 1;
    if (newLevel > stats.level) {
      setStats(prev => ({ ...prev, level: newLevel }));
    }
  }, [stats.xp]);

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

  const updateBalance = (newBalance: number) => {
    setStats(prev => ({ ...prev, balance: newBalance }));
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

  // Mining Clicker Action
  const handleMineClick = () => {
     setStats(prev => ({
        ...prev,
        masterCoins: prev.masterCoins + 1,
        minedCoins: (prev.minedCoins || 0) + 1
     }));
  };

  // Staking Action
  const handleStake = () => {
     if (stats.masterCoins >= 100) {
        setStats(prev => ({
           ...prev,
           masterCoins: prev.masterCoins - 100,
           stakedCoins: (prev.stakedCoins || 0) + 100
        }));
     }
  };

  const handleUnstake = () => {
     if (stats.stakedCoins > 0) {
        setStats(prev => ({
           ...prev,
           masterCoins: prev.masterCoins + prev.stakedCoins,
           stakedCoins: 0
        }));
     }
  };
  
  const handleOpenChest = (chestId: string) => {
    if (stats.openedChests.includes(chestId)) return;
    setStats(prev => ({
        ...prev,
        masterCoins: prev.masterCoins + 20,
        openedChests: [...prev.openedChests, chestId]
    }));
  };

  // Theme Switcher
  const toggleTheme = () => {
     const themes: UserStats['theme'][] = ['default', 'cyberpunk', 'terminal'];
     const nextIndex = (themes.indexOf(stats.theme) + 1) % themes.length;
     setStats(prev => ({ ...prev, theme: themes[nextIndex] }));
  };
  
  // Notes Handler
  const handleUpdateNotes = (notes: string) => {
     setStats(prev => ({ ...prev, quickNotes: notes }));
  };

  // Apply Theme Classes
  const getThemeClass = () => {
     if (stats.theme === 'cyberpunk') return 'bg-slate-950 font-mono text-cyan-400 selection:bg-pink-500';
     if (stats.theme === 'terminal') return 'bg-black font-mono text-green-500 selection:bg-green-700';
     return 'bg-slate-950 text-slate-100 font-sans selection:bg-green-500 selection:text-slate-900';
  };

  return (
    <div className={`flex h-screen overflow-hidden ${getThemeClass()}`}>
      <div className="bg-grid-pattern absolute inset-0 opacity-20 pointer-events-none"></div>
      
      <Sidebar currentView={view} setView={setView} stats={stats} />
      
      <main className="flex-1 overflow-y-auto w-full relative z-10 custom-scrollbar">
        {view === 'dashboard' && <Dashboard stats={stats} setView={setView} onMine={handleMineClick} onStake={handleStake} onUnstake={handleUnstake} onToggleTheme={toggleTheme} onUpdateNotes={handleUpdateNotes} />}
        {view === 'learn' && (
          <Learn 
            stats={stats} 
            updateStats={updateStats} 
            deductHeart={deductHeart}
            buyHearts={buyHearts}
            useItem={useItem}
            addBookmark={addBookmark}
            onOpenChest={handleOpenChest}
          />
        )}
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Learn } from './components/Learn';
import { Dashboard } from './components/Dashboard';
import { AchievementPopup } from './components/AchievementPopup'; // Importar
import { GameProvider, useGame } from './context/GameContext'; 

const AppContent = () => {
  const [view, setView] = useState('dashboard');
  const { stats, actions, latestAchievement, clearAchievement } = useGame();
  
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

  return (
    <div className={`flex h-screen overflow-hidden ${actions.getThemeClass()}`}>
      <div className="bg-grid-pattern absolute inset-0 opacity-20 pointer-events-none"></div>
      
      {/* Componente Global de Logros */}
      <AchievementPopup achievement={latestAchievement} onClose={clearAchievement} />

      <Sidebar currentView={view} setView={setView} stats={stats} />
      
      <main className="flex-1 overflow-y-auto w-full relative z-10 custom-scrollbar">
        {view === 'dashboard' && <Dashboard setView={setView} />}
        {view === 'learn' && <Learn />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
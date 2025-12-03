import React from 'react';
import { useGame } from '../context/GameContext';
import { ShoppingBag, Zap, Clock, SkipForward, Shield, Palette, Check } from 'lucide-react';
import { UserStats } from '../types';

export const Shop: React.FC = () => {
  const { stats, actions } = useGame();
  const { buyShopItem, buyTheme, equipTheme } = actions;

  const ITEMS = [
    { id: 'hint5050', name: "Pista 50/50", desc: "Elimina 2 opciones incorrectas.", cost: 50, icon: Zap, color: "yellow" },
    { id: 'timeFreeze', name: "Congelar Tiempo", desc: "Para el reloj por 30s.", cost: 100, icon: Clock, color: "blue" },
    { id: 'skip', name: "Saltar Nivel", desc: "Pasa una pregunta difícil.", cost: 150, icon: SkipForward, color: "purple" },
    { id: 'streakFreeze', name: "Protector de Racha", desc: "No pierdes la racha si fallas un día.", cost: 200, icon: Shield, color: "green" },
  ];

  const THEMES = [
    { id: 'default', name: "Standard Dark", desc: "El clásico.", cost: 0, color: "bg-slate-900" },
    { id: 'cyberpunk', name: "Cyberpunk Neon", desc: "Estilo hacker futurista.", cost: 500, color: "bg-fuchsia-900" },
    { id: 'terminal', name: "Matrix Terminal", desc: "Solo código verde.", cost: 1000, color: "bg-black" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto pb-24 animate-fade-in">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
           <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400">
              <ShoppingBag size={32} />
           </div>
           <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Tienda</h1>
              <p className="text-slate-400">Gasta tus MasterCoins sabiamente.</p>
           </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl inline-flex items-center gap-2">
            <span className="text-slate-400 text-sm font-bold uppercase">Tu Saldo:</span>
            <span className="text-yellow-400 font-black text-2xl flex items-center gap-1">{stats.masterCoins} <span className="text-sm">©</span></span>
        </div>
      </header>

      {/* CONSUMIBLES */}
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><Zap className="text-yellow-500"/> Potenciadores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
         {ITEMS.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col hover:border-slate-600 transition-all group">
               <div className={`w-12 h-12 rounded-2xl bg-${item.color}-500/20 text-${item.color}-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} />
               </div>
               <h3 className="font-bold text-white text-lg">{item.name}</h3>
               <p className="text-slate-400 text-sm mb-4 flex-1">{item.desc}</p>
               <div className="flex justify-between items-center mt-auto">
                  <span className="text-xs text-slate-500 font-bold uppercase">Tienes: {stats.inventory[item.id as keyof typeof stats.inventory]}</span>
                  <button 
                    onClick={() => buyShopItem(item.id as any, item.cost)}
                    className="bg-slate-800 hover:bg-white hover:text-slate-900 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors border border-slate-700"
                  >
                     {item.cost} ©
                  </button>
               </div>
            </div>
         ))}
      </div>

      {/* TEMAS VISUALES */}
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><Palette className="text-pink-500"/> Aspectos Visuales</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {THEMES.map((theme) => {
            const isUnlocked = stats.unlockedThemes.includes(theme.id);
            const isEquipped = stats.theme === theme.id;

            return (
              <div key={theme.id} className={`relative overflow-hidden rounded-3xl border-2 transition-all ${isEquipped ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'border-slate-800 hover:border-slate-600'}`}>
                 <div className={`h-24 ${theme.color} opacity-80`}></div>
                 <div className="p-6 bg-slate-900">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-white text-xl">{theme.name}</h3>
                       {isEquipped && <div className="bg-green-500 text-slate-900 p-1 rounded-full"><Check size={14} strokeWidth={4}/></div>}
                    </div>
                    <p className="text-slate-400 text-sm mb-6">{theme.desc}</p>
                    
                    {isUnlocked ? (
                       <button 
                          onClick={() => equipTheme(theme.id)}
                          disabled={isEquipped}
                          className={`w-full py-3 rounded-xl font-bold text-sm ${isEquipped ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-white text-slate-900 hover:bg-slate-200'}`}
                       >
                          {isEquipped ? 'EQUIPADO' : 'USAR'}
                       </button>
                    ) : (
                       <button 
                          onClick={() => buyTheme(theme.id, theme.cost)}
                          className="w-full py-3 rounded-xl font-bold text-sm bg-yellow-500 text-slate-900 hover:bg-yellow-400 flex items-center justify-center gap-2"
                       >
                          COMPRAR {theme.cost} ©
                       </button>
                    )}
                 </div>
              </div>
            );
         })}
      </div>
    </div>
  );
};
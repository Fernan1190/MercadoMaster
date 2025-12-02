import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext'; // Importamos el hook
import { Heart, Coins, Zap, Trophy, ArrowUpRight, Globe, Pickaxe, Lock, Wallet, Quote, Crown, Calendar, ShoppingBag, Newspaper, Settings, Book, Edit3, EyeOff, Eye } from 'lucide-react';

interface DashboardProps {
  setView: (view: string) => void;
}

const NEWS_TICKER = [
  "Bitcoin supera resistencia clave en $65k",
  "La Fed anuncia posible recorte de tasas",
  "Tesla reporta ganancias récord este Q3",
  "Mercados asiáticos abren con volatilidad",
  "El oro alcanza máximo histórico"
];

const QUOTES = [
  { text: "El riesgo viene de no saber lo que estás haciendo.", author: "Warren Buffett" },
  { text: "El mercado es un mecanismo para transferir dinero del impaciente al paciente.", author: "Warren Buffett" },
  { text: "En la inversión, lo que es cómodo rara vez es rentable.", author: "Robert Arnott" },
];

const GLOSSARY_TERMS = [
  { term: "Bull Market", def: "Mercado con tendencia alcista." },
  { term: "Bear Market", def: "Mercado con tendencia bajista." },
  { term: "ROI", def: "Retorno sobre la Inversión." },
  { term: "Stop Loss", def: "Orden automática para limitar pérdidas." },
  { term: "FOMO", def: "Miedo a perderse una oportunidad." },
  { term: "HODL", def: "Mantener activos a largo plazo sin vender." },
];

const ECONOMIC_EVENTS = [
  { time: "08:30", event: "Nóminas no agrícolas (NFP)", impact: "high" },
  { time: "14:00", event: "Actas del FOMC", impact: "high" },
  { time: "16:00", event: "Inventarios de crudo", impact: "medium" },
];

export const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  // CONEXIÓN DIRECTA CON EL CEREBRO DE LA APP
  const { stats, actions } = useGame();
  const { mineCoin, stakeCoins, unstakeCoins, toggleTheme, updateNotes } = actions;

  const [newsIndex, setNewsIndex] = useState(0);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [wordOfDay] = useState(GLOSSARY_TERMS[Math.floor(Math.random() * GLOSSARY_TERMS.length)]);
  const [zenMode, setZenMode] = useState(false);
  
  const [timeNY, setTimeNY] = useState('');
  const [timeLondon, setTimeLondon] = useState('');
  const [timeTokyo, setTimeTokyo] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeNY(now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' }));
      setTimeLondon(now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' }));
      setTimeTokyo(now.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex(prev => (prev + 1) % NEWS_TICKER.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-8 animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
           <h1 className="text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
              Inicio
              <button onClick={toggleTheme} className="p-2 bg-slate-800 rounded-lg border border-slate-700 hover:text-green-400 transition-colors" title="Cambiar Tema">
                 <Settings size={20} />
              </button>
              <button onClick={() => setZenMode(!zenMode)} className={`p-2 rounded-lg border transition-colors ${zenMode ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 hover:text-indigo-400'}`} title="Modo Zen">
                 {zenMode ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
           </h1>
           <p className="text-slate-400">Resumen de tu imperio financiero.</p>
        </div>
        {!zenMode && (
        <div className="hidden md:flex items-center gap-2 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
            <Newspaper size={16} className="text-slate-400"/>
            <span className="text-sm text-slate-300 font-mono w-64 truncate">{NEWS_TICKER[newsIndex]}</span>
        </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main Stats Row */}
        {!zenMode && (
        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Heart, val: `${stats.hearts}/5`, label: "Vidas", color: "red" },
              { icon: Coins, val: stats.masterCoins, label: "Coins", color: "yellow" },
              { icon: Zap, val: stats.streak, label: "Racha", color: "orange" },
              { icon: Trophy, val: stats.level, label: "Nivel", color: "purple" }
            ].map((item, i) => (
               <div key={i} className={`bg-slate-900/60 backdrop-blur-md p-5 rounded-3xl border border-slate-800 flex flex-col justify-between hover:border-${item.color}-500/30 transition-colors group`}>
                  <div className={`p-3 w-fit rounded-2xl bg-${item.color}-500/10 text-${item.color}-500 group-hover:bg-${item.color}-500 group-hover:text-slate-900 transition-all`}>
                     <item.icon size={24} fill={item.color === 'red' || item.color === 'orange' ? 'currentColor' : 'none'}/>
                  </div>
                  <div>
                     <div className="text-2xl font-black text-white mt-4">{item.val}</div>
                     <div className="text-xs text-slate-500 font-bold uppercase">{item.label}</div>
                  </div>
               </div>
            ))}
        </div>
        )}

        {/* Continue Learning (Large Card) */}
        <div onClick={() => setView('learn')} className={`${zenMode ? 'md:col-span-12 h-96' : 'md:col-span-4 row-span-2'} bg-gradient-to-br from-green-600 to-emerald-800 rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer shadow-2xl transition-all hover:scale-[1.01] flex flex-col justify-between`}>
            <div className="absolute top-0 right-0 p-20 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
            <div className="relative z-10">
               <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold text-white mb-4 backdrop-blur-md border border-white/20">RECOMENDADO</div>
               <h2 className={`${zenMode ? 'text-5xl' : 'text-3xl'} font-black text-white leading-tight mb-2`}>Continuar Camino</h2>
               <p className="text-green-100 font-medium text-lg">Estás en racha. Sigue sumando XP.</p>
            </div>
            <div className="bg-slate-900/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between group-hover:bg-slate-900/50 transition-colors mt-8">
               <span className="font-bold text-white">Ir al Mapa</span>
               <div className="bg-white text-green-700 p-2 rounded-full"><ArrowUpRight size={20}/></div>
            </div>
        </div>

        {!zenMode && (
        <>
        {/* World Clocks */}
        <div className="md:col-span-5 bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-white font-bold flex items-center gap-2"><Globe size={20} className="text-blue-500"/> Mercados Mundiales</h3>
             </div>
             <div className="flex justify-between text-center divide-x divide-slate-800">
                <div className="px-2">
                   <div className="text-xs text-slate-500 font-bold uppercase">New York</div>
                   <div className="text-lg font-mono font-bold text-white">{timeNY}</div>
                </div>
                <div className="px-2">
                   <div className="text-xs text-slate-500 font-bold uppercase">London</div>
                   <div className="text-lg font-mono font-bold text-white">{timeLondon}</div>
                </div>
                <div className="px-2">
                   <div className="text-xs text-slate-500 font-bold uppercase">Tokyo</div>
                   <div className="text-lg font-mono font-bold text-white">{timeTokyo}</div>
                </div>
             </div>
        </div>

        {/* Economic Calendar */}
        <div className="md:col-span-3 bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800">
           <h3 className="text-white font-bold flex items-center gap-2 mb-4"><Calendar size={20} className="text-indigo-500"/> Eventos Hoy</h3>
           <div className="space-y-3">
              {ECONOMIC_EVENTS.map((ev, i) => (
                 <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-mono">{ev.time}</span>
                    <span className="text-white font-medium truncate w-24">{ev.event}</span>
                    <div className={`w-2 h-2 rounded-full ${ev.impact === 'high' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                 </div>
              ))}
           </div>
        </div>

        {/* Word of Day */}
        <div className="md:col-span-4 bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 bg-indigo-500/10 rounded-full blur-2xl"></div>
           <h3 className="text-white font-bold flex items-center gap-2 mb-2"><Book size={20} className="text-indigo-400"/> Palabra del Día</h3>
           <p className="text-2xl font-black text-white mb-1">{wordOfDay.term}</p>
           <p className="text-slate-400 text-sm leading-relaxed">{wordOfDay.def}</p>
        </div>

        {/* Quick Notes */}
        <div className="md:col-span-4 bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 flex flex-col">
           <h3 className="text-white font-bold flex items-center gap-2 mb-3"><Edit3 size={20} className="text-slate-400"/> Notas Rápidas</h3>
           <textarea 
              className="w-full h-24 bg-slate-800/50 rounded-xl p-3 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none"
              placeholder="Ideas de trading..."
              value={stats.quickNotes}
              onChange={(e) => updateNotes(e.target.value)}
           ></textarea>
        </div>

        {/* Mining Rig */}
        <div className="md:col-span-4 bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 relative group overflow-hidden">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-white font-bold flex items-center gap-2"><Pickaxe size={20} className="text-yellow-500"/> Minería BTC</h3>
               <span className="text-xs text-slate-500 font-mono">{stats.minedCoins} Mined</span>
            </div>
            <button 
               onClick={mineCoin}
               className="w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 group-hover:border-yellow-500/50 shadow-lg"
            >
               <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-500 animate-pulse"><Zap size={20} fill="currentColor"/></div>
               <span className="font-bold text-white">Minar Bloque (+1 Coin)</span>
            </button>
        </div>
        
        {/* Staking Safe */}
        <div className="md:col-span-4 bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
               <h3 className="text-white font-bold flex items-center gap-2"><Lock size={20} className="text-emerald-500"/> Staking</h3>
               <span className="text-xs text-emerald-400 font-bold">5% APY</span>
            </div>
            <div className="text-center py-2">
               <div className="text-2xl font-mono font-bold text-white">{stats.stakedCoins}</div>
               <div className="text-xs text-slate-500 uppercase">Bloqueado</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
               <button onClick={stakeCoins} className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold py-2 rounded-lg border border-emerald-600/30">Deposit</button>
               <button onClick={unstakeCoins} className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 rounded-lg">Withdraw</button>
            </div>
        </div>

        {/* Balance Card */}
        <div className="md:col-span-8 bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
               <div>
                  <p className="text-slate-400 text-xs font-bold uppercase mb-1">Portafolio Simulado</p>
                  <h3 className="text-3xl font-mono font-bold text-white">${stats.balance.toLocaleString()}</h3>
               </div>
               <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><Wallet size={24}/></div>
            </div>
            <div className="flex items-end gap-1 h-12 opacity-50">
               {[40, 60, 45, 70, 65, 85, 80, 100, 90, 110, 105, 120].map((h, i) => (
                  <div key={i} className="flex-1 bg-green-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
               ))}
            </div>
        </div>

        {/* Quote of the Day */}
        <div className="md:col-span-4 bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 flex flex-col justify-center text-center">
            <Quote size={32} className="text-indigo-500 mx-auto mb-4 opacity-50"/>
            <p className="text-white font-medium italic mb-2">"{quote.text}"</p>
            <p className="text-xs text-slate-500 font-bold uppercase">- {quote.author}</p>
        </div>

        {/* Daily Quests List */}
        <div className="md:col-span-8 bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800">
           <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Crown size={20} className="text-yellow-500"/> Misiones Diarias</h3>
           <div className="grid md:grid-cols-3 gap-4">
              {stats.dailyQuests.map(quest => (
                 <div key={quest.id} className={`p-4 rounded-2xl border ${quest.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-800 border-slate-700'} transition-all`}>
                    <div className="flex justify-between items-start mb-2">
                       <span className={`font-bold text-sm ${quest.completed ? 'text-green-400' : 'text-slate-300'}`}>{quest.text}</span>
                       <div className="text-xs font-bold bg-slate-900 px-2 py-1 rounded text-yellow-500">+{quest.reward}</div>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-yellow-400 h-full transition-all" style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}></div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Streak Calendar */}
        <div className="md:col-span-4 bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-white font-bold flex items-center gap-2"><Calendar size={20} className="text-orange-500"/> Racha</h3>
               <span className="text-orange-500 font-bold">{stats.streak} Días</span>
            </div>
            <div className="flex justify-between">
               {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                     <span className="text-xs text-slate-500 font-bold">{day}</span>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < (stats.streak % 7) ? 'bg-orange-500 text-slate-900' : 'bg-slate-800 text-slate-600'}`}>
                        {i < (stats.streak % 7) ? <Zap size={14} fill="currentColor"/> : i + 1}
                     </div>
                  </div>
               ))}
            </div>
        </div>

        {/* Inventory Quick Access */}
        <div className="md:col-span-12 bg-slate-800/30 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-400 flex items-center gap-2"><ShoppingBag size={16}/> Inventario Rápido</span>
            <div className="flex gap-4">
               <div className="text-xs bg-slate-900 px-3 py-1 rounded-lg text-purple-400 border border-purple-500/20">Hint: {stats.inventory.hint5050}</div>
               <div className="text-xs bg-slate-900 px-3 py-1 rounded-lg text-cyan-400 border border-cyan-500/20">Freeze: {stats.inventory.timeFreeze}</div>
               <div className="text-xs bg-slate-900 px-3 py-1 rounded-lg text-yellow-400 border border-yellow-500/20">Skip: {stats.inventory.skip}</div>
            </div>
        </div>
        </>
        )}

      </div>
    </div>
  );
};
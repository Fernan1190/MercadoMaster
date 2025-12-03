import React from 'react';
import { useGame } from '../context/GameContext';
import { Briefcase, ArrowUpRight, MapPin, TrendingUp, Shield } from 'lucide-react';
import { OfficeVisual } from './OfficeVisual'; 

export const Office: React.FC = () => {
  const { stats } = useGame();
  const { level, officeItems, balance } = stats;

  // Determinar Título del Nivel
  let tierName = "Sótano Familiar";
  let tierDesc = "El inicio de todo. Sin presupuesto, pero con sueños.";
  
  if (level >= 5) { tierName = "Garaje Start-up"; tierDesc = "Invirtiendo en hardware y cafeína."; }
  if (level >= 10) { tierName = "Oficina Privada"; tierDesc = "Tu primera sede real. Ya eres un pro."; }
  if (level >= 20) { tierName = "Penthouse Wall St."; tierDesc = "Vistas al éxito. Eres el rey."; }
  if (level >= 50) { tierName = "Base Lunar"; tierDesc = "To the moon. Literalmente."; }

  return (
    <div className="p-6 md:p-10 h-full flex flex-col animate-fade-in pb-24 bg-slate-950">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
         <div>
            <div className="flex items-center gap-2 text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-2">
               <Briefcase size={14}/> Sede Central
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">{tierName}</h1>
            <p className="text-slate-400 font-medium text-lg">{tierDesc}</p>
         </div>
         
         <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-1">Valoración de Mercado</div>
            <div className="text-3xl font-mono font-bold text-green-400 flex items-center gap-2">
               <TrendingUp size={24}/> ${balance.toLocaleString()}
            </div>
         </div>
      </div>

      {/* --- EL ESCENARIO VISUAL --- */}
      <div className="flex-1 relative w-full rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl shadow-black bg-black min-h-[450px] group">
          
          <OfficeVisual level={level} items={officeItems} league={stats.league} />
          
          {/* HUD (Heads Up Display) */}
          <div className="absolute top-6 left-6 flex gap-2">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] text-green-400 font-mono flex items-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> ONLINE
              </div>
              <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] text-slate-300 font-mono">
                 FPS: 60
              </div>
          </div>
      </div>

      {/* Panel de Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex items-center gap-4 hover:border-slate-600 transition-all hover:-translate-y-1">
              <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-2xl"><Shield size={24}/></div>
              <div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Prestigio</div>
                  <div className="text-white font-bold text-lg">Nvl {stats.prestige}</div>
              </div>
          </div>
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex items-center gap-4 hover:border-slate-600 transition-all hover:-translate-y-1">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><MapPin size={24}/></div>
              <div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Zona</div>
                  <div className="text-white font-bold text-lg truncate w-24">Zona {Math.ceil(level/10)}</div>
              </div>
          </div>
          
          {/* Botón Tienda Destacado */}
          <button 
            onClick={() => (document.querySelector('button[aria-label="Tienda"]') as HTMLElement)?.click()} 
            className="col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 p-1 rounded-3xl shadow-lg transition-all active:scale-95 group"
          >
              <div className="bg-slate-900/50 hover:bg-transparent w-full h-full rounded-[1.3rem] flex items-center justify-center gap-3 transition-colors">
                  <span className="text-base font-black text-white uppercase tracking-wide">Mejorar Setup</span>
                  <div className="bg-white text-indigo-600 p-1.5 rounded-full group-hover:translate-x-1 transition-transform">
                      <ArrowUpRight size={18} strokeWidth={3}/>
                  </div>
              </div>
          </button>
      </div>

    </div>
  );
};
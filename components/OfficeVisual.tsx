import React from 'react';

interface OfficeVisualProps {
  level: number;
  items: string[];
  league: string;
}

export const OfficeVisual: React.FC<OfficeVisualProps> = ({ level, items, league }) => {
  // Configuración por TIER
  let tier = 1; // Sótano
  if (level >= 5) tier = 2; // Garaje
  if (level >= 10) tier = 3; // Oficina
  if (level >= 20) tier = 4; // Penthouse
  if (level >= 50) tier = 5; // Espacio

  const isSpace = tier === 5;
  
  return (
    <div className={`relative w-full h-full flex items-end justify-center overflow-hidden transition-colors duration-1000
      ${tier === 1 ? 'bg-[#0f172a]' : ''}
      ${tier === 2 ? 'bg-[#18181b]' : ''}
      ${tier === 3 ? 'bg-slate-900' : ''}
      ${tier === 4 ? 'bg-[#0f0518]' : ''}
      ${tier === 5 ? 'bg-black' : ''}
    `}>
        
        {/* --- FONDO Y AMBIENTE --- */}
        <div className="absolute inset-0 z-0">
            
            {/* TIER 1: Sótano (Ladrillos y oscuridad) */}
            {tier === 1 && (
              <>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brick-wall.png')] opacity-10"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl animate-[flicker_4s_infinite]"></div>
                <div className="absolute top-10 right-10 w-2 h-32 bg-slate-800 rotate-12 opacity-50"></div> {/* Tubería */}
              </>
            )}

            {/* TIER 2: Garaje (Herramientas y luz fría) */}
            {tier === 2 && (
               <>
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,#27272a_25%,transparent_25%,transparent_75%,#27272a_75%,#27272a),linear-gradient(45deg,#27272a_25%,transparent_25%,transparent_75%,#27272a_75%,#27272a)] [background-size:20px_20px] opacity-5"></div>
                 <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]"></div>
               </>
            )}

            {/* TIER 3: Oficina (Ciudad de fondo) */}
            {tier === 3 && (
               <div className="absolute inset-0">
                  <div className="absolute bottom-32 w-full h-64 bg-[url('https://www.transparenttextures.com/patterns/city-lights.png')] opacity-20 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent"></div>
               </div>
            )}

            {/* TIER 4: Penthouse (Lujo y Nubes) */}
            {tier === 4 && (
               <>
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-slate-900"></div>
                  <div className="absolute top-20 -left-20 w-96 h-32 bg-purple-500/20 rounded-full blur-[80px]"></div>
                  <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>
                  {/* Ventanales */}
                  <div className="absolute inset-0 border-x-[50px] border-t-[20px] border-slate-950 opacity-80"></div>
                  <div className="absolute top-0 left-1/3 w-2 h-full bg-slate-950/50"></div>
                  <div className="absolute top-0 right-1/3 w-2 h-full bg-slate-950/50"></div>
               </>
            )}

            {/* TIER 5: Base Lunar (Épico) */}
            {tier === 5 && (
               <>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-[matrix-fall_60s_linear_infinite]"></div>
                  <div className="absolute top-10 right-10 w-48 h-48 bg-blue-400 rounded-full blur-sm shadow-[0_0_100px_rgba(59,130,246,0.5)] opacity-90"></div> {/* La Tierra */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
               </>
            )}
        </div>

        {/* --- MESA Y SETUP (Isométrico) --- */}
        <div className={`relative z-20 flex flex-col items-center transition-transform duration-500 ${isSpace ? 'animate-[float-space_6s_ease-in-out_infinite]' : ''}`}>
            
            {/* PERSONAJE */}
            <div className="relative -mb-12 z-30 flex flex-col items-center group">
                {/* Cabeza */}
                <div className="w-24 h-24 bg-[#ffdbac] rounded-3xl relative shadow-xl z-20 animate-[breathe_4s_infinite_ease-in-out]">
                    {/* Pelo */}
                    <div className="absolute -top-3 -left-2 w-28 h-12 bg-slate-800 rounded-t-2xl shadow-md"></div>
                    <div className="absolute top-2 -right-2 w-4 h-8 bg-slate-800 rounded-r-lg"></div>
                    
                    {/* Gafas (Visual de Progreso) */}
                    {level >= 10 && (
                       <div className="absolute top-8 left-2 w-20 h-6 bg-black/80 rounded-md border-t-2 border-white/20 backdrop-blur-sm shadow-lg flex items-center justify-center">
                          <div className="w-full h-full bg-gradient-to-tr from-blue-500/30 to-transparent"></div>
                       </div>
                    )}

                    {/* Cascos (Si Setup Pro) */}
                    {items.includes('setup_pro') && (
                        <>
                           <div className="absolute top-4 -left-3 w-4 h-12 bg-red-500 rounded-l-lg border-r-2 border-black/20"></div>
                           <div className="absolute top-4 -right-3 w-4 h-12 bg-red-500 rounded-r-lg border-l-2 border-black/20"></div>
                           <div className="absolute -top-4 left-4 w-16 h-2 bg-red-500 rounded-t-full"></div>
                        </>
                    )}
                </div>

                {/* Cuerpo */}
                <div className="w-32 h-24 bg-blue-600 rounded-t-[2rem] relative -mt-2 shadow-inner flex justify-center z-10">
                    {/* Logo Camiseta */}
                    <div className="mt-8 text-white/30 font-black text-xs tracking-widest">HODL</div>
                    
                    {/* Brazos Tecleando */}
                    <div className="absolute bottom-2 -left-8 w-12 h-24 bg-blue-700 rounded-full origin-top rotate-[20deg] animate-[type-left_0.2s_infinite]"></div>
                    <div className="absolute bottom-2 -right-8 w-12 h-24 bg-blue-700 rounded-full origin-top rotate-[-20deg] animate-[type-right_0.2s_infinite_reverse]"></div>
                </div>
            </div>

            {/* ESCRITORIO */}
            <div className="relative z-20 perspective-[1000px]">
                {/* Tablero Mesa */}
                <div className={`w-[600px] h-20 rounded-xl shadow-2xl relative flex justify-center items-end pb-4
                    ${tier >= 4 ? 'bg-slate-200' : 'bg-slate-800'} 
                    ${tier === 2 ? 'bg-zinc-700 border-t-4 border-zinc-600' : ''}
                `}>
                     {/* Brillo del monitor en la mesa */}
                     <div className="absolute top-0 w-64 h-16 bg-blue-500/20 blur-xl rounded-full"></div>

                     {/* SETUP: MONITORES */}
                     <div className="absolute bottom-10 flex items-end gap-2">
                         
                         {/* Monitor Izq (Si Setup Pro) */}
                         {items.includes('setup_pro') && (
                             <div className="w-32 h-40 bg-slate-900 rounded-lg border-4 border-slate-700 relative overflow-hidden shadow-lg origin-bottom-right -rotate-y-12 transform skew-y-3">
                                 <div className="absolute inset-0 bg-green-900/20 flex flex-col p-2 gap-1">
                                     <div className="w-full h-1 bg-green-500/50 animate-pulse"></div>
                                     <div className="w-2/3 h-1 bg-green-500/50 animate-pulse delay-75"></div>
                                     <div className="w-full h-1 bg-green-500/50 animate-pulse delay-150"></div>
                                 </div>
                             </div>
                         )}

                         {/* Monitor Principal */}
                         <div className="w-64 h-40 bg-slate-900 rounded-xl border-[6px] border-slate-700 relative overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-[monitor-glow_3s_infinite]">
                             {/* Pantalla Contenido */}
                             <div className="absolute inset-0 bg-slate-900 flex items-end px-2 gap-1 opacity-80">
                                 <div className="w-1/6 h-[40%] bg-red-500 animate-[pulse_1s_infinite]"></div>
                                 <div className="w-1/6 h-[70%] bg-green-500 animate-[pulse_1.2s_infinite]"></div>
                                 <div className="w-1/6 h-[30%] bg-red-500 animate-[pulse_0.8s_infinite]"></div>
                                 <div className="w-1/6 h-[90%] bg-green-500 animate-[pulse_1.5s_infinite]"></div>
                                 <div className="w-1/6 h-[50%] bg-green-500 animate-[pulse_1s_infinite]"></div>
                                 <div className="w-1/6 h-[60%] bg-red-500 animate-[pulse_1.1s_infinite]"></div>
                             </div>
                             {/* Reflejo */}
                             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>
                         </div>

                         {/* Monitor Der (Si Setup Pro) */}
                         {items.includes('setup_pro') && (
                             <div className="w-32 h-40 bg-slate-900 rounded-lg border-4 border-slate-700 relative overflow-hidden shadow-lg origin-bottom-left rotate-y-12 transform -skew-y-3">
                                 <div className="absolute inset-0 flex items-center justify-center">
                                     <div className="w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                                 </div>
                             </div>
                         )}
                     </div>

                     {/* Periféricos */}
                     <div className="w-40 h-2 bg-slate-900/50 rounded-full mb-1 relative">
                        {/* Teclado RGB */}
                        <div className="absolute -top-2 left-2 w-24 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 blur-[1px] opacity-80 animate-pulse"></div>
                     </div>
                     <div className="w-6 h-8 bg-slate-900 rounded-full absolute bottom-6 right-32 border border-slate-700"></div> {/* Ratón */}
                </div>

                {/* Patas Mesa */}
                <div className="w-full flex justify-between px-10 -mt-2">
                    <div className="w-4 h-32 bg-gradient-to-b from-slate-700 to-slate-900"></div>
                    <div className="w-4 h-32 bg-gradient-to-b from-slate-700 to-slate-900"></div>
                </div>
            </div>

            {/* Silla (Detrás de la mesa, pero visualmente conectada) */}
            <div className="absolute bottom-0 z-0">
                 <div className="w-40 h-48 bg-slate-800 rounded-t-full border-4 border-slate-700 shadow-xl"></div>
            </div>
        </div>

        {/* 4. OBJETOS DE TIENDA (Decoración Frontal) */}
        <div className="absolute inset-0 pointer-events-none z-40">
            {items.includes('plant') && (
               <div className="absolute bottom-0 left-4 md:left-20 w-32 h-48 transition-transform hover:scale-105">
                  {/* Maceta */}
                  <div className="absolute bottom-0 left-8 w-16 h-16 bg-orange-800 rounded-b-lg shadow-lg"></div>
                  {/* Hojas (Arte CSS simple) */}
                  <div className="absolute bottom-16 left-12 w-8 h-24 bg-green-700 rounded-full -rotate-12 origin-bottom"></div>
                  <div className="absolute bottom-16 left-12 w-8 h-20 bg-green-600 rounded-full rotate-12 origin-bottom"></div>
                  <div className="absolute bottom-16 left-12 w-8 h-16 bg-green-500 rounded-full rotate-0 origin-bottom"></div>
               </div>
            )}

            {items.includes('cat') && (
               <div className="absolute bottom-4 right-4 md:right-32 text-6xl drop-shadow-2xl animate-bounce">
                  🐈
               </div>
            )}
            
            {items.includes('trophy_gold') && (
                <div className="absolute top-32 left-10 bg-white/5 p-2 rounded-xl backdrop-blur-md border border-white/10 animate-[float-space_4s_ease-in-out_infinite]">
                    <div className="text-5xl filter drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">🏆</div>
                </div>
            )}
        </div>

        {/* Overlay Viñeta */}
        <div className="absolute inset-0 bg-[radial-gradient(transparent_50%,#000_100%)] z-50 pointer-events-none opacity-60"></div>

    </div>
  );
};
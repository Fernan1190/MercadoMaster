import React from 'react';

interface OfficeVisualProps {
  level: number;
  items: string[];
  league: string;
}

export const OfficeVisual: React.FC<OfficeVisualProps> = ({ level, items, league }) => {
  
  // Determinar Tamaño y Estilo de la Oficina
  let roomSize = 300; // Pixels base
  let wallColor = '#334155'; // Slate 700
  let floorColor = '#1e293b'; // Slate 800
  let floorPattern = 'none';

  if (level >= 5) { // Garaje
      roomSize = 400;
      wallColor = '#52525b'; // Zinc 600
      floorColor = '#27272a'; // Zinc 800
      floorPattern = 'radial-gradient(circle, #3f3f46 1px, transparent 1px)';
  }
  if (level >= 10) { // Oficina
      roomSize = 500;
      wallColor = '#1e3a8a'; // Blue 900
      floorColor = '#172554'; // Blue 950
      floorPattern = 'checkerboard'; // Simulado luego
  }
  if (level >= 20) { // Penthouse
      roomSize = 600;
      wallColor = '#312e81'; // Indigo 900
      floorColor = '#0f172a'; // Slate 900
  }
  if (level >= 50) { // Base Lunar
      roomSize = 700;
      wallColor = '#000000';
      floorColor = '#111111';
  }

  // Posición central para centrar la cámara isométrica
  const center = "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-slate-950 flex items-center justify-center perspective-[2000px]">
        
        {/* CÁMARA ISOMÉTRICA */}
        <div className="relative w-[800px] h-[800px] transform rotate-x-[60deg] rotate-z-[-45deg] transition-all duration-1000 ease-in-out"
             style={{ transform: 'rotateX(60deg) rotateZ(-45deg) scale(0.8)' }}>
            
            {/* --- SUELO (BASE) --- */}
            <div 
                className="absolute shadow-2xl transition-all duration-1000"
                style={{ 
                    width: `${roomSize}px`, 
                    height: `${roomSize}px`, 
                    backgroundColor: floorColor,
                    backgroundImage: floorPattern === 'checkerboard' ? 
                        'linear-gradient(45deg, #1e3a8a 25%, transparent 25%, transparent 75%, #1e3a8a 75%, #1e3a8a), linear-gradient(45deg, #1e3a8a 25%, transparent 25%, transparent 75%, #1e3a8a 75%, #1e3a8a)' : floorPattern,
                    backgroundSize: '40px 40px',
                    backgroundPosition: '0 0, 20px 20px',
                    left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '-20px 20px 50px rgba(0,0,0,0.5)'
                }}
            >
                {/* Alfombra (Si nivel > 5) */}
                {level >= 5 && (
                    <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-red-900/50 rounded-lg border-2 border-red-800/50"></div>
                )}
            </div>

            {/* --- PAREDES (Levantadas en 3D) --- */}
            {/* Pared Izquierda (Oeste) */}
            <div 
                className="absolute origin-bottom-left transition-all duration-1000"
                style={{
                    width: '20px',
                    height: `${roomSize}px`,
                    backgroundColor: wallColor,
                    filter: 'brightness(0.8)',
                    transform: 'rotateY(-90deg)',
                    left: `calc(50% - ${roomSize/2}px)`,
                    top: `calc(50% - ${roomSize/2}px)`
                }}
            >
                {/* Ventana en Pared Izquierda (Nivel alto) */}
                {level >= 10 && (
                    <div className="absolute top-10 left-0 w-full h-[60%] bg-cyan-300/20 border-y-4 border-slate-800 shadow-[0_0_20px_rgba(34,211,238,0.2)]"></div>
                )}
            </div>

            {/* Pared Trasera (Norte) */}
            <div 
                className="absolute origin-top-left transition-all duration-1000"
                style={{
                    width: `${roomSize}px`,
                    height: '100px', // Altura de pared
                    backgroundColor: wallColor,
                    filter: 'brightness(0.6)',
                    transform: 'rotateX(-90deg)',
                    left: `calc(50% - ${roomSize/2}px)`,
                    top: `calc(50% - ${roomSize/2}px)`
                }}
            >
                {/* Pizarra / Cuadro */}
                <div className="absolute top-[20%] left-[30%] w-[40%] h-[50%] bg-green-900 border-4 border-yellow-900 opacity-80"></div>
            </div>


            {/* --- MUEBLES Y OBJETOS (Z-Index fake con translateZ) --- */}
            
            {/* 1. ESCRITORIO (El centro de mando) */}
            <div className="absolute" style={{ 
                left: '50%', top: '50%', 
                transform: 'translate(-50%, -50%) translateZ(20px)' 
            }}>
                {/* Tablero Mesa */}
                <div className="w-32 h-16 bg-amber-800 shadow-lg relative">
                    {/* Ordenador */}
                    <div className="absolute right-2 bottom-4 w-8 h-8 bg-slate-800 border-t-2 border-l-2 border-slate-600 shadow-md"></div>
                    {/* Monitor (Levantado) */}
                    <div className="absolute left-8 bottom-8 w-16 h-2 bg-black transform rotate-x-[-90deg] translate-y-[-20px] shadow-[0_0_10px_rgba(0,255,0,0.5)]"></div>
                    
                    {/* Silla */}
                    <div className="absolute -bottom-8 left-10 w-12 h-12 bg-slate-700 rounded-full border-4 border-slate-900"></div>
                    
                    {/* PERSONAJE (Meeple) */}
                    <div className="absolute -bottom-4 left-12 w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-xl z-50 animate-bounce"></div>
                </div>
            </div>

            {/* 2. SERVIDORES (Si tienes setup pro) */}
            {items.includes('setup_pro') && (
                <div className="absolute" style={{ 
                    left: '20%', top: '20%', 
                    transform: 'translateZ(0px)' 
                }}>
                    <div className="w-16 h-16 bg-black border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] relative">
                        <div className="absolute top-2 left-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="absolute top-6 left-2 w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75"></div>
                    </div>
                </div>
            )}

            {/* 3. PLANTA (Si comprada) */}
            {items.includes('plant') && (
                <div className="absolute" style={{ left: '80%', top: '20%' }}>
                    <div className="w-12 h-12 bg-green-800 rounded-full relative">
                        <div className="absolute -top-8 left-4 w-4 h-12 bg-green-500 rounded-full"></div>
                        <div className="absolute -top-6 left-0 w-4 h-10 bg-green-600 rounded-full rotate-[-45deg]"></div>
                        <div className="absolute -top-6 right-0 w-4 h-10 bg-green-600 rounded-full rotate-[45deg]"></div>
                    </div>
                </div>
            )}

            {/* 4. TROFEO (Si comprado) */}
            {items.includes('trophy_gold') && (
                <div className="absolute" style={{ left: '80%', top: '80%' }}>
                     <div className="w-10 h-10 bg-yellow-500 rounded-full shadow-[0_0_20px_gold] animate-pulse"></div>
                </div>
            )}

        </div>

        {/* HUD / Overlay (No isométrico) */}
        <div className="absolute top-4 left-4 z-50 pointer-events-none">
             <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-xl">
                 <h3 className="text-white font-black text-lg uppercase tracking-widest">Vista Aérea</h3>
                 <p className="text-slate-400 text-xs">Cámara de seguridad #01</p>
             </div>
        </div>

    </div>
  );
};
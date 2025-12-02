import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { generateHistory, generateNextCandle } from '../services/marketSimulator';
import { CandleData } from '../types';

export const TradingTerminal: React.FC = () => {
  const { stats, actions } = useGame();
  const [activeSymbol, setActiveSymbol] = useState('BTC');
  const [data, setData] = useState<CandleData[]>([]);
  const [price, setPrice] = useState(65000);
  const [tradeAmount, setTradeAmount] = useState('');

  // Simulación del Mercado en Tiempo Real
  useEffect(() => {
    const initialData = generateHistory(price, 50);
    setData(initialData);

    const interval = setInterval(() => {
      setData(prev => {
        const lastCandle = prev[prev.length - 1];
        const newCandle = generateNextCandle(lastCandle.close);
        setPrice(newCandle.close);
        return [...prev.slice(1), newCandle];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeSymbol]); 

  // --- LÓGICA DE TRADING MEJORADA ---
  const handleTrade = (type: 'buy' | 'sell') => {
    const amount = parseFloat(tradeAmount);
    
    // 1. Validación básica
    if (!amount || amount <= 0) {
      alert("⚠️ Por favor, introduce una cantidad válida mayor a 0.");
      return;
    }

    let success = false;

    if (type === 'buy') {
      // 2. Intentar Comprar
      success = actions.buyAsset(activeSymbol, amount, price);
      
      if (!success) {
        // Feedback si falla
        const cost = amount * price;
        alert(`🚫 FONDOS INSUFICIENTES\n\nNecesitas: $${cost.toLocaleString()}\nTienes: $${stats.balance.toLocaleString()}\n\nPrueba con una cantidad menor (ej: 0.01)`);
      } else {
        // Feedback si funciona (opcional, visualmente se ve en el balance)
        // alert(`✅ Compraste ${amount} ${activeSymbol}`);
      }

    } else {
      // 3. Intentar Vender
      success = actions.sellAsset(activeSymbol, amount, price);
      
      if (!success) {
        // Feedback si falla
        alert(`🚫 ERROR DE VENTA\n\nNo tienes suficiente ${activeSymbol} en tu cartera para vender esa cantidad.`);
      }
    }

    // 4. Limpiar input solo si hubo éxito
    if (success) {
      setTradeAmount('');
    }
  };

  // Calcular valor actual de esta moneda en posesión
  const ownedAmount = stats.portfolio?.[activeSymbol] || 0;
  const ownedValue = ownedAmount * price;

  const isUp = data.length > 1 && data[data.length - 1].close > data[data.length - 2].close;

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden h-full flex flex-col">
      {/* Header del Terminal */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-slate-800 rounded-xl">
              <Activity className={isUp ? "text-green-500" : "text-red-500"} />
           </div>
           <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                 {activeSymbol} / USD
                 <span className={`text-sm px-2 py-1 rounded-full ${isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {isUp ? '+0.45%' : '-0.21%'}
                 </span>
              </h3>
              <p className="text-4xl font-mono font-bold text-white mt-1">
                 ${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
           </div>
        </div>
        
        {/* Selector de Activos */}
        <div className="flex gap-2">
           {['BTC', 'ETH', 'SOL'].map(sym => (
              <button 
                key={sym} 
                onClick={() => { setActiveSymbol(sym); setPrice(sym === 'BTC' ? 65000 : sym === 'ETH' ? 3500 : 145); }}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${activeSymbol === sym ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                 {sym}
              </button>
           ))}
        </div>
      </div>

      {/* Gráfico */}
      <div className="flex-1 w-full mb-6 relative min-h-[200px]">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
               <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
                     <stop offset="95%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
                  </linearGradient>
               </defs>
               <XAxis dataKey="time" hide />
               <YAxis domain={['auto', 'auto']} hide />
               <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Precio']}
               />
               <Area 
                  type="monotone" 
                  dataKey="close" 
                  stroke={isUp ? "#22c55e" : "#ef4444"} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  strokeWidth={3}
                  animationDuration={500}
               />
            </AreaChart>
         </ResponsiveContainer>
      </div>

      {/* Panel de Operaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
         
         {/* Tu Cartera */}
         <div className="flex flex-col justify-center">
            <span className="text-slate-400 text-xs font-bold uppercase mb-1">Tu Posición</span>
            <div className="text-2xl font-bold text-white mb-1">{ownedAmount.toFixed(4)} {activeSymbol}</div>
            <div className="text-sm text-slate-500">≈ ${ownedValue.toLocaleString()}</div>
            <div className="mt-4 text-xs text-slate-400">
               Saldo Disponible: <span className="text-white font-bold">${stats.balance.toLocaleString()}</span>
            </div>
         </div>

         {/* Controles Compra/Venta */}
         <div>
            <div className="relative mb-4">
               <DollarSign className="absolute left-3 top-3 text-slate-500" size={18}/>
               <input 
                  type="number" 
                  placeholder="Cantidad (ej: 0.1)" 
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
               />
            </div>
            <div className="grid grid-cols-2 gap-3">
               <button 
                  onClick={() => handleTrade('buy')}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
               >
                  <TrendingUp size={18}/> COMPRAR
               </button>
               <button 
                  onClick={() => handleTrade('sell')}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
               >
                  <TrendingDown size={18}/> VENDER
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
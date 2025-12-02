import React from 'react';
import { useGame } from '../context/GameContext';
import { ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';

export const TransactionList: React.FC = () => {
  const { stats } = useGame();
  const txs = stats.transactions || [];

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl h-full flex flex-col">
       <h3 className="text-white font-bold flex items-center gap-2 mb-4">
          <History size={20} className="text-blue-400"/> Historial Reciente
       </h3>
       
       <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-3 max-h-[250px]">
          {txs.length === 0 ? (
             <p className="text-slate-500 text-center italic text-sm mt-10">Aún no has operado. ¡Ve al terminal!</p>
          ) : (
             txs.map(tx => (
                <div key={tx.id} className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tx.type === 'buy' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                         {tx.type === 'buy' ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
                      </div>
                      <div>
                         <div className="text-white font-bold text-sm flex gap-1">
                            {tx.type === 'buy' ? 'Compra' : 'Venta'} <span className="text-slate-400">{tx.symbol}</span>
                         </div>
                         <div className="text-slate-500 text-xs">{tx.timestamp.split(' ')[1]}</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-white font-mono font-bold text-sm">
                         {tx.type === 'buy' ? '-' : '+'}${ (tx.amount * tx.price).toLocaleString(undefined, {maximumFractionDigits: 0}) }
                      </div>
                      <div className="text-slate-500 text-xs">
                         @ {tx.price.toLocaleString()}
                      </div>
                   </div>
                </div>
             ))
          )}
       </div>
    </div>
  );
};
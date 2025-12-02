import { CandleData } from '../types';

// Configuración inicial de activos simulados
export const INITIAL_PRICES = {
  BTC: 65000,
  ETH: 3500,
  SOL: 145,
  AAPL: 180,
  TSLA: 240
};

// Genera una vela realista basada en la anterior (Random Walk)
export const generateNextCandle = (prevClose: number, volatility: number = 0.002): CandleData => {
  const change = 1 + (Math.random() * volatility * 2 - volatility); // Sube o baja un poco
  const close = prevClose * change;
  
  // Generamos mechas realistas alrededor del precio
  const high = Math.max(prevClose, close) * (1 + Math.random() * volatility * 0.5);
  const low = Math.min(prevClose, close) * (1 - Math.random() * volatility * 0.5);
  
  const now = new Date();
  return {
    time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
    open: prevClose,
    high,
    low,
    close
  };
};

// Genera historial inicial falso para que el gráfico no empiece vacío
export const generateHistory = (basePrice: number, count: number): CandleData[] => {
  let price = basePrice;
  const data: CandleData[] = [];
  for (let i = 0; i < count; i++) {
    const candle = generateNextCandle(price);
    price = candle.close;
    // Ajustamos tiempos ficticios hacia atrás
    candle.time = `${10 + Math.floor(i/60)}:${i%60}`; 
    data.push(candle);
  }
  return data;
};
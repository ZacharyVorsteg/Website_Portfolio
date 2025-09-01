'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import PriceChart from '@/components/proterminal/PriceChart';
import Watchlist from '@/components/proterminal/Watchlist';
import OrderPanel from '@/components/proterminal/OrderPanel';
import { DEFAULT_TICKERS, generateSeries, nextTickFromLast, type Candle, type Interval } from '@/lib/proterminal/sim';

const RANGES: Interval[] = ['1m','5m','15m','1H','D','W'];

function barsFor(interval: Interval) {
  switch (interval) {
    case '1m': return 200;   // ~3h
    case '5m': return 200;   // ~16h
    case '15m': return 200;  // ~2d
    case '1H': return 200;   // ~1w
    case 'D': return 200;    // ~200d
    case 'W': return 104;    // 2y
  }
}

export default function ProTerminalPage() {
  const [symbol, setSymbol] = useState<string>('AAPL');
  const [interval, setInterval] = useState<Interval>('1m');
  const [live, setLive] = useState(true);
  const [series, setSeries] = useState<Candle[]>([]);
  const [allPrices, setAllPrices] = useState<Record<string, number>>(DEFAULT_TICKERS);
  const updateCounter = useRef(0);

  // Generate initial data for symbol
  useEffect(() => {
    const base = DEFAULT_TICKERS[symbol] ?? 100;
    const newSeries = generateSeries(symbol, { 
      bars: barsFor(interval), 
      interval, 
      basePrice: base, 
      marketHoursOnly: false 
    });
    console.log('Generated series:', newSeries.length, 'candles for', symbol);
    setSeries(newSeries);
  }, [symbol, interval]);

  // Live price updates - simulate realistic tick data
  useEffect(() => {
    if (!live) return;
    
    const updatePrices = () => {
      updateCounter.current++;
      
      // Update all symbol prices with realistic movements
      setAllPrices(prev => {
        const newPrices = { ...prev };
        Object.keys(newPrices).forEach(sym => {
          const volatility = sym === 'TSLA' ? 0.003 : sym === 'NVDA' ? 0.002 : 0.001;
          const change = (Math.random() - 0.5) * 2 * volatility;
          newPrices[sym] = Math.max(1, prev[sym] * (1 + change));
        });
        return newPrices;
      });

      // Update current symbol's chart
      setSeries(prev => {
        if (prev.length === 0) return prev;
        
        const last = prev[prev.length - 1];
        const now = Math.floor(Date.now() / 1000);
        const intervalSec = interval === '1m' ? 60 : interval === '5m' ? 300 : interval === '15m' ? 900 : interval === '1H' ? 3600 : interval === 'D' ? 86400 : 604800;
        
        // Check if we need a new candle
        if (now - last.time >= intervalSec) {
          // Create new candle
          const newCandle = nextTickFromLast(last, interval, 2, symbol + updateCounter.current);
          const updated = [...prev.slice(-barsFor(interval) + 1), newCandle];
          return updated;
        } else {
          // Update current candle
          const currentPrice = allPrices[symbol] ?? last.close;
          const updated = [...prev];
          const currentCandle = { ...updated[updated.length - 1] };
          
          currentCandle.close = currentPrice;
          currentCandle.high = Math.max(currentCandle.high, currentPrice);
          currentCandle.low = Math.min(currentCandle.low, currentPrice);
          currentCandle.volume = currentCandle.volume + Math.floor(Math.random() * 1000);
          
          updated[updated.length - 1] = currentCandle;
          return updated;
        }
      });
    };

    // Update every 500ms for smooth price action
    const id = window.setInterval(updatePrices, 500);
    return () => window.clearInterval(id);
  }, [live, interval, symbol, allPrices]);

  const lastPrice = useMemo(() => {
    if (series.length > 0) {
      return series[series.length - 1].close;
    }
    return allPrices[symbol] ?? DEFAULT_TICKERS[symbol] ?? 100;
  }, [series, symbol, allPrices]);

  const dayChangePct = useMemo(() => {
    if (series.length < 2) return 0;
    const first = series[0].close;
    return ((lastPrice - first) / first) * 100;
  }, [series, lastPrice]);

  const handleIntervalChange = useCallback((newInterval: Interval) => {
    setInterval(newInterval);
  }, []);

  const handleSymbolChange = useCallback((newSymbol: string) => {
    setSymbol(newSymbol);
  }, []);

  return (
    <main className="ptn-wrap">
      <Watchlist 
        selected={symbol} 
        onSelect={handleSymbolChange} 
        lastPrices={allPrices} 
      />

      <section className="ptn-main">
        <div className="ptn-header">
          <div>
            <h2>
              {symbol} 
              <span className={`ptn-chip ${dayChangePct >= 0 ? 'green' : 'red'}`}>
                {dayChangePct >= 0 ? '+' : ''}{dayChangePct.toFixed(2)}%
              </span>
            </h2>
            <div className="ptn-last">${lastPrice.toFixed(2)}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              {new Date().toLocaleTimeString()} • {series.length} bars
            </div>
          </div>
          <div className="ptn-controls">
            <div className="ptn-timeframe">
              {RANGES.map(r => (
                <button 
                  key={r} 
                  className={r === interval ? 'active' : ''} 
                  onClick={() => handleIntervalChange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            <label className="ptn-live">
              <input 
                type="checkbox" 
                checked={live} 
                onChange={e => setLive(e.target.checked)} 
              />
              <span style={{ color: live ? '#22c55e' : '#6b7280' }}>
                {live ? '● LIVE' : '○ PAUSED'}
              </span>
            </label>
          </div>
        </div>

        <PriceChart data={series} interval={interval} />

        <div className="ptn-lower">
          <div className="ptn-bars">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="ptn-note">Market Data</span>
              <span className="ptn-note">{live ? 'Streaming' : 'Static'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '12px' }}>
              <div>
                <div style={{ color: '#6b7280' }}>Bid</div>
                <div style={{ color: '#ef4444' }}>${(lastPrice - 0.01).toFixed(2)}</div>
              </div>
              <div>
                <div style={{ color: '#6b7280' }}>Spread</div>
                <div>$0.02</div>
              </div>
              <div>
                <div style={{ color: '#6b7280' }}>Ask</div>
                <div style={{ color: '#22c55e' }}>${(lastPrice + 0.01).toFixed(2)}</div>
              </div>
            </div>
          </div>
          <OrderPanel symbol={symbol} lastPrice={lastPrice} />
        </div>
      </section>
    </main>
  );
}
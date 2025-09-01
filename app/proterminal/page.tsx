'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import PriceChart from '@/components/proterminal/PriceChart';
import Watchlist from '@/components/proterminal/Watchlist';
import OrderPanel from '@/components/proterminal/OrderPanel';
import { DEFAULT_TICKERS, generateSeries, nextTickFromLast, type Candle, type Interval } from '@/lib/proterminal/sim';

const RANGES: Interval[] = ['1m','5m','15m','1H','D','W'];

function barsFor(interval: Interval) {
  switch (interval) {
    case '1m': return 600;   // ~10h
    case '5m': return 600;   // ~2d
    case '15m': return 400;  // ~4d
    case '1H': return 500;   // ~3w
    case 'D': return 365;    // 1y
    case 'W': return 260;    // 5y
  }
}

export default function ProTerminalPage() {
  const [symbol, setSymbol] = useState<string>('MSFT');
  const [interval, setInterval] = useState<Interval>('1H');
  const [live, setLive] = useState(false);
  const [series, setSeries] = useState<Candle[]>([]);

  // initial seed
  useEffect(() => {
    const base = DEFAULT_TICKERS[symbol] ?? 100;
    setSeries(generateSeries(symbol, { bars: barsFor(interval), interval, basePrice: base, marketHoursOnly: true }));
  }, [symbol, interval]);

  // live ticks
  useEffect(() => {
    if (!live || series.length === 0) return;
    const id = window.setInterval(() => {
      setSeries(prev => {
        const last = prev[prev.length - 1];
        const next = nextTickFromLast(last, interval, 2, symbol);
        const cap = barsFor(interval);
        const arr = [...prev, next];
        return arr.length > cap ? arr.slice(arr.length - cap) : arr;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [live, interval, series.length, symbol]);

  const lastPrice = series.length ? series[series.length - 1].close : (DEFAULT_TICKERS[symbol] ?? 0);
  const dayChangePct = useMemo(() => {
    if (series.length < 2) return 0;
    const first = series[0].close;
    return ((lastPrice - first) / first) * 100;
  }, [series, lastPrice]);

  const lastPrices: Record<string, number> = useMemo(() => {
    const m: Record<string, number> = {};
    Object.keys(DEFAULT_TICKERS).forEach(k => {
      // simple derived price so the watchlist looks alive
      const seed = DEFAULT_TICKERS[k];
      const jitter = ((seed % 7) - 3) * 0.03;
      m[k] = (k === symbol ? lastPrice : seed * (1 + jitter / 100));
    });
    return m;
  }, [symbol, lastPrice]);

  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <main className="ptn-wrap">
      <Watchlist selected={symbol} onSelect={setSymbol} lastPrices={lastPrices} />

      <section className="ptn-main">
        <div ref={headerRef} className="ptn-header">
          <div>
            <h2>{symbol} <span className={`ptn-chip ${dayChangePct >= 0 ? 'green' : 'red'}`}>{dayChangePct >= 0 ? '+' : '−'} {Math.abs(dayChangePct).toFixed(2)}%</span></h2>
            <div className="ptn-last">${lastPrice.toFixed(2)}</div>
          </div>
          <div className="ptn-controls">
            <div className="ptn-timeframe">
              {RANGES.map(r => (
                <button key={r} className={r === interval ? 'active' : ''} onClick={() => setInterval(r)}>{r}</button>
              ))}
            </div>
            <label className="ptn-live">
              <input type="checkbox" checked={live} onChange={e => setLive(e.target.checked)} />
              <span>LIVE</span>
            </label>
          </div>
        </div>

        <PriceChart data={series} interval={interval} />

        <div className="ptn-lower">
          <div className="ptn-bars">
            {/* Placeholder for depth/indicators—kept minimal for performance */}
            <div className="ptn-note">Volume bars are under the chart. Add RSI/MACD later if desired.</div>
          </div>
          <OrderPanel symbol={symbol} lastPrice={lastPrice} />
        </div>
      </section>
    </main>
  );
}

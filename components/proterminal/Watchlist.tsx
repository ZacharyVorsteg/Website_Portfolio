'use client';
import React from 'react';
import { DEFAULT_TICKERS } from '@/lib/proterminal/sim';

type Props = {
  selected: string;
  onSelect: (s: string) => void;
  lastPrices: Record<string, number>;
};

export default function Watchlist({ selected, onSelect, lastPrices }: Props) {
  const symbols = Object.keys(DEFAULT_TICKERS);
  return (
    <aside className="ptn-aside">
      <input placeholder="Search symbols..." className="ptn-input" />
      <ul className="ptn-list">
        {symbols.map(s => {
          const p = lastPrices[s] ?? DEFAULT_TICKERS[s];
          const base = DEFAULT_TICKERS[s];
          const pct = ((p - base) / base) * 100;
          const up = pct >= 0;
          return (
            <li key={s} className={`ptn-row ${selected === s ? 'active' : ''}`} onClick={() => onSelect(s)}>
              <div className="ptn-left">
                <strong>{s}</strong>
                <span className={`ptn-chip ${up ? 'green' : 'red'}`}>{up ? '+' : '−'} {Math.abs(pct).toFixed(2)}%</span>
              </div>
              <div className="ptn-price">${p.toFixed(2)}</div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

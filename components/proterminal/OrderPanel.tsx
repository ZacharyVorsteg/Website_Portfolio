'use client';
import React, { useMemo, useState } from 'react';

type Fill = { side: 'BUY' | 'SELL'; qty: number; price: number; symbol: string; time: number; };
type Props = { symbol: string; lastPrice: number; };

export default function OrderPanel({ symbol, lastPrice }: Props) {
  const [qty, setQty] = useState(100);
  const [fills, setFills] = useState<Fill[]>([]);

  const position = useMemo(() => {
    const pos = fills.filter(f => f.symbol === symbol);
    const qtyNet = pos.reduce((a, f) => a + (f.side === 'BUY' ? f.qty : -f.qty), 0);
    const cost = pos.reduce((a, f) => a + (f.side === 'BUY' ? f.qty * f.price : -f.qty * f.price), 0);
    const avg = qtyNet !== 0 ? cost / qtyNet : 0;
    const unreal = qtyNet * (lastPrice - avg);
    return { qty: qtyNet, avg, unreal };
  }, [fills, symbol, lastPrice]);

  function submit(side: 'BUY' | 'SELL') {
    setFills(f => [{ side, qty, price: lastPrice, symbol, time: Date.now() }, ...f]);
  }

  return (
    <aside className="ptn-order">
      <h3>Order</h3>
      <div className="ptn-field">
        <label>Order Type</label>
        <div className="ptn-toggle"><button className="active">Market</button><button disabled>Limit</button></div>
      </div>
      <div className="ptn-field">
        <label>Quantity</label>
        <input type="number" value={qty} min={1} onChange={e => setQty(Number(e.target.value || 0))} />
      </div>
      <div className="ptn-summary">
        <div><span>Symbol</span><strong>{symbol}</strong></div>
        <div><span>Price</span><strong>${lastPrice.toFixed(2)}</strong></div>
        <div><span>Est. Total</span><strong>${(qty * lastPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></div>
      </div>
      <div className="ptn-actions">
        <button className="buy" onClick={() => submit('BUY')}>BUY</button>
        <button className="sell" onClick={() => submit('SELL')}>SELL</button>
      </div>

      <div className="ptn-pos">
        <h4>Position</h4>
        <div className="ptn-posrow"><span>Qty</span><strong>{position.qty}</strong></div>
        <div className="ptn-posrow"><span>Avg</span><strong>{position.avg ? position.avg.toFixed(2) : '-'}</strong></div>
        <div className={`ptn-posrow ${position.unreal >= 0 ? 'green' : 'red'}`}><span>Unrealized</span><strong>${position.unreal.toFixed(2)}</strong></div>
      </div>
    </aside>
  );
}

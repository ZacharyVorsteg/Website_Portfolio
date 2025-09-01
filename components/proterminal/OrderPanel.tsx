'use client';
import React, { useMemo, useState, useCallback } from 'react';

type Fill = { 
  id: string;
  side: 'BUY' | 'SELL'; 
  qty: number; 
  price: number; 
  symbol: string; 
  time: number;
  commission: number;
};

type Position = {
  symbol: string;
  qty: number;
  avgCost: number;
  marketValue: number;
  unrealizedPnL: number;
  realizedPnL: number;
};

type Props = { 
  symbol: string; 
  lastPrice: number; 
};

export default function OrderPanel({ symbol, lastPrice }: Props) {
  const [qty, setQty] = useState(100);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState(lastPrice);
  const [fills, setFills] = useState<Fill[]>([]);
  const [buyingPower, setBuyingPower] = useState(100000); // Start with $100k
  const [positions, setPositions] = useState<Record<string, Position>>({});

  // Calculate position for current symbol
  const position = useMemo(() => {
    const pos = positions[symbol];
    if (!pos) {
      return { qty: 0, avgCost: 0, unrealizedPnL: 0, realizedPnL: 0, marketValue: 0 };
    }
    
    const marketValue = pos.qty * lastPrice;
    const costBasis = pos.qty * pos.avgCost;
    const unrealizedPnL = marketValue - costBasis;
    
    return {
      ...pos,
      marketValue,
      unrealizedPnL
    };
  }, [positions, symbol, lastPrice]);

  const handleOrder = useCallback((side: 'BUY' | 'SELL') => {
    const executionPrice = orderType === 'market' ? lastPrice : limitPrice;
    const orderValue = qty * executionPrice;
    const commission = Math.max(0.65, qty * 0.005); // $0.65 min or $0.005/share
    
    // Check buying power for buys
    if (side === 'BUY' && orderValue + commission > buyingPower) {
      alert('Insufficient buying power!');
      return;
    }
    
    // Check position for sells
    if (side === 'SELL' && qty > position.qty) {
      alert(`Insufficient shares! You have ${position.qty} shares.`);
      return;
    }
    
    // Create fill
    const fill: Fill = {
      id: `${Date.now()}-${Math.random()}`,
      side,
      qty,
      price: executionPrice,
      symbol,
      time: Date.now(),
      commission
    };
    
    setFills(prev => [fill, ...prev].slice(0, 100)); // Keep last 100 fills
    
    // Update position
    setPositions(prev => {
      const currentPos = prev[symbol] || { 
        symbol, 
        qty: 0, 
        avgCost: 0, 
        marketValue: 0, 
        unrealizedPnL: 0, 
        realizedPnL: 0 
      };
      
      let newPos = { ...currentPos };
      
      if (side === 'BUY') {
        // Calculate new average cost
        const totalCost = (currentPos.qty * currentPos.avgCost) + (qty * executionPrice);
        const totalQty = currentPos.qty + qty;
        newPos.qty = totalQty;
        newPos.avgCost = totalQty > 0 ? totalCost / totalQty : 0;
        
        // Update buying power
        setBuyingPower(prev => prev - orderValue - commission);
      } else {
        // SELL
        const soldQty = Math.min(qty, currentPos.qty);
        const realizedPnL = soldQty * (executionPrice - currentPos.avgCost);
        
        newPos.qty = currentPos.qty - soldQty;
        newPos.realizedPnL = currentPos.realizedPnL + realizedPnL;
        
        if (newPos.qty === 0) {
          newPos.avgCost = 0;
        }
        
        // Update buying power
        setBuyingPower(prev => prev + orderValue - commission);
      }
      
      if (newPos.qty === 0) {
        const { [symbol]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [symbol]: newPos };
    });
    
    // Show confirmation
    const message = `${side} ${qty} ${symbol} @ $${executionPrice.toFixed(2)}\nCommission: $${commission.toFixed(2)}\nTotal: $${(orderValue + (side === 'BUY' ? commission : -commission)).toFixed(2)}`;
    console.log(message);
  }, [orderType, limitPrice, lastPrice, qty, symbol, position.qty, buyingPower]);

  const totalValue = useMemo(() => {
    const positionsValue = Object.values(positions).reduce((sum, pos) => 
      sum + (pos.qty * lastPrice), 0
    );
    return buyingPower + positionsValue;
  }, [positions, buyingPower, lastPrice]);

  const totalPnL = useMemo(() => {
    return Object.values(positions).reduce((sum, pos) => {
      const marketValue = pos.qty * lastPrice;
      const costBasis = pos.qty * pos.avgCost;
      return sum + (marketValue - costBasis) + pos.realizedPnL;
    }, 0);
  }, [positions, lastPrice]);

  return (
    <aside className="ptn-order">
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Account Value</span>
          <strong>${totalValue.toFixed(2)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Buying Power</span>
          <strong>${buyingPower.toFixed(2)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Total P&L</span>
          <strong className={totalPnL >= 0 ? 'green' : 'red'}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
          </strong>
        </div>
      </div>

      <h3>Order Entry</h3>
      <div className="ptn-field">
        <label>Order Type</label>
        <div className="ptn-toggle">
          <button 
            className={orderType === 'market' ? 'active' : ''} 
            onClick={() => setOrderType('market')}
          >
            Market
          </button>
          <button 
            className={orderType === 'limit' ? 'active' : ''} 
            onClick={() => setOrderType('limit')}
          >
            Limit
          </button>
        </div>
      </div>
      
      <div className="ptn-field">
        <label>Quantity</label>
        <input 
          type="number" 
          value={qty} 
          min={1} 
          onChange={e => setQty(Math.max(1, Number(e.target.value || 1)))} 
        />
      </div>
      
      {orderType === 'limit' && (
        <div className="ptn-field">
          <label>Limit Price</label>
          <input 
            type="number" 
            value={limitPrice.toFixed(2)} 
            step={0.01}
            onChange={e => setLimitPrice(Number(e.target.value || 0))} 
          />
        </div>
      )}
      
      <div className="ptn-summary">
        <div><span>Symbol</span><strong>{symbol}</strong></div>
        <div><span>Price</span><strong>${(orderType === 'market' ? lastPrice : limitPrice).toFixed(2)}</strong></div>
        <div><span>Total</span><strong>${(qty * (orderType === 'market' ? lastPrice : limitPrice)).toFixed(2)}</strong></div>
      </div>
      
      <div className="ptn-actions">
        <button className="buy" onClick={() => handleOrder('BUY')}>BUY</button>
        <button className="sell" onClick={() => handleOrder('SELL')}>SELL</button>
      </div>

      <div className="ptn-pos">
        <h4>Position in {symbol}</h4>
        <div className="ptn-posrow">
          <span>Shares</span>
          <strong>{position.qty}</strong>
        </div>
        <div className="ptn-posrow">
          <span>Avg Cost</span>
          <strong>{position.qty > 0 ? `$${position.avgCost.toFixed(2)}` : '-'}</strong>
        </div>
        <div className="ptn-posrow">
          <span>Market Value</span>
          <strong>{position.qty > 0 ? `$${position.marketValue.toFixed(2)}` : '-'}</strong>
        </div>
        <div className={`ptn-posrow ${position.unrealizedPnL >= 0 ? 'green' : 'red'}`}>
          <span>Unrealized P&L</span>
          <strong>
            {position.qty > 0 ? 
              `${position.unrealizedPnL >= 0 ? '+' : ''}$${position.unrealizedPnL.toFixed(2)}` : 
              '-'
            }
          </strong>
        </div>
      </div>

      {fills.length > 0 && (
        <div style={{ marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
          <h4 style={{ marginBottom: '8px', fontSize: '12px' }}>Recent Fills</h4>
          <div style={{ maxHeight: '120px', overflowY: 'auto', fontSize: '11px' }}>
            {fills.slice(0, 5).map(fill => (
              <div key={fill.id} style={{ 
                padding: '4px', 
                marginBottom: '4px', 
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '4px'
              }}>
                <span className={fill.side === 'BUY' ? 'green' : 'red'}>
                  {fill.side}
                </span>
                {' '}
                {fill.qty} {fill.symbol} @ ${fill.price.toFixed(2)}
                <div style={{ color: '#6b7280', fontSize: '10px' }}>
                  {new Date(fill.time).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
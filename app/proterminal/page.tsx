'use client';

import React, { useState, useEffect, useRef } from 'react';

// Simple chart component using Canvas API
function SimpleChart({ data }: { data: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0b1020';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (data.length === 0) return;

    // Find min and max for scaling
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = (canvas.height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw the line chart
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = (canvas.width / (data.length - 1)) * index;
      const y = canvas.height - ((value - min) / range) * canvas.height * 0.8 - canvas.height * 0.1;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Draw candlestick-like bars
    data.forEach((value, index) => {
      if (index === 0) return;
      
      const x = (canvas.width / (data.length - 1)) * index;
      const prevValue = data[index - 1];
      const y = canvas.height - ((value - min) / range) * canvas.height * 0.8 - canvas.height * 0.1;
      const prevY = canvas.height - ((prevValue - min) / range) * canvas.height * 0.8 - canvas.height * 0.1;
      
      // Color based on direction
      ctx.fillStyle = value > prevValue ? '#22c55e' : '#ef4444';
      ctx.fillRect(x - 2, Math.min(y, prevY), 4, Math.abs(y - prevY) || 2);
    });
  }, [data]);

  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={400}
      style={{
        width: '100%',
        height: '100%',
        background: '#0b1020',
        borderRadius: '8px',
      }}
    />
  );
}

export default function ProTerminalPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [priceData, setPriceData] = useState<number[]>([]);
  const [prices, setPrices] = useState({
    AAPL: 182.52,
    MSFT: 378.85,
    GOOGL: 142.65,
    NVDA: 522.48,
    TSLA: 238.45,
    AMZN: 195.72,
    META: 261.16,
    JPM: 436.78,
    V: 225.76,
    WMT: 480.97,
  });
  const [positions, setPositions] = useState<any[]>([]);
  const [buyingPower, setBuyingPower] = useState(100000);
  const [orderQty, setOrderQty] = useState(100);

  // Generate initial price data
  useEffect(() => {
    const basePrice = prices[selectedSymbol as keyof typeof prices];
    const data: number[] = [];
    for (let i = 0; i < 50; i++) {
      const variation = (Math.random() - 0.5) * 2;
      data.push(basePrice + variation);
    }
    setPriceData(data);
  }, [selectedSymbol]);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update prices
      setPrices(prev => {
        const newPrices = { ...prev };
        Object.keys(newPrices).forEach(symbol => {
          const key = symbol as keyof typeof newPrices;
          const change = (Math.random() - 0.5) * 0.5;
          newPrices[key] = Math.max(1, newPrices[key] + change);
        });
        return newPrices;
      });

      // Update chart data
      setPriceData(prev => {
        if (prev.length === 0) return prev;
        const newData = [...prev.slice(1)];
        const lastPrice = newData[newData.length - 1] || prices[selectedSymbol as keyof typeof prices];
        const variation = (Math.random() - 0.5) * 1;
        newData.push(lastPrice + variation);
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSymbol, prices]);

  const handleBuy = () => {
    const price = prices[selectedSymbol as keyof typeof prices];
    const total = price * orderQty;
    
    if (total > buyingPower) {
      alert('Insufficient buying power!');
      return;
    }

    setBuyingPower(prev => prev - total);
    setPositions(prev => [...prev, {
      symbol: selectedSymbol,
      qty: orderQty,
      price: price,
      type: 'BUY',
      time: new Date().toLocaleTimeString()
    }]);
  };

  const handleSell = () => {
    const price = prices[selectedSymbol as keyof typeof prices];
    const total = price * orderQty;
    
    setBuyingPower(prev => prev + total);
    setPositions(prev => [...prev, {
      symbol: selectedSymbol,
      qty: orderQty,
      price: price,
      type: 'SELL',
      time: new Date().toLocaleTimeString()
    }]);
  };

  const currentPrice = prices[selectedSymbol as keyof typeof prices];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e1a',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0 }}>ProTerminal</h1>
          <span style={{ color: '#22c55e', fontSize: '12px' }}>● LIVE TRADING</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Account Value</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>${(buyingPower + positions.reduce((sum, p) => sum + (p.type === 'BUY' ? p.qty * p.price : 0), 0)).toFixed(2)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
        {/* Watchlist */}
        <div style={{
          width: '250px',
          background: '#0f1623',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          overflowY: 'auto',
        }}>
          <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <input 
              type="text" 
              placeholder="Search symbols..."
              style={{
                width: '100%',
                padding: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: '#fff',
              }}
            />
          </div>
          {Object.entries(prices).map(([symbol, price]) => (
            <div 
              key={symbol}
              onClick={() => setSelectedSymbol(symbol)}
              style={{
                padding: '12px 15px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                background: selectedSymbol === symbol ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{symbol}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>${price.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Symbol Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '32px', margin: 0 }}>{selectedSymbol}</h2>
                <div style={{ fontSize: '24px', marginTop: '5px' }}>${currentPrice.toFixed(2)}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['1m', '5m', '15m', '1H', 'D'].map(interval => (
                  <button
                    key={interval}
                    style={{
                      padding: '8px 16px',
                      background: interval === '1m' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    {interval}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div style={{ flex: 1, padding: '20px' }}>
            <SimpleChart data={priceData} />
          </div>

          {/* Order Panel */}
          <div style={{
            padding: '20px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: '#0f1623',
          }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#6b7280' }}>
                  Quantity
                </label>
                <input
                  type="number"
                  value={orderQty}
                  onChange={(e) => setOrderQty(Number(e.target.value))}
                  style={{
                    padding: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#fff',
                    width: '100px',
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  ${(currentPrice * orderQty).toFixed(2)}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleBuy}
                  style={{
                    padding: '12px 32px',
                    background: '#22c55e',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  BUY
                </button>
                <button
                  onClick={handleSell}
                  style={{
                    padding: '12px 32px',
                    background: '#ef4444',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  SELL
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Positions */}
        <div style={{
          width: '300px',
          background: '#0f1623',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          padding: '20px',
          overflowY: 'auto',
        }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Positions</h3>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#6b7280' }}>Buying Power</span>
              <span>${buyingPower.toFixed(2)}</span>
            </div>
          </div>
          <h4 style={{ margin: '20px 0 10px 0', fontSize: '14px' }}>Recent Orders</h4>
          {positions.slice(-5).reverse().map((position, index) => (
            <div key={index} style={{
              padding: '10px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '4px',
              marginBottom: '8px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: position.type === 'BUY' ? '#22c55e' : '#ef4444' }}>
                  {position.type}
                </span>
                <span>{position.symbol}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                {position.qty} @ ${position.price.toFixed(2)}
              </div>
              <div style={{ fontSize: '10px', color: '#6b7280' }}>
                {position.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

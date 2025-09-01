'use client';
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi, IChartApi } from 'lightweight-charts';
import type { Candle, Interval } from '@/lib/proterminal/sim';

type Props = {
  data: Candle[];
  interval: Interval;
  onReady?: (apis: { candle: ISeriesApi<'Candlestick'> }) => void;
};

export default function PriceChart({ data, interval, onReady }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const candleRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeRef = useRef<any>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (!ref.current) return;
    
    const chart = createChart(ref.current, {
      autoSize: true,
      layout: { 
        background: { type: ColorType.Solid, color: '#0b1020' }, 
        textColor: '#c7d2fe' 
      },
      grid: { 
        vertLines: { color: 'rgba(255,255,255,0.04)' }, 
        horzLines: { color: 'rgba(255,255,255,0.04)' } 
      },
      rightPriceScale: { 
        borderColor: 'rgba(255,255,255,0.08)',
        autoScale: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      timeScale: { 
        borderColor: 'rgba(255,255,255,0.08)', 
        secondsVisible: interval === '1m',
        timeVisible: true,
        rightOffset: 5,
        minBarSpacing: 0.5,
      },
      crosshair: { 
        mode: 0,
        vertLine: {
          width: 1,
          color: 'rgba(255,255,255,0.2)',
          style: 2,
        },
        horzLine: {
          width: 1,
          color: 'rgba(255,255,255,0.2)',
          style: 2,
        },
      },
    });

    const candle = (chart as any).addCandlestickSeries({
      upColor: '#22c55e', 
      downColor: '#ef4444', 
      borderVisible: false, 
      wickUpColor: '#22c55e', 
      wickDownColor: '#ef4444',
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });
    
    const volume = (chart as any).addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '', 
      color: 'rgba(148,163,184,0.3)',
      scaleMargins: { 
        top: 0.85, 
        bottom: 0 
      },
    });

    // Add a line for current price
    const priceLine = candle.createPriceLine({
      price: 0,
      color: '#3b82f6',
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: 'Last',
    });

    candleRef.current = candle;
    volumeRef.current = volume;
    chartRef.current = chart;

    onReady?.({ candle });

    return () => { 
      chart.remove(); 
      candleRef.current = null; 
      volumeRef.current = null; 
      chartRef.current = null; 
    };
  }, [interval]);

  useEffect(() => {
    if (!candleRef.current || !volumeRef.current || !data.length) return;
    
    const now = Date.now();
    const shouldFullUpdate = now - lastUpdateRef.current > 5000; // Full update every 5s
    
    if (shouldFullUpdate) {
      // Full data update
      candleRef.current.setData(data.map(d => ({ 
        time: d.time as any, 
        open: d.open, 
        high: d.high, 
        low: d.low, 
        close: d.close 
      })));
      
      volumeRef.current.setData(data.map(d => ({ 
        time: d.time as any, 
        value: d.volume, 
        color: d.close >= d.open ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)' 
      })));
      
      lastUpdateRef.current = now;
    } else {
      // Just update the last candle for smooth real-time updates
      const lastCandle = data[data.length - 1];
      if (lastCandle) {
        candleRef.current.update({
          time: lastCandle.time as any,
          open: lastCandle.open,
          high: lastCandle.high,
          low: lastCandle.low,
          close: lastCandle.close
        });
        
        volumeRef.current.update({
          time: lastCandle.time as any,
          value: lastCandle.volume,
          color: lastCandle.close >= lastCandle.open ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'
        });
      }
    }
    
    // Update price line
    if (data.length > 0 && candleRef.current) {
      const lastPrice = data[data.length - 1].close;
      try {
        const priceLine = (candleRef.current as any).createPriceLine({
          price: lastPrice,
          color: data[data.length - 1].close >= data[data.length - 1].open ? '#22c55e' : '#ef4444',
          lineWidth: 1,
          lineStyle: 0,
          axisLabelVisible: true,
          title: '',
        });
        
        // Remove the price line after a moment to avoid clutter
        setTimeout(() => {
          try {
            (candleRef.current as any).removePriceLine(priceLine);
          } catch (e) {
            // Ignore if already removed
          }
        }, 100);
      } catch (e) {
        // Ignore price line errors
      }
    }
    
    // Auto-scroll to the latest data
    if (chartRef.current) {
      chartRef.current.timeScale().scrollToPosition(2, false);
    }
  }, [data]);

  return (
    <div ref={ref} style={{ 
      width: '100%', 
      height: '62vh',
      background: '#0b1020',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.06)'
    }} />
  );
}
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, IChartApi, Time } from 'lightweight-charts';
import type { Candle, Interval } from '@/lib/proterminal/sim';

type Props = {
  data: Candle[];
  interval: Interval;
  onReady?: (apis: { candle: ISeriesApi<'Candlestick'> }) => void;
};

export default function PriceChart({ data, interval, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current) return;

    console.log('Initializing chart...');
    
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { type: ColorType.Solid, color: '#0b1020' },
        textColor: '#c7d2fe',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.04)' },
        horzLines: { color: 'rgba(255,255,255,0.04)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.08)',
        autoScale: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.25,
        },
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.08)',
        timeVisible: true,
        secondsVisible: interval === '1m',
        rightOffset: 5,
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

    const candleSeries = (chart as any).addCandlestickSeries({
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

    const volumeSeries = (chart as any).addHistogramSeries({
      color: 'rgba(148,163,184,0.3)',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    
    setIsInitialized(true);
    console.log('Chart initialized successfully');
    
    onReady?.({ candle: candleSeries });

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && chart) {
        chart.applyOptions({ 
          width: containerRef.current.clientWidth 
        });
      }
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      setIsInitialized(false);
    };
  }, []); // Only run once on mount

  // Update data
  useEffect(() => {
    if (!isInitialized || !candleSeriesRef.current || !volumeSeriesRef.current || !data.length) {
      console.log('Skipping data update:', { isInitialized, hasData: data.length > 0 });
      return;
    }

    console.log('Updating chart with', data.length, 'candles');

    try {
      // Convert data to chart format
      const candleData = data.map(d => ({
        time: d.time as Time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));

      const volumeData = data.map(d => ({
        time: d.time as Time,
        value: d.volume,
        color: d.close >= d.open ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
      }));

      // Update series
      candleSeriesRef.current.setData(candleData);
      volumeSeriesRef.current.setData(volumeData);

      // Auto-fit content
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }

      console.log('Chart updated successfully');
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }, [data, isInitialized]);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '500px',
        background: '#0b1020',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
      }}
    >
      {!isInitialized && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#6b7280',
        }}>
          Loading chart...
        </div>
      )}
    </div>
  );
}
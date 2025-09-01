'use client';
import React, { useEffect, useRef } from 'react';
import type { Candle, Interval } from '@/lib/proterminal/sim';

type Props = {
  data: Candle[];
  interval: Interval;
  onReady?: (apis: { candle: any }) => void;
};

export default function PriceChart({ data, interval, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically import lightweight-charts to avoid SSR issues
    import('lightweight-charts').then((module) => {
      const { createChart, ColorType } = module;
      
      console.log('Creating chart...');
      const chart = createChart(containerRef.current!, {
        width: containerRef.current!.clientWidth,
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

      // Use the correct API for v5
      const candleSeries = chart.addCandlestickSeries({
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

      const volumeSeries = chart.addHistogramSeries({
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
      
      // Set initial data if available
      if (data && data.length > 0) {
        const candleData = data.map(d => ({
          time: d.time as any,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));

        const volumeData = data.map(d => ({
          time: d.time as any,
          value: d.volume,
          color: d.close >= d.open ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
        }));

        candleSeries.setData(candleData);
        volumeSeries.setData(volumeData);
        chart.timeScale().fitContent();
      }
      
      console.log('Chart initialized');
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

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }).catch(err => {
      console.error('Failed to load lightweight-charts:', err);
    });
  }, []); // Only run once on mount

  // Update data when it changes
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || !data || data.length === 0) {
      return;
    }

    console.log('Updating chart data:', data.length, 'candles');

    try {
      const candleData = data.map(d => ({
        time: d.time as any,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));

      const volumeData = data.map(d => ({
        time: d.time as any,
        value: d.volume,
        color: d.close >= d.open ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
      }));

      candleSeriesRef.current.setData(candleData);
      volumeSeriesRef.current.setData(volumeData);
      
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }, [data]);

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
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#6b7280',
        fontSize: '14px',
        display: chartRef.current ? 'none' : 'block',
      }}>
        Loading chart...
      </div>
    </div>
  );
}
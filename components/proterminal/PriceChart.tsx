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

  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, {
      autoSize: true,
      layout: { background: { type: ColorType.Solid, color: '#0b1020' }, textColor: '#c7d2fe' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.04)' }, horzLines: { color: 'rgba(255,255,255,0.04)' } },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.08)' },
      timeScale: { borderColor: 'rgba(255,255,255,0.08)', secondsVisible: interval === '1m' },
      crosshair: { mode: 0 },
    });

    const candle = (chart as any).addCandlestickSeries({
      upColor: '#22c55e', downColor: '#ef4444', borderVisible: false, wickUpColor: '#22c55e', wickDownColor: '#ef4444',
    });
    const volume = (chart as any).addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '', color: 'rgba(148,163,184,0.6)', scaleMargins: { top: 0.8, bottom: 0 },
    });

    candleRef.current = candle;
    volumeRef.current = volume;
    chartRef.current = chart;

    onReady?.({ candle });

    return () => { chart.remove(); candleRef.current = null; volumeRef.current = null; chartRef.current = null; };
  }, []);

  useEffect(() => {
    if (!candleRef.current || !volumeRef.current) return;
    candleRef.current.setData(data.map(d => ({ time: d.time as any, open: d.open, high: d.high, low: d.low, close: d.close })));
    volumeRef.current.setData(data.map(d => ({ time: d.time as any, value: d.volume, color: d.close >= d.open ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.6)' })));
  }, [data, interval]);

  return <div ref={ref} style={{ width: '100%', height: '62vh' }} />;
}

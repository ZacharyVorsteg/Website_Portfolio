export type Candle = {
  time: number;  // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Interval = '1m' | '5m' | '15m' | '1H' | 'D' | 'W';

export const INTERVAL_SEC: Record<Interval, number> = {
  '1m': 60, '5m': 300, '15m': 900, '1H': 3600, 'D': 86400, 'W': 604800,
};

export const DEFAULT_TICKERS: Record<string, number> = {
  AAPL: 182.52, MSFT: 378.85, GOOGL: 142.65, NVDA: 522.48, TSLA: 238.45,
  AMZN: 195.72, META: 261.16, JPM: 436.78, V: 225.76, WMT: 480.97,
};

export function seedFromString(s: string) {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h >>> 0) || 1;
}

// PRNG + Gaussian
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function randn(rand: () => number) {
  let u = 0, v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

type GenOpts = {
  bars: number;
  interval: Interval;
  basePrice: number;
  dailyVolPct?: number;      // ~2 typical
  seed?: string;
  marketHoursOnly?: boolean; // intraday U-shape + 9:30-16:00 ET
};

function alignToInterval(nowSec: number, stepSec: number) {
  return Math.floor(nowSec / stepSec) * stepSec;
}

export function generateSeries(symbol: string, opts: GenOpts): Candle[] {
  const { bars, interval, basePrice, dailyVolPct = 2, seed = symbol + '-' + interval, marketHoursOnly = true } = opts;
  const step = INTERVAL_SEC[interval];
  const stepsPerDay = Math.max(1, Math.floor(86400 / step));
  const sigmaDaily = dailyVolPct / 100;
  const sigmaStep = sigmaDaily / Math.sqrt(stepsPerDay);
  const drift = 0.00002;

  const r = mulberry32(seedFromString(seed));
  const now = Math.floor(Date.now() / 1000);
  let t = alignToInterval(now, step) - (bars - 1) * step;
  const isIntraday = step < 86400;

  function isMarketTime(ts: number) {
    if (!marketHoursOnly || !isIntraday) return true;
    const d = new Date(ts * 1000);
    const day = d.getUTCDay(); // 0 Sun
    const mins = d.getUTCHours() * 60 + d.getUTCMinutes();
    const open = 13 * 60 + 30; // 9:30 ET ~ 13:30 UTC
    const close = 20 * 60;     // 16:00 ET ~ 20:00 UTC
    return day >= 1 && day <= 5 && mins >= open && mins <= close;
  }

  const out: Candle[] = [];
  let prevClose = basePrice;

  for (let i = 0; i < bars; i++) {
    if (isIntraday && marketHoursOnly) {
      let guard = 0;
      while (!isMarketTime(t) && guard++ < 5000) t += step;
    }
    const shock = sigmaStep * randn(r);
    const close = Math.max(0.01, prevClose * (1 + drift + shock));
    const open = prevClose;
    const spread = Math.max(0.001, 0.0025 * open);
    const high = Math.max(open, close) + spread * (0.3 + r());
    const low  = Math.min(open, close) - spread * (0.3 + r());

    let volBase = Math.max(1, Math.round(1_000_000 / stepsPerDay));
    let uShape = 1;
    if (isIntraday) {
      const p = (i % stepsPerDay) / stepsPerDay;
      uShape = 0.7 + 0.6 * Math.cos((p - 0.5) * Math.PI * 2); // higher at open/close
    }
    const volume = Math.round(volBase * uShape * (0.7 + 0.6 * r()));

    out.push({ time: t, open, high, low, close, volume });
    prevClose = close;
    t += step;
  }
  return out;
}

export function nextTickFromLast(last: Candle, interval: Interval, volPct = 2, seed?: string): Candle {
  const step = INTERVAL_SEC[interval];
  const r = mulberry32(seedFromString((seed ?? '') + last.time));
  const sigmaStep = (volPct/100) / Math.sqrt(Math.max(1, Math.floor(86400 / step)));
  const drift = 0.00002;
  const close = Math.max(0.01, last.close * (1 + drift + sigmaStep * randn(r)));
  const open = last.close;
  const spread = Math.max(0.001, 0.0025 * open);
  const high = Math.max(open, close) + spread * (0.3 + r());
  const low  = Math.min(open, close) - spread * (0.3 + r());
  const volume = Math.round(last.volume * (0.8 + 0.4 * r()));
  return { time: last.time + step, open, high, low, close, volume };
}

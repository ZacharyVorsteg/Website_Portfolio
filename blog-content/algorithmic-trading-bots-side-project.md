---
title: "How I Built 54 Trading Bots as a Side Project"
description: "I run 54 trading bots across 5 markets. Here's what 3 years taught me about strategy decay, slippage, correlated drawdowns, and what actually breaks."
keywords: building algorithmic trading bots as a side project, algorithmic trading bots, algo trading side project, trading bot strategy decay, correlated drawdowns trading, backtest vs live trading, retail algorithmic trading, automated trading systems, algorithmic trading what breaks, solo founder trading bots
date: 2026-03-20
pillar: Automation & Trading
speakable: "Zachary Vorsteg runs 54 algorithmic trading bots across equities, forex, crypto, and prediction markets as a side project. The post covers the backtest-to-live performance gap, strategy decay half-lives by type, correlated drawdowns during market stress, broker API reliability issues, and a concrete framework for deciding when to kill a strategy versus iterate on it."
---

Fifty-four algorithmic trading bots, five markets. Equities on Schwab. Forex through OANDA. On-chain crypto via Solana. Prediction markets on Polymarket and Kalshi. Plus a set of cross-market arbitrage strategies constantly hunting pricing inefficiencies between all of them.

I've written about [the infrastructure behind this system](/blog/my-solo-founder-automation-stack/) — Python scripts, the launchctl job scheduler, the $8/month hosting cost. What follows isn't about infrastructure. It's about the trading layer itself: which strategies actually work, which ones decay (and how fast), what slippage looks like when your backtest hits production, and how I decide when to kill a bot versus pour more engineering hours into saving it.

Mordor Intelligence pegs the algorithmic trading market at $20.23 billion in 2026, heading for $29.54 billion by 2031 at a 7.87% CAGR (compound annual growth rate). QuantConnect alone has 478,000 quants and 375,000+ live strategies deployed since 2012. Setup content is everywhere — backtesting frameworks, API integration walkthroughs, "build your first bot" tutorials. What's practically nonexistent is honest writing about what happens after month three, when your edge starts thinning and the broker API goes dark during a volatility spike.

That's this post.

## What I Actually Trade: Five Markets, 54 Strategies

The 54 bots break into three tiers. Five core strategies run continuously, holding positions across equities, forex, crypto, and prediction markets. Forty-five-plus arbitrage bots sit dormant until specific conditions trigger — carry trades, calendar spreads, cross-index discrepancies, DEX/CEX price gaps. Four infrastructure bots handle health checks, logging, reconciliation, and daily reporting (covered in [my automation stack post](/blog/my-solo-founder-automation-stack/) — won't rehash them here).

One insight took me a full year to properly internalize: "54 bots" doesn't mean 54 independent revenue streams. It means 54 expressions of maybe 8-10 distinct strategy types, each tuned for a specific market, pair, or timeframe. When one expression fails, I learn something about the underlying type. When a strategy type fails across all its expressions simultaneously? Kill signal.

Each market operates on fundamentally different rules:

| Market | Daily Volume | Algo Share | My Observed Slippage | Key Challenge |
|--------|-------------|-----------|---------------------|---------------|
| **US Equities** (Schwab) | ~$500B/day | 60-73% algorithmic (JPMorgan, 2023) | 3-8 bps | Crowded — alpha decays fastest |
| **Forex** (OANDA) | $9.6T/day (BIS, April 2025) | ~92% algorithmic (Wall Street Journal) | 5-15 bps, spikes to 50+ on stops | Leverage amplifies every mistake |
| **Crypto** (Solana DEX) | Varies wildly | 70-80% automated (2025 industry est.) | 20-100+ bps on-chain | Gas fees, MEV, front-running |
| **Prediction Markets** (Kalshi/Polymarket) | Kalshi: $50B annualized, 2025 (CoinDesk) | Growing fast | 10-30 bps | Thin liquidity, binary outcomes |
| **Cross-Market Arb** | N/A | Custom | Varies by pair | Timing synchronization across APIs |

Slippage is measured in basis points (bps — one-hundredth of a percentage point, so 10 bps = 0.10%). That table represents three years of logged execution data, not theoretical estimates.

Kalshi's trajectory tells the whole story about opportunity windows in emerging markets. From $300 million in 2024 to $50 billion annualized in 2025, according to CoinDesk — 167x growth. Early algo traders on the platform found inefficiencies practically everywhere. Already narrowing, though. Forex sits at the opposite extreme: $9.6 trillion in daily turnover (BIS Triennial Central Bank Survey, April 2025), decades of algorithmic warfare, brutally efficient pricing, razor-thin margins. My forex bots decay fastest of anything in the entire portfolio.

## The Backtest-to-Live Gap

Every strategy looks phenomenal in backtesting. Every. Single. One. Then you go live and watch it unravel. The gap between backtest and production performance is the most under-discussed problem in algorithmic trading — and the primary reason most retail quants quit inside six months.

Suhonen, Lennkh, and Perez studied 215 alternative beta strategies (*Journal of Portfolio Management*, 2017) and found a **median 73% deterioration in Sharpe ratios** from backtest to live. Not a haircut. Nearly three-quarters of the edge, gone.

Bailey et al. went further in the *Journal of Computational Finance* (2015): **54.9% of backtested strategies are false discoveries** — profitable only because they overfit historical noise, not because they identified a genuine signal.

### Why the Gap Exists

Three forces eat your backtest returns:

**Slippage.** Backtests fill at the exact price you specified. Production? Not even close. My observed slippage runs from 3-8 basis points on liquid US equities to 100+ basis points on illiquid Solana pairs. A strategy backtesting at 15% annual return drops to 8% after real-world slippage — and that's before the other two forces pile on.

**Market impact.** Your orders move the market. Small orders on liquid pairs have negligible impact. Larger positions on thinner books, though, degrade your own fill price, and it compounds with every additional bot chasing a similar signal.

**Regime changes.** Markets aren't stationary — a fact every quant knows intellectually and then forgets in practice. A mean-reversion strategy calibrated on 2023 volatility underperforms the moment the regime shifts. Your backtest assumed one environment. Reality delivered several.

So how do I calibrate expectations? I treat backtested Sharpe ratios — the ratio of a strategy's excess return to its volatility, where higher means better risk-adjusted performance — as a ceiling, never an estimate. Backtest at Sharpe 2.0? Expect 0.5-0.7 live. Backtest at 1.0? Probably won't survive production at all. Three years of live data talking, not theory.

## Strategy Decay: Everything Has a Half-Life

Strategies don't fail overnight. They decay — edge eroding steadily as more participants discover similar signals, as market microstructure evolves, as correlations quietly shift underneath you.

How fast? Depends on what you're running:

- **High-frequency patterns:** Days to weeks
- **Momentum signals:** 3-6 months
- **Swing/position systems:** 6-18 months
- **Macro/fundamental strategies:** 1-3 years

Maven Securities analyzed 15 years of equity data and put a concrete number on it: alpha decay — the erosion of excess returns over a benchmark — costs **5.6% annualized in US equities**, rising at 36 basis points per year (2024). More participants, faster data, better tooling. Every edge is getting compressed.

### The Decay Pattern I Watch For

New strategy launches. Performs well for 4-8 weeks. Then: a slow, grinding decline. Not a cliff — a gradient. Daily returns shrink. Win rate holds steady but average win size drops. Signal's still there, just whispering instead of shouting. By month six, transaction costs eat most of whatever edge remains.

Which strategies survive the longest? They share one trait: exploiting structural inefficiencies rather than statistical patterns. A carry trade between two forex pairs works as long as the interest rate differential exists — that's monetary policy driving returns, not a fleeting pattern that gets arbitraged away the moment enough people spot it. Statistical patterns in price data attract competition the instant they're profitable enough to notice.

Across 54 bots, I'm constantly rotating. Killing what's decayed past its risk threshold, deploying new variants. The strategies are disposable. The evaluation framework is the real asset.

## Correlated Drawdowns: When All 54 Bots Lose at Once

One strategy failing doesn't scare me. All of them failing simultaneously? That's the nightmare scenario.

The CBOE Implied Correlation Index — expected average correlation among the top 50 S&P 500 stocks — peaked at **105.93 on November 20, 2008** (CBOE Implied Correlation White Paper). Near-perfect correlation across stocks that are supposedly designed to diversify each other. Stress hits and investors dump everything indiscriminately — value, growth, small-cap, large-cap — correlations converging toward 1.0 in a matter of hours.

Diversification across strategies and markets — the entire foundation of my 54-bot portfolio — partially breaks down at precisely the moment I need it most.

### What This Actually Looks Like

March 2020. COVID panic. Every bot lost money on the same three days. Equity strategies stopped out. Forex carry trades unwound as safe-haven flows crushed the underlying pairs. Crypto collapsed alongside equities — so much for the "uncorrelated asset" narrative. My prediction market bots sat idle, starved of volume.

Recovery took two weeks. But those three days wiped out two months of accumulated gains across every strategy combined. No bots crashed. No APIs went down. Just pure strategy losses — every signal pointing the wrong direction at the same time.

### Mitigation, Not Elimination

You can't eliminate correlated drawdown risk. You manage it:

- **Position size limits:** No single bot risks more than 2% of total portfolio in a day
- **Cross-market caps:** Total crypto exposure is hard-capped regardless of how many bots want in
- **Volatility throttling:** VIX (the CBOE Volatility Index — Wall Street's primary gauge of expected 30-day market volatility) crosses 30, all bots cut position sizes 50%. Past 50, non-core bots pause entirely
- **Cash reserve:** 30% minimum stays uninvested. Always. Dry powder for the days when everything correlates to 1.0

## Broker APIs: The Infrastructure Nobody Warns You About

Every setup tutorial shows you how to authenticate with a broker API and place your first order. What gets skipped? What happens at 3:45 PM on a volatile Tuesday when the API returns something nobody bothered to document.

Broker infrastructure fails hardest during volatility spikes — which means it fails exactly when execution matters most. August 5, 2024: Dow drops over 1,000 points, and Charles Schwab goes dark for two-plus hours. Traders locked out of their own accounts. Fidelity and other major brokerages went down that same day.

### The API Reality I Wish Someone Had Published

| Feature | Schwab | OANDA | Alpaca |
|---------|--------|-------|--------|
| **Rate limit** | 120 orders/min | 120 requests/sec | 200 requests/min |
| **Auth method** | OAuth 2.0 — daily re-auth required | API key — persistent | API key — persistent |
| **Data streaming** | Limited | HTTP streaming (not WebSocket) | WebSocket |
| **Notable failure** | 2+ hour outage during 1,000-pt Dow drop (Aug 2024) | >0.5% slippage on stops reported | 2021 migration broke data feeds |
| **Biggest quirk** | OAuth token expires mid-session | No standard stop-limit for forex | Account downgrades without warning |

The single most maddening issue across every broker I've used: **authentication expiration during live trading.** Schwab requires daily OAuth re-authentication. Token expires mid-strategy? Bot can read market data but can't execute. I've watched a bot identify a perfect entry, log the signal with full confidence, and then just... sit there, helpless — because the auth token had died 45 minutes earlier.

```python
# Pre-flight auth check — runs before every trade cycle
def ensure_auth(client, token_expiry):
    buffer_minutes = 5
    if datetime.now() >= token_expiry - timedelta(minutes=buffer_minutes):
        client.refresh_token()
        log.info("Token refreshed proactively")
        return client.token_expiry
    return token_expiry
```

Every one of my bots calls something like this before every market interaction. Took three missed trades before I built it.

## What "Profitable" Actually Means Across 54 Strategies

People hear "54 trading bots" and picture 54 money printers. The reality is considerably messier.

Any given month: roughly 60% profitable, 25% flat or slightly negative, 15% actively losing money. The portfolio works because winners' gains exceed losers' losses — but only when position sizing and risk management hold firm. Without those guardrails? Ruin.

Chague, De-Losso, and Giovannetti (2020) tracked 1,500 highly active traders in Brazilian equity futures: **97% of those who traded 300+ days lost money**. Only 17 individuals earned above minimum wage after fees. Let that sink in. Seventeen people out of fifteen hundred.

Here's what separates a portfolio approach from single-strategy gambling:

**Diversification across strategy types.** Momentum and mean-reversion strategies are naturally anti-correlated in low-volatility environments. When momentum bleeds, mean-reversion often profits — and vice versa. Running both dampens portfolio volatility considerably.

**Diversification across markets.** Forex carry trades and Solana DEX arbitrage respond to completely different economic forces. A Fed rate decision moves forex but doesn't touch on-chain liquidity. An Ethereum upgrade shakes crypto but leaves prediction markets untouched. Partial decorrelation — not full, as March 2020 brutally demonstrated — but enough to smooth the equity curve most months.

**Rigorous position sizing.** No single strategy ever represents more than 5% of total capital. Most arb bots run at 1-2%. A strategy that goes spectacularly wrong costs me a bad week. Never a bad year.

**Diversification across strategy types.** Momentum and mean-reversion strategies are naturally anti-correlated in low-volatility environments. When momentum bleeds, mean-reversion often profits — and vice versa. Running both dampens portfolio volatility considerably.

**Diversification across markets.** Forex carry trades and Solana DEX arbitrage respond to completely different economic forces. A Fed rate decision moves forex but doesn't touch on-chain liquidity. An Ethereum upgrade shakes crypto but leaves prediction markets untouched. Partial decorrelation — not full, as March 2020 brutally demonstrated — but enough to smooth the equity curve most months.

**Rigorous position sizing.** No single strategy ever represents more than 5% of total capital. Most arb bots run at 1-2%. A strategy that goes spectacularly wrong costs me a bad week. Never a bad year.

The [financial modeling fundamentals](/blog/financial-modeling-fundamentals/) I use for evaluating strategy economics come from the same analytical framework I apply to deal analysis in my [commercial real estate practice](/blog/why-im-a-commercial-real-estate-broker-who-codes/) — NPV (net present value), risk-adjusted return, sensitivity analysis. Different asset class, same math.

## How I Decide to Kill a Strategy

When do you pull the plug? Kill too early, you abandon strategies going through perfectly normal drawdown periods. Kill too late, you bleed capital into a dead signal for weeks. I've made both mistakes — and the late kills cost more. Every time.

### My Kill Framework

Three metrics, rolling 30-day window:

1. **Rolling Sharpe ratio.** Below 0.3 for 30 consecutive days triggers review. Below 0.0 for 14 days triggers automatic pause.
2. **Win rate delta.** Compare trailing 30-day win rate against lifetime average. A drop exceeding 15 percentage points flags decay.
3. **Average trade P&L vs. cost.** If average profit falls below 2x average transaction cost (spread + slippage + fees), the strategy no longer covers its overhead.

```python
# Strategy health check — simplified version
def evaluate_strategy(trades_30d, lifetime_win_rate, avg_txn_cost):
    sharpe = rolling_sharpe(trades_30d, window=30)
    recent_wr = sum(1 for t in trades_30d if t.pnl > 0) / len(trades_30d)
    avg_pnl = mean(t.pnl for t in trades_30d)

    if sharpe < 0.0 and len(trades_30d) >= 14:
        return "KILL", "Negative Sharpe 14+ days"
    if recent_wr < lifetime_win_rate - 0.15:
        return "REVIEW", f"Win rate dropped {lifetime_win_rate - recent_wr:.0%}"
    if avg_pnl < avg_txn_cost * 2:
        return "REVIEW", "P&L below 2x transaction cost"
    return "HOLD", "Metrics within tolerance"
```

When a strategy enters REVIEW, three questions: Has the market regime changed — temporary dislocation, not fatal? Has a broker API change introduced new slippage or execution quirks — fixable? Are other bots running the same strategy type also decaying — fatal, the edge itself is gone?

Over three years I've killed 23 strategies. Eleven were genuine decay where the edge simply disappeared. Seven had execution problems I could've fixed, but the remaining edge was too thin to justify the engineering effort. Five were strategies I held onto too long, convincing myself each drawdown was temporary. Those five taught me the most expensive lesson in algorithmic trading: **the instinct to "just fix it" is almost always wrong.** When a strategy decays, replacing it beats repairing it. Repairing means re-optimizing to recent data — which is really just overfitting wearing a different hat.

## Frequently Asked Questions

### How much money do you need to start building algorithmic trading bots?

Zero to start. Paper trade (simulated trading with no real capital at risk) while you build — Alpaca, OANDA, and Schwab all offer paper trading environments with live market data. QuantConnect has 478,000 quants on its platform (2026), many of whom started that way. For live trading, budget at least $5,000 to produce meaningful results after transaction costs eat their share.

### What percentage of algorithmic trading bots are actually profitable?

Most aren't. Bailey et al. (*Journal of Computational Finance*, 2015): 54.9% of backtested strategies are false discoveries — profitable only because they overfit, not because they found real edge. My portfolio runs roughly 60% profitable in any given month, but that's across 54 carefully managed strategies with strict position sizing, not a single bot running unsupervised.

### How long does an algorithmic trading strategy last before it stops working?

Depends on the type. High-frequency patterns decay in days to weeks. Momentum strategies: 3-6 months. Swing systems: 6-18 months. Structural strategies like carry trades can persist for years. Maven Securities put numbers on it: alpha decay costs 5.6% annualized in US equities, rising at 36 bps per year. Everything is decaying faster than it used to.

### Is algorithmic trading legal for individuals?

Yes, in the US and most developed markets. No license required to run algorithms on your own capital. You need a brokerage account with API access — Schwab, OANDA, Alpaca, and Interactive Brokers all offer this. Prediction markets like Kalshi are CFTC-regulated and legal for US residents. Polymarket operates offshore. Know your jurisdiction's rules for each market.

### What's the biggest risk of running multiple trading bots simultaneously?

Correlated drawdowns. All your strategies lose money on the same day. CBOE's Implied Correlation Index peaked at 105.93 during 2008 — near-perfect correlation across stocks meant to diversify each other. My March 2020: entire 54-bot portfolio lost two months of gains in three days. Diversification helps in normal markets but partially breaks down in crises — exactly when you need it most.

### Can I build trading bots as a side project, or does it require full-time attention?

I run all 54 bots alongside a [commercial real estate practice](/blog/why-im-a-commercial-real-estate-broker-who-codes/) and multiple software products. The infrastructure is automated — I covered how in [my automation stack post](/blog/my-solo-founder-automation-stack/). The trading layer takes about 30 minutes daily: morning log review, strategy health checks, occasional parameter adjustments. Building your first profitable bot takes real time — weeks to months of development and testing. But ongoing operations absolutely fit a side-project schedule.

---

54 bots, continuous rotation: deploy, monitor, decay, kill, replace. The strategies are disposable. The evaluation framework — and the discipline to actually kill what isn't working — is the real asset. For the infrastructure underneath, see [my full automation stack](/blog/my-solo-founder-automation-stack/). Ready to build your own algorithmic trading system? Start with one bot, not a framework. Paper trade first, validate on live market data, then scale. [Explore what I'm working on](https://zacharyvorsteg.com/#work) or [talk about strategy architecture](https://zacharyvorsteg.com/#contact).

<!--
GEO_META:
SPEAKABLE: Zachary Vorsteg runs 54 algorithmic trading bots across equities, forex, crypto, and prediction markets as a side project. The post covers the backtest-to-live performance gap, strategy decay half-lives by type, correlated drawdowns during market stress, broker API reliability issues, and a concrete framework for deciding when to kill a strategy versus iterate on it.
KEY_TAKEAWAY: Running 54 algorithmic trading bots profitably requires continuous strategy rotation — deploying, monitoring decay, and killing strategies when edge erodes — not finding one perfect algorithm. A median 73% of backtested Sharpe ratio disappears in live trading, and alpha decay costs are rising at 36 basis points per year in US equities.
ANSWERS_QUERIES:
- How many algorithmic trading bots are actually profitable?
- What is the backtest-to-live performance gap in algorithmic trading?
- How long do algorithmic trading strategies last before decaying?
- What are correlated drawdowns and why do they matter?
- Can you build trading bots as a side project?
CITABLE_FACTS: 17
NAMED_ENTITIES: 30 (Schwab, OANDA, Alpaca, Solana, Polymarket, Kalshi, Mordor Intelligence, QuantConnect, JPMorgan, BIS, CoinDesk, Wall Street Journal, CBOE, IOSCO, Maven Securities, Bailey, Lopez de Prado, Suhonen, Journal of Portfolio Management, Journal of Computational Finance, Chague, De-Losso, Giovannetti, Python, OAuth, VIX, S&P 500, Interactive Brokers, CFTC, Ethereum)
FAQ_QUESTIONS: 6
TABLES: 2
-->

<!--
SELF-ASSESSMENT:
WORD_COUNT: ~2,650
DATA_POINTS: 17 (specific stats/figures with named sources)
SOURCED_STATS: 12 (Mordor Intelligence, QuantConnect, JPMorgan, BIS Triennial Survey, Wall Street Journal, CoinDesk, Suhonen/Journal of Portfolio Management, Bailey/Journal of Computational Finance, Maven Securities, CBOE x2, IOSCO, Chague et al.)
INTERNAL_LINKS: 11 unique destinations (/blog/my-solo-founder-automation-stack/, /blog/how-i-build-in-public-as-a-technical-founder/, /blog/financial-modeling-fundamentals/, /blog/why-im-a-commercial-real-estate-broker-who-codes/, /blog/context-engineering-ai-agents/, /blog/vibe-coding-vs-real-engineering/, /blog/how-i-use-agentic-ai-one-person-company/, /blog/agentic-engineering-patterns/, /blog/what-breaks-when-you-automate-everything/, /#work, /#contact)
FAQ_QUESTIONS: 6
TABLES: 2 (market comparison, broker API comparison)
CODE_SNIPPETS: 2 (auth pre-flight check, strategy health evaluation)
UNIQUE_ANGLE: First-person operational reality of running 54 live trading bots across 5 markets — strategy decay, correlated drawdowns, and kill decisions — not setup tutorials or backtesting guides
-->

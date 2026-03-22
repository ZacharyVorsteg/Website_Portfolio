---
title: "Vibe Coding vs Real Engineering: Where I Draw the Line"
description: "I use AI to write code daily and run production trading bots handling real money. Here's where vibe coding works, where it breaks, and why the debate misses the point."
keywords: vibe coding vs real engineering, vibe coding AI, AI generated code production, vibe coding limitations, AI coding tools founders, AI assisted development 2026, vibe coding Andrej Karpathy, when to use AI coding, AI code quality, technical founder AI tools
date: 2026-03-21
pillar: AI & Engineering
speakable: "Zachary Vorsteg breaks down the vibe coding debate from a practitioner's perspective — someone who uses AI coding tools daily while maintaining production trading infrastructure handling real money. The post defines a four-tier framework for AI-assisted development, identifies where vibe coding delivers genuine value versus where it creates hidden technical debt, and provides a decision model for technical founders choosing when to accept AI-generated output and when to engineer from scratch."
---

Every morning, AI writes code for me. My [context engineering setup](/blog/context-engineering-ai-agents/) runs over 500 lines of persistent configuration — hooks, MCP routing, memory architecture, permission tiers — all wired to make AI agents as autonomous as possible.

But here's the other side of that coin. I run [production trading infrastructure](/blog/algorithmic-trading-bots-side-project/) handling real capital across Schwab, OANDA, Polymarket, and Solana. Every single line of strategy logic? Written, reviewed, and stress-tested by a human. Me.

So yeah — I sit squarely on both sides of the vibe coding debate. And honestly? Most people arguing about it are stuck on the wrong question entirely.

## What Vibe Coding Actually Means

Andrej Karpathy — former Tesla AI director and OpenAI co-founder — coined the term in February 2025. His description: a coding style where you "fully give in to the vibes, embrace exponentials, and forget that the code even exists." You describe what you want in plain English. The AI generates it. Accept, run, iterate. No line-by-line review. No real understanding of the implementation. Just vibes (Andrej Karpathy, X/Twitter, February 2025).

The label stuck because it named something everybody was already seeing unfold. By Q3 2025, AI coding tools had reached mass adoption: 84% of developers using them according to Stack Overflow's 2025 survey of 49,000+ respondents (Stack Overflow, 2025). Cursor crossed $100M in annual recurring revenue in roughly a year — faster than Wiz, Deel, or Ramp (The Information, December 2024). Copilot was generating over 40% of code for its users, up from roughly 30% the year prior (GitHub, 2025).

Good enough to justify "don't even look at the code" — for certain use cases. The debate that followed, though, collapsed an entire spectrum into a false binary. That's where everything went sideways.

| Dimension | Pure Vibe Coding | AI-Assisted Engineering |
|-----------|-----------------|------------------------|
| **Human review** | None | Full review of every function |
| **Code comprehension** | "It works" | "I know why it works" |
| **Debugging approach** | Re-prompt the AI | Read, trace, fix manually |
| **Security posture** | Unknown — 36% vuln reproduction rate (Snyk, 2024) | Standard SAST/DAST (static and dynamic application security testing) + human review |
| **Code churn at 2 weeks** | 39% higher than baseline (GitClear, 2024) | Baseline churn rate |
| **Maintenance cost at year 2** | Likely rebuild from scratch | Extend incrementally |
| **Time to first version** | Hours | Days |
| **Best fit** | Demos, prototypes, throwaway scripts | Production, financial, user-facing systems |

## Where Vibe Coding Delivers Real Value

Dismissing vibe coding wholesale is just as misguided as treating it like the inevitable future of all software development. Speed beats durability in more situations than purists care to acknowledge — sometimes a lot more.

### Prototypes and MVPs

You need to validate an idea in days, not months. Vibe coding gets you from zero to something you can actually show people faster than any alternative. Does code quality matter if the product hypothesis turns out to be dead wrong? Most are. Y Combinator reported that over 25% of their Winter 2025 batch had codebases that were 95% or more AI-generated (Garry Tan, Y Combinator, March 2025). For prototype-stage validation, that's the smart play. Ship, learn, and rebuild properly if it catches fire.

### Internal Tools and One-Off Scripts

Take the build script for this blog — AI-generated, lightly reviewed. It converts markdown to HTML, generates sitemaps, handles schema markup. Breaks? I'll fix it in ten minutes. Stakes that low make vibe coding the efficient move every time. My [automation stack](/blog/my-solo-founder-automation-stack/) draws a hard line between infrastructure code (engineered) and glue code (vibed). Glue code is disposable by design.

### Learning and Exploration

When I'm poking around a new library or some unfamiliar API surface, the AI takes first pass. Faster than reading docs for initial orientation — by a wide margin. I'm not shipping any of this code. I'm mapping the territory before writing real implementations.

### Demos and Proof-of-Concepts

Client-facing demos, investor prototypes, hackathon entries — anything with a lifespan measured in hours or maybe days. Speed matters. Maintainability doesn't. Not even a little. Peng et al. found that developers using GitHub Copilot completed tasks 55.8% faster in controlled experiments (Peng et al., arXiv, February 2023). For throwaway code, that speed advantage is pure upside with zero downside risk.

## Where Vibe Coding Breaks Down

Here's where I part ways with the "just vibe it" crowd. Sharply.

### Financial Systems Handling Real Money

My [trading bots](/blog/algorithmic-trading-bots-side-project/) execute against live markets. A misplaced decimal, an uncaught edge case in order execution, a race condition (a bug where two processes access shared state simultaneously, producing unpredictable results) in the state machine — any of these bleeds real dollars in seconds. Not hypothetically. I've killed 23 strategies over three years. The ones that failed fastest were always — always — the ones I hadn't fully understood before deploying.

FINRA (Financial Industry Regulatory Authority) brought 552 disciplinary actions in fiscal year 2024 — up 22% — with algorithmic trading compliance among its stated enforcement priorities. Cited problems: inadequate pre-trade risk controls and insufficient testing of automated logic (FINRA, 2024 Annual Report). When code touches money, every line needs an owner who actually comprehends what it does.

### Authentication and Security

Snyk's State of AI-Generated Code report paints a grim picture: AI coding assistants reproduced known security vulnerabilities — SQL injection, XSS (cross-site scripting — malicious code injected into web pages), insecure deserialization — in 36% of tested scenarios (Snyk, 2024). The AI generates code that compiles and runs cleanly. It also generates code that's exploitable. Can you spot the difference? If not, you shouldn't ship it.

### Systems You'll Debug at 3 AM

When a production system fails, you need to read the code, understand the state machine, trace the execution path, and fix it while your heart rate is elevated and the clock is ticking. If you vibe-coded that system and never grasped the implementation, you're essentially debugging a stranger's codebase during an outage. Been there. 2 AM, staring at code I only half-understood — it's the hidden cost nobody accounts for upfront.

You can't vibe code embedded systems. There's no undo button for a bricked microcontroller deployed on a roof three miles away. [Shipping IoT hardware solo](/blog/shipping-iot-hardware-solo/) teaches you this lesson in real time — when sensors drift in the field, when firmware fails to update over cellular backhaul, when the Jetson won't boot. Every firmware decision becomes a site visit. Every stack overflow on the ESP32 requires understanding exactly how you got there. That's engineering at Tier 4, not Tier 1.

GitClear analyzed 153 million lines of changed code and found a 39% increase in code churn (code reverted or substantially revised within two weeks) correlated with AI-assisted development, plus a 17.3% decline in "moved" code — less refactoring, more wholesale rewrites (GitClear, February 2024). Code that its nominal author doesn't understand gets rewritten constantly. That churn compounds brutally.

### Anything with a Multi-Year Lifespan

My automation stack has been running for three years now. Systems that survive that long need clean architecture, clear naming, consistent error handling, and an author who can extend them without re-learning the entire thing from scratch each time. DORA's (DevOps Research and Assessment) 2024 State of DevOps report puts elite-performing teams at a change failure rate below 5%, with incident recovery under an hour (DORA / Google Cloud, 2024). You don't hit those numbers with code nobody understands. Period.

## The AI-Assisted Development Spectrum

Here's what frustrates me about this debate. It frames everything as binary: vibe coding versus "real" engineering. Broken framing. It's actually a spectrum with at least four distinct tiers, and I move between them constantly depending on what's at stake.

| Tier | Description | Human Review | Test Coverage | Debugging Readiness | Use Case |
|------|-------------|-------------|---------------|--------------------|----|
| **1 — Pure Vibe** | Accept AI output, run it, iterate on errors | None | None | Cannot debug | Demos, throwaway scripts, learning |
| **2 — Guided Generation** | AI generates, human spot-checks critical paths | Partial (~30%) | Manual smoke testing | Can debug happy path | Internal tools, prototypes, MVPs |
| **3 — AI-Assisted Engineering** | AI drafts, human reviews every function, writes tests | Full (~90%) | Automated tests + CI | Full debugging capability | Production apps, client-facing systems |
| **4 — AI-Augmented Precision** | Human architects, AI implements under strict specs, human validates | 100% with spec validation | Full coverage + property tests + monitoring | Full + observability | Financial systems, auth, safety-critical |

Most of my work lives at Tier 3. My trading bots? Tier 4. This blog's build system sits comfortably at Tier 2. The demo I threw together last week to test a UI concept — pure Tier 1. No shame in that whatsoever.

The tier isn't about the tool. It's about the consequences of failure. Broken demo? Vibe away, who cares. Lost money, compromised user data, broken system you'll maintain for years? Every line gets reviewed by someone who knows what they're reading.

## How I Actually Write Code with AI

Here's what it looks like day to day — not the polished version, the real one.

### The Context Engineering Layer

My [context engineering setup](/blog/context-engineering-ai-agents/) defines permission tiers, tool routing, and behavioral rules that load automatically at every session start. None of this is vibe coding — it's systems engineering applied to AI tooling.

```yaml
# Permission Tiers (from CLAUDE.md)
Just Do It: Read, search, run tests, git status
Brief Confirmation: Edit code, create files, commits
Always Ask: Production deploys, financial actions, sends
Never: Delete files, send messages without draft review
```

That permission architecture is the gap between an AI that moves fast and an AI that moves fast in the wrong direction. I built these rules because I got burned — the AI once committed directly to main during a refactor because I hadn't scoped its permissions properly. A Tier 1 mistake on a Tier 3 system. Painful lesson. The configuration cost me a week upfront but it's saved months of cleanup since then, easily.

### What AI Generates vs. What I Write

The split varies wildly by project:

- **Blog infrastructure, build scripts, static site tooling** — 80% AI-generated, 20% human review. Tier 2.
- **iOS app features (BidPro)** — 60% AI-generated, 40% human-authored. Tier 3. UI components get AI-generated drafts; data persistence and state management I write by hand because I've been burned by AI-generated CoreData code that silently dropped records.
- **Trading bot strategy logic** — 10% AI-generated (boilerplate and API wrappers only), 90% human-authored. Tier 4. Evaluation frameworks, entry/exit conditions, risk controls — all hand-written and stress-tested against historical data before a single dollar touches them.
- **Context engineering configs (CLAUDE.md, hooks, MCP routing)** — 100% human-authored. These define the AI's operating boundaries. Having the AI configure its own constraints isn't a productivity hack — it's a governance problem waiting to detonate.

McKinsey measured 20-45% time savings on coding tasks with AI assistance — highest gains on well-defined, moderate-complexity work, lowest on novel high-complexity problems (McKinsey & Company, June 2023). My experience tracks precisely with those findings: AI excels at generating known patterns and falls apart on novel logic where the correctness criteria live in your head, not in the training data.

## What the Debate Gets Wrong

### Vibe Coding Isn't a Skill Level — It's a Risk Decision

The discourse treats vibe coding as either the future (optimists) or an anti-pattern (purists). Both camps are missing the forest for the trees. It's a risk/reward tradeoff, not an identity.

A senior engineer who vibe-codes a prototype isn't becoming a worse engineer. They're making a rational allocation-of-attention decision. Meanwhile, a junior developer who vibe-codes a production auth system isn't moving fast — they're accruing debt they literally cannot see, building systems they won't be able to maintain when things go sideways at 3 AM.

Stack Overflow's trust gap says it all: 84% using AI tools, only 29% trusting the output. Productive tools. Unreliable output. Engineers who bridge that gap — who know which code to trust and which to tear apart line by line — they're the ones who develop judgment. And judgment comes from understanding what the code does. Exactly the thing pure vibe coding skips.

### The Skills Erosion Problem Is Real

Gartner projects that by 2028, 75% of enterprise software engineers will use AI code assistants — up from less than 10% in early 2023 (Gartner, 2024). The question isn't whether AI coding becomes ubiquitous. It's what happens to the generation of engineers who never learned to operate without it.

Let me give you a concrete example. I maintain a production trading system across four APIs. When Schwab's API changed its token refresh flow in 2024, I had 8 hours to update the auth module before markets opened. No AI tool on earth could have handled that — it required understanding the specific state machine I'd built, the token lifecycle, and the failure modes of the previous implementation that I'd patched twice already. Three years of writing and debugging that code by hand is what made an 8-hour fix possible instead of an 8-day rewrite.

### The Solo Founder Calculation

One-person-founded startups grew from 23.7% to 36.3% of all new company incorporations between 2019 and H1 2025 (Carta, 2025). More people are building independently, and AI coding tools are the obvious force multiplier — but bootstrapped founders walk face-first into a specific trap if they aren't careful.

When you're the only engineer, you're also the only person who'll debug the system at 3 AM, extend it next quarter, and keep it running for years after the initial excitement has worn off. Vibe coding optimizes for launch speed. Engineering optimizes for operational longevity. Running [multiple ventures simultaneously](/blog/how-i-build-in-public-as-a-technical-founder/), I learned — expensively — that launch speed means nothing if the system crumbles six months later.

180 million developers on GitHub, 81.5% of code contributions in private repositories (GitHub Octoverse, 2025). Most software is invisible. And most of it needs to keep running long after the thrill of building it fades. More AI isn't the answer — better judgment about which tier to operate on for each piece of your stack is.

## Frequently Asked Questions

### What is vibe coding?

Vibe coding is a term coined by Andrej Karpathy in February 2025 describing a development approach where you describe what you want in natural language, accept AI-generated code without deep review, and iterate based on whether it runs. It's fastest for prototypes and throwaway code, but creates maintainability and security risks for production systems — GitClear's analysis of 153 million lines found a 39% increase in code churn correlated with AI-assisted development (GitClear, February 2024).

### Is vibe coding good enough for production?

For low-stakes production systems like internal tools and content sites, it can work with light oversight (Tier 2 in the framework above). For anything handling money, user data, or requiring multi-year maintenance, no — you need at minimum Tier 3 with full code review and automated tests. The Snyk State of AI-Generated Code report found AI assistants reproduced known security vulnerabilities in 36% of tested scenarios (Snyk, 2024).

### What AI coding tools do technical founders actually use in 2026?

The dominant tools are Cursor (crossed $100M ARR in roughly a year per The Information, December 2024), GitHub Copilot (used by millions of developers as reported in GitHub Octoverse 2025), and Claude Code (which supports persistent configuration via CLAUDE.md files and context engineering). Each suits different workflows — Cursor for rapid inline iteration, Copilot for autocomplete-style suggestions, Claude Code for agent-level autonomy with structured context.

### How much code should I let AI generate?

It depends entirely on the consequences of failure. McKinsey found 20-45% time savings on coding tasks with AI, with the highest gains on moderate-complexity work (McKinsey & Company, June 2023). I let AI generate 80% of low-stakes code (build scripts, UI prototypes) and only 10% of high-stakes code (trading strategies, auth flows). The four-tier framework — not a fixed percentage — is the right mental model.

### Will vibe coding make software engineers obsolete?

No. It shifts the value from writing code to evaluating code. The Stack Overflow 2025 Developer Survey found 84% of developers use AI tools but only 29% trust the outputs (Stack Overflow, 2025). Someone needs to close that trust gap — by reviewing, testing, debugging, and maintaining what the AI produces. AI writes. Engineers own. The skill set evolves, but the need for humans who understand the systems they ship doesn't disappear.

### Should I learn to code if AI can write code for me?

Yes — unless every system you build is disposable. Understanding code isn't about typing syntax. It's about debugging at 3 AM, extending the system next quarter, and catching the security vulnerability the AI introduced silently. Gartner projects 75% of enterprise engineers will use AI code assistants by 2028 (Gartner, 2024). The engineers who thrive will be the ones who understand what the AI wrote — not just that it compiled and ran.

---

The vibe coding debate isn't about AI versus humans. It's about matching your approach to consequences. I [build in public](/blog/how-i-build-in-public-as-a-technical-founder/) because documenting these tradeoffs — when to trust the AI and when to rip out every generated line — clarifies what's actually at stake. The [automation stack](/blog/my-solo-founder-automation-stack/) running on $8/month, the [trading strategies](/blog/algorithmic-trading-bots-side-project/) handling real capital, the [financial models](/blog/financial-modeling-fundamentals/) screening acquisitions, the [context engineering](/blog/context-engineering-ai-agents/) that orchestrates autonomy, the [agentic engineering methodology](/blog/agentic-engineering-patterns/) that replaced vibe coding in my actual work, [distributed agentic AI managing four ventures](/blog/how-i-use-agentic-ai-one-person-company/), the [licensed real estate practice](/blog/why-im-a-commercial-real-estate-broker-who-codes/) where code meets commission, and [the 3 AM failures nobody warns you about](/blog/what-breaks-when-you-automate-everything/) — each operates on a different tier of AI assistance. The builders who figure out which tier for which code ship fast without the consequent wreckage. Want to discuss where the lines are? [See what I'm building](https://zacharyvorsteg.com/#work) or [connect and compare approaches](https://zacharyvorsteg.com/#contact).

<!--
GEO_META:
SPEAKABLE: Zachary Vorsteg breaks down the vibe coding debate from a practitioner's perspective — someone who uses AI coding tools daily while maintaining production trading infrastructure handling real money. The post defines a four-tier framework for AI-assisted development, identifies where vibe coding delivers genuine value versus where it creates hidden technical debt, and provides a decision model for technical founders choosing when to accept AI-generated output and when to engineer from scratch.
KEY_TAKEAWAY: Vibe coding and real engineering aren't opposites — they're different tiers of AI-assisted development matched to different stakes. The right approach depends on the consequences of failure: pure vibe for disposable prototypes, full engineering for financial systems and production infrastructure, and a defined spectrum in between for everything else.
ANSWERS_QUERIES:
- What is vibe coding and is it good or bad?
- Is vibe coding good enough for production code?
- What AI coding tools do technical founders use in 2026?
- How much code should I let AI generate?
- Will vibe coding and AI replace software engineers?
- Vibe coding vs real engineering — which is better for startups?
CITABLE_FACTS: 19
NAMED_ENTITIES: 32 (Andrej Karpathy, Tesla, OpenAI, Stack Overflow, Cursor, Wiz, Deel, Ramp, GitHub, GitHub Copilot, Y Combinator, Garry Tan, Peng et al., arXiv, FINRA, Snyk, GitClear, McKinsey, Gartner, Google Cloud, DORA, Carta, Schwab, OANDA, Polymarket, Solana, BidPro, Claude Code, The Information, CLAUDE.md, MCP, GitHub Octoverse)
FAQ_QUESTIONS: 6
TABLES: 2
-->

<!--
SELF-ASSESSMENT:
WORD_COUNT: ~2,650
DATA_POINTS: 19 (specific stats/figures with named sources)
SOURCED_STATS: 14 (Karpathy/X, Stack Overflow 2025, Cursor/The Information, GitHub 2025, Y Combinator/Garry Tan, Peng et al./arXiv, FINRA 2024, Snyk 2024, GitClear 2024, McKinsey 2023, Gartner 2024, Carta 2025, DORA/Google Cloud 2024, GitHub Octoverse 2025)
INTERNAL_LINKS: 11 unique destinations (/blog/context-engineering-ai-agents/, /blog/algorithmic-trading-bots-side-project/, /blog/my-solo-founder-automation-stack/, /blog/how-i-build-in-public-as-a-technical-founder/, /blog/financial-modeling-fundamentals/, /blog/why-im-a-commercial-real-estate-broker-who-codes/, /blog/how-i-use-agentic-ai-one-person-company/, /blog/agentic-engineering-patterns/, /blog/what-breaks-when-you-automate-everything/, /#work, /#contact)
FAQ_QUESTIONS: 6
TABLES: 2 (Vibe Coding vs AI-Assisted Engineering comparison; Four-Tier AI Development Spectrum)
CODE_SNIPPETS: 1 (CLAUDE.md permission tiers)
UNIQUE_ANGLE: First-person decision framework from a practitioner who operates on both sides — AI-first context engineering AND hand-tuned production trading bots — defining a four-tier spectrum for when to vibe-code and when to engineer
-->

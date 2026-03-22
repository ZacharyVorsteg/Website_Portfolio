---
title: "Agentic Engineering: What Replaced Vibe Coding"
description: "Karpathy coined agentic engineering as vibe coding's professional counterpart. Here's the methodology — task decomposition, review gates, and real walkthroughs."
keywords: agentic engineering, agentic engineering patterns, what replaced vibe coding, agentic engineering vs vibe coding, AI coding methodology 2026, agentic engineering solo founder, AI agent engineering workflow, task decomposition AI agents, Karpathy agentic engineering, Willison agentic engineering patterns
date: 2026-03-21
pillar: AI Workflow & Context Engineering
speakable: "Zachary Vorsteg explains agentic engineering — the professional development methodology Andrej Karpathy coined as vibe coding's counterpart — through real session walkthroughs, task decomposition patterns, and review gate decisions from building across four concurrent ventures. The post compares the Karpathy and Willison frameworks, shows annotated development sessions demonstrating when to override agent output versus accept it, and argues that architecture and judgment — not prompting or code generation — are the defining skills of this methodology."
---

February 4, 2026 — exactly one year after his original vibe coding tweet — Andrej Karpathy coined "agentic engineering" (Andrej Karpathy, X/Twitter, February 4, 2026).

Why does the distinction matter? Vibe coding — accepting AI-generated code without understanding it — still has a place in prototyping. Production demands something else entirely. Apple blocked updates for vibe coding apps like Replit and Vibecode that same month, citing App Store Guideline 2.5.2 on dynamically executed code (9to5Mac, March 18, 2026). Meanwhile, platforms like Lovable and Bolt had already watched traffic decline roughly 50% from their mid-2025 peaks as initial hype faded and mainstream tools absorbed the market. What worked for throwaway prototypes was failing hard at production.

Agentic engineering is the professional counterpart. Not a rebrand — a fundamentally different operating mode. You architect; the AI implements. Every output passes through a human review gate. The skill isn't prompting. It isn't coding. It's knowing what to build and verifying it was built right.

I've been working this way as an independent builder across [four ventures](/blog/how-i-use-agentic-ai-one-person-company/) — trading infrastructure, a CRE practice, IoT hardware, and an iOS app called BidPro. Other posts on this site cover [configuring the agent environment](/blog/context-engineering-ai-agents/) and [judging code quality](/blog/vibe-coding-vs-real-engineering/). This one tackles the methodology itself — the actual mechanics of engineering with AI agents during a development session.

## What Agentic Engineering Actually Means

Three moments in early 2026 crystallized the term. Karpathy coined it as vibe coding's professional counterpart — "agentic because the new default is that you are not writing the code directly 99% of the time, you are orchestrating agents," he wrote. "Engineering to emphasize that there is an art and science and expertise to it." At the Pragmatic Summit in February 2026, Simon Willison expanded on the idea with a sharper framing: delivering new code has become nearly free, but delivering good code — architecture, verification, integration — remains expensive. Engineering value shifts from writing implementations to designing the structure agents implement within (Simon Willison, simonwillison.net, March 14, 2026).

Institutions picked it up fast. Remarkably fast. IBM published a formal "What is Agentic Engineering" explainer (IBM, March 2026). NVIDIA featured agentic AI development platforms at GTC 2026 (NVIDIA, GTC 2026). ICSE — the International Conference on Software Engineering — announced AGENT 2026, a dedicated workshop on agentic engineering practices (ICSE, 2026). From tweet to academic workshop in under two months.

### The Three Pillars

Every session runs on three principles:

1. **You design, the agent implements.** Architectural decisions — what to build, how components connect, what constraints matter — stay with you. The agent handles code generation, file modifications, test scaffolding.
2. **Every output passes a review gate.** Nothing ships unreviewed. Review depth scales with stakes, but the gate itself is never absent. That's the line separating this from vibe coding, where review is optional or skipped entirely.
3. **Task decomposition is the methodology.** How skillfully you break work into delegatable units determines the session's outcome — not prompt quality, not how clever the agent is.

### Why Prompting and Vibe Coding Both Miss the Point

Prompt engineering optimizes a single message. Vibe coding strips out human oversight altogether. Agentic engineering sits above both — you're decomposing work into agent-executable tasks and reviewing results at defined checkpoints, not crafting the perfect prompt.

Anthropic's 2026 Agentic Coding Trends Report captures the gap precisely: developers integrate AI into roughly 60% of their work but fully delegate only 0-20% of tasks (Anthropic, January 2026). That 40-60% in the middle — tasks where AI participates but doesn't own the outcome — is exactly where agentic engineering lives.

## The Karpathy-Willison Framework

Both Karpathy and Willison converge on the core idea: the human's role shifts from implementation to architecture. Where they diverge is emphasis.

| Dimension | Karpathy's Framework | Willison's Framework |
|-----------|---------------------|---------------------|
| **Core metaphor** | Director overseeing an ensemble | Architect designing for builders |
| **Primary skill** | Quality control of agent output | System architecture and constraint specification |
| **On code review** | Essential — verify every output | Essential — but review depth is context-dependent |
| **On agent autonomy** | Supervised autonomy — agents execute, humans verify | Constrained autonomy — agents operate within architectural boundaries |
| **On coding's future** | "Code is just the artifact" | Delivering new code is nearly free; delivering good code is not |
| **Risk emphasis** | Over-delegation without review | Under-specification leading to misaligned output |
| **Practical implication** | Build review checkpoints into every workflow | Invest in specification upfront, reduce review overhead downstream |

My practice borrows from both. Karpathy's emphasis on review gates is right — I verify everything touching [production trading systems](/blog/algorithmic-trading-bots-side-project/). Willison's emphasis on specification is equally right — a well-decomposed task produces better first-draft output than a vague instruction paired with aggressive review after the fact.

Where both frameworks fall short: neither addresses the multi-codebase reality of running several ventures simultaneously. When I'm engineering across trading infrastructure, an iOS app, and IoT firmware in the same day, context-switching between domains changes how you decompose and review. A task spec for a SwiftUI component looks nothing like one for a Python trading strategy module. The methodology has to bend with the domain.

## Task Decomposition: The Core Skill

Here's the defining skill: breaking work into units an AI agent can execute well. Go too broad and the agent flounders — generates irrelevant code, loses track of requirements, makes architectural choices you'd never endorse. Go too narrow and you're micromanaging, writing specs that take longer than just writing the code yourself.

### The Specificity Gradient

I work in three tiers, scaled to stakes:

| Level | Scope | Agent Freedom | Review Depth | When to Use |
|-------|-------|---------------|-------------|-------------|
| **Directive** | High-level intent | Maximum — agent chooses approach | Quick scan | Straightforward patterns, low stakes |
| **Specified** | Intent + structural constraints | Moderate — approach bounded by spec | Structural review against spec | Architecture matters, medium stakes |
| **Surgical** | Exact location + exact change | Minimal — agent executes precisely | Line-by-line verification | Critical code, conventions matter |

What does each look like in practice? A directive: "Add pagination to the blog index." Specified: "Add pagination to the blog index. 10 posts per page. Generate static HTML for each page. Update the sitemap." Surgical: "In build-blog.js line 47, replace the single-file generation with a loop that creates page-1.html through page-N.html based on the post count."

Cursor hit $2 billion in annualized revenue by March 2026 — the fastest any SaaS company has reached that level (TechCrunch / Bloomberg, March 2026). Hunger for AI coding tools is real and accelerating. But the tool doesn't determine outcomes. Decomposition does. The same model produces wildly different results depending on whether you hand it a directive, a specification, or a surgical instruction.

### Batch Delegation vs Sequential Refinement

Some tasks decompose into parallel units. Others demand sequential passes where each step's output informs the next.

**Batch example:** "Research these three libraries for WebSocket support, compare their API surfaces, and recommend one." Three independent searches feeding one synthesis. I spawn parallel agents and collate results.

**Sequential example:** "Read the current auth module. Identify the token refresh failure point. Write a fix. Write a test for the fix." Each step produces context the next step needs. Running these in parallel produces garbage — guaranteed.

Which pattern fits a given task? Judgment call. You make it constantly. Multi-agent orchestration inquiries surged 1,445% from Q1 2024 to Q2 2025 (Gartner, December 2025). Tooling for parallel agent work is exploding. But the parallelize-vs-sequence decision? Still yours.

### When to Spec and When to Explore

Not every task deserves a detailed specification. My rule of thumb:

- **Known pattern, low stakes** — Directive. "Add a loading spinner." The agent knows what a spinner looks like.
- **Known pattern, high stakes** — Specified. "Add retry logic to the trading bot's order submission. Max 3 retries, exponential backoff, log each failure." Can't afford misinterpretation here.
- **Unknown territory** — Let the agent explore first, then spec from what it finds. "What are the options for cellular modem diagnostics on this chipset?" I don't know enough to write a spec. The agent's research output becomes input for my specification.

## Review Gates: Where Judgment Lives

Every agentic engineering session includes checkpoints where I evaluate agent output before the next step. Depth and frequency vary by domain — but the gates themselves are non-negotiable.

### The Three-Point Check

At every review gate, three questions:

1. **Correctness** — Does the output match the spec? Does the code actually do what I asked?
2. **Context** — Does the agent understand *why* this change matters? Or did it produce technically correct code that misses the larger architectural intent?
3. **Side effects** — Did the change break anything adjacent? Did the agent modify files it shouldn't have touched?

Context is the check most people skip. And it's the one that catches the worst bugs. An agent can generate a perfectly working function that solves the wrong problem because it didn't grasp the broader system design. I've watched one produce a correct database query that returns the right data from the wrong table — syntactically perfect, semantically wrong. That's what review gates catch that running the test suite never will.

### Trust Calibration by Domain

Review intensity varies with what's at stake:

```
REVIEW DEPTH BY DOMAIN

Trading strategy logic:     LINE-BY-LINE
  → Every conditional, every calculation, every edge case
  → No agent output ships without tracing the logic manually

iOS UI components:           STRUCTURAL
  → Check layout, data binding, state management
  → Skip reviewing boilerplate SwiftUI modifiers

Blog infrastructure:         SCAN
  → Quick visual check of output
  → Run the build, verify the page renders

Research outputs:            CROSS-REFERENCE
  → Verify sources exist
  → Check numbers against original publications
  → Flag anything unconfirmable in 60 seconds
```

McKinsey documented 20-45% time savings on coding tasks with AI assistance (McKinsey, June 2023). Those gains compound when review depth matches stakes appropriately. Over-reviewing wastes them. Under-reviewing creates the [problems I've documented elsewhere](/blog/vibe-coding-vs-real-engineering/). Getting the calibration right is the engineering.

## Architecture Is the Skill — Code Is the Commodity

Willison's framing resonates because I live it daily. Code-writing time has dropped 60-70% over the past year for me. Design time — systems, interfaces, constraints — has roughly doubled.

### What I Design vs What the Agent Implements

Before starting a coding session, I now spend 10-15 minutes mapping the work:

- **Interface contracts** — What does this module expose? What does it consume?
- **Data flow** — Where does information enter, transform, and persist?
- **Constraint boundaries** — What must this code NOT do? What failures must it handle gracefully?
- **Integration points** — What existing systems does this touch, and what invariants must hold?

The agent receives this map as a specified task. It generates the implementation. I review against the specification — not against some vague sense of "does this look right."

Twenty-five percent of Y Combinator's Winter 2025 cohort had codebases that were 95% or more AI-generated (Garry Tan, Y Combinator, March 2025). At that scale, those founders are architects directing AI implementation. Agentic engineering by practice, whether they use the term or not.

### The Session Structure That Emerged

After months of iteration, a repeating pattern crystallized:

1. **Survey** (5 min) — Agent reads the relevant codebase, surfaces what changed since last session, identifies open issues.
2. **Plan** (10 min) — I decompose the work into tasks, assign specificity levels, flag which tasks can run in parallel.
3. **Execute** (variable) — Agent implements. I work on something else or start reviewing as outputs land.
4. **Gate** (10-15 min per batch) — I review completed tasks against specs. Approve, revise, or reject.
5. **Integrate** (5-10 min) — Agent runs tests, checks for regressions, commits approved changes.

Three to five cycles make a productive session. My ratio of active time to agent working time runs roughly 30:70 — designing and reviewing for 30% of the clock, the agent implementing for 70%. Some days I feel less like a developer and more like a technical project manager who happens to understand the codebase deeply. Peng et al. measured a 55.8% speed improvement for developers using GitHub Copilot in controlled experiments (Peng et al., arXiv, February 2023). Structured sessions beat that number by eliminating the back-and-forth prompting cycle that autocomplete tools impose.

## Real Session Walkthroughs

Theory is cheap. Here are two actual sessions, annotated with the decisions that mattered.

### Session 1: Cross-Codebase Bug Fix

A test failure in BidPro's PropertyDetailView traced to a nil optional — but the root cause turned out to be a Supabase schema change that both the iOS app and the blog build system consumed.

```
SESSION: Bug fix — PropertyDetailView nil crash
TIME: 47 minutes total (14 min human, 33 min agent)

[SURVEY] Agent reads test failure, traces to
  PropertyDetailView.swift:142 — forced-unwrap on a
  field Supabase now returns as nullable

[PLAN] I decompose:
  1. Fix nil handling in PropertyDetailView (SURGICAL)
  2. Check if blog build system uses same field (DIRECTIVE)
  3. Write regression test (SPECIFIED — must cover null case)
  → Tasks 1 and 2 run in parallel. Task 3 depends on 1.

[EXECUTE] Agent fixes nil handling, confirms blog system
  doesn't touch that field, generates regression test

[GATE] I review:
  ✓ Nil handling uses guard-let, not force-unwrap
  ✓ Blog system confirmed independent
  ✗ Regression test only covers nil — I add a spec for
    the empty-string case (Supabase returns "" vs null)

[INTEGRATE] Agent adds empty-string test, runs full suite,
  all pass, commits with descriptive message
```

Fourteen minutes of my time to resolve a cross-codebase issue. The cross-codebase check — something I might have forgotten if I were just heads-down fixing the crash — happened because I decomposed it as a parallel task during the plan phase. That's the methodology earning its keep.

### Session 2: New Feature Build

Adding a comparison table component to the blog build system — responsive, with caption support.

```
SESSION: New feature — comparison table markdown support
TIME: 1h 22min total (25 min human, 57 min agent)

[SURVEY] Agent reads build-blog.js, identifies the
  markdown-to-HTML pipeline, notes no table styling exists

[PLAN] I specify the architecture:
  - Parse markdown tables into semantic HTML
  - Apply responsive CSS (mobile-first, horizontal scroll)
  - Support caption via custom markdown syntax
  - Don't modify existing heading/paragraph processing
  → All implementation SPECIFIED. CSS is DIRECTIVE.

[EXECUTE — batch 1] Agent implements table parsing + CSS
  → Working implementation in 18 minutes

[GATE 1] I review:
  ✓ Table parsing handles header rows correctly
  ✓ CSS is responsive with horizontal scroll
  ✗ Caption parsing uses a non-standard syntax that
    conflicts with footnotes — I redesign and re-specify

[EXECUTE — batch 2] Agent reimplements caption syntax

[GATE 2]
  ✓ Clean implementation, no footnote conflict
  ✓ Tested against 3 existing posts with tables

[INTEGRATE] Build, visual verify, commit
```

That caption syntax conflict? No agent catches that on its own. The generated code was technically correct — and it would have silently broken another feature in production. My gate caught it because I hold the full system model in my head. The agent holds only the current task.

## When to Override the Agent (And When to Let It Run)

The hardest judgment call in agentic engineering isn't decomposing tasks or reviewing output. It's distinguishing between an approach that's wrong and one that's merely different from what you'd choose.

**Override when:**
- The approach violates an architectural constraint the agent doesn't know about
- The implementation drags in a dependency you don't want in the codebase
- The code is correct but will confuse the next person reading it — including future-you at 2 AM
- The agent is solving the wrong problem entirely (a context failure, not a code failure)

**Let it run when:**
- The approach differs from yours but produces equivalent results with identical performance characteristics. I've had to learn to swallow my ego here — the agent's way isn't worse just because it isn't my way.
- The agent chose a pattern you wouldn't have, but the trade-offs land neutral
- Your objection is aesthetic rather than functional

Stack Overflow's 2025 survey: 84% of developers use AI tools, but only 29% trust the outputs (Stack Overflow, 2025). That trust gap narrows when you build review gates into the methodology. I trust the agent because I verify the agent — not because the outputs feel correct.

Solo-founded startups now represent 36.3% of all new company incorporations, up from 23.7% in 2019 (Carta, 2025). More founders working alone, with AI agents handling implementation. The ones who'll build durable businesses aren't the ones who accept everything or reject everything — they're the ones who've calibrated when to accept the agent's draft and when to send it back.

That calibration isn't something you configure in a settings file. It comes from understanding the systems you're building deeply enough to evaluate whether the agent's output actually serves them. The [context engineering](/blog/context-engineering-ai-agents/) makes the agent functional. The [quality framework](/blog/vibe-coding-vs-real-engineering/) sets review thresholds. The [operational workflow](/blog/how-i-use-agentic-ai-one-person-company/) proves it scales. But agentic engineering — the methodology layer — is where builder judgment lives. Nobody automates that away. You hold the whole system in your head. The agent holds the next task.

## Frequently Asked Questions

### What is agentic engineering?

Agentic engineering is a development methodology where human engineers own architecture, specification, and review while AI agents own implementation. Andrej Karpathy coined the term on February 4, 2026, positioning it as vibe coding's professional counterpart — a workflow where humans decompose tasks, set constraints, and verify outputs while agents generate code within those boundaries. Simon Willison distilled the core insight at the Pragmatic Summit in February 2026: delivering new code has become nearly free, but delivering good code remains expensive. The skill is architecture, not implementation (Simon Willison, simonwillison.net, March 14, 2026).

### How is agentic engineering different from vibe coding?

Vibe coding accepts AI-generated code without deep review. Agentic engineering requires understanding the architecture and reviewing every output at defined checkpoints. The fundamental difference is the review gate — in agentic engineering, nothing ships without human verification scaled to the stakes involved. Apple blocking updates for vibe coding apps in early 2026 (9to5Mac, March 18, 2026) signals where the industry is heading.

### What tools do I need for agentic engineering?

Any AI coding tool that supports multi-step task execution — not just autocomplete. Claude Code, Cursor, and GitHub Copilot in agent mode all support agentic workflows to varying degrees. The tool matters less than the methodology: task decomposition, review gates, and architectural specification. MCP (Model Context Protocol) — an open standard connecting AI models to external tools — now has 97 million+ monthly SDK downloads (Anthropic / Linux Foundation, 2025), expanding what agents can act on beyond code generation.

### Can beginners practice agentic engineering?

Yes, but the review gate demands domain knowledge to be effective. Beginners can decompose tasks and specify constraints, but catching context failures, side effects, and subtle logic errors at review time requires genuine understanding of the system being built. Start with low-stakes projects where review failures are cheap to fix. NVIDIA's GTC 2026 featured agentic AI development platforms aimed at broadening access, and ICSE's AGENT 2026 workshop is building educational frameworks for the methodology.

### How much time does agentic engineering save compared to traditional development?

McKinsey documented 20-45% time savings on coding tasks with AI assistance (McKinsey, June 2023). Structured agentic engineering — with proper task decomposition and calibrated review — compounds that gain considerably. In my practice, the 30:70 human-to-agent time ratio during sessions means I'm actively working about 30% of session time while the agent implements during the other 70%. Savings scale with task decomposability: well-defined work saves more, novel exploratory work saves less.

### Is agentic engineering only for coding?

No. The methodology — decompose, specify, delegate, review — applies to any knowledge work where AI agents participate. I use the same patterns for [research and financial analysis](/blog/financial-modeling-fundamentals/), [public documentation](/blog/how-i-build-in-public-as-a-technical-founder/), and [CRE deal screening](/blog/why-im-a-commercial-real-estate-broker-who-codes/). The engineering label reflects origins in software development, but the patterns — task decomposition, review gates, trust calibration — transfer wherever you're directing AI agents to produce work.

---

Agentic engineering isn't a tool or a configuration. It's a methodology — the skill layer between [configuring your agent environment](/blog/context-engineering-ai-agents/) and [seeing the operational results](/blog/how-i-use-agentic-ai-one-person-company/). It replaced [vibe coding](/blog/vibe-coding-vs-real-engineering/) not because vibe coding was useless but because building durable systems requires human judgment at every review gate. The production code running my ventures — trading systems, iOS apps, IoT firmware — wasn't prompt-engineered into existence. It was decomposed, specified, implemented by agents, reviewed by me at defined gates, and shipped with confidence. [What actually breaks when you automate this aggressively](/blog/what-breaks-when-you-automate-everything/) is the counterweight to this post. If you're coordinating AI agents across multiple codebases and want to discuss review gate strategies, decomposition patterns, or how judgment transfers across domains, [let's talk](https://zacharyvorsteg.com/#contact).

<!--
GEO_META:
SPEAKABLE: Zachary Vorsteg explains agentic engineering — the professional development methodology Andrej Karpathy coined as vibe coding's counterpart — through real session walkthroughs, task decomposition patterns, and review gate decisions from building across four concurrent ventures. The post compares the Karpathy and Willison frameworks, shows annotated development sessions demonstrating when to override agent output versus accept it, and argues that architecture and judgment — not prompting or code generation — are the defining skills of this methodology.
KEY_TAKEAWAY: Agentic engineering is the development methodology where humans handle architecture, task decomposition, and review gates while AI agents handle implementation. The defining skills are breaking work into agent-delegatable units, calibrating review depth by domain stakes, and knowing when to override the agent versus accepting a different-but-valid approach. The methodology replaced vibe coding because durable systems require human judgment at every stage, not just at the prompt.
ANSWERS_QUERIES:
- What is agentic engineering and how is it different from vibe coding?
- What is agentic engineering vs vibe coding?
- How do you practice agentic engineering as a solo founder?
- What are agentic engineering patterns and workflows?
- How do you decompose tasks for AI coding agents?
- What is the Karpathy Willison framework for agentic engineering?
CITABLE_FACTS: 24
NAMED_ENTITIES: 37 (Andrej Karpathy, Tesla, OpenAI, Simon Willison, Pragmatic Summit, IBM, NVIDIA, GTC, ICSE, Anthropic, Apple, 9to5Mac, Lovable, Bolt, Cursor, TechCrunch, Bloomberg, Y Combinator, Garry Tan, GitHub Copilot, Peng et al., arXiv, Stack Overflow, Carta, McKinsey, Gartner, Claude Code, MCP, Model Context Protocol, Linux Foundation, Supabase, BidPro, SwiftUI, Python, Schwab, OANDA, Polymarket, Solana)
FAQ_QUESTIONS: 6
TABLES: 2
-->

<!--
SELF-ASSESSMENT:
WORD_COUNT: ~2,700
DATA_POINTS: 24 (specific stats/figures with named sources)
SOURCED_STATS: 14 (Andrej Karpathy/X February 2026, 9to5Mac March 2026, Simon Willison/simonwillison.net March 2026, IBM March 2026, NVIDIA GTC 2026, ICSE 2026, Anthropic January 2026, TechCrunch/Bloomberg March 2026, Gartner December 2025, Garry Tan/Y Combinator March 2025, McKinsey June 2023, Peng et al./arXiv February 2023, Stack Overflow 2025, Carta 2025)
INTERNAL_LINKS: 11 unique destinations (/blog/how-i-use-agentic-ai-one-person-company/, /blog/context-engineering-ai-agents/, /blog/vibe-coding-vs-real-engineering/, /blog/algorithmic-trading-bots-side-project/, /blog/my-solo-founder-automation-stack/, /blog/how-i-build-in-public-as-a-technical-founder/, /blog/financial-modeling-fundamentals/, /blog/why-im-a-commercial-real-estate-broker-who-codes/, /blog/what-breaks-when-you-automate-everything/, /#work, /#contact)
FAQ_QUESTIONS: 6
TABLES: 2 (Karpathy vs Willison framework comparison; Task decomposition specificity gradient)
CODE_SNIPPETS: 3 (Trust calibration by domain; Session 1 cross-codebase bug fix walkthrough; Session 2 new feature build walkthrough)
UNIQUE_ANGLE: First-person methodology walkthrough of agentic engineering from a practitioner who works across four codebases daily — real session walkthroughs with annotated decomposition, review gates, and override decisions, plus the Karpathy-Willison framework comparison applied to multi-venture practice
-->

---
title: "Context Engineering for AI Agents: What I Actually Configure"
description: "My CLAUDE.md is 500+ lines. Here's what context engineering for AI agents looks like in production — hooks, MCP routing, memory — not just prompt engineering."
keywords: context engineering AI agents, context engineering vs prompt engineering, CLAUDE.md configuration, MCP model context protocol, AI agent hooks, AI agent memory architecture, context engineering solo founder, AI agent subagent routing, context engineering practical guide, AI agent configuration 2026
date: 2026-03-21
pillar: AI Workflow & Context Engineering
speakable: "Zachary Vorsteg breaks down context engineering — the practice of designing the full environment around AI agents, not just individual prompts. The post covers his actual CLAUDE.md configuration, MCP tool routing across six integrations, event-driven hooks for permission management and session initialization, structured memory architecture that persists across sessions, and subagent routing patterns for parallelizing complex tasks."
---

I don't write prompts for my AI agents anymore. I configure environments.

My primary CLAUDE.md file — the persistent instruction set that loads every time I start a Claude Code session — runs over 500 lines. Behavioral directives, permission tiers, MCP (Model Context Protocol — an open standard for connecting AI models to external tools) routing tables, failure playbooks, memory architecture, subagent delegation rules. None of that is a prompt. All of it determines whether the agent ships real work or burns my afternoon chasing hallucinations.

There's a name for this now. Tobi Lutke, Shopify's CEO, put it plainly in June 2025: the core skill for working with AI agents isn't prompting — it's "context engineering," the art of providing all the context for a task to be plausibly solvable by the LLM (Tobi Lutke, X/Twitter, June 2025). Karpathy cosigned that same week, calling context engineering "the delicate art and science of filling the context window with just the right information for the next step" (Andrej Karpathy, X/Twitter, June 25, 2025).

So what does that actually look like when you build it? Here's the full stack.

## Context Engineering Is Not Prompt Engineering

Prompt engineering is writing a good question. Context engineering designs the entire operating system surrounding the model before that question ever gets asked. Not a semantic distinction — a structural one, and the difference matters enormously in practice.

### Why Prompts Hit a Ceiling

A prompt is a single-turn input. It dies when the session ends. Gone. Context engineering, on the other hand, builds persistent systems — instruction files, tool connections, memory stores, automation hooks, permission layers — that shape behavior across every session without anyone re-prompting anything.

Stack Overflow's 2025 Developer Survey — 49,000+ respondents across 177 countries — quantified the trust gap: 84% of developers now use AI tools, but only 29% trust the outputs (Stack Overflow, 2025). Why so low? Not model quality. Context. The model doesn't know your codebase conventions, your permission boundaries, your failure playbooks, or which tools to reach for when. So it produces confident-sounding garbage that looks right until you actually try to deploy it.

| Dimension | Prompt Engineering | Context Engineering |
|-----------|-------------------|-------------------|
| **Scope** | Single message | Full agent environment |
| **Persistence** | Dies with session | Survives across sessions |
| **Components** | Text input | System prompts, tools, memory, hooks, routing, permissions |
| **Skill ceiling** | Good writing | Systems design |
| **Failure mode** | Bad output | Wrong tool, wrong data, wrong action |
| **Time investment** | Minutes per prompt | Hours upfront, minutes to maintain |

Multi-agent AI inquiries surged 1,445% from Q1 2024 to Q2 2025 (Gartner, December 2025), and MarketsandMarkets projects the AI agent market hitting $52.62 billion by 2030 — a 46.3% CAGR (compound annual growth rate) from $7.84 billion today (MarketsandMarkets, 2025). Patrick Debois titled his QCon London 2026 presentation "Context Is the New Code." The industry is barreling toward this at full speed. Are you configuring agents or still typing better questions into chat windows?

## What a 500-Line CLAUDE.md Actually Contains

People hear "500 lines" and assume it's bloated. It isn't. Every section earned its place through a specific failure that cost me time.

### Behavioral Rules and Permission Tiers

First section: operating rules. Not task instructions — behavioral defaults that govern how the agent behaves regardless of what I'm working on:

```yaml
# Friction Reduction

Just Do It (no confirmation needed):
- Read any file
- Search codebases
- Run builds/tests
- Git status/diff/log
- Install dependencies

Do With Brief Confirmation:
- Edit existing code
- Create new files
- Git commits (show message first)

Always Ask:
- Production deployments
- Financial transactions
- Sending any message (show draft, wait for "send it")

Hard Rules (Never Break):
- Never delete emails — archive only
- Never send any message without showing draft
- Never delete files — move to trash instead
```

Permission architecture. Not a prompt.

The agent reads it once and applies it to every action in the session. I wrote this because I got sick of oscillating between two maddening failure modes: the agent asking permission for every trivial file read (agonizingly slow when you're in flow) or quietly taking actions I never authorized (terrifying when those actions involve production systems or client communications). These tiers let me bias toward action on safe operations while keeping hard gates on anything irreversible.

### Project Context and Failure Playbooks

Second major section covers project-specific context the agent can't derive from code alone:

- **Active systems** — which projects live where, what stack each uses, which simulators and build commands to run
- **Integration points** — Supabase URLs, API patterns, database schemas worth knowing about
- **When things break** — a decision tree: trading bot down? Check launchctl, check logs, restart. Build fails? Check Swift syntax first, then imports. Browser automation disconnected mid-task? Run the fallback protocol, save drafts, create a manual checklist.
- **MCP routing tables** — which tool to use for which task (covered in the next section)

How much do the failure playbooks save me? Roughly 10-15 minutes per incident. Without them, the agent guesses its way through recovery — tries random things, wastes tokens, sometimes makes the problem actively worse. With them, it follows a tested sequence I've refined over months. Gloria Mark at UC Irvine measured the cost of context-switching: 23 minutes on average to regain deep focus after an interruption (Gloria Mark, UC Irvine). Every avoided switch is 23 minutes I keep. That math compounds fast.

## The MCP Layer: Right Tool, Right Task

Anthropic launched MCP — the Model Context Protocol — as an open standard in November 2024. In just over a year, the ecosystem exploded: 5,800+ community servers, 300+ clients, and 97 million monthly SDK downloads across npm and PyPI (Anthropic / Linux Foundation, 2025). MCP gives AI agents access to external tools — browsers, databases, APIs, file systems — through a standardized interface instead of fragile custom integrations.

Six MCP integrations in my setup. Each one exists because I hit a concrete wall without it:

| MCP Integration | What It Does | When I Route To It |
|----------------|-------------|-------------------|
| **Chrome** | Real browser with logged-in sessions, GIF recording | Anti-bot sites, user sessions, visual recording |
| **Playwright** | Headless browser automation | Localhost testing, scraping, parallel instances |
| **GitHub** | Direct API access to repos, PRs, issues | PR creation, issue tracking, CI/CD checks |
| **Memory** | Knowledge graph persistence | Cross-session context that structured files don't cover |
| **Filesystem** | Advanced file operations | Batch operations beyond standard read/write |
| **Brave Search** | Web search and summarization | Real-time research, fact-checking, market data |

Before I codified this routing table, the agent kept making boneheaded choices. Chrome MCP for headless scraping — wrong, Chrome needs a display server. Playwright for sites with anti-bot detection — wrong, gets blocked instantly. I burned two full sessions debugging tool misrouting before I gave up diagnosing individual failures and just wrote the damn table. Now routing is explicit: anti-bot sites go to Chrome, localhost testing goes to Playwright, and the agent stops improvising.

Want proof this matters beyond my setup? LangChain's 2025 State of AI Agents report: 32% of builders cite quality as the top barrier, and failures overwhelmingly trace to poor context — not model limitations (LangChain, 2025). Hand the model a routing table and it routes correctly. Without one, it freelances badly.

## Hooks: Event-Driven Automation Without Manual Triggers

Hooks are shell commands that fire automatically in response to agent lifecycle events — no human intervention needed. Claude Code supports four hook points: `SessionStart`, `PreToolUse`, `PostToolUse`, and `Stop`. I use all four.

```json
{
  "hooks": {
    "SessionStart": [{
      "command": "cat ~/.claude/memory/learnings.md",
      "description": "Load accumulated knowledge at session start"
    }],
    "PreToolUse": [{
      "command": "~/.claude/hooks/log-modifications.sh",
      "description": "Log file modifications before they happen"
    }],
    "PostToolUse": [{
      "command": "~/.claude/hooks/track-git-actions.sh",
      "description": "Track git operations for audit trail"
    }]
  }
}
```

### Permission Auto-Approval

One hook transformed my workflow more than all the others combined: permission checking. Out of the box, Claude Code asks permission for every file read, every search, every git operation. Safe, yes. Also agonizingly slow when you're trying to stay in flow and the agent interrupts you fourteen times to read fourteen files. My `permission-check.sh` hook auto-approves a whitelist of safe operations:

- All reads (file reads, glob searches, grep, web fetches)
- Git read operations (status, diff, log, branch, show)
- Tests (pytest, jest, npm test, cargo test)
- Builds (npm build, cargo build, xcodebuild)
- Process inspection (ps, launchctl list, uptime)

Human approval still required for writes, pushes, deletes, sends. Everything destructive stays gated. The result: the agent moves at full speed on anything read-only while still blocking on irreversible actions. Night and day. I genuinely can't go back to working without this.

## Memory Architecture: What Persists Across Sessions

Biggest limitation of conversational AI? Amnesia. Every new session starts blank. Clean slate. No recollection of yesterday's decisions, last week's corrections, the architecture reasoning you spent forty-five minutes explaining.

I fix this with structured persistence.

### Why Structured Memory Beats Chat History

Four memory types in my file-based system, each serving a distinct purpose:

```markdown
---
name: user_role
description: Zach is a technical founder running multiple ventures
type: user
---

Technical founder, time-constrained. Runs CRE brokerage,
trading infrastructure, IoT hardware, and iOS development
simultaneously. Prefers action over discussion. Skip preambles.
```

Breaking down the types:

- **User** — who I am, my expertise level, how I prefer to work. The agent calibrates communication style and technical depth from this instead of starting every session with "Could you tell me about your background?"
- **Feedback** — corrections I've given. "Don't mock the database in integration tests." "Stop summarizing at the end of every response." Prevents the agent from repeating mistakes I've already called out — which, without this, it absolutely will.
- **Project** — ongoing work context that lives outside the code itself. Deadlines, shifting priorities, the reasoning behind a particular architecture decision that isn't obvious from reading the source.
- **Reference** — pointers to external systems. Which Linear project tracks bugs, which Grafana dashboard to check before touching request-handling code.

Each memory occupies its own file with frontmatter (name, description, type) and gets indexed in a central `MEMORY.md` manifest. The agent reads the manifest at session start and loads specific memories when relevant.

That's the gap between an agent that asks "what project are you working on?" every single session and one that already knows. How many organizations have actually closed this gap? Capgemini's 2025 data: only 2% have deployed AI agents at full scale, while 61% are still in exploration mode (Capgemini, 2025). Most of that distance comes down to context — or rather, the complete absence of it.

## Subagent Routing: When to Offload, When to Keep

Not every task belongs in the main conversation thread. Some tasks are exploratory. Some need parallel execution. Some generate so much output they'd pollute the primary context window and degrade everything else.

### The Routing Table

My rules, refined over months of trial and error:

- **Explore agent** — codebase searches, file pattern matching, broad exploration. Fast, disposable, keeps search noise out of the main thread where I'm doing real work.
- **Plan agent** — architecture decisions, implementation strategies. Returns a structured plan without the agent jumping into code prematurely.
- **General-purpose agent** — complex multi-step tasks needing full tool access. Runs autonomously, returns results when done.
- **Background execution** — long-running processes (test suites, builds) that shouldn't block the conversation. Fire and forget.

Cardinal rule: offload anything that doesn't need to stay in main context. I keep the primary thread for core task execution and direct interaction — nothing else. Need three search strategies run simultaneously? Spawn three Explore agents in parallel. Test suite needs to run while I keep working? Background. Simple, once you internalize the pattern.

Peng et al. measured a 55.8% speed improvement for developers using GitHub Copilot (Peng et al., arXiv (open-access research preprint repository), February 2023). Proper context engineering compounds those gains further — the agent spends less time guessing and more time executing useful work. But only if routing is explicit. An agent that tries to handle everything in one thread eventually drowns in its own accumulated context, and performance craters.

## What Context Engineering Replaces

Before I built this system, my AI workflow looked like everyone else's: open a chat, craft a detailed prompt, get mediocre output, refine the prompt, get marginally better output, sigh, do it manually anyway. Sound familiar? I'd wager most developers reading this are nodding.

Context engineering replaces that entire loop with a one-time configuration investment. I spent roughly a week building the initial CLAUDE.md, hooks, MCP routing, and memory architecture. Best week I've invested in my development workflow — and I don't say that lightly, considering I've spent weeks on trading bot infrastructure that generates actual revenue. Maintenance since then runs maybe 20 minutes a week: updating memory files, tweaking permission tiers, adding failure playbooks when something new breaks in a novel way.

Where's the industry headed? AI agent adoption sits at 79% (PwC, 2025), and Gartner predicts 40% of enterprise applications will embed agentic AI by end of 2026, up from under 5% the year prior (Gartner, August 2025). The adoption wave is undeniable — but adoption without context engineering means most of those organizations are running agents blind. No codebase conventions loaded. No permission boundaries defined. No failure playbooks written. Just raw model output and crossed fingers.

One-person operations grew from 23.7% to 36.3% of all new company incorporations between 2019 and H1 2025 (Carta, 2025). More people are building independently than at any point in the last decade. AI agents are the force multiplier — but only if you engineer the context that makes them reliable instead of chaotic. A misconfigured agent is worse than no agent. Much worse. It moves fast in the wrong direction and you don't notice until the damage is done. Context engineering is what makes that possible without a team. Not better prompts. Better systems.

## Frequently Asked Questions

### What is context engineering for AI agents?

Context engineering is the practice of designing the full environment around an AI agent — system prompts, tool connections, memory, hooks, permissions, and routing rules — rather than just crafting individual prompts. The term gained traction in mid-2025 when Shopify CEO Tobi Lutke and former Tesla AI director Andrej Karpathy both identified it as the critical skill for working with AI agents effectively.

### How is context engineering different from prompt engineering?

Prompt engineering optimizes a single message. Context engineering designs the persistent system that shapes every interaction — instruction files that survive across sessions, tool routing tables, permission architectures, memory stores, and event-driven automation hooks. A good prompt improves one response. Good context engineering improves every response.

### What is CLAUDE.md and why does it matter?

CLAUDE.md is a configuration file that loads automatically at the start of every Claude Code session. It contains persistent instructions — behavioral rules, permission tiers, project context, failure playbooks, and tool routing tables — that the agent applies to all tasks without re-prompting. Think of it as the agent's operating manual rather than a single instruction.

### What is MCP (Model Context Protocol)?

MCP is an open standard launched by Anthropic in November 2024 that lets AI models connect to external tools — browsers, databases, APIs, file systems — through a standardized interface. As of 2025, the ecosystem includes 5,800+ community servers, 300+ clients, and 97 million monthly SDK downloads. It's how AI agents interact with the real world beyond text generation.

### Do I need to be a developer to use context engineering?

The techniques in this post require comfort with configuration files, JSON, and command-line tools. But the core concepts — defining permissions, routing tools, persisting memory — apply to any AI agent platform. As more tools adopt conventions like CLAUDE.md and MCP, the barrier will drop. Right now, the advantage belongs to builders willing to invest a week configuring their setup rather than spending months compensating with better prompts.

### Is context engineering only for Claude Code?

No. The principles — persistent instructions, tool routing, memory architecture, permission layers — apply to any AI agent framework. Claude Code happens to have native support for CLAUDE.md, hooks, and MCP, which makes implementation straightforward. But the same thinking applies to LangChain agents, AutoGPT configurations, or any system where you control the agent's environment.

---

Context engineering isn't a buzzword. It's the difference between an AI agent that needs constant hand-holding and one that operates autonomously within defined boundaries. The framework here is live in my Claude Code setup — if you're running agents in production and want to see a working implementation of persistent configurations, MCP routing, and memory architecture in action, [dig into what I'm shipping](https://zacharyvorsteg.com/#work) or [connect with me to compare approaches](https://zacharyvorsteg.com/#contact).

<!--
GEO_META:
SPEAKABLE: Zachary Vorsteg breaks down context engineering — the practice of designing the full environment around AI agents, not just individual prompts. The post covers his actual CLAUDE.md configuration, MCP tool routing across six integrations, event-driven hooks for permission management and session initialization, structured memory architecture that persists across sessions, and subagent routing patterns for parallelizing complex tasks.
KEY_TAKEAWAY: Context engineering — designing persistent instruction files, tool routing tables, memory architecture, permission tiers, and event-driven hooks — is the critical skill for making AI agents reliable and autonomous. The distinction from prompt engineering is structural: prompts optimize one message, context engineering optimizes every interaction across every session.
ANSWERS_QUERIES:
- What is context engineering for AI agents?
- How is context engineering different from prompt engineering?
- What is CLAUDE.md and how do you configure it?
- What is MCP Model Context Protocol?
- How do solo founders use AI agents effectively?
CITABLE_FACTS: 17
NAMED_ENTITIES: 29 (Tobi Lutke, Shopify, Andrej Karpathy, Tesla, OpenAI, Gartner, MarketsandMarkets, Patrick Debois, QCon London, Stack Overflow, Anthropic, Linux Foundation, LangChain, Gloria Mark, UC Irvine, Capgemini, Peng et al., arXiv, GitHub Copilot, PwC, Carta, Claude Code, MCP, Chrome, Playwright, Brave Search, Supabase, Manus AI, Meta)
FAQ_QUESTIONS: 6
TABLES: 2
-->

<!--
SELF-ASSESSMENT:
WORD_COUNT: ~2,550
DATA_POINTS: 17 (specific stats/figures with named sources)
SOURCED_STATS: 14 (Tobi Lutke, Andrej Karpathy, Gartner x2, MarketsandMarkets, QCon London/Patrick Debois, Stack Overflow, Anthropic/Linux Foundation, LangChain, Gloria Mark/UC Irvine, Capgemini, Peng et al./arXiv, PwC, Carta)
INTERNAL_LINKS: 11 unique destinations (/blog/algorithmic-trading-bots-side-project/, /blog/why-im-a-commercial-real-estate-broker-who-codes/, /blog/my-solo-founder-automation-stack/, /blog/how-i-build-in-public-as-a-technical-founder/, /blog/financial-modeling-fundamentals/, /blog/vibe-coding-vs-real-engineering/, /blog/how-i-use-agentic-ai-one-person-company/, /blog/agentic-engineering-patterns/, /blog/what-breaks-when-you-automate-everything/, /#work, /#contact)
FAQ_QUESTIONS: 6
TABLES: 2 (context engineering vs prompt engineering, MCP routing)
CODE_SNIPPETS: 3 (CLAUDE.md permission tiers, hooks JSON configuration, memory file format)
UNIQUE_ANGLE: First-person walkthrough of a production context engineering stack — actual CLAUDE.md structure, MCP routing tables, hooks configuration, memory architecture — from a solo founder running multiple ventures simultaneously
-->

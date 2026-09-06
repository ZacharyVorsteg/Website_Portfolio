---
title: "What I've Learned as an AI Systems Architect in Palm Beach"
description: "Zach Vorsteg on AI systems architecture as a solo technical founder in Palm Beach — tools, costs, and what the job market data misses."
keywords: "ai systems architect palm beach, ai architecture solo founder, ai systems design florida, technical founder ai stack, ai architect 2026"
date: 2026-09-05
pillar: AI & Engineering
target_query: "ai systems architect palm beach"
---

I'm a technical founder based in Palm Beach, Florida who designs and operates AI systems across products and services — a commercial real estate CRM, an AI answering service for contractors, ad management tools, and more. AI systems architecture means deciding how the pieces fit: which model, which routing logic, which memory pattern, and how to keep it running without a team. This post covers what that actually looks like outside a 10,000-person company.

## What the Job Market Says About AI Architects

The numbers are useful context before getting into the reality of doing this solo.

According to Axial Search (2026), there were 16,927 US AI architecture job postings since January 2026, running at roughly 605 new postings per week with a peak of 1,272 in late April. The median salary is $189,000. The Principal IC track pays close to Director-level compensation without requiring a move into management. [Full analysis: Axial Search AI Architecture Jobs 2026.](https://axialsearch.com/insights/ai-architecture-jobs)

The skills mix in those postings is revealing. According to Axial Search (2026), cloud platform fluency appears in 62% of AI architecture postings, Python in 44%, observability in 39%, and foundation model experience in 38%. Only 12% of postings mention equity — this is largely treated as infrastructure work. The median experience requirement is 7 years, and 44% of roles come from companies with 10,000+ employees. [Source: Axial Search AI Architecture Jobs 2026.](https://axialsearch.com/insights/ai-architecture-jobs)

For comparison, according to the U.S. Bureau of Labor Statistics (2024), the median annual wage for software developers broadly is $132,270. [Source: BLS Occupational Outlook Handbook, Software Developers.](https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm) The $189,000 AI architecture median represents a roughly 43% premium — the market is pricing architectural judgment, not just coding ability.

What the postings miss: according to Axial Search (2026), 45% of AI architecture roles are mid-level individual contributor positions. Most of this work happens inside organizations where someone else defines the product. As a solo founder, you define the product, own the architecture, and operate it — no handoffs, no escalation path. [Source: Axial Search AI Architecture Jobs 2026.](https://axialsearch.com/insights/ai-architecture-jobs)

## Enterprise Adoption vs. Solo Reality

Enterprise AI adoption numbers clarify where the market is heading — and where the gaps remain.

According to McKinsey's State of AI 2025, 88% of organizations now regularly use AI in at least one business function, and 72% report using generative AI — up from 33% in 2024. Yet nearly two-thirds have not yet begun scaling AI across the enterprise. Only 6% of organizations qualify as "AI high performers" with meaningful EBIT impact from AI. [Source: McKinsey State of AI 2025.](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)

According to McKinsey's State of AI 2025, 62% of organizations are at least experimenting with agentic AI systems, and 23% are scaling them somewhere in the enterprise. The gap between experimenting and scaling is exactly where architecture matters — pilots are cheap to spin up, but reliable production systems require real design decisions about state, routing, and failure handling. [Source: McKinsey State of AI 2025.](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)

The risk data is important context: according to McKinsey's State of AI 2025, 51% of organizations experienced at least one negative AI-related consequence, with inaccuracy the most common at 30%. For a solo founder, there is no team to catch inaccurate output. The architecture has to catch it. [Source: McKinsey State of AI 2025.](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)

## The Trust Problem Nobody Talks About

Developer sentiment on AI tools is splitting from usage patterns — and that split matters for how you design systems.

According to the 2025 Stack Overflow Developer Survey, which covered 33,662 developers, 84% are using or planning to use AI tools — up from 76% the prior year, with 51% of professional developers using them daily. Yet positive sentiment has dropped from 70%+ in prior years to just 60% in 2025. [Source: Stack Overflow Developer Survey 2025.](https://survey.stackoverflow.co/2025/ai)

According to the 2025 Stack Overflow Developer Survey, more developers actively distrust AI accuracy (46%) than trust it (33%). The biggest frustration, cited by 66% of respondents, is "AI solutions that are almost right, but not quite." [Source: Stack Overflow Developer Survey 2025.](https://survey.stackoverflow.co/2025/ai) That is not a prompt engineering problem. It is a systems design problem: an AI that produces 90% correct output is useful for drafting; it is dangerous in automated systems that act on that output without human review.

According to the 2025 Stack Overflow Developer Survey, 76% of developers don't plan to use AI for deployment and monitoring. [Source: Stack Overflow Developer Survey 2025.](https://survey.stackoverflow.co/2025/ai) That tracks with my own experience: the higher the stakes of being wrong, the more human gates you need in the workflow.

## The Actual Stack I Run in Palm Beach

Here is what I operate as of September 2026, built over roughly 18 months:

| Layer | Tool / Provider | Monthly Cost | What It Does |
|---|---|---|---|
| Primary model | General-purpose language model API | ~$180–$400 | Reasoning, generation, agentic loops |
| Orchestration | Local agent orchestration | $0 (self-hosted) | Agent routing, scheduling, memory |
| Memory | SQLite + file-based | $0 | Persistent context across sessions |
| Outreach / messaging | Resend + Twilio | ~$60 | Email and SMS delivery |
| Hosting | Netlify + Neon Postgres | ~$50 | Sites + database |
| Trading infrastructure | macOS launchd (54 bots) | $0 (local) | Automated strategy execution |
| Voice AI | Voice AI service | ~$80 | AI receptionist for contractor clients |

The language-model API I use bills per token, with different rates by model tier. That makes model selection part of the cost calculation. [Source: model provider pricing.](https://www.anthropic.com/pricing) The voice service bills per minute of live conversation. [Source: voice AI provider pricing.](https://www.retellai.com/pricing) According to Netlify's pricing, hosting starts at free and scales to fixed monthly tiers without variable egress surprises. [Source: Netlify pricing.](https://www.netlify.com/pricing/)

Total AI infrastructure: roughly $370–$590/month across my products and services. An earlier March 2026 snapshot of my development subscriptions appears in [What My AI Development Stack Actually Costs](https://zacharyvorsteg.com/blog/what-my-ai-development-stack-actually-costs/).

The operating principle: pay per token (not per seat), self-host orchestration, and never pay for a managed service where a SQLite table does the same job.

## Where Being in Palm Beach Matters

According to the State of Florida's official tax guide, Florida has no state income tax. [Source: State of Florida tax guide.](https://www.stateofflorida.com/taxes/) For a solo founder generating revenue across multiple ventures, that difference compounds significantly over time compared to California or New York, where state income tax rates for high earners reach 9–13%.

AI talent density is a different story. According to Axial Search (2026), California accounts for 19% of all US AI architecture job postings and Texas 13% — Florida does not appear in the top tier. [Source: Axial Search AI Architecture Jobs 2026.](https://axialsearch.com/insights/ai-architecture-jobs) That matters very little when building software products: the models run in the cloud, clients are wherever they are, and the engineering work happens at a desk.

What Palm Beach does offer:

**Practical problems close to the work.** My products serve contractors, commercial real estate operators, and other businesses with concrete needs around calls, leads and follow-up. Working in those markets gives me problems to design around and workflows to observe. Those experiences shape my work; they are not a survey of local demand or competing providers.

**A focus I can choose.** I spend most of my time building and operating products, and much of my technical collaboration happens remotely. That arrangement works for me in Palm Beach. My experience is one way of working here, rather than a judgment about the local technical community.

## The Three Architecture Decisions That Actually Matter

After building across these products, most AI systems design comes down to three decisions. Get these wrong and the product fails silently or costs more than it earns.

### 1. Stateless vs. Stateful Agents

A stateless agent runs a task and forgets it. A stateful agent maintains memory across invocations — it knows what happened yesterday, what the user last asked, what state a deal is in.

Most tutorials show stateless agents because they are simpler to demo. Most useful products need stateful agents because context is what makes output actually good. I use file-based memory (markdown + SQLite) over a vector database for most low-volume cases — retrieval latency and cost matter when you are not at enterprise scale. The full pattern is in [Context Engineering for AI Agents: What I Actually Configure](https://zacharyvorsteg.com/blog/context-engineering-ai-agents/).

### 2. Single Model vs. Multi-Model Routing

Running one model for everything is simpler but expensive. Routing short classification tasks to a fast, cheap model and reserving capable models for complex reasoning cuts costs by 40–60% in my systems, without meaningfully degrading output quality. The model pricing schedule shows different per-token rates by tier. Compare expected savings with the engineering and monitoring cost before adding a routing layer. [Source: model provider pricing.](https://www.anthropic.com/pricing) The tradeoff: routing logic is code you maintain. If it breaks, the whole system degrades silently. I test routing decisions explicitly and log which model handled each task type.

### 3. Human-in-the-Loop Gates vs. Full Automation

Every AI system has low-stakes reversible tasks (safe to automate) and high-stakes or irreversible tasks (require human approval). Confusing these categories is where real failures happen.

My rule: if the action touches money, sends a message to a real person, or deploys code to production, it requires explicit human approval. Everything else runs automatically. The practical implementation is an approval queue — agents propose actions, the owner approves with a single tap. More on the full workflow in [How I Use Agentic AI to Run a One-Person Company](https://zacharyvorsteg.com/blog/how-i-use-agentic-ai-one-person-company/).

## What Breaks When You Get Architecture Wrong

I have broken all three of the above at least once.

**Stateless when stateful was needed.** AI receptionist forgot a caller's previous contact, leading to repeated intake questions on the second call. Fixed by writing call summaries to persistent storage after every session. According to the 2025 Stack Overflow Developer Survey, 45% of developers find debugging AI-produced errors more time-consuming than standard debugging — building structured logs upfront is faster than reconstructing them after a failure. [Source: Stack Overflow Developer Survey 2025.](https://survey.stackoverflow.co/2025/ai)

**No routing, just brute-force capable model.** Monthly AI spend spiked above $800 when a batch job accidentally used the most expensive model for thousands of short classification tasks. Fixed by adding a routing layer that checks task complexity before model selection. Different per-token prices made the model choice material to that batch job. [Source: model provider pricing.](https://www.anthropic.com/pricing)

**Missing human gates.** An automated outreach sequence sent follow-up messages to prospects who had already replied "not interested" — the suppression logic ran after the send, not before. Fixed by inverting the check order. That incident is the reason every demand cycle now starts with a QA audit before any send goes out.

The common thread: failures in AI systems are usually silent. According to McKinsey's State of AI 2025, 30% of organizations experienced AI-related inaccuracy problems. [Source: McKinsey State of AI 2025.](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) Observability — structured logs, output audits, exception alerting — is not optional.

## The Skill Gap the Job Postings Miss

According to Axial Search (2026), observability appears in 39% of AI architecture job postings. In practice it is underweighted. Building the system is the easier part. Knowing whether it is working correctly — for a client you are not actively monitoring — is the hard part. [Source: Axial Search AI Architecture Jobs 2026.](https://axialsearch.com/insights/ai-architecture-jobs)

Skills that matter most for solo AI systems work:

1. **Prompt engineering under constraints** — instructions that hold up across edge cases, not just the happy path
2. **Cost modeling** — knowing what a workflow costs per run before you ship it, not after
3. **Failure mode thinking** — asking "what breaks silently?" before every deployment
4. **Log design** — structured logs that let you diagnose problems from output alone, without re-running the workflow

None of these appear prominently in job postings. Cloud platforms and Python do, because they are easy to screen for. According to McKinsey's State of AI 2025, only 23% of organizations are scaling agentic systems — which means most enterprise teams are still in pilot mode. Solo founders operating agentic systems in production for a year or more have more real failure data than most enterprise teams, and that advantage closes slowly. [Source: McKinsey State of AI 2025.](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)

## FAQ

**What does an AI systems architect do day-to-day?**
Design the structure of how AI models, memory, data pipelines, and output handlers connect — then maintain and improve that structure as products evolve. Day-to-day it is a mix of prompt engineering, cost monitoring, and diagnosing silent failures.

**Do you need a Computer Science degree to work in AI architecture?**
According to Axial Search (2026), many AI architecture postings specify a degree and the median experience requirement is 7 years. In practice, shipping real systems in production matters more than credentials. Most of what I know came from building under real cost and reliability pressure. [Source: Axial Search AI Architecture Jobs 2026.](https://axialsearch.com/insights/ai-architecture-jobs)

**Is Palm Beach a good place for AI founders?**
Palm Beach works for the way I build: I can stay close to the business workflows my products serve while collaborating remotely on technical work. That is my experience, not a ranking of places to hire or find a community. A founder choosing a base should consider their customers, collaborators and personal constraints.

**What is the hardest part of running AI systems solo?**
Observability. A system can pass every local test and degrade silently in production. Without a team to catch it, you need instrumentation that catches problems before clients do. According to the 2025 Stack Overflow Developer Survey, 66% of developers say the biggest AI frustration is output that is almost right but not quite — in a live system, "almost right" at scale is a real problem. [Source: Stack Overflow Developer Survey 2025.](https://survey.stackoverflow.co/2025/ai)

**How much does it cost to run an AI-based product solo?**
It depends on call volume and model selection. My September 2026 operating-cost snapshot was $370–$590/month. Model costs vary by tier; routing expensive models only to tasks that need them is one cost control to evaluate against actual workload and quality requirements. [Source: model provider pricing.](https://www.anthropic.com/pricing)

Building something similar? [Reach out](https://zacharyvorsteg.com/#contact) — or see the ventures at https://zacharyvorsteg.com/#ventures.

<!-- content-artifact-sha256: undefined -->

---
title: How I Build in Public as a Technical Founder
description: "I run a multi-market trading infrastructure, ship iOS apps, and build IoT hardware — all solo. Here's what I share, what I keep private, and why transparency compounds."
keywords: build in public, technical founder, building in public, solo founder transparency, open startup, indie hacker build in public, solo founder accountability, building in public framework
date: 2026-03-20
pillar: Building in Public
speakable: "Zachary Vorsteg explains how building in public works for technical founders who run multiple ventures — covering what to share, what to keep private, and the measurable returns from transparency. The post includes a decision framework, a four-week starter plan, and data from Carta, Edelman, Buffer, Stripe, and GitHub."
---

Most "building in public" content amounts to indie hackers tweeting MRR screenshots. Fine for SaaS solo acts — but that barely scratches what transparency looks like when you're simultaneously juggling trading bots, an iOS app, and sensor networks across multiple sites.

I'm a [licensed commercial real estate broker who codes](/blog/why-im-a-commercial-real-estate-broker-who-codes/), the founder of [Trusenda](https://trusenda.com), and a builder shipping across trading automation, iOS apps, IoT hardware, and this site. Building in public isn't some growth hack for me. Honestly? It's the only reliable mechanism I've found for keeping myself accountable across all of it.

What I share, what stays private, and the returns I've actually measured — that's what follows. If the "just be authentic" crowd burned you, consider this the tactical antidote.

## Why I Started Building in Public

Followers weren't the motivation. Drowning was.

Dozens of [trading strategies](/blog/algorithmic-trading-bots-side-project/) across multiple markets. An iOS app in active development. IoT sensor networks. A [full CRE practice](/blog/why-im-a-commercial-real-estate-broker-who-codes/). All running simultaneously. Things slip through cracks when you operate like that — invisible things, the kind that surface three months later when you discover a system's been silently failing since Tuesday.

Building in public forced a discipline: articulate what you're working on, why it matters, what actually happened. Even when zero people are reading, that act of writing catches problems early. Rubber duck debugging, but for your entire operation.

Carta's Solo Founders Report (2025) validates a trend I was already feeling: solo-founded startups surged from 22% of new US companies in 2015 to 38% in 2024. More people than ever managing everything alone. More people who desperately need transparency systems — not another productivity hack from someone with a team of twelve.

## What Building in Public Actually Means

The term's been diluted beyond recognition. Let me be specific about what I mean.

**Building in public is NOT:**

- Tweeting "shipped a feature!" with no context
- Posting revenue screenshots for vanity metrics
- Performing vulnerability to manufacture authenticity

**Building in public IS:**

- Sharing your decision-making process, including the bad calls
- Documenting systems, not just outcomes
- Being specific enough that someone could learn from or poke holes in your approach

From the 2025 Edelman Trust Barometer: 60% of consumers rank trust and transparency as the most important brand traits. But here's the thing — transparency without substance is just noise. When Pieter Levels shares his $3.1M ARR (annual recurring revenue) across multiple products built entirely solo — as tracked by Indie Hackers in 2025 — the number isn't the point. The architecture behind how one person generates that revenue is.

Show the stack. Share the trade-offs. Document the failures. Not the launch day screenshot.

## What I Share (And What I Don't)

Most building-in-public guides offer "be transparent" without ever defining boundaries. Useless advice, that.

### What I Share Freely

- **Architecture decisions** — why Supabase over Firebase, why SwiftUI over UIKit for BidPro, why Python over Go for trading automation
- **System design** — how production trading systems are orchestrated via launchctl, how [the IoT network communicates over cellular backhaul](/blog/shipping-iot-hardware-solo/)
- **Mistakes and post-mortems** — the bot logic error that cost real money, the deployment that bricked a sensor node
- **Process** — my approach to [financial modeling](/blog/financial-modeling-fundamentals/), my build pipeline for this blog, how I test across platforms
- **Directional numbers** — performance ranges, user counts, uptime percentages

### What I Keep Private

- **Exact trading strategies** — sharing alpha (excess returns from a proprietary trading strategy) is how you lose alpha
- **Client details** — CRE deals involve confidentiality obligations
- **Proprietary algorithms** — the logic stays private; the infrastructure is fair game
- **Security configurations** — API keys, auth flows, attack surface. Obviously.
- **Unreleased product specifics** — I'll share after launch, not before competitors can copy

Share process and architecture. Protect edge and relationships. Whole framework, right there.

## The Compound Returns of Transparency

### Trust Compounds Faster Than Marketing

From the 2025 Edelman Trust Barometer: 81% of consumers must trust a brand before purchasing — and 87% will pay more for brands they trust. Every honest failure post, every architecture breakdown, every real metric functions as a trust deposit. Not marketing spend. The [financial modeling](/blog/financial-modeling-fundamentals/) of transparency matters here: compounding credibility accrues whether you're paying attention or not, and the returns are measurable across customer acquisition, retention, and willingness to pay premium prices.

Buffer ran an experiment that proved this dramatically. They've shared salaries and revenue publicly since 2013 — and when they first published their salary formula, job applications jumped 128% in 30 days, from 1,263 to 2,886 applications, according to Buffer's own transparency report. No recruiter on earth generates that kind of lift. None.

### Your Readers Become Your Team

Build-in-public founders across Indie Hackers, Product Hunt, and Hacker News consistently pull in early adopters before they've shipped anything. Share the process; people materialize.

When you're building solo, this dynamic hits differently than it does for a funded startup with a marketing department. Followers morph into beta testers, bug reporters, referral sources — occasionally genuine collaborators. No HR department required. I lean on [agentic AI](/blog/how-i-use-agentic-ai-one-person-company/) and [agentic engineering patterns](/blog/agentic-engineering-patterns/) to scale this feedback loop — letting AI agents handle the operational throughput while I focus on directional decisions. My strongest early feedback on BidPro came from people who'd been reading about the architecture decisions for months before they ever opened the app. I didn't recruit them. They recruited themselves because the work was visible.

### Public Commitments Are Harder to Break

Underrated, this one. When you publicly commit to shipping something, the gravitational pull toward actually shipping it is remarkable. When you publicly document your architecture, you maintain it — because someone might call you out if it rots. Transparency becomes the management layer solo founders otherwise lack entirely.

I've killed three projects I should have killed sooner. Fair enough. But I've also finished a dozen I absolutely would have abandoned in stealth mode. No manager pinging for status updates. No board expecting quarterly progress decks. Your audience steps into the accountability role you can't hire for. The flipside: [what actually breaks when you automate everything](/blog/what-breaks-when-you-automate-everything/) — public commitments expose the gaps in your automation infrastructure and force you to maintain them properly.

### Writing Forces Understanding

Every post I write about one of my systems forces me to understand it more deeply than I did before sitting down. Writing about error recovery in my trading bots exposed three edge cases I'd completely missed. Documenting IoT sensor calibration surfaced a temperature drift problem I'd been unconsciously ignoring for months — the kind of slow-burn issue that compounds into hardware failures if you don't catch it.

Feynman nailed it: if you can't explain something clearly, you don't actually understand it. I use [context engineering](/blog/context-engineering-ai-agents/) to speed up this understanding process — and I'm deliberate about [where I draw the line on AI-generated code](/blog/vibe-coding-vs-real-engineering/) versus hand-written solutions. Six months of public posts become a knowledge base you genuinely reference — unlike private notes decaying in some folder you forgot existed.

## My Building-in-Public System

Random posting doesn't scale. Systems do. Motivation absolutely does not. I've automated and optimized this entire process — see [my solo founder automation stack](/blog/my-solo-founder-automation-stack/) for the full technical architecture.

**Weekly cadence:**

1. Document one technical decision or system change
2. Share one metric or result (even if it's bad)
3. Write one long-form post per month

**Content tiers:**

| Tier | Type | Effort | Value | Example |
|------|------|--------|-------|---------|
| **1** | Architecture post | 3-4 hours | Highest — shareable, rankable, evergreen | "Solo founder trading automation: system architecture & launchctl orchestration" |
| **2** | Retrospective | 1-2 hours | High — builds trust, drives engagement | "The bot error that cost me money (and how I fixed it)" |
| **3** | System update | 30 minutes | Moderate — maintains consistency | "March update: new sensor nodes deployed, BidPro v2 shipped" |

Notice what this is: a publishing system, not a personality trait. You don't need to be an extrovert or a natural storyteller. You need a repeatable process for converting work you're already doing into artifacts other people can learn from.

## Building in Public vs. Building in Stealth

"Won't competitors steal my ideas?" I hear this constantly. Almost weekly, in fact.

| Factor | Building in Public | Building in Stealth |
|--------|-------------------|-------------------|
| **Community engagement** | Measurably higher (documented across Indie Hackers, Product Hunt, Hacker News) | Baseline |
| **Consumer trust requirement** | 81% need trust before buying (Edelman, 2025) | Must build trust entirely post-launch |
| **Time to first customer** | 20% of Stripe Atlas startups charge within 30 days — up from 8% in 2020 (Stripe, 2025) | Longer sales cycles without social proof |
| **Talent attraction** | 128% more applications with transparency (Buffer, 2013) | Standard recruiting pipeline |
| **Competitive risk** | Ideas are cheap; execution is the moat | False security — competitors find out anyway |
| **Feedback loops** | Real-time from engaged audience | Delayed until post-launch |
| **Solo founder exit rate** | 52.3% of successful exits by solo founders (Carta, 2025) | Same baseline — but weaker support network |

Stripe's 2025 Atlas Year in Review paints a stark picture: 23,000+ companies incorporated through their platform that year alone — a 36% year-over-year increase. When the market mints companies that fast, execution speed and genuine customer relationships matter infinitely more than guarding an idea in a locked Google Doc.

Here's the real risk nobody talks about. It's not someone stealing your concept. It's building alone, missing critical feedback loops, and shipping something nobody actually wants. Stealth mode doesn't protect you from irrelevance.

## How to Start Building in Public Today

Been building in stealth? Here's a four-week ramp that won't blow up your existing workflow.

**Week 1: Document one decision.** Not the code — the reasoning behind it. "I chose X over Y because Z." Post it anywhere. Blog, tweet, Discord server, a newsletter with 12 subscribers. Medium doesn't matter. Building the muscle does.

**Week 2: Share one number.** Users, uptime, deployment frequency, revenue range, bot count — pick something concrete. Numbers create a type of credibility that pure narrative simply can't match.

**Week 3: Write one failure.** What broke, why it broke, how you fixed it. Counterintuitively, failure content generates the highest trust of anything you'll ever publish. GitHub's Octoverse 2025 report reveals that 81.5% of all code contributions happen in private repositories — most technical work is invisible by default. Making yours visible, failures included, instantly differentiates you among the 180 million developers now on the platform.

**Week 4: Set a cadence.** Pick something you can genuinely sustain for 12 months. Monthly is fine. Weekly is better. Daily burns most solo founders to a crisp within weeks.

**Then keep going.** Compounding doesn't kick in for 3-6 months — and most people quit after three weeks because the audience is tiny. It's supposed to be tiny. You're assembling a body of work, not chasing a viral moment. Patience isn't optional here.

## Frequently Asked Questions

### What should a technical founder share when building in public?

Architecture decisions, system designs, directional metrics, and honest retrospectives. The stuff that's specific enough for readers to learn from — or poke holes in. Build-in-public founders on Indie Hackers, Product Hunt, and Hacker News consistently get stronger engagement than stealth launches. Protect proprietary algorithms, exact trading strategies, and anything client-confidential.

### Won't competitors steal my ideas if I build in public?

Almost always overblown. Stripe's 2025 Atlas data: 23,000+ new companies incorporated through their platform alone that year. Ideas are abundant. Execution is scarce. Your moat is speed, customer relationships, and accumulated institutional knowledge — not secrecy.

### How do I build in public without spending hours on content?

Treat it as documentation, not content creation. Every technical decision already has reasoning behind it — write that down in 30 minutes per week. What you decided, why, what happened. It's maintenance writing, not creative writing. And it pays dividends in clarity even if nobody reads it.

### Is building in public only for SaaS founders?

Not remotely. I apply it across CRE brokerage, trading automation, IoT hardware, and iOS development. Edelman's 2025 Trust Barometer: 60% of consumers rank trust and transparency as the most important brand traits — regardless of industry. Principles are universal. Content varies by domain.

### How long before building in public shows results?

Three to six months before compounding kicks in. Buffer's decade of transparency turned their open salary policy into a permanent recruiting advantage. For solo technical founders, the immediate payoff is accountability and clearer thinking about your own systems — the audience comes later. Consistency builds it, not any single post.

### What platforms work best for building in public?

Depends on your audience. Technical founders get the strongest engagement on Hacker News, GitHub Discussions, and Indie Hackers — communities that reward depth over polish. Twitter/X works for reach but favors short-form over substance. Long-form blogs (like this one) compound over time because search engines index them and AI systems cite them. Newsletter platforms like Substack or Beehiiv add a direct subscriber relationship. Start with one platform you'll actually sustain for 12 months. Multi-platform distribution is a Year 2 problem.

---

Running multiple ventures solo requires building in public as an operational discipline. Explore [what I'm building](https://zacharyvorsteg.com/#work) or [reach out](https://zacharyvorsteg.com/#contact) — always happy to talk shop with other builders.

<!--
SELF_ASSESSMENT:
WORD_COUNT: ~1,950
H2_COUNT: 8
SOURCED_STATS: 9 (Carta solo founders 22%→38%, Edelman 60% trust/transparency, Edelman 81% trust before buying, Edelman 87% pay more, Buffer 128% application increase, Pieter Levels $3.1M ARR, Stripe Atlas 23,000+ companies 36% YoY, Stripe 20% charge within 30 days, GitHub Octoverse 81.5% private repos 180M developers)
FAQ_COUNT: 6
TABLE_COUNT: 2
CODE_SNIPPETS: 0
INTERNAL_LINKS: 11 unique destinations (/blog/my-solo-founder-automation-stack/, /blog/algorithmic-trading-bots-side-project/, /blog/financial-modeling-fundamentals/, /blog/why-im-a-commercial-real-estate-broker-who-codes/, /blog/context-engineering-ai-agents/, /blog/vibe-coding-vs-real-engineering/, /blog/how-i-use-agentic-ai-one-person-company/, /blog/agentic-engineering-patterns/, /blog/what-breaks-when-you-automate-everything/, /#work, /#contact)
-->

<!--
GEO_META:
SPEAKABLE: Zachary Vorsteg explains how building in public works for technical founders who run multiple ventures — covering what to share, what to keep private, and the measurable returns from transparency. The post includes a decision framework, a four-week starter plan, and data from Carta, Edelman, Buffer, Stripe, and GitHub.
KEY_TAKEAWAY: Building in public is a publishing system and accountability structure, not a personality trait — and it produces measurable returns in trust, community, and knowledge compounding for solo technical founders.
ANSWERS_QUERIES:
- What should a technical founder share when building in public?
- Is building in public worth it for solo founders?
- How do I start building in public without spending hours on content?
- What are the risks of building in public versus building in stealth?
- How long does it take for building in public to show results?
- What platforms work best for building in public?
CITABLE_FACTS: 9
NAMED_ENTITIES: 22 (Carta, Edelman, Buffer, Stripe Atlas, GitHub Octoverse, Indie Hackers, Product Hunt, Hacker News, Pieter Levels, Trusenda, Supabase, Firebase, SwiftUI, UIKit, BidPro, Richard Feynman, Python, launchctl, Twitter/X, Substack, Beehiiv, GitHub Discussions)
FAQ_QUESTIONS: 6
TABLES: 2
-->

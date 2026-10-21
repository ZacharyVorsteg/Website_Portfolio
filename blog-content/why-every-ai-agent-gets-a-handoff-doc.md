---
title: "Why Every AI Agent I Run Gets a Handoff Doc First"
description: "Before an AI agent touches a real business process, I write it a one-page handoff: scope, gates, stop rules and a ledger. Here is the template."
keywords: "ai agent handoff document, ai agent runbook small business, human in the loop ai agents, ai agent approval gates, ai operating layer small business"
date: 2026-10-20
pillar: AI & Engineering
target_query: ai agent handoff document
speakable: "Zachary Vorsteg explains why every AI agent he runs starts with a one-page handoff document covering scope, inputs, quality gates, stop rules, a ledger and a reporting cadence. The post walks through each section, the failure modes it prevents, and how a small business owner can write the same document in an afternoon before handing any recurring process to an agent."
---

The most useful thing I build for an AI agent is not a prompt. It is a one-page handoff document, written before the agent touches anything real.

I learned this the slow way. Early on, I would describe a job to an agent in a chat window, watch it do a decent first pass, and assume the job was handled. A week later the output had drifted: a step skipped, a check forgotten, a format that slowly changed. Nothing broke loudly. It just got a little worse every run, and I only noticed when I went looking.

Now every recurring job gets a written handoff first. Same idea as onboarding a new hire: you would not hand someone a recurring process with a five-minute verbal brief and no checklist. An agent deserves the same respect, and it needs it more, because it will follow what you wrote with total confidence, gaps included.

## Why This Matters More Now

Adoption is moving fast. The Census Bureau's Business Trends and Outlook Survey found that the share of U.S. firms using AI in producing goods or services rose from 4.6% at the start of 2024 to 10% by September 2025, as summarized by the [Economic Innovation Group](https://eig.org/how-many-businesses-are-using-ai/). In November 2025 the survey broadened the question to cover AI use in any business function ([Census Bureau](https://www.census.gov/hfp/btos/downloads/AI%20Question%20Wording%20Updates.pdf)), and by that wider measure about 18% of firms were using AI at the end of 2025, according to a [Federal Reserve note](https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html). The same note reports that over 20% of firms expected to be using AI in the first half of 2026.

So a lot of small businesses are about to hand real work to software that makes decisions. The ones that do it well will not be the ones with the cleverest prompts. They will be the ones that wrote down what "done right" means before they let go.

## What Goes in the Handoff Doc

My handoff docs are short. If one runs past a page or two, the job is probably two jobs. Every doc has the same seven sections.

### 1. Scope: what this agent owns, and what it does not

One sentence on the job, then a list of explicit exclusions. Exclusions matter more than the job description. "Writes and publishes one blog post per weekday" is the job. "Does not edit pages another process is working on this week, does not touch pricing pages, does not post to social" are the fences.

Agents are eager. If a nearby task looks related and nothing says it is off-limits, a capable agent will helpfully do it. The exclusion list is where you say no in advance.

### 2. Inputs: where the work comes from

Where does the agent get its raw material? A backlog file, a shared inbox, a spreadsheet, a form submission. Name the exact source and what to do when it is empty. "If the backlog is empty, stop and report" is a perfectly good instruction. "Figure something out" is how you get filler.

### 3. Steps, in order

A numbered list, written like a checklist for a careful new hire. Not prose. Each step should be something you could look at afterward and say yes, that happened, or no, it did not.

The test I use: could someone who has never seen this job follow the list and produce acceptable work? If not, the list is missing something that lives in my head, and the agent cannot read my head.

### 4. Gates: what has to be true before anything goes out

This is the section that does the most work. A gate is a check that must pass before the output becomes visible to anyone outside the business. For content, my gates look like this:

- Every number has at least two real sources, recorded in a separate facts file.
- Every link returns a working page.
- The piece passes a brand checklist: topics it must never touch, claims it must never make.
- A preview of the change is reviewed before it goes live.

Gates should be binary. "Looks good" is not a gate. "The page returns a 200 status and the new URL is in the sitemap" is a gate. If you cannot check it with a yes or no, rewrite it until you can.

### 5. Stop rules: when the agent should quit and tell you

Most automation failures I have seen were not wrong answers. They were the system pressing on when it should have stopped. So every handoff has explicit stop rules:

- If any gate fails, leave the work unpublished and report why.
- If an input looks unusual, such as a duplicate, a missing field or something out of range, stop instead of guessing.
- If the same step fails twice, stop.

Writing stop rules forces a useful question: what is the worst thing this agent could do if it kept going? Whatever the answer is, put a stop rule in front of it.

### 6. Ledger: one line per run

Every run appends one line to a log: when it ran, what it did, what it produced, whether it passed. That is it. No dashboards required.

The ledger is what turns "I think it has been working" into "here is every run since it started." It is also how you catch drift. If the ledger shows the agent skipping a step more often than it used to, you see it in a minute instead of in a month. I wrote more about the quiet ways automation degrades in [What Breaks When You Automate Everything](/blog/what-breaks-when-you-automate-everything/).

### 7. Reporting: how often you hear about it

Pick a cadence and a format. Mine is usually a short weekly note: what shipped, with links, and anything that failed. Failures get reported immediately. Successes can wait for Friday.

The point is to keep yourself informed without having to supervise. If you are reading every output in real time, you have not delegated anything. You have just added a step.

## Why a Document Beats a Better Prompt

People ask why I do not just write a longer prompt. There are three reasons.

**It survives handoffs.** A document lives in a file, not a chat history. When I change tools, restructure a workflow, or hand a job from one agent to another, the doc moves with the job. The rules do not get lost in a conversation nobody can find.

**It is reviewable.** I can read a one-page doc in two minutes and know exactly what the agent is allowed to do. That is also true for anyone else who needs to understand the process. A forty-message chat thread is not reviewable.

**It forces me to decide things.** Most of the value comes from writing it. When I sit down to fill in the stop rules section, I usually discover a decision I had been avoiding. What happens if a customer replies angry? What if the data source is down? The doc does not let me leave those blank.

I covered the configuration side of this, meaning what context an agent actually sees, in [Context Engineering for AI Agents](/blog/context-engineering-ai-agents/). The handoff doc sits one layer above that. It is the job description the context is built from.

## A Template You Can Use This Afternoon

If you run a small business and want to hand a recurring task to an agent, start here. Copy this into a document and fill it in before you automate anything:

```
JOB: [one sentence]
OWNS: [what it does]
NEVER: [explicit exclusions]
INPUT: [exact source] · if empty: [stop / report]
STEPS:
  1. ...
  2. ...
GATES (all must pass before anything is visible outside):
  - ...
STOP RULES:
  - any gate fails -> leave unpublished, report why
  - unusual input -> stop, do not guess
LEDGER: [file] · one line per run
REPORT: [cadence] · failures immediately
```

Pick a small, boring, recurring task for the first one: a weekly summary, a follow-up reminder, a report someone builds by hand every Monday. Not your most important process. You want your first handoff to be one where a mistake is cheap and visible, so you learn what your doc was missing.

## What This Looks Like in Practice

Across my own work, the jobs that run cleanly week after week all have a handoff doc, gates and a ledger. The ones that gave me trouble were the ones I set up quickly in a chat and never wrote down.

This post went through exactly that process. It was drafted against a written handoff, its numbers were checked against two sources and logged, its links were tested, and it went through a preview review before it was published. That is not a special ceremony for a blog post. It is just what the doc says to do.

That is the whole idea behind what I call an [AI operating layer](/ai-operating-layer/): not one clever agent, but a set of small, documented jobs with clear owners, clear gates and a paper trail. The agents are interchangeable. The documents are what make the system dependable.

## Where to Start

If you are thinking about putting AI to work in your business, write the handoff doc before you pick a tool. You will learn more about your own process in an hour of writing than in a week of trying tools.

If you are in Palm Beach County and want help mapping which of your processes are ready for this, and which are not, my [AI consulting page](/ai-consulting-west-palm-beach/) explains how I approach it, or you can [send me a note](/?topic=ai#contact) through the contact form.

*This post describes my own working process. It is general information, not legal, compliance or financial advice. Whether a given process is appropriate to automate depends on your business and any rules that apply to it.*

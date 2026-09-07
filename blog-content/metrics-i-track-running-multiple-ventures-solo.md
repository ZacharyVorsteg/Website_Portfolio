---
title: "The Metrics I Actually Track Running Five Ventures Solo"
description: "Most founder dashboards are noise. Here are the specific numbers I check every day across five ventures—and what I stopped tracking entirely."
keywords: solo founder metrics, multi-venture founder KPIs, one-person company dashboard, tracking multiple businesses solo, solo operator metrics, indie founder performance indicators, technical founder metrics 2026, venture portfolio solo founder
date: 2026-09-02
pillar: Solo Founder Operations
---

# The Metrics I Actually Track Running Five Ventures Solo

Running five ventures at once without a team means your attention is the most limited resource you have. I have 54 automated trading bots, two SaaS products, a commercial real estate practice, and a CRM I built myself. What I track—and what I ignore—determines whether I'm making decisions or reacting to noise. This post covers exactly what's on my dashboard and why each number earned its spot.

---

## Why Most Founder Dashboards Are Useless

The default advice is to track everything. Stripe gives you a revenue graph. Google Analytics gives you session counts. Your CRM gives you a pipeline view. You end up with six tabs open and no idea what to do next.

The problem isn't a lack of data. It's that most dashboards answer "what happened?" when you need "where should I spend the next two hours?"

According to the [U.S. Census Bureau](https://www.census.gov/programs-surveys/nonemployer-statistics.html) Nonemployer Statistics program (2022), there are approximately 27.1 million nonemployer businesses in the United States—businesses with no paid employees, run entirely by one person or a small partnership. Almost none of them have a dedicated analyst.

According to the [Bureau of Labor Statistics](https://www.bls.gov/cps/cpsaat15.htm) Current Population Survey (2024), roughly 15.8 million Americans are self-employed across incorporated and unincorporated businesses. Most track vanity metrics—total signups, page views, follower counts—because those numbers go up and feel good. They don't point to an action.

According to [Paul Graham](http://paulgraham.com/foundermode.html) in his "Founder Mode" essay (September 2024), the instinct to manage by summary and abstraction is where founders lose touch with what's actually happening in their companies. His argument was directed at founders with teams, but it lands harder for solo operators: when you're the only person in the building, a bad metric reading has no one to investigate it but you. The metric has to be precise enough to tell you where to look.

I wasted the first year of running multiple ventures on exactly this problem. A dashboard full of trailing indicators that told me what already happened and nothing about what to change.

Now I run a single daily review that takes about eight minutes. Here's what it covers.

---

## The Five Numbers I Check Every Morning

These are the only metrics that show up in my daily standup with my AI agent stack. Each one requires an action if it's off; none of them are purely informational.

| Metric | Venture | What "off" means | Action threshold |
|---|---|---|---|
| Cost per lead (CPL) | AdsHandled | >$35 | Pause, rotate creative |
| Demo request count | CallsHandled | 0 for 48h | Check routing, check form |
| Open deal count | Trusenda / CRE | Stale >7d | Send a touchpoint or close |
| Bot uptime % | Trading | <95% | Check launchctl logs, restart |
| New inbound messages | All | Any unread >4h | Reply or route to agent |

**Cost per lead** is the number I've learned to trust most for paid acquisition. It's a leading indicator: if CPL spikes before volume drops, I catch a problem before I've burned budget. On AdsHandled, CPL above $35 almost never produces a client within a normal sales cycle. Below $28 consistently means the creative is doing real work.

**Demo request count** at zero for 48 hours isn't always a demand problem. Half the time it's a routing issue—a webhook that stopped firing or a form field that broke after a deploy. I learned this the hard way after spending a week tweaking messaging when the problem was a misconfigured endpoint. Now zero for 48 hours triggers a technical check first, demand hypothesis second.

**Open deal count** per venture with a staleness flag is the closest thing I have to a CRM nag. If a deal hasn't moved in seven days, it's either dead or needs a nudge. Both are worth knowing. Trusenda—the CRM I built specifically for commercial real estate—surfaces this automatically. I built the staleness flag after losing two deals in a quarter to silence I mistook for "still warm."

**Bot uptime** matters because I have 54 trading bots running on launchctl across several strategies. A single bot going down is fine. Three going down simultaneously usually indicates something systemic—a connectivity issue, a credential rotation I forgot, or a dependency that broke. Uptime below 95% fleet-wide is the signal I watch. I wrote more about how the system works in my post on [building 54 trading bots as a side project](/blog/algorithmic-trading-bots-side-project/).

**Unread inbound messages** across all ventures is the human layer nothing else replaces. A potential client who waited five hours for an answer on a $500/month service usually doesn't stick around. I route everything through a single intake queue, but the queue still needs a human decision on edge cases.

---

## Per-Venture Metrics That Go Deeper

Beyond the daily five, each venture has one number that gets a weekly review.

**AdsHandled:** Client retention rate by month. Paid acquisition is pointless if clients churn at 60 days. I track month-1 and month-3 retention separately. Month-1 churn almost always signals an expectation problem at close; month-3 churn usually means they didn't see results yet. The interventions are different.

**CallsHandled:** Demo-to-trial conversion rate. Getting a demo booked is the top of the funnel. Whether the person who takes the demo requests a trial tells me whether the product actually lands. This number is harder to move than CPL but is more predictive of revenue.

**CRE Practice:** Pipeline-weighted probability. I have a small number of deals at any given time, so I weight each one by close probability and sum them. A simple expected-value calculation. When that sum drops below a threshold, I know I need to do more prospecting, not more deal-nurturing.

**Trusenda (the CRM product):** Days since last user-initiated action. Not admin actions, not automated events—actions a real user took because they found the product useful. This tells me whether the product is sticky or just installed. If that number creeps past 14 days, something is wrong with the core loop.

**Trading bots:** Sharpe ratio by strategy bucket. Not raw P&L. Absolute returns without risk adjustment are misleading because a strategy that returned 12% by taking catastrophic correlation risk is worse than one that returned 8% with a clean drawdown profile. I group the 54 bots into five strategy buckets and review the Sharpe for each weekly.

---

## What I Stopped Tracking

The metrics I removed were harder to cut than the ones I added. Here's what left my dashboard and why.

**Total signups.** A signup is not a user. It's an email address. I tracked signups for about eight months before realizing I was optimizing for a number that had almost no relationship to revenue or retention. I now only care about signups that took at least one meaningful action within 48 hours.

**Social media follower counts.** Completely gone. Followers on any platform are a lagging, gamed, algorithm-dependent number. The metric I care about is inbound messages that reference specific content—that tells me something resonated. Aggregate counts don't.

**Website sessions.** I still have analytics installed, but I don't review session counts in my daily or weekly routine. Session counts without conversion context are noise. The exception: if CPL spikes or demo volume drops, I'll look at sessions to see if there's a traffic problem upstream. It's a diagnostic tool, not a performance indicator.

**Revenue by day.** This one took me the longest to drop. Checking daily revenue felt important. In practice, it caused me to make campaign decisions based on noise rather than signal. I now review revenue weekly with a 4-week rolling average. That's the number I actually act on.

I wrote about some of the broader failure modes that come from automating without the right measurement layer in my post on [what breaks when you automate everything](/blog/what-breaks-when-you-automate-everything/). The measurement mistakes I made as I automated were the most expensive lessons.

---

## The System Behind the Numbers

The dashboard itself is a custom SQLite database that aggregates data from Stripe, my ad platforms, launchctl log files, and a small inbound queue tool I built for the ventures. Python scripts pull from each source every hour and write normalized rows with timestamps.

I don't use a SaaS dashboard tool for the daily review. I tried three of them over two years. The fundamental problem is that every tool wants to be your system of record, which means it wants you to import all your data into its format. The abstraction ends up hiding the details I actually need.

The eight-minute daily review is a structured prompt I give to my AI agent stack. It reads the current metric state, flags anything outside threshold, and produces a prioritized action list. The agent doesn't make decisions—it surfaces which venture needs attention first. I make the call.

According to [Stripe](https://stripe.com/annual-updates/2024) (2024 Annual Update), a growing share of new businesses on the platform are single-operator companies running multiple revenue streams simultaneously. The payment layer sees this as a structural shift in how businesses are formed, not a temporary trend.

According to the [Kauffman Foundation](https://www.kauffman.org/entrepreneurship/) State of Entrepreneurship (2023), founders who establish structured operating rhythms in the first 12 months show higher two-year survival rates than those who operate reactively. The foundation attributes much of that gap to decision latency: without actionable metrics, founders can't catch problems until they're expensive.

According to [Y Combinator](https://www.ycombinator.com/blog) founder research (2024), solo founders now represent a meaningful and growing fraction of companies in the accelerator, as AI tooling has reduced the team size required to ship and operate software. The operational challenge they face is the same one I've navigated: a solo operator can only respond to what they're measuring, so measurement choices are strategic, not administrative.

---

## Building Toward This System

The first version of this dashboard was a spreadsheet I updated manually every Monday morning. It took about 45 minutes and I skipped it whenever I was busy—which is exactly when it mattered most.

Automating the data pull was the single highest-return infrastructure investment I've made. The scripts are not elegant. They're eight Python files totaling maybe 600 lines, each pulling from a different API or log file and inserting rows into the same SQLite schema. When I add a new venture, I write a new script. Total setup time for a new data source is usually 90 minutes.

The threshold logic lives separately from the data pull. A YAML file defines, for each metric, the green/yellow/red boundaries and the first-response action for yellow and red. When the morning review runs, it reads current values, compares against thresholds, and generates a plain-text report sorted by severity. No charts. Just text and actions.

That choice—text over charts—is deliberate. Charts are good for identifying trends over time. They're bad for answering "what do I do right now?" A sentence that says "CallsHandled demo volume is 0 for 52 hours; check webhook config at /api/demo-request" is more useful than a line chart showing a dip.

---

## FAQ

**How long does your daily metric review actually take?**

Eight minutes on most days. The structured prompt takes about 90 seconds to run and produces a list of flagged items. If nothing is flagged, I move immediately to the highest-priority task I've pre-identified. If something is flagged, the diagnostic work that follows might take 20 minutes. The review itself stays bounded.

**Don't you need a co-founder or analyst to track this many ventures properly?**

The honest answer is that the metrics discipline replaces some of what a co-founder would provide—a forcing function to look at the business rather than just work in it. Whether that's better or worse than a co-founder depends on the ventures. For businesses where I'm the builder and the operator, solo tracking works. The measurement system can tell me where I'm understaffed; it can't fix it.

**What tool do you use for the actual dashboard?**

A SQLite file, a few Python scripts, and a structured agent prompt. No SaaS dashboard. The decision to build instead of buy came down to control over schema and the ability to add ventures without restructuring the whole setup. Maintenance cost is about 30 minutes a month when I'm adding a new data source.

**What's the most important metric for a new venture in the first 90 days?**

Conversations with potential customers per week. Not a product metric, not a financial metric. The number of genuine conversations about the problem you're solving. Before there's enough data for any of the metrics above to be meaningful, conversation volume is the only leading indicator that tells you whether you're building something real.

**How do you avoid metric fatigue when you're tracking five businesses?**

The answer is the threshold-plus-action structure. Every metric has a defined threshold and a defined first action. If nothing is outside threshold, I don't read the metric that day. Most metrics are green most days. The system only demands attention when something is actually wrong, which means eight minutes are genuinely spent on problems rather than reassurance.

---

## Sources

1. U.S. Census Bureau, [Nonemployer Statistics](https://www.census.gov/programs-surveys/nonemployer-statistics.html) (2022)
2. Bureau of Labor Statistics, [Current Population Survey Table 15](https://www.bls.gov/cps/cpsaat15.htm) (2024)
3. Paul Graham, ["Founder Mode"](http://paulgraham.com/foundermode.html) (September 2024)
4. Stripe, [2024 Annual Update](https://stripe.com/annual-updates/2024) (2024)
5. Kauffman Foundation, [State of Entrepreneurship](https://www.kauffman.org/entrepreneurship/) (2023)
6. Y Combinator, [Founder Resources and Blog](https://www.ycombinator.com/blog) (2024)

---

More at https://zacharyvorsteg.com — or reach out if you are building something similar.

# Qualified-inquiry experiment and measurement specification

**Decision for the current release:** Keep zacharyvorsteg.com a clear founder hub for mixed, referral, and organic traffic. Preserve an obvious property route: Zach identifies Palm Beach Warehouses as his strongest venture and the destination of most current advertising. Do not change that paid funnel, launch personal-site ads, or build a speculative paid landing page as part of this work. Fix observed usability defects now; treat conversion uplift as unproven until measured.

**Status:** Research/specification only, dated September 6, 2026. No new analytics provider, advertising changes, spending, live form submissions, or experiment deployment. Actual traffic, qualified-inquiry baseline, lead economics, and attribution coverage remain unverified.

## What the evidence establishes

| Primary evidence | Useful implication | Limit on the claim |
|---|---|---|
| NN/g's 2018 eye-tracking analysis included 120 participants and over 130,000 fixations on 1920×1080 screens; 57% of viewing time was above the fold. [Original study](https://www.nngroup.com/articles/scrolling-and-attention/) | Make the offer, trust context, and next action discoverable early. | Attention across varied tasks is not qualified B2B conversion. It does not prove that putting an entire form above the fold wins, especially on mobile. |
| Baymard's original checkout research identifies the burden of fields as more consequential to checkout usability than simply the number of steps. [Research article](https://baymard.com/blog/checkout-flow-average-form-fields) | Ask only what is needed to respond and route an inquiry; preserve optional phone/topic and error recovery. | Ecommerce checkout is a different task from an owner selecting a service provider. Its figures cannot be copied into a predicted B2B uplift. |
| Unbounce's 2024 report gives an all-industry median landing-page conversion rate of 6.6%. [Original benchmark](https://unbounce.com/conversion-benchmark-report/) | A broad external reference can generate questions about device, source, message, and friction. | This is observational, platform-selected data with varied conversion actions. It is neither Zach's baseline nor a qualified-inquiry target. |
| Randomization and proper experiment design support causal attribution; Microsoft also warns about repeated peeking and selection problems. [Experimentation research](https://www.microsoft.com/en-us/research/publication/online-experimentation-at-microsoft/), [during-experiment guidance](https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/) | Use a predefined outcome and stopping rule, with a real control. | Copying a successful competitor, observing a before/after increase, or reaching an attractive CTR does not isolate the design's effect. |

**Recommendation:** A prominent conversation CTA plus a compact anchored form is a reasonable current design for this mixed-intent hub. An early form is a testable alternative. The main risk is maximizing low-effort submissions while losing useful context, property routing, or lead quality.

## Define the outcome before changing the test

**Target business metric:** verified qualified inquiries originating from the founder hub per 1,000 eligible visitors. Count each eligible visitor at most once for the binary experiment endpoint; separately report number of opportunities and subsequent value.

An **eligible visitor** is a distinct browser/user in the existing measurement system whose first qualifying homepage view occurs during enrollment. Include bounces and visitors who never click or submit. Apply predeclared staff/test/bot exclusions equally before analyzing outcomes. Do not select the denominator based on later topic choice, form starts, or whether someone turns out to be an ICP. Cross-device identity is not assumed; do not fingerprint.

**Proposed qualification rubric, to freeze before enrollment:** a non-spam, non-duplicate inquiry from a real business decision-maker or someone acting for one; a concrete need within Zach's service/property scope; and enough information or follow-up confirmation to make a relevant next conversation plausible. Use explicit reason codes: `qualified`, `needs_clarification`, `outside_scope`, `vendor_or_solicitation`, `spam`, `duplicate`. Do not invent a minimum budget, revenue threshold, or property specification. Record partnerships separately rather than silently treating them as junk.

Qualification is a business assessment, not a browser event. Use the same reviewer/rubric and, where practical, hide the experiment variant during review. Record new inquiries received within **14 calendar days after first exposure**; complete qualification review within **two business days of receipt**. Wait for the final visitor's full window plus that review period before analysis. Freeze these proposed windows before launching, based on actual sales-cycle evidence if available. Unresolved cases remain a separately reported category; show sensitivity if assigning all unresolved cases to either outcome could change the decision.

**Measurement coverage gate:** A form transport acknowledgement is not confirmed delivery or qualification. Verify field → request → Netlify record → notification → qualification record using an authorized test and readback. Join the experiment assignment to the confirmed inquiry through an opaque ID in the existing system, after the relevant implementation is authorized. If only personal-site forms can be attributed, label the endpoint **qualified personal-site form inquiries per eligible visitor**. Do not claim total-business improvement while phone, email, or PBW-routed inquiries are unobserved. Keep the property route identical between form-placement variants; specialist link clicks remain routing diagnostics until downstream inquiry attribution is verified.

## Metric contract and guardrails

| Measure | Numerator / denominator | Decision role |
|---|---|---|
| Qualified inquiry rate | Visitors with ≥1 confirmed, qualified inquiry / all eligible assigned visitors | Primary endpoint, with its exact observable scope stated |
| Held conversation rate | Visitors with a verified held conversation / eligible visitors; fixed longer follow-up window | Downstream business confirmation, not an immediate substitute for the primary endpoint |
| Confirmed inquiry rate | Visitors with ≥1 verified received inquiry / eligible visitors | Funnel diagnostic; distinguish it from HTTP success |
| Primary CTA CTR | Visitors clicking the specified CTA / visitors exposed to that CTA | Diagnostic; cannot decide between layouts that change CTA exposure or bypass the CTA |
| Form completion | Visitors with a confirmed form inquiry / visitors starting the form | Diagnose friction; never replace the visitor-based primary denominator |
| Qualification share and handling burden | Qualified / confirmed inquiries; actual handling time per inquiry and per qualified inquiry | Guard against unusable volume; a lower qualification share alone does not veto a higher qualified-inquiry yield |
| Delivery, errors, spam, duplicates | Verified losses/errors; spam and duplicate counts with submission denominators | Any confirmed lost inquiry or broken submit/accessibility path triggers investigation/rollback |
| Response expectation | Inquiries receiving the first human response within the published one-business-day expectation / eligible received inquiries | Operational guardrail, using a defined business calendar |
| Property routing | Unique visitors using the property route / eligible visitors; downstream outcomes only where verified | Preserve the valuable specialist path; a click is not a property lead |

Before a test, set an acceptable handling-cost/capacity limit and a smallest economically worthwhile improvement using real operating data. Do not invent those thresholds. Report absolute percentage-point differences, relative changes, counts, and uncertainty. “No statistically significant harm” is not proof of equivalence or a passed non-inferiority test.

**Minimal proposed event vocabulary:** `experiment_exposure`, `cta_click`, `form_start`, `inquiry_transport_ack`, `inquiry_confirmed`, `qualified_inquiry`, `conversation_held`, `specialist_route_click`. The existing provider must be checked for current tags and deduplication before adding anything. Allow only experiment/variant IDs, a fixed placement/topic/source vocabulary, device category, and necessary opaque join IDs. Never send names, emails, phones, message text, raw URLs, or raw referrers to analytics. If the existing system cannot support reliable assignment and joining, gather a descriptive baseline instead of pretending the A/B test is ready.

## First conditional test: early form versus anchored form

**Hypothesis:** Moving the same inquiry form nearer the initial offer increases qualified inquiries by making the action easier to discover, without reducing comprehension, property routing, or operational quality. The competing hypothesis is that mixed/referral visitors benefit from understanding Zach and inspecting relevant work before filling it out.

- **A:** Current polished hero and clear conversation CTA leading to the compact anchored form.
- **B:** The same offer and same form presented directly with/after the hero introduction. On wide screens it may sit beside the introduction; on mobile keep the meaningful offer and action clear without shrinking the entire form to fit one screen. Remove the duplicate form at the bottom, retaining a return-to-form CTA.
- Keep fields, required/optional status, validation, error handling, response promise, proof, property route, and follow-up process the same. Do not simultaneously test headline, pricing, video, ad targeting, and form placement.
- Use 50/50 persistent assignment at the eligible-visitor level. Analyze everyone assigned, including non-clickers, under their original assignment. Confirm assignment and exposure counts reconcile; investigate sample-ratio mismatch or variant-specific missing data before interpreting results. [Microsoft pre-experiment guidance](https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-pre-experiment-stage/)
- Freeze one primary endpoint, target sample, minimum run duration covering at least two complete weekly cycles, and a maximum practical enrollment horizon before launch. Use balanced source/device assignment where supported. Predeclare organic/referral and mobile/desktop breakdowns as descriptive unless separately powered; do not mine segments for a winner.
- Stop early for a functional or operational failure. Do not repeatedly check ordinary p-values and stop when one crosses 0.05. At the predefined endpoint, use a two-sided test and a suitable 95% interval for the difference in proportions, alongside practical effect and guardrails. If early statistical decisions are needed, preselect a valid sequential design rather than applying fixed-horizon thresholds. [Microsoft guidance](https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/)

## Illustrative sample sizes — not the site's baseline

Assumptions: independent binary visitor outcomes, equal allocation, fixed-horizon two-proportion normal approximation, two-sided α=0.05, 80% power, no continuity correction, no clustering, no attrition or multiplicity adjustment. The assumed rates are **qualified inquiry rates**, not generic button or form-conversion rates. Stable repeated-visitor assignment and outcome coverage matter; these numbers may be optimistic if those assumptions fail.

With `p̄=(pA+pB)/2`, the approximate sample **per arm** is:

```text
n = ceil( [1.959963985 × sqrt(2 p̄(1−p̄))
         +0.841621234 × sqrt(pA(1−pA)+pB(1−pB))]² / (pB−pA)² )
```

Reproduce these figures with `python3 tools/conversion-sample-size.py`; the script prints JSON to standard output. This is a conventional two-sample proportion power-planning calculation; the R `power.prop.test` documentation specifies the corresponding per-group sample, significance, power, and two-sided inputs. Results below were computed directly from the displayed approximation and rounded up. [Official R documentation](https://www.stat.ethz.ch/R-manual/R-devel/library/stats/html/power.prop.test.html)

| Hypothetical change | Absolute / relative difference | Per arm | Total eligible visitors | At 100/week total | At 500/week total | At 1,000/week total |
|---|---:|---:|---:|---:|---:|---:|
| 3.0% → 4.5% | +1.5 percentage points / +50% | 2,518 | 5,036 | 50.4 weeks | 10.1 weeks | 5.0 weeks |
| 3.0% → 3.3% | +0.3 percentage points / +10% | 53,211 | 106,422 | 1,064.2 weeks | 212.8 weeks | 106.4 weeks |

These are enrollment-time arithmetic, not recommended durations. Add the full outcome-maturation/review window and the minimum weekly-cycle requirement. A years-long test is generally impractical because traffic, offers, and operations change. Power is a planning probability under the specified effect and assumptions, not an 80% probability that a future positive result is true. Neither scenario predicts a real uplift or ROI.

## Low-traffic execution plan

1. **Establish the baseline first.** Review the existing analytics and inquiry records for a clearly stated recent period, initially four complete weeks as a planning window, extending for sparse data. Record eligible visitors, source/device mix, confirmed inquiries, qualified inquiries, unresolved cases, delivery losses, response timing, and observed cross-domain coverage. Show counts and intervals; mark unavailable values as unavailable.
2. **Prioritize direct evidence now.** Fix the reproduced tablet wrapping/alignment and mobile contact-landing friction. These are usability improvements; a deployment is not itself causal conversion evidence. Record the release date so it is not confused with an experiment start.
3. **Use representative comprehension sessions.** Start with 5–8 actual target owners/referral visitors, including property-oriented visitors. Ask them to explain the offer, choose the relevant route, and begin an inquiry in a safe prototype. Note misunderstandings, time, and hesitation. This is qualitative defect discovery, not a conversion-rate estimate; do not convert “6 of 8 liked it” into a predicted lift. Arrange outreach only under separate authorization.
4. **Apply a feasibility gate.** From the real baseline, choose the smallest effect worth the effort and calculate the required sample. An eight-week enrollment cap is a proposed operational planning limit, not a statistical law. If the sample cannot be reached within the agreed horizon, do not launch a token underpowered test or keep extending until significance appears. Retain the clearest working design, improve message/proof quality, and collect more real qualified-inquiry evidence.
5. **Make an honest decision.** With enough data, ship a variant only when the primary effect and its uncertainty support a worthwhile business improvement and guardrails are acceptable. Otherwise record “inconclusive,” including effects the interval still permits. At low traffic, a documented usability judgment is more useful than false statistical certainty. Before/after trends remain descriptive because traffic composition and business conditions can change.

## Paid landing pages / Facebook: future conditional work

No personal-site advertising is running now, per Zach. PBW's existing advertising is outside this implementation scope. Keep the founder hub useful to mixed traffic and do not redirect active property campaigns here.

If a future campaign sells one clear service, route it to an offer-specific destination with the same promise, scope, proof, and CTA as the ad. A generic multi-venture homepage need not be that destination. Google explicitly advises matching the landing page to the ad, keyword, and requested action. [Google Ads guidance](https://support.google.com/google-ads/answer/6238826/optimising-your-ad-and-landing-page?hl=en-GB)

For future Facebook/Instagram lead acquisition, compare qualified-inquiry cost and held-conversation cost, not just ad CTR or cheap form submissions. Meta's current service-industry training discusses prequalifying through creative and filtering for higher-intent leads in instant forms. That supports testing qualification and message design; it supplies no guaranteed result for Zach and does not prove instant forms outperform website forms. [Meta Blueprint, March 2026](https://trainingworkshops.facebookblueprint.com/student/page/705443-improve-your-ad-creative-for-higher-quality-leads)

Keep that a separate study: one approved offer/audience/budget, current account features verified, reliable qualified-outcome feedback, and a planned comparison. Ad-impression/click denominators and native-form exposure differ from website visitors; do not pool them into the homepage A/B rate. Advertising, CRM sharing, tracking changes, and spending require their own explicit implementation authorization. No ROI forecast is justified until spend, qualified volume, opportunity value, close rate, and margin are known.

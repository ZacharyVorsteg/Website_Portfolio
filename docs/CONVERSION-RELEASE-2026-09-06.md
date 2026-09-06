# Zachary Vorsteg conversion release — September 6, 2026

## Purpose and scope

Apply the personal-site portion of the venture conversion audit. Make zacharyvorsteg.com
the place an owner understands Zach's work, sees relevant evidence and begins a conversation.
Specialist ventures remain contextual destinations. Other domains and client sites are outside
this release. This is a design and messaging hypothesis; no uplift in CTR, leads or revenue is claimed.

Zach explicitly requested optimization, push and deployment in this task. Production releases
use GitHub `main` and Netlify's connected build, never a direct CLI upload from a dirty checkout.

## Continuity and integration

- Starting point: isolated branch from `ba3f841`, preserving the earlier entity/appointment
  wording and explicit public-output staging work.
- Reconciled with Claude's deployed `fc8bf6b` production assets and `3142b9f` repository guidance.
- Original Sloane files remain byte-for-byte in Git. Unreviewed claim-bearing source clips and
  their posters are excluded from website output; the reviewed excerpt is a new asset.
- No force push, reset of another working tree, client-site changes, real lead submission,
  paid render, or newly created credential is part of this release.

## What changed and why

| Area | Implemented change | Intended result |
|---|---|---|
| Buyer and headline | Owner-led businesses; manual work, lead handoffs, workflows and reporting; direct relationship with Zach | A visitor can recognize a business problem before parsing the technology |
| First screen | Problem → brief explanation → conversation action → personal introduction; portrait after the action on mobile | A visible, understandable next step |
| Navigation | How I help, Selected work, About, Insights, Let's talk; repaired mobile dialog and keyboard behavior | Consistent orientation across the main site, services and articles |
| Visual system | Warm neutral canvas, charcoal text, blue primary actions, dark proof section, larger readable labels and restrained cards | Fewer competing focal points and reliable contrast |
| Evidence | Trusenda featured as founder-owned product; property and production examples explicitly identified as Zach's own brands | Concrete work without implying customer endorsements or measured results |
| Venture network | Need-led links to software, automation, websites, advertising, calls and property; complete portfolio secondary | A reason to follow each cross-domain link |
| Contact | Name, email and message required; phone and topic optional; partnership/uncertain scope supported | Lower friction without forcing an inappropriate service category |
| Contact context | AI/software/finance/property/production topic links; source-page/source-offer and three validated campaign fields | Inquiry context survives navigation without exporting free text into URLs or analytics |
| Error handling | Persistent accessible failure, retained input, retry, pending-submit guard, 20-second abort when supported, native form fallback | Recoverable failure and no false booking confirmation |
| Premium offer | First-month scope, agreed responsibilities, human review and continuity replace discouraging fee/30-day rhetoric | A more concrete discussion of an ongoing engagement |
| Production | Optional custom explainer and disclosed Sloane sample; transcripts and adjacent inquiry link; original reels/stills retained | Show message clarity and production capability without making performance promises |
| Search/entity | Matching canonicals, sitemap entries, stable Person identity, accurate roles, visible/schema alignment, preserved authored blog titles | A consistent factual site for people and search/answer systems |
| Accessibility/media | Essential content visible without JS, focus treatment, working skip/legacy targets, reduced-motion posters, bounded media | Contact remains accessible when scripts, animation, storage or tracking fail |
| Publication | `stage-public.cjs` stages explicit routes/assets to `public/`; source, internal records and tests stay outside the website | Repeatable Git-connected deployment with a constrained output |

The pro forma calculator and workbook calculations were not changed or financially audited.
Existing download paths and their contextual return route remain available.

## Custom creative decision

Use the personal site to start a business conversation. An ad-spokesperson pitch belongs as
optional production evidence, below the primary buying story. The homepage proof tile links
directly to `/production/#examples`; the hero remains focused on contacting Zach.

The custom 21-second silent explainer says:

1. Still copying the same information between tools?
2. Start with one bottleneck.
3. Illustrative workflow: Inquiry → Follow-up → Reporting.
4. Connect the work. Keep a person accountable.
5. Tell Zach what's slowing you down. Start a conversation.

It is an actual locally rendered SVG/HTML piece, not only a proposed script. H.264, 720×1280,
24fps, faststart, approximately 269KB. Diagrams are expressly illustrative, with no fictional
customer metrics or implied live product interface. The video is silent and does not autoplay.

The Sloane sample retains only “Everything about this video is AI. Including me.” Every frame
has an AI spokesperson/demo disclosure. The original car clip's lead-cost numbers and the
full reveal's pricing/turnaround comparisons lack supporting records in this review, so they
are not selected for publication. The edit is a capability sample, not customer proof.

Editable sources, transcripts and reproduction instructions are in `tools/creative/`.
The page's real inquiry link sits beside the players; a burned-in video invitation is not clickable.

## Verification gates

Completed before final release preparation:

- Nine browser tests passed: dialog focus/Escape/resize; topic and source allowlists;
  HTTP failure/retry; pending/success duplicate guard; network failure; missing page elements;
  native no-JavaScript fallback; campaign retention through About; denied and tampered storage.
- Local browser QA at 320, 390, 768, 1024 and 1440px: no horizontal overflow, no page errors,
  no hidden essential headings/actions; automated WCAG A/AA scan found no violations on the homepage.
- At 390px, primary action starts around y=429 versus the audited y=874. Contact begins around
  y=6,389 versus y=14,609. These are layout observations, not conversion or performance metrics.
- Contact anchor places the section under the fixed header and moves keyboard focus correctly.
- No-JavaScript mobile navigation/content and native form action remain available.
- Independent source review: 43 HTML pages, 30 sitemap URLs; JSON-LD parses; sitemap canonicals
  and local assets/fragments resolve. Person node agrees with the entity file.
- Article/entity generators were checked for deterministic output. Authored publication dates
  remain historical; substantially updated main/service sitemap dates reflect this release.
- Final premium/production QA passed at desktop/mobile widths and with reduced motion: native
  playback decodes both new examples, no preload video requests, no overflow or page errors.
  Original UGC sources match the remote bytes; final Sloane rendering reproduces byte-for-byte.
- All generators, the 14-article blog build, staging and `tools/validate-public.py` passed after
  integration: 43 public HTML pages, 30 sitemap URLs, no missing local targets/schema failures
  or leaked internal/unreviewed sources. Nine existing editorial warnings remain (description
  lengths and absolute internal links); these are not build errors or broken destinations.
  The task deployment record records the published commit and live acceptance checks.

Mocks block external requests and real POSTs. Automated accessibility checks supplement the
visual and keyboard review; they are not a claim that every browser/device or assistive technology
has been exhaustively tested.

## Form persistence and security boundary

HTML controls → FormData → URL-encoded POST `/index.html` → Netlify Forms `contact`.
Preserved existing public endpoint, no custom backend/database migration or permission change.

Expected registered fields: `name`, `email`, `phone`, `service`, `message`, `bot-field`,
`source-page`, `source-offer`, `utm_source`, `utm_medium`, `utm_campaign`.
`form-name=contact` routes the form submission. Check the Netlify registered schema after deploy.
Campaign values are limited to short marketing tokens, source paths and topics are allowlisted,
and storage is optional. No message, email, phone, full referrer or arbitrary URL is sent to analytics.

An HTTP success is a transport acknowledgement; it is not an independently verified database
record or delivered notification. No real production lead was submitted, read back or delivered
to the inbox during this task. Netlify storage, spam filtering and notification delivery require
an explicitly authorized test submission and record readback. Do not label inquiry receipt as
an appointment, qualified lead, sale or durable-delivery proof. A timeout retry may still be
accepted twice server-side; the browser guard only prevents concurrent/repeated in-page success.

## Remaining executable work

| Priority | Action | Acceptance evidence |
|---|---|---|
| P1 | Authorize one clearly labeled Netlify test lead, inspect the persisted record and receipt notification, then remove/archive test data under the relevant policy | Every form field read back, source/topic retained, one record, correct recipient; never infer this from HTTP alone |
| P1 | Establish the actual traffic and qualified-conversation baseline in existing analytics/CRM before claiming improvement | Counts, date range, source, device, landing page and qualification criteria |
| P1 | Verify current domain renewal configuration; a Netlify email received September 5 lists expiry October 2, 2026 | Current registrar expiry and auto-renew/payment state; no renewal purchase or billing change performed here |
| P2 | Obtain a permissioned operational case with a real workflow screenshot, observed result, period and limitations | Evidence the relevant owner can inspect; distinguish owned product from a customer |
| P2 | Run target-owner comprehension checks on the homepage and custom explainer | People can explain who it helps, what changes and how to begin without coaching |
| P2 | Test the explainer's effect on qualified conversations, using the existing analytics provider once verified | Compare exposed sessions → contact click → accepted inquiry → qualified/held conversation; include quality guardrails |
| P2 | Review Search Console search presentation and indexing after recrawl | Query/page/device/position-specific impressions, clicks and CTR; inspect intended canonicals |
| P2 | Repeat a fixed buyer-question set in answer engines and record cited pages/factual accuracy | Dated observed citations and referred/qualified traffic; no guaranteed GEO ranking claim |

## Measurement contract

Keep the existing tag configuration. This release adds no independent analytics provider and
does not relabel generic clicks as conversions. Before enabling new events, inspect existing
tags and deduplication. Suggested nonpersonal events: primary CTA view/click (with placement),
form start, transport acknowledgement, server-accepted lead, qualified lead, booked and held
conversation. Separate these stages. Use opaque IDs to reconcile server and CRM outcomes.

Primary business measure: qualified held conversations per relevant visit. Diagnostics: visible
CTA CTR and inquiry completion. Guardrails: spam, irrelevant leads, actual delivery, response
time and downstream quality. A video play and a high click rate alone do not prove business value.

## Build, release and recovery

```sh
PYTHONDONTWRITEBYTECODE=1 python3 tools/build-entity-pages.py
PYTHONDONTWRITEBYTECODE=1 python3 tools/build-premium-page.py
PYTHONDONTWRITEBYTECODE=1 python3 tools/build-production-page.py
npm run build
node stage-public.cjs
python3 tools/validate-public.py
node --test tests/app-behavior.test.cjs
git diff --check
```

Browser tests require Playwright available through `NODE_PATH` or the documented runtime and
local Chrome. No Playwright or audit dependency was added to the production package.

Review the complete diff and generated `public/` before pushing. Fetch the latest remote and
merge any newer authorized work; never force-push. From a clean, current release checkout on
main, push `origin main`, then wait for Netlify's published commit to equal the release commit.
Verify live homepage/production markers, assets, apps redirect and form registration. No direct
`netlify deploy` command. For a material regression, preserve newer unrelated work and revert
the scoped conversion changes through Git, run the same build/QA gates, then release the fix.

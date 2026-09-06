# Personal-site polish and regression record

This release follows the conversion release published at `95fc945`. Zach requested another
gap review, implementation, push and deployment. His clarification: the personal site serves
mixed traffic; no personal-site ads are currently running. Palm Beach Warehouses is his strongest
venture and receives most of his advertising. This release changes only zacharyvorsteg.com.

## Decisions and evidence

| Observed problem | Change | Verification / prevention |
|---|---|---|
| The property business was buried behind less important founder projects | Feature Palm Beach Warehouses first, with property inquiry and specialist-site routes; keep Trusenda as a clearly identified owned product | Preserve the existing PBW domain and paid funnel; no campaign edits or invented lead/results claims |
| Contact was after the venture catalogue; its mobile introduction pushed the message field below the landing viewport | Move contact before the directory; put the short introduction before the form and personal/direct-contact support after it on mobile | At 390×844 after the actual hero CTA click, message begins around y=584 rather than the prior y=845; focus remains on contact |
| A one-pixel viewport change produced a large hero shift around 640px | Use fluid heading sizing and a compact founder introduction through tablet widths | Automated 639/640px comparison limits CTA displacement to 40px; desktop two-column layout begins at 1000px |
| Three narrow outcome columns and variable card copy created wrapping/orphan arrows and uneven CTA baselines | Stack outcome cards below 800px; align peer actions with flex layout; keep arrow attached to link text | Layout checks cover 640–1440px and compare peer action positions |
| Transparent headers revealed ghost text; secondary pages and blogs used inconsistent navigation/footer spacing | Shared opaque warm-neutral chrome in `site-shell.css`, consistent gutters, compact footer, preserved topic-specific links | Natural viewport review, no horizontal overflow, keyboard menu/Escape and shared-header checks |
| Production thumbnail described the older spokesperson concept rather than the linked explainer | Add an accurate code-native SVG preview for the 21-second bottleneck explainer | Link still leads to the optional native players and adjacent production inquiry action; no fake player control |
| Ambient videos lacked a clear user pause control; mobile media and narrow kinetic cards dominated the page | Add synchronized pause/play, reduced-motion opt-in, bounded video height and a readable mobile horizontal rail | Production/premium mobile/desktop, pause, reduced-motion, rail end states and unchanged native-player/source-asset checks |
| Four core service pages contained legacy unsupported claims and FAQ text differed from schema | Remove unverified volume, savings, timing and unconditional fee assertions; synchronize visible FAQ answers and JSON-LD | Public validator now compares normalized visible FAQ questions/answers with schema; a deliberate mismatch fails |

These are reproduced usability and factual-consistency improvements. No CTR, qualified-lead,
SEO or GEO uplift is measured or promised. A prominent CTA leading to a compact form is the
current mixed-traffic design; a full early form remains an experiment, not an established winner.
The research, qualification rubric, attribution limits, low-traffic plan and powered-test examples
are in [QUALIFIED-INQUIRY-EXPERIMENT.md](QUALIFIED-INQUIRY-EXPERIMENT.md).

## What the earlier review missed

The earlier homepage/browser checks passed but did not cover breakpoint-adjacent widths, action
alignment inside peer cards, or the amount of form actually exposed after contact navigation.
Parsing structured data and checking links also failed to detect semantically different FAQ answers.
Secondary-page chrome was reviewed too narrowly. A first attempted breakpoint fix introduced a
reverse jump; the new test caught it before release, and fluid sizing resolved it.

Do not take layout measurements immediately after `load` or a readiness-class mutation. In local
Chrome, the menu readiness class was visible before the resulting layout was painted. Wait for
fonts and two animation frames, then inspect the natural viewport. Full-page screenshots alone
can misrepresent sticky elements and media/loading state.

## Repeatable verification gates

1. Fetch and inspect Git state; preserve concurrent work. Edit generator inputs and regenerate.
2. Build entity, premium, production and blog pages; stage the public allowlist and validate it.
3. Run `node --test tests/app-behavior.test.cjs tests/layout-regression.test.cjs` with Playwright
   available through `NODE_PATH`. Behavior tests mock writes; layout tests reject them.
4. Review mobile, tablet and desktop in natural viewports, including breakpoint ±1px; click the
   actual CTA, check visible input affordances, focus, copy wrapping, peer action alignment,
   gutters, footer, reduced motion and no-JavaScript fallback. Supplement with accessibility scans.
5. Review the complete diff and public output. Check generated determinism and unchanged approved
   media. Version changed shared CSS URLs so returning visitors receive the new styles.
6. Release only through a clean current `main` checkout and `git push origin main`. Confirm the
   published Netlify commit matches, then check live routes, assets, redirects, menus and form schema.

## Authorized one-inquiry delivery check

Zach explicitly approved one production test named Website QA, using his supplied email and the
reference `ZV-POLISH-20260906-QA`. Submit once after publication with the exact approved draft.
The path is HTML fields → component/FormData → URL-encoded POST `/index.html` → Netlify `contact`
record → configured notification. Read back the matching record and notification separately.
Do not retry a possibly accepted POST, infer storage from HTTP success, send a separate email,
or delete the record. Existing source/topic/campaign fields and endpoint remain unchanged.

The external deployment receipt records the final commit, live checks and actual delivery outcome
after publication. Until that receipt exists, build success is not live verification. The earlier
release note is historical; its unperformed delivery-test entry is superseded only by a verified
result in the new receipt.

## Remaining business evidence

- Inspect actual analytics/CRM counts, source/device mix and qualified-inquiry coverage before
  choosing or powering a conversion experiment. No analytics baseline was available in this review.
- Qualify real inquiries with a fixed rubric and monitor first human response; link clicks, video
  plays and form acknowledgements are diagnostics, not qualified conversations.
- Obtain permissioned evidence for any claimed customer result; keep owned ventures identified.
- Check current registrar renewal state from the earlier dated expiry notice; no billing or
  renewal change is included in this release.

Recovery: revert the scoped regression through Git while preserving newer work, rerun the same
checks and release normally. Do not upload a stale local directory directly to Netlify.

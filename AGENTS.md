# AGENTS.md — zacharyvorsteg.com (static site)

Owner: Zach Vorsteg. House rules: `~/.claude/CLAUDE.md`. Public-content rules that matter here:
never name AI vendors or models on public pages; no invented counts, "#1", or guarantees (the builders
assert against `BANNED` in `tools/build-entity-pages.py`); Zach is a Florida real-estate *sales associate*, never "broker".

## How the site is built
- Plain HTML/CSS, no framework. Netlify builds from GitHub `main` (`netlify.toml`: `npm install && node build-blog.js && node stage-public.cjs`).
- Generated pages are built locally and the output is committed:
  - Entity/service pages: `python3 tools/build-entity-pages.py`
  - Production page (`/production/`): `python3 tools/build-production-page.py` — reads assets from
    `images/production/` (720x1280 H.264 clips, jpg posters, 4:5 stills) and `captions.json`.
  - Blog: `node build-blog.js` (also runs on Netlify).
- Verify a build before committing: the page must contain no vendor names, every `/images/production/*`
  it references must exist, and every `<script type="application/ld+json">` must parse.

## Deploy
- **Deploy = commit on `main` + `git push origin main`.** Netlify auto-builds; the new page is live in ~20–60 s.
  Verify with `curl -s https://zacharyvorsteg.com/<path>/ | grep <marker>`.
- Do not use `netlify deploy` from the CLI: a deploy from a dirty or behind branch has deleted live content before.
  Confirm `git status -sb` shows `main...origin/main` with no divergence first.
- Pushing is a production release. It needs Zach's explicit yes for the specific change; approval does not carry over.

## Assets
- `images/production/` is the only source for the production page. New clips: encode to 720x1280 H.264
  (`-crf 26`, faststart, AAC 96k), poster from ~1 s in, keep each clip under ~2 MB.
- Sloane (Ads Handled spokesperson) is a disclosed AI persona: every piece she appears in must say so on
  the piece; she is a spokesperson, never a customer or testimonial.

## September 2026 conversion release
- `stage-public.cjs` stages an explicit allowlist in `public/`; internal docs, tests and creative render sources are not deployed. The original four `ugc-sloane-*` assets remain in Git but are excluded from public output because their commercial claims/disclosure were not approved as evidence.
- The reviewed production examples are `one-bottleneck.*` and `sloane-ai-demo.*`; native playback, transcripts and disclosures must survive rebuilds. Editable render sources are in `tools/creative/`.
- `tools/build-entity-pages.py` leaves the redesigned homepage intact by default. If changing Person data, sync its node inside the homepage `@graph` as well as `entity/person.jsonld`. Do not replace the entire graph.
- Contact form is still Netlify `contact`, POST `/index.html`. Phone/topic are optional; topic/source/campaign fields are allowlisted. Do not claim a successful request is a booked call, or add personal form contents to analytics.
- See `docs/CONVERSION-RELEASE-2026-09-06.md` for decisions, verification and remaining measurement gates.

## Polish regression gates
- Read `docs/POST-DEPLOYMENT-POLISH-2026-09-06.md` before changing conversion layout. Shared navigation/footer styles live in `site-shell.css`; preserve service-specific inquiry topics when rebuilding.
- Run both browser test files and `tools/validate-public.py`. Check breakpoint-adjacent widths, peer CTA alignment and the actual mobile CTA-to-message-field path, after fonts and two animation frames settle. Full-page screenshots alone are insufficient.
- Preserve visible FAQ/schema equivalence, approved media/disclosures and the property route. PBW advertising is a separate funnel.
- Do not describe the design as statistically optimal without qualified-inquiry evidence. Use `docs/QUALIFIED-INQUIRY-EXPERIMENT.md` for measurement and experiment gates.
- For an authorized delivery test, read both verified and spam records using supported query parameters. The September QA was initially spam; manual verification delivered its notification. Preserve that distinction and never repeat a possibly accepted POST to manufacture a pass.
- On stacked cards, compare both image gutters with the text inset and caption edge. A desktop image that reaches a card edge must not inherit a one-sided mobile margin. See the screenshot correction in `docs/POST-DEPLOYMENT-POLISH-2026-09-06.md`.

## Free resource quality gates
- Read `docs/RESOURCE-QUALITY-2026-09-07.md` before changing the pro forma, worksheet or Excel downloads. Useful resources require reviewed calculations, interfaces, printouts and exported files, not just working links.
- `proforma-model.js` is the sole calculation source. Preserve v3 migration, explicit fee modes/timing, opt-in local storage, null undefined ratios and the absence of arbitrary investment grades. Run the model and resource-browser suites after relevant changes.
- Keep resource styling in `resource-styles.css` and calculator styling in `proforma-styles.css`. Inspect currency at320px and actual print text; hidden responsive line breaks must retain literal word separation.
- All three financial downloads are illustrative. Recalculate and independently check formulas/returns and balance-sheet reconciliation before publishing edits; retain formula/input distinctions and explicit assumptions. Change the download version query after replacing a cached workbook.
- Resource-specific preview PNGs have reproducible code-native source in `tools/render-resource-previews.cjs`; preview mapping is in `tools/preview-metadata.cjs`. Keep the actual PNG dimensions and metadata consistent.

# AGENTS.md — zacharyvorsteg.com (static site)

Owner: Zach Vorsteg. House rules: `~/.claude/CLAUDE.md`. Public-content rules that matter here:
never name AI vendors or models on public pages; no invented counts, "#1", or guarantees (the builders
assert against `BANNED` in `tools/build-entity-pages.py`); Zach is a Florida real-estate *sales associate*, never "broker".

## How the site is built
- Plain HTML/CSS, no framework. Netlify builds from GitHub `main` (`netlify.toml`: `npm install && node build-blog.js`).
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

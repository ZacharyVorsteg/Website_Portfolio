#!/usr/bin/env python3
"""Production page — /production/ (2026-09-06).

Zach: "integrate aligned with the quality standard… the idea is to (1) compel and convert people and (2) make people
want to contract us for the service… that belongs on zacharyvorsteg.com."

Every asset on this page is our own output and carries its receipt: FLUX stills → Seedance 2.5 push-ins (render-forge),
brief-verified plates, and kinetic pieces that PASSED the production standard gate (only those — pieces that pass under the
legacy standard are not shown). Nothing here is a mockup, a stock clip, or someone else's work. No claims, no counts we
cannot back, no "#1".
Assets are staged by the encode step into images/production/ (720x1280 H.264, posters, 4:5 stills).
"""
import importlib.util, pathlib, re, json
ROOT = pathlib.Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("b", ROOT / "tools" / "build-entity-pages.py"); b = importlib.util.module_from_spec(spec); spec.loader.exec_module(b)
ASSETS = ROOT / "images" / "production"

PAGE = dict(
  slug="production",
  eyebrow="Production · content that converts, verified before it posts",
  title="Content Production for Premium Brands | Zachary Vorsteg",
  description="Cinematic reels, stills and kinetic pieces produced on a schedule, checked against a written standard and posted with a receipt. For owner-led Palm Beach brands.",
  h1="Content that looks like this, every week, without you touching it.",
  lede=("Below is our own output: signature renders turned into motion, and short kinetic pieces built to a written production "
        "standard, and a spokesperson who is disclosed as AI on every piece she appears in. Each one was produced by the system, checked by the system, and posted by the system with a receipt. The same "
        "production layer is available to a small number of brands on annual terms."),
  cta2=("/ai-operating-layer/", "Private engagements"),
  sections=[
   ("Why it converts",
    ["A feed of consistently cinematic pieces does two things at once: it makes the brand feel established before anyone reads a word, "
     "and it gives every ad, every follow-up and every referral something worth pointing at. The visuals carry the mood. The caption "
     "carries the offer. The receipt proves it posted.",
     "What you see here is one week of the system's own work across five brands — no agency, no editor, no shoot day."]),
   ("Where it fits",
    ["Production is part of Operating Layer and Embedded engagements, and available as a standalone annual engagement. Your brand kit "
     "goes in once; from then on the system produces, checks and posts to the destinations you approve, and reports what it did."]),
  ],
  grid=("What a month produces", [
   ("Signature stills", "Cinematic renders in your brand's world, one idea per frame, with a restrained wordmark. Used across the feed, ads and the site."),
   ("Detail reels", "One material, one light, one slow move: 9:16 clips made from your own stills so motion and stills share a look."),
   ("Kinetic pieces", "Short typographic pieces that make one point with one line, cut to a measured pace on a brief-verified plate."),
   ("Spokesperson pieces", "Short talking pieces from a persistent, identity-locked spokesperson, disclosed as AI on the piece itself. A spokesperson, never a customer or a testimonial."),
   ("Captions and destinations", "Hook-first captions per platform, niche hashtags capped, a funnel link where links are clickable."),
   ("Verification", "Plates are checked frame by frame by a vision model; every piece passes a written standard gate before it can post."),
   ("Receipts", "Every post is logged with its destination and status. A monthly report says what ran, in plain English."),
  ]),
  why_title="How a piece is made",
  why=[
   "Signature render: a still generated for the brand's world — no text, no logos, no faces — and kept if it passes review.",
   "Motion: the still itself is animated with a single slow push-in, so stills and motion share one look.",
   "Brief verification: three frames are shown to a vision model with the brand's brief; at least two of three must agree.",
   "Standard gate: kinetic pieces are checked against the written production standard — pace, structure, plate, audio — before posting.",
   "Spokesperson pieces: one persistent persona with a locked reference pack, a script checked for articulation, captions taken from the script, and the disclosure written on the piece before a human reviews it.",
   "Posting with receipts: the piece goes to the destinations you approved, and the log records where and whether it landed.",
  ],
  faq=[
   ("Is this stock footage or templates?", "No. Every still is generated for the brand; every clip is made from that still; every kinetic piece is built from the brand's own claim-locked lines. Nothing on this page comes from a library."),
   ("Will it look like everyone else's AI content?", "The look is set by a house style and a written standard, not by a prompt someone typed once. The same restraint you see here — one idea per frame, no text burned into images, no invented customers or testimonials — is enforced on every piece. Where a spokesperson is synthetic, the piece says so."),
   ("Who approves what goes out?", "You approve the destinations and the brand kit. Pieces that fail the standard cannot post. You can review before posting if you prefer; most clients read the receipts instead."),
   ("What do you need from us?", "Logo files, colours, the offers you actually want promoted, and access to the social accounts you want used. A brand kit takes one conversation."),
   ("Which tools do you use?", "Current image, video and speech models behind our own pipeline. The models change as better ones arrive; the pipeline, the written standard and the verification are the product, and those are ours."),
   ("How is it priced?", "Annually, against a scope in writing, as part of an Operating Layer or Embedded engagement or on its own. If the fee is a material line for the business, Ads Handled or CallsHandled is the better starting point."),
  ],
  close=("If your brand should look like this", "Send me one thing you sell and the platforms you care about. I'll reply with what a first month would produce."),
  crosslinks=[("/ai-operating-layer/", "Private engagements"), ("/ai-consultant-palm-beach-county/", "AI consultant, Palm Beach County"), ("/agentic-ai-engineer-west-palm-beach/", "Agentic AI engineering"), ("/about", "About Zachary")],
  service_name="Content Production — Reels, Stills and Kinetic Pieces", service_type="AI-assisted content production and social publishing (annual engagement)",
)

# brand code → display; captions are the reel's own five words (from the .reel.json specs, copied at encode time)
BRAND = {"zv": ("Zachary Vorsteg", "zacharyvorsteg.com"), "ah": ("Ads Handled", "adshandled.com"), "ch": ("CallsHandled", "callshandled.ai"),
         "pbw": ("Palm Beach Warehouses", "palmbeachwarehouses.com"), "cl": ("CustomLab", "customlab.ai")}
CAPTIONS = json.loads((ASSETS / "captions.json").read_text()) if (ASSETS / "captions.json").exists() else {}
KINETIC = [("adshandled", "Ads Handled", "Your Google profile"), ("callshandled", "CallsHandled", "After hours"), ("pbw", "Palm Beach Warehouses", "Specs that matter")]  # kinetic-standard PASS only

def vid(src, poster, label, aria, cls="pv", sound=False):
    return (f'<video class="{cls}" muted loop playsinline preload="none" poster="/images/production/{poster}" aria-label="{b.esc(aria)}" data-src="/images/production/{src}"'
            + (' data-sound="1"' if sound else '') + '></video>')

def blocks():
    css = """
<style>
.stu-label{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:#6b7280;margin:0 0 10px}
.wall{background:#0b0d12;color:#e8ecf2;padding:44px 0 40px}
.wall h2{color:#fff;margin:0 0 6px}
.wall .sub{color:#a7aeba;margin:0 0 22px}
.wall .stu-label{color:#8b93a3}
.reels{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr));gap:14px}
@media(max-width:520px){.reels{grid-template-columns:1fr 1fr;gap:10px}.method{grid-template-columns:1fr 1fr;gap:10px}.stills{grid-template-columns:1fr 1fr;gap:10px}}
.reel{margin:0;position:relative;border-radius:14px;overflow:hidden;background:#12151c;aspect-ratio:9/16}
.reel video,.reel img{display:block;width:100%;height:100%;object-fit:cover}
.reel figcaption{position:absolute;left:0;right:0;bottom:0;padding:14px 14px 12px;background:linear-gradient(transparent,rgba(5,6,10,.85));color:#e8ecf2}
.reel.kin{aspect-ratio:auto;display:flex;flex-direction:column}.reel.kin video{aspect-ratio:9/16;height:auto}.reel figcaption.below{position:static;background:#12151c;padding:12px 14px 14px}
.reel figcaption b{display:block;font-size:.98rem;line-height:1.3;letter-spacing:-.01em}
.reel figcaption span{display:block;margin-top:4px;font-family:ui-monospace,Menlo,monospace;font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:#a7aeba}
.reel .snd{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:rgba(5,6,10,.55);color:#fff;font-size:14px;cursor:pointer}
.reel .snd:focus-visible{outline:3px solid #fff;outline-offset:2px}
.stills{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr));gap:14px;margin-top:8px}
.stills figure{margin:0;border-radius:14px;overflow:hidden;background:#f3f4f6;box-shadow:0 10px 30px rgba(0,0,0,.08)}
.stills img{display:block;width:100%;height:auto;aspect-ratio:4/5;object-fit:cover}
.stills figcaption{padding:10px 12px;font-family:ui-monospace,Menlo,monospace;font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;color:#6b7280}
.method{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(160px,100%),1fr));gap:14px;margin-top:8px}
.method figure{margin:0;border-radius:12px;overflow:hidden;background:#0b0d12;aspect-ratio:9/16;position:relative}
.method figure img,.method figure video{display:block;width:100%;height:100%;object-fit:cover}
.method figcaption{position:absolute;left:0;right:0;bottom:0;padding:10px 12px;background:linear-gradient(transparent,rgba(5,6,10,.85));color:#cfd5df;font-family:ui-monospace,Menlo,monospace;font-size:.62rem;letter-spacing:.16em;text-transform:uppercase}
.receipt{margin-top:14px;font-family:ui-monospace,Menlo,monospace;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:#6b7280}
@media(prefers-reduced-motion:reduce){.pv{display:none}.reel img.still{display:block}}
</style>"""
    # ---- reel wall: our detail reels (FLUX still → Seedance 2.5 push-in), five words each ----
    reels = ""
    for code, (name, handle) in BRAND.items():
        if not (ASSETS / f"reel-{code}.mp4").exists(): continue
        cap = CAPTIONS.get(code, name)
        reels += (f'<figure class="reel">{vid(f"reel-{code}.mp4", f"reel-{code}.jpg", name, f"{name}: {cap}")}'
                  f'<img class="still" src="/images/production/reel-{code}.jpg" alt="" style="display:none" loading="lazy">'
                  f'<figcaption><b>{b.esc(cap)}</b><span>{b.esc(handle)} · detail reel · 5s</span></figcaption></figure>')
    wall = ('<section class="wall" aria-labelledby="wall-h"><div class="container"><p class="stu-label">01 · Detail reels — one material, one light, one slow move</p>'
            '<h2 id="wall-h">Made from our own stills, so motion and stills share a look</h2>'
            '<p class="sub">Each clip is a signature render animated with a single push-in. No text in the frame; the caption carries the words.</p>'
            f'<div class="reels">{reels}</div>'
            '<div class="receipt" style="color:#8b93a3">Receipts · signature still → single push-in · brief-verified 3/3 frames each · rendered 2026-09-06</div></div></section>')
    # ---- kinetic pieces: only those that PASSED the kinetic standard gate ----
    kin = "".join(
        f'<figure class="reel kin">{vid(f"kinetic-{k}.mp4", f"kinetic-{k}.jpg", name, f"{name} kinetic piece: {t}", sound=True)}'
        f'<button type="button" class="snd" aria-label="Toggle sound">&#9834;</button>'
        f'<figcaption class="below"><b>{b.esc(t)}</b><span>{b.esc(name)} · kinetic piece · standard: pass</span></figcaption></figure>'
        for k, name, t in KINETIC if (ASSETS / f"kinetic-{k}.mp4").exists())
    kinetic = ('<section class="wall" style="background:#111420" aria-labelledby="kin-h"><div class="container"><p class="stu-label">02 · Kinetic pieces — the production standard</p>'
               '<h2 id="kin-h">One point, one line, a measured pace</h2>'
               '<p class="sub">Typographic pieces built from each brand\'s own claim-locked lines, cut on a brief-verified plate with a licensed bed. Shown here only if they passed the written standard gate. Tap the note for sound.</p>'
               f'<div class="reels">{kin}</div>'
               '<div class="receipt" style="color:#8b93a3">Receipts · standard gate: kinetic, pass · plate verdicts on file · beds generated under commercial licence</div></div></section>')
    # ---- stills ----
    st = "".join(f'<figure><img src="/images/production/still-{c}.jpg" alt="{b.esc(BRAND[c][0])} signature still" width="1080" height="1350" loading="lazy"><figcaption>{b.esc(BRAND[c][1])} · signature still</figcaption></figure>'
                 for c in BRAND if (ASSETS / f"still-{c}.jpg").exists())
    stills = ('<section class="svc-section" aria-labelledby="st-h"><div class="container"><p class="stu-label">03 · Signature stills</p>'
              '<h2 id="st-h" style="margin-top:0">One idea per frame, a wordmark and nothing else</h2>'
              f'<div class="stills">{st}</div></div></section>')
    # ---- method strip: still → push-in → plate → piece ----
    method = ('<section class="svc-section" aria-labelledby="me-h"><div class="container"><p class="stu-label">04 · From still to post</p>'
              '<h2 id="me-h" style="margin-top:0">The same four steps, every time</h2><div class="method">'
              '<figure><img src="/images/production/reel-pbw.jpg" alt="Signature still: a warehouse loading dock at dawn" loading="lazy"><figcaption>1 · Signature still</figcaption></figure>'
              f'<figure>{vid("reel-pbw.mp4", "reel-pbw.jpg", "Push-in", "The same dock, animated with a slow push-in")}<figcaption>2 · Push-in</figcaption></figure>'
              f'<figure>{vid("plate-pbw.mp4", "plate-pbw.jpg", "Plate", "A verified brand plate: a distribution park from above")}<figcaption>3 · Brief-verified plate</figcaption></figure>'
              f'<figure>{vid("kinetic-pbw.mp4", "kinetic-pbw.jpg", "Kinetic piece", "The finished kinetic piece on that plate", sound=True)}<figcaption>4 · Kinetic piece, gate: pass</figcaption></figure>'
              '</div><div class="receipt">Every step writes a receipt: source, seed, checksum, verdict. Nothing ships without one.</div></div></section>')
    # ---- spokesperson pieces: Sloane (Ads Handled), disclosed as AI on the piece; a spokesperson, never a customer ----
    UGC = [("reveal", "Everything about her is AI."), ("ads", "The ads pitch, from the car.")]
    ug = "".join(
        f'<figure class="reel kin">{vid(f"ugc-sloane-{k}.mp4", f"ugc-sloane-{k}.jpg", "Sloane", f"Ads Handled spokesperson piece, disclosed as AI: {t}", sound=True)}'
        f'<button type="button" class="snd" aria-label="Toggle sound">&#9834;</button>'
        f'<figcaption class="below"><b>{b.esc(t)}</b><span>adshandled.com · spokesperson piece · disclosed AI · 18s</span></figcaption></figure>'
        for k, t in UGC if (ASSETS / f"ugc-sloane-{k}.mp4").exists())
    ugc = ('<section class="wall" style="background:#0f1118" aria-labelledby="ugc-h"><div class="container"><p class="stu-label">05 · Spokesperson pieces — disclosed as AI on every one</p>'
           '<h2 id="ugc-h">A spokesperson who can say the line, and says what she is</h2>'
           '<p class="sub">Sloane fronts Ads Handled. The same face holds across every scene, the script is checked before it is spoken, and each piece carries its own disclosure. She is a spokesperson, never a customer and never a testimonial. Tap the note for her voice.</p>'
           f'<div class="reels">{ug}</div>'
           '<div class="receipt" style="color:#8b93a3">Receipts · identity-locked reference pack · script-first captions · disclosure on the piece · human review before posting</div></div></section>') if ug else ""
    js = """
<script>(function(){var vs=[].slice.call(document.querySelectorAll('video.pv'));if(!vs.length)return;
var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(rm)return;
var load=function(v){if(v.dataset.loaded)return;var s=document.createElement('source');s.src=v.dataset.src;s.type='video/mp4';v.appendChild(s);v.dataset.loaded='1';v.load()};
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){load(v);v.play().catch(function(){})}else{v.pause()}})},{rootMargin:'120px',threshold:.25});vs.forEach(function(v){io.observe(v)})}else{vs.forEach(function(v){load(v);v.play().catch(function(){})})}
document.querySelectorAll('.snd').forEach(function(btn){btn.addEventListener('click',function(){var v=btn.parentNode.querySelector('video');if(!v)return;v.muted=!v.muted;btn.textContent=v.muted?'\\u266A':'\\u25A0';if(!v.muted){document.querySelectorAll('video.pv').forEach(function(o){if(o!==v)o.muted=true})}})});})();</script>"""
    return css, wall, kinetic, stills, method, ugc, js

if __name__ == "__main__":
    out = b.page_html(PAGE)
    css, wall, kinetic, stills, method, ugc, js = blocks()
    out = out.replace("</head>", css + "\n</head>", 1)
    hero_end = out.find("</section>", out.find('class="svc-hero"')) + len("</section>")
    out = out[:hero_end] + wall + kinetic + stills + out[hero_end:]
    faq_at = out.find('<h2>Frequently asked questions</h2>'); sec_start = out.rfind('<section class="svc-section">', 0, faq_at)
    out = out[:sec_start] + method + ugc + out[sec_start:]
    out = out.replace("</body>", js + "\n</body>", 1)
    out = out.replace('class="btn btn-accent">Start a project</a>', 'class="btn btn-accent">Request a conversation</a>')
    text = re.sub(r"<[^>]+>", " ", re.sub(r"<(style|script)[^>]*>.*?</\1>", " ", out, flags=re.S))
    bad = [m.group(0) for m in b.BANNED.finditer(text)]
    assert not bad, f"banned phrase {bad}"
    assert len(PAGE["title"]) <= 65 and 110 <= len(PAGE["description"]) <= 165
    n_reels = out.count('<figure class="reel'); assert n_reels >= 6, f"only {n_reels} reel cards — assets missing?"
    d = ROOT / PAGE["slug"]; d.mkdir(exist_ok=True); (d / "index.html").write_text(out, encoding="utf-8")
    print(f"  wrote /{PAGE['slug']}/ ({len(out)} bytes, title {len(PAGE['title'])}c, desc {len(PAGE['description'])}c, {n_reels} video cards)")

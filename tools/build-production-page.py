#!/usr/bin/env python3
"""Production page — /production/ (2026-09-06).

Zach: "integrate aligned with the quality standard… the idea is to (1) compel and convert people and (2) make people
want to contract us for the service… that belongs on zacharyvorsteg.com."

Every asset on this page is our own output: signature stills, push-in reels,
brief-verified plates, kinetic pieces, a clearly illustrative explainer and a
disclosed synthetic spokesperson excerpt. Original source clips remain in Git;
only reviewed excerpts are featured. Production examples are not conversion proof.
Assets are staged by the encode step into images/production/ (720x1280 H.264, posters, 4:5 stills).
"""
import importlib.util, pathlib, re, json
ROOT = pathlib.Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("b", ROOT / "tools" / "build-entity-pages.py"); b = importlib.util.module_from_spec(spec); spec.loader.exec_module(b)
ASSETS = ROOT / "images" / "production"

PAGE = dict(
  slug="production",
  eyebrow="Production · messages, motion and stills",
  title="Content Production for Premium Brands | Zachary Vorsteg",
  description="Cinematic reels, stills and kinetic pieces produced on a schedule, checked against a written standard and posted with a receipt. For owner-led Palm Beach brands.",
  h1="A consistent look for your brand, produced every week.",
  lede=("Explainers, disclosed AI spokesperson pieces, stills and reels built around your brand and offers. The work below was produced "
        "for my own businesses. An annual scope sets the formats, cadence, review responsibilities and publishing destinations, "
        "so you know what is being produced and where it goes."),
  cta_href="/?topic=production#contact",
  cta_label="Request a conversation",
  cta2=("/ai-operating-layer/", "Private engagements"),
  sections=[
   ("How the work supports a conversation",
    ["The aim is a recognizable visual identity paired with a clear offer and a relevant next step. A reel can introduce the brand; "
     "the caption explains the offer; the destination gives an interested visitor a way to act.",
     "This collection shows production work across five of my brands. It demonstrates the style and formats available. "
     "To assess commercial results, measure destination clicks, qualified inquiries and resulting business alongside the posts."]),
   ("Where it fits",
    ["Production can be included in Operating Layer and Embedded scopes, or agreed as a standalone annual engagement. "
     "I work with you on the brand kit, offers, destinations and approval responsibilities. The agreed process covers production, "
     "checks, publishing and reporting; the written scope sets the formats and cadence."]),
  ],
  grid=("Formats we can scope together", [
   ("Signature stills", "Cinematic renders in your brand's world, one idea per frame, with a restrained wordmark. Used across the feed, ads and the site."),
   ("Detail reels", "One material, one light, one slow move: 9:16 clips made from your own stills so motion and stills share a look."),
   ("Kinetic pieces", "Short typographic pieces that make one point with one line, cut to a measured pace on a brief-verified plate."),
   ("Spokesperson pieces", "A synthetic spokesperson with a consistent visual reference and an approved script. AI disclosure stays on the piece; the persona is never presented as a customer or testimonial."),
   ("Captions and destinations", "Hook-first captions per platform, niche hashtags capped, a funnel link where links are clickable."),
   ("Verification", "Plates are checked frame by frame by a vision model; every piece passes a written standard gate before it can post."),
   ("Receipts", "Every post is logged with its destination and status. A monthly report says what ran, in plain English."),
  ]),
  why_title="How a piece is made",
  why=[
   "Signature stills: an image generated for the brand's world and reviewed against the brief. This visual format uses no faces; spokesperson pieces follow their own script and disclosure review.",
   "Motion: the still itself is animated with a single slow push-in, so stills and motion share one look.",
   "Brief verification: three frames are shown to a vision model with the brand's brief; at least two of three must agree.",
   "Standard gate: kinetic pieces are checked against the written production standard — pace, structure, plate, audio — before posting.",
   "Spokesperson review: approve the script and business claims, check the captions against the spoken line, and keep a readable AI disclosure on the piece.",
   "Posting with receipts: the piece goes to the destinations you approved, and the log records where and whether it landed.",
  ],
  faq=[
   ("Is this stock footage or templates?", "These examples were produced for my own businesses. The detail reels animate signature stills, kinetic pieces use each brand's written lines, and the explainer illustrates a workflow. Sloane is a disclosed synthetic spokesperson shown as a short production demo."),
   ("Will it look like everyone else's AI content?", "The look is set by a house style and a written standard. Each format has a purpose: a still establishes the visual world, an explainer carries a message, and a spokesperson delivers an approved script. Synthetic personas are disclosed on the piece and never presented as customers or testimonials."),
   ("Who approves what goes out?", "You approve the brand kit, offers, destinations and publishing permissions. We agree which pieces require your review before posting. Production checks support that process; they do not replace approval of your business claims."),
   ("What do you need from us?", "Logo files, colours, the offers you actually want promoted, and access to the social accounts you want used. A brand kit takes one conversation."),
   ("Which tools do you use?", "Image, video and speech models support our production process. The brief, script, written standard, review and publishing records matter more than a particular model. We agree how those steps apply to your scope."),
   ("How is it priced?", "Annually, against a scope in writing, as part of an Operating Layer or Embedded engagement or on its own. We agree the formats, cadence, destinations, review responsibilities and reporting before work starts. A focused advertising need can be discussed through Ads Handled; production and campaign results are evaluated separately."),
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
# PRODUCT-DEMO family (kinetic standard v4.3, 2026-09-07; Zach: "not one trick ponies… the work needs to sell / convert them"): the
# same gate, a second dynamic — the work shown happening (a task card ticking off, the hand clicking the next step). PASS only.
KINETIC_DEMO = [("callshandled-demo", "CallsHandled", "Tonight's call, handled"), ("adshandled-demo", "Ads Handled", "A lead moves through the system"),
                ("pbw-demo", "Palm Beach Warehouses", "How a search actually goes"), ("customlab-demo", "CustomLab", "One handoff, mapped, then built"),
                ("vorsteg-demo", "Vorsteg Software", "From one workflow to an app"), ("palmbeachwebsites-demo", "Palm Beach Websites", "A site with one job")]

def vid(src, poster, label, aria, cls="pv", sound=False):
    return (f'<video class="{cls}" muted loop playsinline preload="none" poster="/images/production/{poster}" aria-label="{b.esc(aria)}" data-src="/images/production/{src}"'
            + (' data-sound="1"' if sound else '') + '></video>')

def blocks():
    css = """
<style>
.stu-label{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:#6b7280;margin:0 0 10px}
.svc-section .stu-label{font-size:.75rem;line-height:1.6;letter-spacing:.13em;margin:0 0 10px}
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
.reel figcaption span{display:block;margin-top:4px;font-family:ui-monospace,Menlo,monospace;font-size:.75rem;line-height:1.5;letter-spacing:.06em;text-transform:uppercase;color:#a7aeba;overflow-wrap:anywhere}
.reel .snd{position:absolute;top:10px;right:10px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.5);background:rgba(5,6,10,.85);color:#fff;font-size:16px;cursor:pointer}
.reel .snd:disabled{opacity:.5;cursor:default}
.reel .snd:focus-visible{outline:3px solid #fff;outline-offset:2px}
.stills{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr));gap:14px;margin-top:8px}
.stills figure{margin:0;border-radius:14px;overflow:hidden;background:#f3f4f6;box-shadow:0 10px 30px rgba(0,0,0,.08)}
.stills img{display:block;width:100%;height:auto;aspect-ratio:4/5;object-fit:cover}
.stills figcaption{padding:10px 12px;font-family:ui-monospace,Menlo,monospace;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:#586360}
.method{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(160px,100%),1fr));gap:14px;margin-top:8px}
.method figure{margin:0;border-radius:12px;overflow:hidden;background:#0b0d12;aspect-ratio:9/16;position:relative}
.method figure img,.method figure video{display:block;width:100%;height:100%;object-fit:cover}
.method figcaption{position:absolute;left:0;right:0;bottom:0;padding:10px 12px;background:linear-gradient(transparent,rgba(5,6,10,.85));color:#cfd5df;font-family:ui-monospace,Menlo,monospace;font-size:.62rem;letter-spacing:.16em;text-transform:uppercase}
.receipt{margin-top:14px;font-family:ui-monospace,Menlo,monospace;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:#6b7280}
.gallery-controls{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:0 0 20px}
.gallery-motion,.gallery-arrow{min-height:44px;padding:10px 16px;border:1px solid currentColor;border-radius:999px;background:transparent;color:inherit;font-family:inherit;font-size:.875rem;font-weight:600;line-height:1.4;cursor:pointer}
.gallery-motion:focus-visible,.gallery-arrow:focus-visible,.kinetic-reels:focus-visible{outline:3px solid #5b9cf5;outline-offset:3px}
.gallery-arrow{display:none;width:44px;padding:8px;font-size:18px}.gallery-arrow:disabled{opacity:.4;cursor:default}
.gallery-hint{display:none}
@media(max-width:900px){.kinetic-reels{grid-auto-flow:column;grid-auto-columns:min(82vw,320px);grid-template-columns:none;gap:14px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x proximity;padding-bottom:14px;scrollbar-width:thin}.kinetic-reels .reel{scroll-snap-align:start}.gallery-arrow{display:inline-block}.gallery-hint{display:block;font-size:.875rem;color:#a7aeba;margin:0 0 14px}}
.production-examples{background:#f5f7fa;padding:48px 0;scroll-margin-top:100px}
.production-examples h2{margin:0 0 12px}
.production-examples .examples-intro{max-width:720px;margin:0 0 28px}
.examples-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.production-example{min-width:0;background:#fff;border:1px solid #dbe1ea;border-radius:18px;padding:24px}
.production-example h3{font-size:1.25rem;line-height:1.3;margin:0 0 8px;letter-spacing:-.02em}
.production-example .example-meta{font-size:.875rem;color:#4b5563;margin:0 0 20px}
.example-video{display:block;width:100%;max-width:320px;height:auto;aspect-ratio:9/16;margin:0 auto 20px;background:#0b0d12;border-radius:10px}
.example-video:focus-visible{outline:3px solid #194ce8;outline-offset:4px}
.production-example p{font-size:1rem;line-height:1.6;margin:0 0 14px}
.production-example details{border-top:1px solid #dbe1ea;padding-top:4px}
.production-example summary{cursor:pointer;min-height:44px;padding:10px 0;color:#142f75;font-weight:600}
.production-example summary:focus-visible{outline:3px solid #194ce8;outline-offset:3px}
.production-example details p{font-size:.9375rem;color:#374151}
.examples-action{margin-top:28px}
@media(max-width:700px){.examples-grid{grid-template-columns:1fr}.production-example{padding:20px}.production-examples{padding:36px 0}}
@media(max-width:375px){.production-example{padding:14px}}
</style>"""
    motion_control = '<button type="button" class="gallery-motion" hidden>Pause motion</button>'
    # User-initiated examples stay outside the ambient reel playback controller.
    # The original UGC files are retained as source assets, not featured as evidence.
    demos = [
        ("one-bottleneck", "One bottleneck. One clear next step.", "21 seconds · Silent explainer · Illustrative workflow",
         "A message-led example for this site: start with an owner's problem and end with a clear invitation. The workflow is illustrative.",
         ["Still copying the same information between tools? Copy. Paste. Repeat.",
          "Start with one bottleneck. Illustrative workflow: Inquiry → Follow-up → Reporting.",
          "Connect the work. Keep a person accountable. One clear point of contact.",
          "Tell Zach what’s slowing you down. Start a conversation at zacharyvorsteg.com."]),
        ("sloane-ai-demo", "An AI spokesperson, clearly disclosed.", "3.25 seconds · With speech · Production demo",
         "Sloane is a synthetic spokesperson shown here to demonstrate the format and disclosure. She is not a customer or a testimonial.",
         ["Everything about this video is AI. Including me.", "On-screen disclosure: Sloane · AI-generated spokesperson · Demo."]),
    ]
    demo_cards = ""
    for key, title, meta, purpose, transcript in demos:
        for ext in ("mp4", "jpg", "vtt"):
            assert (ASSETS / f"{key}.{ext}").is_file(), f"missing reviewed example: {key}.{ext}"
        demo_cards += (
            f'<article class="production-example" aria-labelledby="{key}-h"><h3 id="{key}-h">{b.esc(title)}</h3>'
            f'<p class="example-meta" id="{key}-meta">{b.esc(meta)}</p>'
            f'<video class="example-video" controls playsinline preload="none" width="720" height="1280" '
            f'poster="/images/production/{key}.jpg" aria-labelledby="{key}-h" aria-describedby="{key}-meta">'
            f'<source src="/images/production/{key}.mp4" type="video/mp4">'
            f'<track kind="captions" src="/images/production/{key}.vtt" srclang="en" label="English">'
            f'<a href="/images/production/{key}.mp4">Open the demo video</a></video>'
            f'<p>{b.esc(purpose)}</p><details><summary>Read the transcript</summary>'
            + "".join(f'<p>{b.esc(line)}</p>' for line in transcript) + '</details></article>'
        )
    examples = (
        '<section class="production-examples" id="examples" aria-labelledby="examples-h"><div class="container">'
        '<p class="stu-label">Optional viewing · message and format</p>'
        '<h2 id="examples-h">See the message, then the production style.</h2>'
        '<p class="examples-intro">Two short examples show how an idea can become a clear message. Play either when you want, or read the transcripts. These demonstrate production choices; they do not establish campaign results.</p>'
        f'<div class="examples-grid">{demo_cards}</div>'
        '<div class="examples-action"><a class="btn btn-accent" href="/?topic=production#contact">Discuss a production brief</a></div>'
        '</div></section>'
    )
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
            f'<div class="gallery-controls">{motion_control}</div>'
            f'<div class="reels">{reels}</div>'
            '<div class="receipt" style="color:#8b93a3">Receipts · signature still → single push-in · brief-verified 3/3 frames each · rendered 2026-09-06</div></div></section>')
    # ---- kinetic pieces: only those that PASSED the kinetic standard gate ----
    kin = "".join(
        f'<figure class="reel kin">{vid(f"kinetic-{k}.mp4", f"kinetic-{k}.jpg", name, f"{name} kinetic piece: {t}", sound=True)}'
        f'<button type="button" class="snd" aria-label="Toggle sound">&#9834;</button>'
        f'<figcaption class="below"><b>{b.esc(t)}</b><span>{b.esc(name)} · kinetic piece · standard: pass</span></figcaption></figure>'
        for k, name, t in KINETIC if (ASSETS / f"kinetic-{k}.mp4").exists())
    kin_demo = "".join(
        f'<figure class="reel kin">{vid(f"kinetic-{k}.mp4", f"kinetic-{k}.jpg", name, f"{name} kinetic piece, product-demo family: {t}", sound=True)}'
        f'<button type="button" class="snd" aria-label="Toggle sound">&#9834;</button>'
        f'<figcaption class="below"><b>{b.esc(t)}</b><span>{b.esc(name)} · product-demo family · standard: pass</span></figcaption></figure>'
        for k, name, t in KINETIC_DEMO if (ASSETS / f"kinetic-{k}.mp4").exists())
    kin_demo_html = (f'<p class="stu-label" style="margin-top:26px">02b · Product-demo family — the work, visibly happening</p>'
                     f'<div class="reels" role="region" aria-label="Product-demo kinetic examples">{kin_demo}</div>') if kin_demo else ""
    kinetic = ('<section class="wall" style="background:#111420" aria-labelledby="kin-h"><div class="container"><p class="stu-label">02 · Kinetic pieces — the production standard</p>'
               '<h2 id="kin-h">One point, one line, a measured pace</h2>'
               '<p class="sub">Two families, so a feed never looks like one trick. Typographic pieces show a line; product-demo pieces show the work being done — a call handled, a lead moving, a search narrowing — with the hand clicking the next step. Each is built from the brand\'s own claim-locked lines on a brief-verified plate with a licensed bed, and shown here only if it passed the written standard gate. Use each sound button to listen.</p>'
               f'<div class="gallery-controls">{motion_control}<button class="gallery-arrow" type="button" id="kin-prev" aria-label="Previous kinetic example" aria-controls="kinetic-track">&larr;</button><button class="gallery-arrow" type="button" id="kin-next" aria-label="Next kinetic example" aria-controls="kinetic-track">&rarr;</button></div>'
               '<p class="gallery-hint">Scroll sideways or use the arrows to see all three.</p>'
               f'<div class="reels kinetic-reels" id="kinetic-track" role="region" tabindex="0" aria-label="Kinetic examples">{kin}</div>'
               f'{kin_demo_html}'
               '<div class="receipt" style="color:#8b93a3">Receipts · standard gate: kinetic, pass · plate verdicts on file · beds generated under commercial licence</div></div></section>')
    # ---- stills ----
    st = "".join(f'<figure><img src="/images/production/still-{c}.jpg" alt="{b.esc(BRAND[c][0])} signature still" width="1080" height="1350" loading="lazy"><figcaption>{b.esc(BRAND[c][1])} · signature still</figcaption></figure>'
                 for c in BRAND if (ASSETS / f"still-{c}.jpg").exists())
    stills = ('<section class="svc-section" aria-labelledby="st-h"><div class="container"><p class="stu-label">03 · Signature stills</p>'
              '<h2 id="st-h" style="margin-top:0">One idea per frame, a wordmark and nothing else</h2>'
              f'<div class="stills">{st}</div></div></section>')
    # ---- method strip: still → push-in → plate → piece ----
    method = ('<section class="svc-section" aria-labelledby="me-h"><div class="container"><p class="stu-label">04 · From still to post</p>'
              f'<h2 id="me-h" style="margin-top:0">From a still to a kinetic piece</h2><div class="gallery-controls">{motion_control}</div><div class="method">'
              '<figure><img src="/images/production/reel-pbw.jpg" alt="Signature still: a warehouse loading dock at dawn" loading="lazy"><figcaption>1 · Signature still</figcaption></figure>'
              f'<figure>{vid("reel-pbw.mp4", "reel-pbw.jpg", "Push-in", "The same dock, animated with a slow push-in")}<figcaption>2 · Push-in</figcaption></figure>'
              f'<figure>{vid("plate-pbw.mp4", "plate-pbw.jpg", "Plate", "A verified brand plate: a distribution park from above")}<figcaption>3 · Brief-verified plate</figcaption></figure>'
              f'<figure>{vid("kinetic-pbw.mp4", "kinetic-pbw.jpg", "Kinetic piece", "The finished kinetic piece on that plate", sound=True)}<figcaption>4 · Kinetic piece, gate: pass</figcaption></figure>'
              '</div><div class="receipt">Every step writes a receipt: source, seed, checksum, verdict. Nothing ships without one.</div></div></section>')
    js = """
<script>(function(){var vs=[].slice.call(document.querySelectorAll('video.pv'));if(!vs.length)return;
var motion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');var visible=new Set(),userPaused=false,allowReduced=false;
var stopped=function(){return userPaused||(motion&&motion.matches&&!allowReduced)};
var load=function(v){if(v.dataset.loaded)return;var s=document.createElement('source');s.src=v.dataset.src;s.type='video/mp4';v.appendChild(s);v.dataset.loaded='1';v.load()};
var soundButtons=function(){document.querySelectorAll('.snd').forEach(function(btn){var v=btn.parentNode.querySelector('video');btn.textContent=v.muted?'♪':'■';btn.disabled=Boolean(stopped());btn.setAttribute('aria-label',v.muted?'Turn sound on':'Turn sound off');btn.setAttribute('aria-pressed',String(!v.muted))})};
var sync=function(){document.querySelectorAll('.gallery-motion').forEach(function(btn){btn.hidden=false;btn.textContent=stopped()?'Play motion':'Pause motion'});soundButtons()};
var update=function(v){if(stopped()){v.pause();v.muted=true;if(motion&&motion.matches&&!allowReduced){v.querySelectorAll('source').forEach(function(s){s.remove()});delete v.dataset.loaded;v.load();}return;}if(visible.has(v)){load(v);v.play().catch(function(){})}else{v.pause()}};
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting)visible.add(v);else visible.delete(v);update(v)})},{rootMargin:'120px',threshold:.25});vs.forEach(function(v){io.observe(v)})}else{vs.forEach(function(v){visible.add(v);update(v)})}
if(motion&&motion.addEventListener)motion.addEventListener('change',function(){allowReduced=false;vs.forEach(update);sync()});
document.querySelectorAll('.gallery-motion').forEach(function(btn){btn.addEventListener('click',function(){if(stopped()){userPaused=false;allowReduced=true}else{userPaused=true;allowReduced=false}vs.forEach(update);sync()})});
document.querySelectorAll('.snd').forEach(function(btn){btn.addEventListener('click',function(){var v=btn.parentNode.querySelector('video');if(!v||stopped())return;v.muted=!v.muted;if(!v.muted)vs.forEach(function(o){if(o!==v)o.muted=true});soundButtons()})});sync();
var track=document.getElementById('kinetic-track'),prev=document.getElementById('kin-prev'),next=document.getElementById('kin-next');
if(track&&prev&&next){var arrows=function(){prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2};var move=function(d){var card=track.querySelector('.reel');if(card)track.scrollBy({left:d*(card.getBoundingClientRect().width+14),behavior:motion&&motion.matches?'auto':'smooth'})};prev.addEventListener('click',function(){move(-1)});next.addEventListener('click',function(){move(1)});track.addEventListener('scroll',arrows,{passive:true});window.addEventListener('resize',arrows);arrows()}
})();</script>"""
    return css, examples, wall, kinetic, stills, method, js

if __name__ == "__main__":
    out = b.page_html(PAGE)
    out = out.replace('href="/?topic=ai#contact"', 'href="/?topic=production#contact"')
    css, examples, wall, kinetic, stills, method, js = blocks()
    out = out.replace("</head>", css + "\n</head>", 1)
    hero_end = out.find("</section>", out.find('class="svc-hero"')) + len("</section>")
    out = out[:hero_end] + examples + wall + kinetic + stills + out[hero_end:]
    faq_at = out.find('<h2>Frequently asked questions</h2>'); sec_start = out.rfind('<section class="svc-section">', 0, faq_at)
    out = out[:sec_start] + method + out[sec_start:]
    out = out.replace("</body>", js + "\n</body>", 1)
    out = out.replace('class="btn btn-accent">Start a project</a>', 'class="btn btn-accent">Request a conversation</a>')
    text = re.sub(r"<[^>]+>", " ", re.sub(r"<(style|script)[^>]*>.*?</\1>", " ", out, flags=re.S))
    bad = [m.group(0) for m in b.BANNED.finditer(text)]
    assert not bad, f"banned phrase {bad}"
    assert len(PAGE["title"]) <= 65 and 110 <= len(PAGE["description"]) <= 165
    n_reels = out.count('<figure class="reel'); assert n_reels >= 6, f"only {n_reels} reel cards — assets missing?"
    d = ROOT / PAGE["slug"]; d.mkdir(exist_ok=True); (d / "index.html").write_text(out, encoding="utf-8")
    print(f"  wrote /{PAGE['slug']}/ ({len(out)} bytes, title {len(PAGE['title'])}c, desc {len(PAGE['description'])}c, {n_reels} video cards)")

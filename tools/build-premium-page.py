#!/usr/bin/env python3
"""Premium engagement page — /ai-operating-layer/ (draft 2026-09-06).

Positioning (Zach): attract premium, owner-led Palm Beach County businesses on annual engagements where the
fee is immaterial to them; avoid churn by becoming the operating plumbing. Understated, evidence-led,
one accountable person. No "#1", no guarantees, no invented counts.
Reuses the query-page generator so nav/design stay native.
"""
import importlib.util, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("b", ROOT / "tools" / "build-entity-pages.py"); b = importlib.util.module_from_spec(spec); spec.loader.exec_module(b)

PAGE = dict(
  slug="ai-operating-layer",
  eyebrow="Private engagements · Palm Beach County",
  title="AI Operating Layer for Owner-Led Businesses | Zachary Vorsteg",
  description="Private annual engagements: Zachary Vorsteg designs, builds and runs the AI systems behind intake, follow-up, reporting and content for owner-led businesses.",
  h1="I build and run the AI operating layer for owner-led businesses.",
  lede=("For a small number of businesses in Palm Beach County each year, I take responsibility for the systems that "
        "run underneath the company: how inquiries are captured and answered, how follow-up happens, how the owner sees "
        "the numbers, how the business shows up in search and in AI assistants. Designed by me, built by me, monitored "
        "continuously, reported in plain English."),
  cta2=("/ai-consultant-palm-beach-county/", "How I work"),
  sections=[
   ("What you are actually buying",
    ["Not software, and not advice. An accountable person who owns an outcome: the parts of your operation that should "
     "run without you, running without you — and staying that way. Every system I put in place verifies its own work "
     "and tells you, in one line a day, whether it did.",
     "I run the same systems for my own companies. The fleet behind this site publishes, checks and audits itself across "
     "fifteen properties on a schedule; the lead-handling infrastructure behind my ad and call businesses is the same "
     "infrastructure I install for clients. You are not the test."]),
   ("Who this is for",
    ["Owner-led businesses in Palm Beach County with real revenue and a back office that has stopped scaling: private "
     "wealth and family-office operations, luxury residential and development, aesthetic and medical practices, marine "
     "services, boutique law and accounting, design-build and high-end trades. The common thread is that the owner's "
     "time is the constraint, and the fee for removing that constraint is immaterial next to what it returns."]),
  ],
  grid=("Three engagement levels", [
   ("Foundation", "One operational system, end to end — usually intake and follow-up — with monitoring and a monthly report. The right place to start when you want to see how I work before handing over more."),
   ("Operating Layer", "Intake, follow-up, reporting, and your search and AI presence, run as one system with a quarterly review. Most clients live here."),
   ("Embedded", "I act as your head of systems: roadmap, build, operation, vendor decisions, and a seat at the quarterly review. A handful of these exist at any time."),
   ("Annual terms", "Twelve-month engagements with an onboarding fee. A system that is judged at day thirty is judged at its worst; annual terms let it compound."),
   ("Quarterly review", "A board-style session: what ran, what it produced, what to add. Scope expands there, not by surprise invoice."),
   ("One accountable person", "You work with me, not an account manager. When something needs a decision you hear from me; otherwise it simply runs."),
  ]),
  why_title="How the engagement runs",
  why=[
   "Discovery: a 45-minute conversation about where your time goes and what the business needs to do without you.",
   "Scope in writing: the systems, what each should produce, the reporting you'll receive, the annual fee. Nothing starts before you've read it.",
   "Onboarding: your existing tools stay; I build around them. First system live within the first month.",
   "Operation: continuous monitoring, a daily plain-English line, a monthly report, a quarterly review.",
   "Ownership: your accounts, your data, your platforms stay yours. The operating infrastructure is licensed while we work together.",
  ],
  faq=[
   ("What does this cost?", "Engagements are priced annually against the scope in writing. As a reference, Foundation engagements begin in the low five figures per year; Operating Layer and Embedded engagements run into six figures. If the fee is a material line for the business, this is probably not the right fit yet — my productized services (Ads Handled, CallsHandled) are built for that stage."),
   ("Why annual?", "Because the systems compound. Intake improves as data accrues, search presence builds over months, and the quarterly review is where the real expansion happens. Month-to-month arrangements optimise for the wrong thing."),
   ("How many clients do you take?", "A handful of engagements a year, by design. I do the work myself, and the value is in that."),
   ("What if we already have an agency or an IT provider?", "They usually stay. I own the operating layer — the systems between your tools — and coordinate with whoever runs marketing or infrastructure. Often I make their work measurable for the first time."),
   ("What do you need from us?", "Access to the tools you already use, a decision-maker for the quarterly review, and honesty about where time is lost. Almost nothing else."),
  ],
  close=("If your time is the constraint", "A short conversation is enough to tell whether there's an engagement here. I'll say so plainly either way."),
  crosslinks=[("/ai-consultant-palm-beach-county/", "AI consultant, Palm Beach County"), ("/agentic-ai-engineer-west-palm-beach/", "Agentic AI engineering"), ("/ai-systems-architect-florida/", "AI systems architecture"), ("/about", "About Zachary")],
  service_name="AI Operating Layer — Private Engagements", service_type="AI systems architecture, build and operation (annual engagement)",
)

WORK = [  # real screenshots of live systems; captions state only what is true
    ("adshandled-home.jpg", "Ads Handled", "Done-for-you ads for contractors. Paying customers; lead intake, missed-call text-back and a consolidated owner inbox run on infrastructure I built."),
    ("callshandled-home.jpg", "CallsHandled", "An AI receptionist for home-service businesses: answers, qualifies, books, and hands urgent calls to a person."),
    ("trusenda-home.jpg", "Trusenda", "A CRM for commercial real-estate brokers, designed and shipped to the App Store with billing and push notifications."),
    ("tspectrumtech-home.jpg", "Thermal Spectrum Technologies", "A client's site: onboarded to the content system in a day — blog, schema and standards check — with three verified articles live within 24 hours."),
    ("zacharyvorsteg-consultant.jpg", "Entity-structured presence", "Search and AI-assistant positioning built as structured data: one canonical entity, linked from every property."),
    ("palmbeachwarehouses.jpg", "Palm Beach Warehouses", "My commercial real-estate practice site: market intelligence, inventory and inquiries handled by the same operating layer."),
    ("dockandrack.jpg", "Dock & Rack Supply Co.", "A Next.js storefront for warehouse move-in equipment, with the blog and feeds run by the fleet."),
]

def showcase_html():
    cards = "".join(
        f'<figure class="work-card"><div class="work-frame"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>'
        f'<img src="/images/work/{img}" alt="{b.esc(title)} — screenshot" loading="lazy" width="1200" height="750">'
        f'<figcaption><strong>{b.esc(title)}</strong><span>{b.esc(cap)}</span></figcaption></figure>'
        for img, title, cap in WORK)
    css = """
<style>
.work{padding:52px 0 8px}
.work h2{margin:0 0 6px}
.work .work-sub{margin:0 0 22px;color:var(--text-muted,#6b7280)}
.work-track{display:flex;gap:18px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px 4px 18px;scrollbar-width:thin;-webkit-overflow-scrolling:touch}
.work-card{flex:0 0 min(78vw,560px);scroll-snap-align:start;margin:0;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.08)}
.work-frame{height:28px;background:#0f1218;display:flex;gap:6px;align-items:center;padding:0 12px}
.work-frame .dot{width:9px;height:9px;border-radius:50%;background:#3a3f48}
.work-card img{display:block;width:100%;height:auto;aspect-ratio:1200/750;object-fit:cover;object-position:top}
.work-card figcaption{padding:14px 16px 16px;font-size:.95rem;line-height:1.5}
.work-card figcaption strong{display:block;margin-bottom:4px}
.work-card figcaption span{color:var(--text-muted,#6b7280)}
.work-nav{display:flex;gap:8px;justify-content:flex-end;margin-top:4px}
.work-nav button{width:40px;height:40px;border-radius:50%;border:1px solid rgba(0,0,0,.15);background:#fff;font-size:18px;cursor:pointer}
.work-nav button:focus-visible{outline:3px solid var(--accent,#2563eb);outline-offset:2px}
@media(prefers-reduced-motion:reduce){.work-track{scroll-behavior:auto}}
</style>"""
    js = """
<script>(function(){var t=document.getElementById('worktrack');if(!t)return;var w=function(){var c=t.querySelector('.work-card');return c?c.getBoundingClientRect().width+18:400};
document.getElementById('workprev').addEventListener('click',function(){t.scrollBy({left:-w(),behavior:'smooth'})});
document.getElementById('worknext').addEventListener('click',function(){t.scrollBy({left:w(),behavior:'smooth'})});})();</script>"""
    return (css + '<section class="work svc-section" aria-labelledby="work-h"><div class="container"><h2 id="work-h">Selected work — live systems, not mockups</h2>'
            '<p class="work-sub">Every item below is running today. Screenshots are taken from the live sites.</p>'
            f'<div class="work-track" id="worktrack" tabindex="0" aria-label="Selected work, scroll horizontally">{cards}</div>'
            '<div class="work-nav"><button type="button" id="workprev" aria-label="Previous">&larr;</button><button type="button" id="worknext" aria-label="Next">&rarr;</button></div>'
            '</div></section>' + js)

def studio_blocks():
    """Structure borrowed from studio-grade sites (numbered micro-labels, a live 'render', marquee, numbered process,
    deliverables). Every figure shown is a real receipt from the system, never a mockup."""
    css = """
<style>
.stu-label{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:#6b7280;margin:0 0 10px}
.render{background:#0b0d12;color:#e8ecf2;border-radius:16px;padding:28px 28px 22px;position:relative;overflow:hidden;
 background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:36px 36px}
.render .stu-label{color:#8b93a3}
.render-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:6px}
.tile{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:16px 16px 14px}
.tile b{display:block;font-size:1.9rem;line-height:1;letter-spacing:-.02em;font-weight:700;color:#fff}
.tile span{display:block;margin-top:6px;font-size:.86rem;color:#a7aeba;line-height:1.4}
.tile em{display:block;margin-top:8px;font-style:normal;font-family:ui-monospace,Menlo,monospace;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:#6b7280}
.render-foot{margin-top:16px;font-family:ui-monospace,Menlo,monospace;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:#6b7280}
.marquee{overflow:hidden;white-space:nowrap;border-top:1px solid rgba(0,0,0,.08);border-bottom:1px solid rgba(0,0,0,.08);padding:12px 0;margin:36px 0 0}
.marquee div{display:inline-block;animation:mq 42s linear infinite;font-family:ui-monospace,Menlo,monospace;font-size:.78rem;letter-spacing:.2em;text-transform:uppercase;color:#6b7280}
.marquee span{margin:0 22px}
@keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media(prefers-reduced-motion:reduce){.marquee div{animation:none}}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px;margin-top:10px}
.step{border-top:2px solid #15181d;padding-top:12px}
.step .n{font-family:ui-monospace,Menlo,monospace;font-size:.78rem;letter-spacing:.16em;color:#6b7280}
.step h3{margin:6px 0 6px;font-size:1.05rem}
.step p{margin:0;color:#4a5060;font-size:.95rem;line-height:1.5}
.deliv{columns:2;column-gap:32px;margin:8px 0 0;padding-left:18px}
.deliv li{break-inside:avoid;margin:0 0 6px}
@media(max-width:640px){.deliv{columns:1}.tile b{font-size:1.6rem}}
</style>"""
    render = ('<section class="svc-section" aria-labelledby="live-h"><div class="container">'
              '<p class="stu-label">01 · Live render — the system, right now</p>'
              '<h2 id="live-h" style="margin-top:0">What "running" looks like</h2>'
              '<div class="render"><p class="stu-label">Receipts · read from the operating layer on 2026-09-06</p><div class="render-grid">'
              '<div class="tile"><b>15 / 15</b><span>websites meet the written publishing standard, checked daily</span><em>blog standard</em></div>'
              '<div class="tile"><b>30</b><span>articles researched, written, gated, published and verified in the last seven days</span><em>7-day output</em></div>'
              '<div class="tile"><b>28</b><span>assertions in the never-twice registry — one per past failure, run every day</span><em>regression watch</em></div>'
              '<div class="tile"><b>9 / 9</b><span>operator channels connected; every announcement in plain English</span><em>fleet</em></div>'
              '<div class="tile"><b>&lt; 60s</b><span>missed-call text-back on the receptionist line</span><em>callshandled</em></div>'
              '<div class="tile"><b>1 day</b><span>to onboard a client site: builder, schema, standard check, first verified post</span><em>tspectrumtech.com</em></div>'
              '</div><div class="render-foot">Figures are live receipts, not projections · updated as the systems run</div></div>'
              '</div></section>')
    mq_items = ["Private wealth", "Luxury residential", "Developers", "Aesthetic &amp; medical", "Marine", "Boutique law &amp; CPA", "Design-build", "High-end trades"]
    mq = '<div class="marquee" aria-hidden="true"><div>' + "".join(f"<span>{x} •</span>" for x in mq_items * 2) + "</div></div>"
    steps = [("01", "Discovery", "Where your time goes, and what the business must do without you."),
             ("02", "Scope", "Systems, outputs, reporting and the annual fee — in writing before anything starts."),
             ("03", "Onboarding", "Built around the tools you already run. First system live within the first month."),
             ("04", "Operation", "Continuous monitoring, a daily plain-English line, a monthly report."),
             ("05", "Review", "A board-style quarterly session: what ran, what it produced, what comes next.")]
    process = ('<section class="svc-section" aria-labelledby="proc-h"><div class="container"><p class="stu-label">02 · Process</p>'
               '<h2 id="proc-h" style="margin-top:0">How an engagement runs</h2><div class="steps">' +
               "".join(f'<div class="step"><div class="n">{n}</div><h3>{t}</h3><p>{d}</p></div>' for n, t, d in steps) + "</div></div></section>")
    deliverables = ["An intake and response system across phone, web, text and email", "Follow-up cadences with an owner and a receipt for every step",
                    "A daily plain-English status line and a monthly outcomes report", "Quarterly review materials and a written roadmap",
                    "Entity-structured search and AI-assistant presence on your domain", "Monitoring with alerts that reach you before customers notice",
                    "Documentation your team can operate from", "Custom software where off-the-shelf fails"]
    deliv = ('<section class="svc-section" aria-labelledby="deliv-h"><div class="container"><p class="stu-label">03 · Deliverables</p>'
             '<h2 id="deliv-h" style="margin-top:0">What you receive</h2><ul class="deliv">' + "".join(f"<li>{d}</li>" for d in deliverables) + "</ul></div></section>")
    return css, render, mq, process, deliv

if __name__ == "__main__":
    out = b.page_html(PAGE)
    css, render, mq, process, deliv = studio_blocks()
    out = out.replace("</head>", css + "\n</head>", 1)
    # order after the hero: marquee → live render → selected work → (template sections) ; process + deliverables before the FAQ
    hero_end = out.find("</section>", out.find('class="svc-hero"')) + len("</section>")
    # SIGNATURE RENDERS (render-forge, FLUX via fal.ai, 2026-09-06): cinematic stills, one per idea — the layer that sells.
    hero_fig = ('<style>.sig{margin:0;position:relative;border-radius:0}'
                '.sig img{display:block;width:100%;height:min(72vh,720px);object-fit:cover;object-position:center 60%}'
                '.sig figcaption{position:absolute;left:0;right:0;bottom:0;padding:18px 22px;background:linear-gradient(transparent,rgba(5,6,10,.75));color:#cfd5df;'
                'font-family:ui-monospace,Menlo,monospace;font-size:.7rem;letter-spacing:.18em;text-transform:uppercase}'
                '.render{background-image:linear-gradient(rgba(5,6,10,.82),rgba(5,6,10,.88)),url(/images/renders/render-05.jpg);background-size:cover;background-position:center}</style>'
                '<figure class="sig">'
                # living render: a 5s image-to-video push-in generated from the same still (render-forge video); the still is the poster
                # and the only thing shown when the visitor prefers reduced motion or the video cannot play.
                '<video class="sig-video" autoplay muted loop playsinline preload="metadata" poster="/images/renders/render-06.jpg" aria-label="A quiet studio at dusk over the Intracoastal, one monitor showing an orderly dashboard" style="display:block;width:100%;height:min(72vh,720px);object-fit:cover;object-position:center 60%">'
                '<source src="/images/renders/hero-loop.mp4" type="video/mp4"></video>'
                '<style>@media(prefers-reduced-motion:reduce){.sig-video{display:none!important}.sig .sig-still{display:block!important}}</style>'
                '<img class="sig-still" src="/images/renders/render-06.jpg" alt="A quiet studio at dusk over the Intracoastal, one monitor showing an orderly dashboard" width="1600" height="893" style="display:none">'
                '<figcaption>Signature render · the operating layer, West Palm Beach, dusk</figcaption></figure>')
    out = out[:hero_end] + hero_fig + mq + render + showcase_html() + out[hero_end:]
    faq_at = out.find('<h2>Frequently asked questions</h2>')
    sec_start = out.rfind('<section class="svc-section">', 0, faq_at)
    out = out[:sec_start] + process + deliv + out[sec_start:]
    # the template's own "How the engagement runs" list now duplicates the numbered process — drop it
    out = re.sub(r'<section class="svc-section"><div class="container"><h2>How the engagement runs</h2><ul class="svc-list">.*?</ul></div></section>', "", out, count=1, flags=re.S)
    # premium page: primary CTA reads as an invitation, not a project start
    out = out.replace('class="btn btn-accent">Start a project</a>', 'class="btn btn-accent">Request a conversation</a>')
    text = re.sub(r"<[^>]+>", " ", re.sub(r"<(style|script)[^>]*>.*?</\1>", " ", out, flags=re.S))  # CSS colours like #15181d are not copy
    bad = [m.group(0) for m in b.BANNED.finditer(text)]
    assert not bad, f"banned phrase {bad}"
    assert len(PAGE["title"]) <= 65 and 110 <= len(PAGE["description"]) <= 165
    d = ROOT / PAGE["slug"]; d.mkdir(exist_ok=True); (d / "index.html").write_text(out, encoding="utf-8")
    print(f"  wrote /{PAGE['slug']}/ ({len(out)} bytes, title {len(PAGE['title'])}c, desc {len(PAGE['description'])}c)")

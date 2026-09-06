#!/usr/bin/env python3
"""Premium engagement page — /ai-operating-layer/ (draft 2026-09-06).

Positioning: annual systems engagements for owner-led Palm Beach County businesses, with a clear scope,
first-month priorities and one accountable person. Understated, evidence-led. No "#1", no guarantees,
no invented counts.
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
        "the numbers, how the business shows up in search and in AI assistants. I lead the design, build and operation, "
        "with the scope, responsibilities and reporting agreed in writing."),
  cta_href="/?topic=ai#contact",
  cta_label="Request a conversation",
  cta2=("/production/", "See the production layer"),
  sections=[
   ("What you are actually buying",
    ["A defined set of operational systems, with me responsible for their architecture, implementation and ongoing review. "
     "The written scope identifies what each workflow should produce, how it is monitored, and which decisions remain "
     "with your team. A daily status line and monthly report make the work visible.",
     "I operate related publishing and lead-handling systems in my own businesses. The examples below show that work; "
     "your engagement starts with the workflows, tools and constraints of your business."]),
   ("Who this is for",
    ["Owner-led businesses in Palm Beach County with real revenue and a back office that has stopped scaling: private "
     "wealth and family-office operations, luxury residential and development, aesthetic and medical practices, marine "
     "services, boutique law and accounting, design-build and high-end trades. The common thread is that the owner's "
     "time is the constraint. We assess the work, expected value and investment together before agreeing to a scope."]),
  ],
  grid=("Three engagement levels", [
   ("Foundation", "One operational system, end to end — usually intake and follow-up — with monitoring and a monthly report. The right place to start when you want to see how I work before handing over more."),
   ("Operating Layer", "Intake, follow-up, reporting, and your search and AI presence, coordinated under one scope with a quarterly review."),
   ("Embedded", "I act as your head of systems: roadmap, build, operation, vendor decisions, and a seat at the quarterly review. A handful of these exist at any time."),
   ("Annual terms", "Twelve-month engagements with an onboarding fee. The first month establishes the agreed workflow, access, first implementation and monitoring. We review progress against that scope before choosing the next priorities."),
   ("Quarterly review", "A working session on what ran, what it produced and what needs attention. Changes to scope and fees are agreed in writing."),
   ("One accountable person", "I lead the architecture, implementation and review. Your team approves business decisions and provides the access and operational context the work needs."),
  ]),
  why_title="How the engagement runs",
  why=[
   "Discovery: a 45-minute conversation about where your time goes and what the business needs to do without you.",
   "Scope in writing: the systems, what each should produce, the reporting you'll receive, the annual fee. Nothing starts before you've read it.",
   "Onboarding: work around your existing tools, confirm access and approval responsibilities, and plan the first system for the first month. Dependencies and readiness are reviewed against the scope.",
   "Operation: continuous monitoring, a daily plain-English line, a monthly report, a quarterly review.",
   "Ownership: your accounts, your data, your platforms stay yours. The operating infrastructure is licensed while we work together.",
  ],
  faq=[
   ("What does this cost?", "Engagements are priced annually against the scope in writing. As a reference, Foundation engagements begin in the low five figures per year; Operating Layer and Embedded engagements run into six figures. We compare the proposed work, expected value and investment before deciding whether to proceed. A specific advertising or call-handling need may fit Ads Handled or CallsHandled instead."),
   ("Why annual?", "The engagement includes implementation, operation and quarterly review. The first month has defined onboarding and implementation priorities; later reviews use the reporting to decide what to improve. The annual scope sets out fees, responsibilities and what is included before work begins."),
   ("How many clients do you take?", "A handful of engagements a year, by design. I do the work myself, and the value is in that."),
   ("What if we already have an agency or an IT provider?", "We identify who owns each part of the workflow before starting. I coordinate the agreed systems work with the people responsible for marketing and infrastructure, including access, approvals, monitoring and reporting."),
   ("How do your other businesses fit?", "Ads Handled and CallsHandled focus on specific advertising and call-handling needs. This personal engagement is for work that needs my involvement across several systems. We choose any specialist service because it fits the agreed scope; its role and responsibilities are explicit."),
   ("What do you need from us?", "A decision-maker, someone who knows the current workflow, and appropriate access to the tools in scope. Your team confirms the business rules and approves the first workflow before it goes live. We agree who receives alerts and who makes decisions when an exception needs attention."),
  ],
  close=("If your time is the constraint", "A short conversation is enough to tell whether there's an engagement here. I'll say so plainly either way."),
  crosslinks=[("/production/", "Production: reels, stills, kinetic pieces"), ("/ai-consultant-palm-beach-county/", "AI consultant, Palm Beach County"), ("/agentic-ai-engineer-west-palm-beach/", "Agentic AI engineering"), ("/ai-systems-architect-florida/", "AI systems architecture"), ("/about", "About Zachary")],
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
.work-nav button{width:44px;height:44px;border-radius:50%;border:1px solid rgba(0,0,0,.15);background:#fff;font-size:18px;cursor:pointer}
.work-nav button:disabled{opacity:.4;cursor:default}
.work-nav button:focus-visible{outline:3px solid var(--accent,#2563eb);outline-offset:2px}
@media(prefers-reduced-motion:reduce){.work-track{scroll-behavior:auto}}
</style>"""
    js = """
<script>(function(){var t=document.getElementById('worktrack');if(!t)return;var w=function(){var c=t.querySelector('.work-card');return c?c.getBoundingClientRect().width+18:400};
var behavior=function(){return window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'};
var prev=document.getElementById('workprev'),next=document.getElementById('worknext');
var sync=function(){var s=getComputedStyle(t),start=parseFloat(s.paddingLeft)||0,end=parseFloat(s.paddingRight)||0;prev.disabled=t.scrollLeft<=start+2;next.disabled=t.scrollLeft+t.clientWidth>=t.scrollWidth-end-2};
prev.addEventListener('click',function(){t.scrollBy({left:-w(),behavior:behavior()})});
next.addEventListener('click',function(){t.scrollBy({left:w(),behavior:behavior()})});
t.addEventListener('scroll',sync,{passive:true});window.addEventListener('resize',sync);sync();})();</script>"""
    return (css + '<section class="work svc-section" aria-labelledby="work-h"><div class="container"><h2 id="work-h">Selected work — live systems, not mockups</h2>'
            '<p class="work-sub">Screenshots of products and sites I have built. Founder projects and the client example are identified below.</p>'
            f'<div class="work-track" id="worktrack" tabindex="0" aria-label="Selected work, scroll horizontally">{cards}</div>'
            '<div class="work-nav"><button type="button" id="workprev" aria-label="Previous example" aria-controls="worktrack">&larr;</button><button type="button" id="worknext" aria-label="Next example" aria-controls="worktrack">&rarr;</button></div>'
            '</div></section>' + js)

def studio_blocks():
    """Numbered operating snapshot, process and deliverables. Snapshot values retain their recorded date;
    publishing checks and output counts are not a measurement of client conversion results."""
    css = """
<style>
.stu-label{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:#6b7280;margin:0 0 10px}
.svc-section .stu-label{font-size:.75rem;line-height:1.6;letter-spacing:.13em;margin:0 0 10px}
.render{background:#0b0d12;color:#e8ecf2;border-radius:16px;padding:28px 28px 22px;position:relative;overflow:hidden;
 background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:36px 36px}
.render .stu-label{color:#8b93a3}
.render-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:6px}
.tile{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:16px 16px 14px}
.tile b{display:block;font-size:1.9rem;line-height:1;letter-spacing:-.02em;font-weight:700;color:#fff}
.tile span{display:block;margin-top:6px;font-size:.86rem;color:#a7aeba;line-height:1.4}
.tile em{display:block;margin-top:8px;font-style:normal;font-family:ui-monospace,Menlo,monospace;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:#a7aeba}
.render-foot{margin-top:16px;font-family:ui-monospace,Menlo,monospace;font-size:.75rem;line-height:1.6;letter-spacing:.08em;text-transform:uppercase;color:#a7aeba}
.marquee{border-top:1px solid rgba(0,0,0,.08);border-bottom:1px solid rgba(0,0,0,.08);padding:16px 0;margin:0}
.marquee div{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 22px;font-family:ui-monospace,Menlo,monospace;font-size:.75rem;line-height:1.5;letter-spacing:.1em;text-transform:uppercase;color:#59636b}
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
              '<p class="stu-label">01 · Operating snapshot · September 6, 2026</p>'
              '<h2 id="live-h" style="margin-top:0">What "running" looks like</h2>'
              '<div class="render"><p class="stu-label">Receipts · read from the operating layer on 2026-09-06</p><div class="render-grid">'
              '<div class="tile"><b>15 / 15</b><span>websites recorded as passing the internal publishing check</span><em>blog standard</em></div>'
              '<div class="tile"><b>30</b><span>articles researched, written, gated, published and verified in the last seven days</span><em>7-day output</em></div>'
              '<div class="tile"><b>28</b><span>assertions in the never-twice registry — one per past failure, run every day</span><em>regression watch</em></div>'
              '<div class="tile"><b>9 / 9</b><span>operator channels connected; every announcement in plain English</span><em>fleet</em></div>'
              '<div class="tile"><b>&lt; 60s</b><span>missed-call text-back on the receptionist line</span><em>callshandled</em></div>'
              '<div class="tile"><b>1 day</b><span>to onboard a client site: builder, schema, standard check, first verified post</span><em>tspectrumtech.com</em></div>'
              '</div><div class="render-foot">Recorded internal activity · publishing checks and output counts do not measure client conversion results</div></div>'
              '</div></section>')
    mq_items = ["Private wealth", "Luxury residential", "Developers", "Aesthetic &amp; medical", "Marine", "Boutique law &amp; CPA", "Design-build", "High-end trades"]
    mq = '<div class="marquee" role="group" aria-label="Who this is for"><div class="container">' + "".join(f"<span>{x}</span>" for x in mq_items) + "</div></div>"
    steps = [("01", "Discovery", "Where your time goes, and what the business must do without you."),
             ("02", "Scope", "Systems, outputs, reporting and the annual fee — in writing before anything starts."),
             ("03", "Onboarding", "Confirm access, business rules and approvals; plan the first system for the first month and review readiness against the scope."),
             ("04", "Operation", "Continuous monitoring, a daily plain-English line, a monthly report."),
             ("05", "Review", "A board-style quarterly session: what ran, what it produced, what comes next.")]
    process = ('<section class="svc-section" aria-labelledby="proc-h"><div class="container"><p class="stu-label">02 · Process</p>'
               '<h2 id="proc-h" style="margin-top:0">How an engagement runs</h2><div class="steps">' +
               "".join(f'<div class="step"><div class="n">{n}</div><h3>{t}</h3><p>{d}</p></div>' for n, t, d in steps) + "</div></div></section>")
    deliverables = ["An intake and response system across phone, web, text and email", "Follow-up cadences with an owner and a receipt for every step",
                    "A daily plain-English status line and a monthly outcomes report", "Quarterly review materials and a written roadmap",
                    "Structured website content and entity information for search and AI discovery", "Content production: signature stills, detail reels and kinetic pieces, verified and posted with receipts (<a href=\"/production/\">see the work</a>)", "Monitoring and an agreed route for alerts and exceptions",
                    "Documentation your team can operate from", "Custom software where off-the-shelf fails"]
    deliv = ('<section class="svc-section" aria-labelledby="deliv-h"><div class="container"><p class="stu-label">03 · Deliverables</p>'
             '<h2 id="deliv-h" style="margin-top:0">What the scope can include</h2><p>The written engagement identifies which of these systems and outputs are included.</p><ul class="deliv">' + "".join(f"<li>{d}</li>" for d in deliverables) + "</ul></div></section>")
    return css, render, mq, process, deliv

if __name__ == "__main__":
    out = b.page_html(PAGE)
    css, render, mq, process, deliv = studio_blocks()
    out = out.replace("</head>", css + "\n</head>", 1)
    # order after the hero: marquee → live render → selected work → (template sections) ; process + deliverables before the FAQ
    hero_end = out.find("</section>", out.find('class="svc-hero"')) + len("</section>")
    # SIGNATURE RENDERS (render-forge, FLUX via fal.ai, 2026-09-06): cinematic stills, one per idea — the layer that sells.
    hero_fig = ('<style>.sig{margin:0;position:relative;border-radius:0}'
                '.sig-video{display:block;width:100%;height:clamp(280px,42vw,480px);object-fit:cover;object-position:center 60%}'
                '.sig-motion{position:absolute;top:16px;right:16px;min-height:44px;padding:10px 16px;border:1px solid #a7aeba;border-radius:999px;background:#0b0d12;color:#fff;font-family:inherit;font-size:.875rem;font-weight:600;line-height:1.4;cursor:pointer}'
                '.sig-motion:focus-visible{outline:3px solid #fff;outline-offset:3px}'
                '.sig figcaption{position:absolute;left:0;right:0;bottom:0;padding:18px 22px;background:linear-gradient(transparent,rgba(5,6,10,.75));color:#cfd5df;'
                'font-family:ui-monospace,Menlo,monospace;font-size:.75rem;line-height:1.5;letter-spacing:.1em;text-transform:uppercase}</style>'
                '<figure class="sig">'
                # living render: a 5s image-to-video push-in generated from the same still (render-forge video); the still is the poster
                # and the default under reduced motion; visitors can explicitly opt into playback.
                '<video class="sig-video" id="signature-motion" muted loop playsinline preload="none" poster="/images/renders/render-06.jpg" data-src="/images/renders/hero-loop.mp4" aria-label="A quiet studio at dusk over the Intracoastal, one monitor showing an orderly dashboard"></video>'
                '<button class="sig-motion" type="button" aria-controls="signature-motion" hidden>Pause motion</button>'
                '<figcaption>Signature render · the operating layer, West Palm Beach, dusk</figcaption></figure>'
                '<script>(function(){var v=document.querySelector(".sig-video");if(!v)return;'
                'var motion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)");var visible=false,userPaused=false,allowReduced=false;var btn=document.querySelector(".sig-motion");btn.hidden=false;'
                'function stopped(){return userPaused||(motion&&motion.matches&&!allowReduced);}'
                'function update(){btn.textContent=stopped()?"Play motion":"Pause motion";if(stopped()){v.pause();if(motion&&motion.matches&&!allowReduced){v.removeAttribute("src");v.load();}return;}'
                'if(!visible){v.pause();return;}if(!v.getAttribute("src")){v.src=v.dataset.src;v.load();}v.play().catch(function(){});}'
                'if("IntersectionObserver" in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;update();},{threshold:.1}).observe(v);}else{visible=true;update();}'
                'btn.addEventListener("click",function(){if(stopped()){userPaused=false;allowReduced=true;}else{userPaused=true;allowReduced=false;}update();});'
                'if(motion&&motion.addEventListener)motion.addEventListener("change",function(){allowReduced=false;update();});update();})();</script>')
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

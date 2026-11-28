#!/usr/bin/env python3
"""Builds /zach-vorsteg-ai-consultant-west-palm-beach/ (the plain entity page for Zach Vorsteg).

Reuses the head/header/footer shell and helpers from tools/build-entity-pages.py so the page stays native.
Every claim on the page is one already published on the site (homepage case studies, /portfolio/,
/ai-consulting-cost/, /ai-operating-layer/) or on the linked venture sites. No invented clients, counts,
results or testimonials. Run:  python3 tools/build-zach-profile-page.py
"""
import importlib.util, json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("entity", ROOT / "tools" / "build-entity-pages.py")
E = importlib.util.module_from_spec(spec); spec.loader.exec_module(E)
esc, ld, DOMAIN, PERSON_ID = E.esc, E.ld, E.DOMAIN, E.PERSON_ID

SLUG = "zach-vorsteg-ai-consultant-west-palm-beach"
URL = f"{DOMAIN}/{SLUG}/"
TITLE = "Zach Vorsteg: Fractional AI Lead & AI Consultant, West Palm Beach"
DESC = ("Zach Vorsteg is an AI automation consultant (fractional AI lead) in West Palm Beach, serving "
        "Palm Beach County businesses. See what he has built and how to start.")
H1 = "Zach Vorsteg: AI automation consultant (fractional AI lead) in West Palm Beach"
BUSINESS_ID = DOMAIN + "/#professional-service"
CTA = "/?topic=ai#contact"

SAME_AS = [
    "https://www.linkedin.com/in/zacharyvorsteg",
    "https://x.com/zachvorsteg",
    "https://github.com/ZacharyVorsteg",
    "https://apps.apple.com/us/developer/zachary-vorsteg/id1847188302",
    "https://customlab.ai/",
    "https://callshandled.ai/",
    "https://adshandled.com/",
    "https://palmbeachwebsites.com/",
    "https://trusenda.com/",
]

AREA = [
    {"@type": "City", "name": "West Palm Beach",
     "containedInPlace": {"@type": "AdministrativeArea", "name": "Palm Beach County, FL"}},
    {"@type": "AdministrativeArea", "name": "Palm Beach County, FL",
     "containedInPlace": {"@type": "State", "name": "Florida"}},
    {"@type": "State", "name": "Florida"},
]

FAQ = [
    ("Who is Zach Vorsteg?",
     "Zach Vorsteg (Zachary Vorsteg) is an AI automation consultant and fractional AI lead based in West Palm Beach, Florida. "
     "He builds and runs AI systems in his own businesses and installs the same kind of systems for owner-led businesses in "
     "Palm Beach County, with a person approving anything that sends, spends or publishes."),
    ("What does a fractional AI lead do?",
     "A fractional AI lead is the one person who owns your AI priorities without being a full-time hire. In practice that means "
     "choosing the first workflow worth automating, building it in the tools you already use, monitoring it, and keeping it "
     "running, with the scope, responsibilities and reporting agreed in writing."),
    ("Where does Zach work?",
     "From West Palm Beach, with owner-led businesses across Palm Beach County. First conversations are by phone or video, "
     "and he meets in person when it helps. Remote work for businesses outside the county is also possible."),
    ("What does it cost to start?",
     "The first conversation is free. Ongoing engagements through CustomLab.ai start at $3,500 a month with a 90-day initial "
     "partnership, and a project scoped directly with Zach is quoted in writing before any work starts. All published prices "
     "are listed, with sources, on the AI consulting cost page."),
    ("What has Zach actually built?",
     "Trusenda, a lead-management CRM for web and iOS that he built solo; CallsHandled, an AI receptionist for local service "
     "businesses; and Palm Beach Warehouses, an industrial listing site that runs on agents. He has also built and launched "
     "websites for local business clients. These systems run his own ventures."),
    ("Is this a full agency?",
     "No. You work directly with Zach, with no account-manager layer. If your business needs a large team or a full-time AI "
     "executive, he will tell you in the first conversation."),
]

CASES = [
    ("Trusenda: a CRM and lead pipeline I built and run",
     "A lead-management CRM I designed and built solo for web and iOS, live on the App Store. It tracks speed to lead, deal stages "
     "and the next step on every lead, and I use it every day on my own inquiries.",
     "https://trusenda.com/", "Visit Trusenda"),
    ("CallsHandled: an AI receptionist for local service businesses",
     "An AI front office that answers calls, captures the details of each job and hands the lead to the owner, so small businesses "
     "stop losing work to missed calls. I build and operate it myself.",
     "https://callshandled.ai/", "Visit CallsHandled"),
    ("Palm Beach Warehouses: an industrial listing site that runs on agents",
     "A commercial real estate site for warehouse and flex space in Palm Beach County. AI agents keep listings current, check "
     "every listing against its live source, and route each new inquiry into a lead pipeline so a person follows up fast.",
     "https://palmbeachwarehouses.com/", "Visit the site"),
    ("Palm Beach Websites: websites for local businesses",
     "I have built and launched websites for local business clients, the same way I build my own: fast, searchable and tied to a "
     "lead pipeline.",
     "https://palmbeachwebsites.com/", "Visit Palm Beach Websites"),
]

STEPS = [
    ("Talk through one workflow", "What is happening now, who uses the process, and where does it get stuck? The first conversation is free."),
    ("Decide if it is worth changing", "We weigh the practical value, your existing tools and the people involved. If I cannot find at least 5 hours a week to save, I will say so before we start."),
    ("Agree scope in writing", "Deliverables, timing, investment and responsibilities are written down before any work begins."),
    ("Build, monitor and keep it running", "The system is built in your accounts with a runbook, logs and alerts, and a person on your side approving what goes out."),
]

NOT_FOR = [
    "Owner-led and mid-sized businesses in Palm Beach County that are growing faster than their back office: contractors and home-service companies, professional services, property operators and founders running several ventures.",
    "Owners who want one accountable person who builds, not a slide deck or a vendor handoff.",
    "Not a fit: a large enterprise that needs a full team or a full-time AI executive, or anyone who wants a fully automated system with no person approving what sends, spends or publishes.",
]

PROFILE_LINKS = [
    ("LinkedIn", "https://www.linkedin.com/in/zacharyvorsteg"),
    ("X (@zachvorsteg)", "https://x.com/zachvorsteg"),
    ("GitHub", "https://github.com/ZacharyVorsteg"),
    ("App Store developer page", "https://apps.apple.com/us/developer/zachary-vorsteg/id1847188302"),
    ("CustomLab.ai", "https://customlab.ai/"),
    ("CallsHandled", "https://callshandled.ai/"),
    ("AdsHandled", "https://adshandled.com/"),
    ("Palm Beach Websites", "https://palmbeachwebsites.com/"),
    ("Trusenda", "https://trusenda.com/"),
]

def ext(href):  # external-link attrs
    return ' target="_blank" rel="noopener"' if href.startswith("http") else ""

def build():
    dummy = dict(slug=SLUG, title=TITLE, description=DESC, eyebrow="x", h1="x", lede="x", cta2=("/", "x"),
                 sections=[("x", ["x"])], grid=("x", [("x", "x")]), why_title="x", why=["x"], faq=FAQ,
                 close=("x", "x"), crosslinks=[("/", "x")], service_name="x", service_type="x")
    h = E.page_html(dummy)  # head meta + shell are replaced below
    h = h.replace("</head>", "<style>.svc-card a{font-weight:600;color:inherit;text-decoration:underline;text-underline-offset:3px;display:inline-block;margin-top:12px}.svc-profile-links{display:flex;flex-wrap:wrap;gap:10px 18px;list-style:none;padding:0;margin:16px 0 0}.svc-profile-links a{color:inherit;text-decoration:underline;text-underline-offset:3px}.svc-note{font-size:14px;color:var(--gray-600)}</style>\n</head>", 1)

    person = {
        "@type": "Person", "@id": PERSON_ID, "name": "Zachary Vorsteg", "alternateName": ["Zach Vorsteg"],
        "url": DOMAIN + "/", "image": DOMAIN + "/images/zach-headshot.jpg",
        "jobTitle": "AI Automation Consultant (Fractional AI Lead)",
        "description": "Zach Vorsteg is an AI automation consultant and fractional AI lead in West Palm Beach, Florida, serving Palm Beach County businesses.",
        "address": {"@type": "PostalAddress", "addressLocality": "West Palm Beach", "addressRegion": "FL", "addressCountry": "US"},
        "areaServed": AREA,
        "knowsAbout": ["AI automation", "Workflow automation", "AI receptionists and call handling", "Lead routing and CRM automation",
                       "Agentic AI systems", "Custom software"],
        "sameAs": SAME_AS,
    }
    service = {
        "@type": "ProfessionalService", "@id": BUSINESS_ID, "name": "Zachary Vorsteg",
        "alternateName": "Zach Vorsteg, AI automation consultant",
        "description": DESC, "url": URL, "image": DOMAIN + "/images/zach-headshot.jpg",
        "telephone": "+15617186725",
        "address": {"@type": "PostalAddress", "addressLocality": "West Palm Beach", "addressRegion": "FL", "addressCountry": "US"},
        "areaServed": AREA, "founder": {"@id": PERSON_ID},
        "serviceType": ["AI automation consulting", "Fractional AI lead", "AI workflow implementation"],
        "knowsAbout": ["AI automation", "Workflow automation", "AI receptionists and call handling", "Lead routing and CRM automation"],
        "sameAs": SAME_AS,
        "hasOfferCatalog": {"@type": "OfferCatalog", "name": "AI automation services", "itemListElement": [
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "AI workflow automation",
                                               "description": "One workflow at a time, built in the client's own tools, with a person approving what goes out."}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Fractional AI lead",
                                               "description": "Ongoing ownership of AI priorities, builds and monitoring, scoped in writing."}}]},
    }
    webpage = {
        "@type": "ProfilePage", "@id": URL + "#webpage", "url": URL, "name": TITLE, "description": DESC,
        "inLanguage": "en-US", "mainEntity": {"@id": PERSON_ID}, "about": {"@id": BUSINESS_ID},
        "isPartOf": {"@type": "WebSite", "@id": DOMAIN + "/#website", "url": DOMAIN + "/", "name": "Zachary Vorsteg"},
    }
    faq = {"@type": "FAQPage", "@id": URL + "#faq", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]}
    crumbs = {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN + "/"},
        {"@type": "ListItem", "position": 2, "name": "Zach Vorsteg, AI automation consultant", "item": URL}]}
    graph = {"@context": "https://schema.org", "@graph": [webpage, person, service, faq, crumbs]}
    h = re.sub(r'<script type="application/ld\+json">.*?</script>\s*', "", h, flags=re.S)
    h = h.replace("</head>", ld(graph) + "\n</head>", 1)
    # consistent social metadata
    h = re.sub(r'(<meta property="og:image:alt" content=")[^"]*(")', lambda m: m.group(1) + "Zach Vorsteg, AI automation consultant in West Palm Beach" + m.group(2), h, count=1)

    hero = (f'<section class="svc-hero"><div class="container"><div class="svc-hero-content"><div class="hero-eyebrow">AI automation consultant · West Palm Beach, FL</div>'
            f'<h1>{esc(H1)}</h1>'
            "<p>Zach Vorsteg (Zachary Vorsteg) is an AI automation consultant and fractional AI lead based in West Palm Beach, Florida, "
            "working with owner-led businesses across Palm Beach County. I pick one workflow with you, build it in the tools you already "
            "use, monitor it, and keep a person approving anything that sends, spends or publishes.</p>"
            f'<div class="svc-cta-row"><a href="{CTA}" class="btn btn-accent">Work with me</a>'
            '<a href="/ai-consulting-cost/" class="btn btn-secondary">See published prices</a></div></div></div></section>')

    def sec(title, inner): return f'<section class="svc-section"><div class="container"><h2>{esc(title)}</h2>{inner}</div></section>'
    who = sec("Who Zach Vorsteg is",
              "<p>I'm Zach Vorsteg, an AI automation consultant in West Palm Beach. I run AI workflow systems in my own businesses every day, "
              "then install the same kind of systems for local owners: missed-call handling, lead intake and follow-up, CRMs, reporting and "
              "custom software. I have a finance background (FAU '20) and I work directly with each client, with no account-manager layer.</p>"
              "<p>\"Fractional AI lead\" means I act as your AI lead on a part-time basis, so you get one accountable person for priorities, "
              "builds and monitoring without hiring a full-time executive. For a single project it can be a fixed-scope pilot; for ongoing "
              "work it is the <a href=\"/ai-operating-layer/\">operating-layer engagement</a>.</p>")
    cards = ("".join(f'<div class="svc-card"><h3>{esc(t)}</h3><p>{esc(b)}</p></div>' for t, b in [
        ("Find the workflow worth automating", "Intake, follow-up, scheduling, reporting and document work: we decide what a model can handle reliably and what stays with a person."),
        ("Build it in your tools", "Systems are built on the software you already run, so you are not moved onto a new platform."),
        ("Monitor it", "Logs, alerts and plain-English reporting are part of the build, so failures are loud instead of silent."),
        ("Keep a person in charge", "Anything that sends, spends or publishes has a human approval step on your side."),
    ]))
    does = sec("What a fractional AI lead does for a local business", f'<div class="svc-grid">{cards}</div>')
    case_cards = "".join(
        f'<div class="svc-card"><h3>{esc(t)}</h3><p>{esc(b)}</p><a href="{esc(href)}"{ext(href)}>{esc(lbl)} <span aria-hidden="true">↗</span></a></div>'
        for t, b, href, lbl in CASES)
    cases = sec("Case studies: systems I built and run", f'<p>These are my own businesses and products. They are the systems I would build for you, running today.</p><div class="svc-grid">{case_cards}</div>'
                '<p class="svc-note">Case studies describe past work; results vary and nothing here is a guarantee. See the <a href="/portfolio/">full portfolio</a>.</p>')
    forwho = sec("Who this is for", '<ul class="svc-list">' + "".join(f"<li>{esc(x)}</li>" for x in NOT_FOR) + "</ul>")
    steps = sec("How to work with me", '<ol class="svc-list">' + "".join(f"<li><strong>{esc(t)}.</strong> {esc(b)}</li>" for t, b in STEPS) + "</ol>"
                '<p>Ongoing engagements through CustomLab.ai start at $3,500 a month with a 90-day initial partnership. A project scoped directly with me is quoted in writing first. '
                'Every published price, with its source, is on the <a href="/ai-consulting-cost/">AI consulting cost page</a>.</p>'
                f'<p><a href="{CTA}" class="btn btn-accent">Work with me</a></p>')
    links = sec("Find Zach elsewhere", "<p>The same name, title and city appear on each of these profiles and ventures.</p>"
                '<ul class="svc-profile-links">' + "".join(f'<li><a href="{esc(h_)}"{ext(h_)} rel="me noopener">{esc(n)}</a></li>' for n, h_ in PROFILE_LINKS) + "</ul>")
    faq_html = sec("Frequently asked questions", '<div class="faq-block">' + "".join(
        f'<div class="faq-item"><h3>{esc(q)}</h3><p>{esc(a)}</p></div>' for q, a in FAQ) + "</div>")
    cross = "".join(f'<a href="{esc(h_)}">{esc(t)}</a>' for h_, t in [
        ("/ai-consulting-west-palm-beach/", "AI consulting in West Palm Beach"), ("/ai-consultant-palm-beach-county/", "AI consultant, Palm Beach County"),
        ("/ai-consulting-cost/", "What AI consulting costs"), ("/ai-operating-layer/", "Ongoing engagements"), ("/about/", "About Zachary")])
    close = (f'<section class="svc-close"><div class="container"><h2>Bring one workflow you\'d like to stop doing by hand</h2>'
             f'<p>Tell me the task and how it runs today. If there is a real system in it, I will scope it and tell you what it should save.</p>'
             f'<a href="{CTA}" class="btn btn-accent">Work with me</a><p class="svc-response">I reply within one business day.</p><div class="svc-crosslinks">{cross}</div></div></section>')
    main = '<main id="main" tabindex="-1">' + hero + who + does + cases + forwho + steps + links + faq_html + close + "</main>"
    h = re.sub(r"<main\b[^>]*>.*?</main>", lambda m: main, h, count=1, flags=re.S)

    text = re.sub(r"<[^>]+>", " ", main)
    banned = re.compile(r"guarantee(?!d?[,.;])|#1|number one|best in|ZimVie|Cornerstone|commission|open to (roles|work)|available full|full-time (role|position)|looking for (a )?(role|job|work)|ChatGPT|Claude|Gemini|OpenAI|Anthropic", re.I)
    bad = [m.group(0) for m in banned.finditer(text)]
    assert not bad, bad
    assert len(TITLE) <= 65, len(TITLE)
    assert 110 <= len(DESC) <= 165, len(DESC)
    d = ROOT / SLUG; d.mkdir(exist_ok=True)
    (d / "index.html").write_text(h, encoding="utf-8")
    print(f"wrote /{SLUG}/ ({len(h)} bytes, title {len(TITLE)}c, desc {len(DESC)}c)")

if __name__ == "__main__":
    build()

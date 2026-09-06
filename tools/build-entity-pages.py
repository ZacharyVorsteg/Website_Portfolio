#!/usr/bin/env python3
"""Entity + query-page builder for zacharyvorsteg.com (draft, 2026-09-06).

Goal (Zach): be what gets indexed when someone in Palm Beach County looks for AI help.
Strategy: one canonical Person entity (homepage JSON-LD, @id-linked to every venture) plus four
buyer-query pages, each cloned from the proven /ai-automation template so design and nav stay native.

Every claim below is one already published on the site or verifiable from a shipped system.
No "#1", no guarantees, no invented counts (see feedback_canonical_bio_no_inflated_counts).
"""
import json, re, pathlib, html

ROOT = pathlib.Path(__file__).resolve().parent.parent
TEMPLATE = (ROOT / "ai-automation" / "index.html").read_text(encoding="utf-8")
DOMAIN = "https://zacharyvorsteg.com"
PERSON_ID = DOMAIN + "/#person"

# ----------------------------------------------------------------------------- entity schema
PERSON = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    "name": "Zachary Vorsteg",
    "alternateName": ["Zach Vorsteg"],
    "url": DOMAIN,
    "mainEntityOfPage": DOMAIN,
    "image": DOMAIN + "/images/zach-headshot.jpg",
    "telephone": "+15617186725",
    "email": "mailto:zacharyvorsteg@gmail.com",
    "jobTitle": "AI Systems Architect & Automation Engineer",
    "description": ("AI systems architect and automation engineer based in West Palm Beach, Florida. Designs and ships "
                    "agentic AI systems, LLM integrations, and custom software that remove manual work for small and "
                    "mid-sized businesses across Palm Beach County and nationwide. Founder of CustomLab.ai, with 5+ shipped "
                    "products across AI SaaS, CRM, and ad management (Trusenda, Ads Handled, and more). Also an M&A/FP&A "
                    "financial analyst and a Florida-licensed commercial real estate sales associate (SL3603483, Cornerstone "
                    "Realty). FAU Finance '20."),
    "hasOccupation": [
        {"@type": "Occupation", "name": "AI Systems Architect",
         "occupationLocation": {"@type": "AdministrativeArea", "name": "Palm Beach County, Florida"},
         "skills": "Agentic AI systems, LLM integration, workflow automation, systems verification and monitoring"},
        {"@type": "Occupation", "name": "Automation Engineer",
         "occupationLocation": {"@type": "AdministrativeArea", "name": "Palm Beach County, Florida"}}
    ],
    "areaServed": [
        {"@type": "AdministrativeArea", "name": "Palm Beach County",
         "containedInPlace": {"@type": "State", "name": "Florida"}},
        {"@type": "City", "name": "West Palm Beach"}, {"@type": "City", "name": "Boca Raton"},
        {"@type": "City", "name": "Jupiter"}, {"@type": "City", "name": "Delray Beach"},
        {"@type": "City", "name": "Wellington"}, {"@type": "Country", "name": "United States"}
    ],
    "address": {"@type": "PostalAddress", "addressLocality": "West Palm Beach", "addressRegion": "FL", "addressCountry": "US"},
    "alumniOf": {"@type": "CollegeOrUniversity", "name": "Florida Atlantic University", "department": "Finance", "url": "https://www.fau.edu"},
    "hasCredential": {"@type": "EducationalOccupationalCredential", "credentialCategory": "license",
                      "name": "Florida Real Estate Sales Associate License",
                      "recognizedBy": {"@type": "GovernmentOrganization", "name": "Florida Department of Business and Professional Regulation"}},
    "founder": [  # inverse link: the Organization blocks on the homepage carry "founder": {"@id": PERSON_ID}
        {"@type": "Organization", "@id": "https://customlab.ai/#organization", "name": "CustomLab.ai", "url": "https://customlab.ai"},
        {"@type": "Organization", "@id": "https://adshandled.com/#organization", "name": "Ads Handled", "url": "https://adshandled.com"},
        {"@type": "Organization", "@id": "https://trusenda.com/#organization", "name": "Trusenda", "url": "https://trusenda.com"},
        {"@type": "Organization", "@id": "https://palmbeachwebsites.com/#organization", "name": "Palm Beach Websites", "url": "https://palmbeachwebsites.com"}
    ],
    "knowsAbout": [
        "AI Consulting for Small and Mid-Sized Businesses", "Agentic AI Engineering", "AI Systems Architecture",
        "AI Agents", "Large Language Model Applications", "LLM Integration", "Retrieval-Augmented Generation (RAG)",
        "Workflow Automation", "Business Process Automation", "AI Automation for Home-Service Contractors",
        "AI Receptionists and Call Handling", "Lead Routing and CRM Automation", "Autonomous Content Systems",
        "AI System Verification and Monitoring", "Full-Stack Web Development", "React and Next.js", "Node.js",
        "Python", "Supabase and PostgreSQL", "iOS Application Development", "SwiftUI", "Technical SEO",
        "Mergers and Acquisitions Modeling", "Financial Planning and Analysis (FP&A)", "Commercial Real Estate",
        "Industrial Real Estate Leasing and Sales", "Facebook Ads Management", "Google Ads Management"
    ],
    "subjectOf": [
        {"@type": "WebPage", "@id": DOMAIN + "/ai-consultant-palm-beach-county/"},
        {"@type": "WebPage", "@id": DOMAIN + "/ai-automation-palm-beach-county/"},
        {"@type": "WebPage", "@id": DOMAIN + "/agentic-ai-engineer-west-palm-beach/"},
        {"@type": "WebPage", "@id": DOMAIN + "/ai-systems-architect-florida/"}
    ],
    "sameAs": [
        "https://www.linkedin.com/in/zacharyvorsteg", "https://github.com/ZacharyVorsteg", "https://x.com/zachvorsteg",
        "https://customlab.ai", "https://trusenda.com", "https://adshandled.com", "https://callshandled.ai",
        "https://palmbeachwebsites.com", "https://palmbeachwarehouses.com", "https://palmbeachhomesrealty.com",
        "https://palmbeachquotes.com", "https://vorstegsoftware.com"
    ]
}

# ----------------------------------------------------------------------------- the four query pages
PROOF = [  # shipped, verifiable systems — stated as what they are
    ("Trusenda", "a CRM I designed, built and shipped to the App Store, with its own billing, push notifications and lead pipeline."),
    ("Ads Handled and CallsHandled", "done-for-you ad management and an AI receptionist for home-service contractors, running on infrastructure I built: lead routing, call handling, missed-call text-back and a consolidated owner inbox."),
    ("An autonomous content system", "that researches, writes, quality-gates, publishes and verifies articles across fifteen websites on a schedule — and checks its own work against a written standard every day."),
    ("CustomLab.ai", "AI operations automation for service businesses: intake, follow-up and reporting built around the tools a business already runs."),
]

CITIES = "West Palm Beach, Boca Raton, Jupiter, Delray Beach, Wellington, Palm Beach Gardens and the rest of Palm Beach County"

PAGES = [
 dict(
  slug="ai-consultant-palm-beach-county",
  eyebrow="AI Consultant · Palm Beach County",
  title="AI Consultant in Palm Beach County | Zachary Vorsteg",
  description="Zachary Vorsteg is an AI consultant and systems architect in West Palm Beach who builds and ships working AI systems for Palm Beach County businesses.",
  h1="An AI consultant in Palm Beach County who builds the system, not just the slide deck",
  lede=("I'm Zachary Vorsteg, an AI systems architect and automation engineer based in West Palm Beach. Businesses across "
        f"{CITIES} bring me the work their people do by hand, and I design, build and run the AI system that takes it over — "
        "then keep it monitored so it stays working."),
  cta2=("https://customlab.ai", "See CustomLab.ai"),
  sections=[
   ("What an AI consultant should actually do for a Palm Beach County business",
    ["Most \"AI consulting\" ends at a roadmap. The useful version ends at a system that is live, measured and maintained. "
     "The questions that matter are narrow: where does your team lose hours every week, which of that can a model handle "
     "reliably, what has to stay with a person, and how will you know it is still working next month?",
     "I answer those by building. A first automation is typically live in about two weeks, scoped around the tools you "
     "already use, with verification and alerts designed in from the start rather than bolted on after something breaks."]),
   ("Who this is for",
    ["Owner-operated and mid-sized businesses in Palm Beach County that are growing faster than their back office: "
     "contractors and home-service companies, professional services, property and real-estate operators, and "
     "founders running several ventures at once. If the pain is manual intake, follow-up, reporting, scheduling or "
     "document work, it is usually automatable."]),
  ],
  grid=("What I build for local businesses", [
   ("Lead intake and follow-up", "Capture, qualify and route every inquiry — web form, call, text or email — so nothing sits unanswered."),
   ("AI receptionist and call handling", "Answer, qualify and book calls after hours and during rush; text back missed calls automatically."),
   ("Agentic workflows", "Multi-step agents that read, decide and act across your CRM, email, calendar and billing."),
   ("Reporting and monitoring", "Daily numbers delivered in plain English, with alerts when something drifts."),
   ("Document and proposal generation", "Quotes, contracts and reports drafted from your data, reviewed before they go out."),
   ("Custom software when off-the-shelf won't fit", "Web apps, iOS apps and integrations built to your process."),
  ]),
  why_title="Why work with me rather than an agency",
  why=[
   "You work directly with the person who designs and builds the system — no account-manager layer.",
   "Every project is scoped first. If I can't find at least 5 hours a week to save, I'll say so before we start.",
   "Systems are built on the tools you already run; you are not moved onto new software.",
   "Verification, monitoring and reliability are part of the build, not an add-on.",
   "I'm local. West Palm Beach based, available in person across Palm Beach County and remotely nationwide.",
  ],
  faq=[
   ("Are you an AI consultant or an AI engineer?", "Both, in the order that matters: I consult by building. The advice is grounded in systems I have designed, shipped and kept running, including my own products."),
   ("Which parts of Palm Beach County do you serve?", f"All of it — {CITIES}. Discovery calls are remote; I meet in person when it helps."),
   ("What does an engagement look like?", "A short discovery call, a written scope with the hours it should save, a first automation live in about two weeks, then monitoring and iteration. No long retainers to get started."),
   ("Do I need to be technical?", "No. You need to know where your team loses time. I handle the architecture, the build and the plain-English reporting."),
   ("What have you actually shipped?", "A CRM on the App Store (Trusenda), ad management and an AI receptionist for contractors (Ads Handled, CallsHandled), CustomLab.ai, and an autonomous content system that publishes and verifies articles across fifteen websites — 5+ shipped products in total."),
  ],
  close=("Start with the work your team does by hand", "Tell me the task you'd most like to never do again. If there's a real system in it, I'll scope it and tell you what it should save."),
  crosslinks=[("/ai-automation-palm-beach-county/", "AI automation for contractors"), ("/agentic-ai-engineer-west-palm-beach/", "Agentic AI engineering"), ("/ai-systems-architect-florida/", "AI systems architecture"), ("/ai-automation", "AI automation services")],
  service_name="AI Consulting", service_type="AI consulting and implementation",
 ),
 dict(
  slug="ai-automation-palm-beach-county",
  eyebrow="AI Automation · Contractors & Service Businesses",
  title="AI Automation for Palm Beach County Contractors | Zachary Vorsteg",
  description="AI automation for HVAC, plumbing, electrical, landscaping and other service businesses in Palm Beach County: lead intake, call handling, follow-up and reporting.",
  h1="AI automation for Palm Beach County contractors and service businesses",
  lede=("Missed calls, unanswered form fills, quotes that go out late, follow-up that never happens — that is where a "
        "service business in Palm Beach County loses jobs. I build the AI systems that handle it: answering, qualifying, "
        "booking, following up and reporting, built around the tools you already use."),
  cta2=("https://callshandled.ai", "See CallsHandled"),
  sections=[
   ("Where service businesses leak revenue",
    ["The phone rings while the crew is on a roof. A lead fills out the form at 9pm. A quote sits unsent because the "
     "office is buried. None of this is a marketing problem — it is a response problem, and it is exactly what "
     "automation is good at.",
     "The systems I build for contractors answer and qualify calls, text back missed ones within seconds, route every "
     "inquiry into the CRM with the right owner and a follow-up cadence, and put the day's numbers in front of the owner "
     "in plain English."]),
   ("Built for the trades, in Palm Beach County",
    [f"HVAC, plumbing, electrical, roofing, landscaping, pool service, pest control and cleaning companies across {CITIES}. "
     "Local means I understand seasonality here — the summer AC rush, storm season, the winter population swing — and "
     "build the response system for it."]),
  ],
  grid=("What gets automated", [
   ("Missed-call text-back", "A caller who hangs up gets a text within seconds, while they are still deciding who to hire."),
   ("AI receptionist", "Calls answered, qualified and booked around the clock, with urgent jobs transferred to a person."),
   ("Lead routing and follow-up", "Every inquiry lands in the CRM with an owner and a cadence; nothing goes stale."),
   ("Quote and estimate follow-up", "Automatic, polite nudges on open quotes so the work closes."),
   ("Review and reputation flow", "Post-job review requests at the right moment, routed to the right platform."),
   ("Owner's daily report", "Calls, leads, bookings and spend in one plain-English message each morning."),
  ]),
  why_title="Why contractors hire me",
  why=[
   "I run these systems for my own ad-management and receptionist businesses, so I know what breaks in the field.",
   "Scoped first, then built; first automation live in about two weeks.",
   "No new software to learn — it plugs into the phone system, CRM and calendar you already have.",
   "Monitoring is built in: if a channel goes quiet, the owner hears about it before customers do.",
   "Plain-English reporting; you judge it by whether the phone rings and jobs close.",
  ],
  faq=[
   ("Does this replace my office staff?", "No. It handles the after-hours, overflow and repetitive follow-up so your people spend their time on customers and scheduling. Urgent calls still reach a person."),
   ("Which trades do you work with?", "HVAC, plumbing, electrical, roofing, landscaping, pool service, pest control, cleaning and similar home-service businesses in Palm Beach County."),
   ("How fast can missed-call text-back go live?", "Usually within the first two weeks of an engagement; it is typically the first thing we turn on because it pays for itself fastest."),
   ("Will it work with my existing phone system and CRM?", "Yes in most cases. I build around what you have — Twilio-based lines, Google Voice, common trade CRMs and calendars — rather than replacing them."),
   ("How do I know it's working?", "You get a daily plain-English report and alerts when something drifts. Every automated action is logged so it can be audited."),
  ],
  close=("Stop losing the jobs that call at 9pm", "Tell me how calls and leads reach you today. I'll show you exactly where they fall through and what the system to catch them looks like."),
  crosslinks=[("/ai-consultant-palm-beach-county/", "AI consultant"), ("https://callshandled.ai", "CallsHandled"), ("https://adshandled.com", "Ads Handled"), ("/ai-automation", "AI automation services")],
  service_name="AI Automation for Service Businesses", service_type="AI automation implementation",
 ),
 dict(
  slug="agentic-ai-engineer-west-palm-beach",
  eyebrow="Agentic AI Engineering",
  title="Agentic AI Engineer in West Palm Beach | Zachary Vorsteg",
  description="Zachary Vorsteg is an agentic AI engineer in West Palm Beach who designs, builds and operates multi-agent systems that run real business operations.",
  h1="An agentic AI engineer in West Palm Beach who runs agents in production, not demos",
  lede=("Agentic AI is easy to demo and hard to operate. I design multi-agent systems that do real work — research, "
        "writing, outreach, monitoring, publishing — inside guardrails: typed tools, approval boundaries, ledgers, and "
        "checks that prove an outcome happened rather than that a job ran."),
  cta2=("/blog/", "Read the engineering notes"),
  sections=[
   ("What agentic engineering means in practice",
    ["An agent is a model with tools and a loop. Making one useful means deciding what it may touch, what it must ask "
     "before doing, how its actions are recorded, and how you find out when it is wrong. Most of the engineering is in "
     "those boundaries, not in the prompt.",
     "The systems I run use typed, permission-scoped tools instead of open shells, keep an action ledger for every "
     "outbound step, gate anything customer-facing behind deterministic quality checks, and maintain a registry of "
     "assertions — one per past failure — that runs every day so nothing regresses silently."]),
   ("Production examples",
    ["A fleet of operator agents that manufactures demand for several businesses: research, outreach drafting, "
     "call handling, follow-up and reporting, each within caps and a ledger. An autonomous content system that "
     "researches, writes, gates, publishes and verifies articles across fifteen websites and audits its own output "
     "against a written standard daily. A consolidated owner inbox built so no inbound is missed."]),
  ],
  grid=("What I engineer", [
   ("Multi-agent orchestration", "Operators with scoped tools, schedules, caps and receipts — coordinated, not chaotic."),
   ("Tool and permission design", "Typed tools, allow-lists and approval boundaries instead of an open terminal."),
   ("Verification layers", "Deterministic gates, live checks and a never-twice assertion registry."),
   ("LLM integration", "Retrieval, structured outputs, provider fallbacks and cost control across models."),
   ("Observability", "Ledgers, health checks and plain-English alerts so humans stay in the loop without being in the way."),
   ("Reliability engineering", "Timeouts, idempotency, dedupe and rollback — the boring parts that keep agents trustworthy."),
  ]),
  why_title="How I work",
  why=[
   "Outcomes over activity: every automated step must produce a receipt that can be checked.",
   "Fail closed. When a check cannot run, the system stops, it does not guess.",
   "Small typed changes, tested, reviewed adversarially before they ship.",
   "Every incident becomes an assertion that runs daily — the same mistake is not made twice.",
   "Based in West Palm Beach, working with companies across Florida and nationwide.",
  ],
  faq=[
   ("What is an agentic AI system?", "Software where a language model plans and executes multi-step work using tools — reading data, calling APIs, writing, sending — inside boundaries an engineer defines. The engineering is mostly in those boundaries."),
   ("Which models and frameworks do you use?", "Whatever fits the job: frontier models from several providers with fallbacks, typed tool interfaces, and orchestration I build rather than a single vendor's framework. The design is provider-agnostic."),
   ("How do you keep agents from doing something harmful?", "Scoped permissions, approval gates for anything external or irreversible, action ledgers, caps, and daily assertions that catch regressions. Customer-facing outputs pass deterministic quality gates before they ship."),
   ("Do you work with companies outside Palm Beach?", "Yes. I'm based in West Palm Beach and work remotely with teams across Florida and the United States."),
   ("Can you take over an existing AI project?", "Often. The first step is an audit of what the current system actually does versus what its reports claim — that gap is usually where the risk is."),
  ],
  close=("Bring me the agent that almost works", "If you have an AI workflow that demos well and fails in production, that is the exact problem I solve."),
  crosslinks=[("/ai-systems-architect-florida/", "AI systems architecture"), ("/ai-consultant-palm-beach-county/", "AI consultant"), ("/blog/agentic-engineering-patterns/", "Agentic engineering patterns"), ("/custom-software", "Custom software")],
  service_name="Agentic AI Engineering", service_type="AI agent design and operation",
 ),
 dict(
  slug="ai-systems-architect-florida",
  eyebrow="AI Systems Architecture · Florida",
  title="AI Systems Architect in Florida | Zachary Vorsteg",
  description="Zachary Vorsteg, AI systems architect in West Palm Beach, Florida: architecture, build and operation of reliable AI systems for businesses statewide.",
  h1="An AI systems architect in Florida who owns the outcome, not just the design",
  lede=("Architecture is where AI projects succeed or quietly fail. I design the whole system — data, models, tools, "
        "permissions, monitoring and the humans in the loop — then build and run it, for businesses in Palm Beach County "
        "and across Florida."),
  cta2=("/#contact", "Book a discovery call"),
  sections=[
   ("What an AI systems architect does",
    ["Decides what the model is allowed to do and what it is not. Chooses where deterministic code beats a prompt. "
     "Designs the data flow, the tool interfaces, the approval boundaries, and the checks that prove the system is "
     "still working. Then makes sure the whole thing can be operated by the people who own it.",
     "I do this as a founder who runs his own AI-driven businesses, so the designs are shaped by what survives contact "
     "with real customers, real phones and real money."]),
   ("Serving Florida from West Palm Beach",
    ["Palm Beach County in person; Miami, Fort Lauderdale, Orlando, Tampa, Jacksonville and the rest of Florida "
     "remotely, with on-site work when a project needs it. Also available to companies nationwide."]),
  ],
  grid=("Architecture work I take on", [
   ("Greenfield AI systems", "From the first whiteboard to a monitored system in production."),
   ("Rescue and hardening", "Audit an AI project that demos well and fails in use; redesign the boundaries; make it reliable."),
   ("Operations automation", "Intake, follow-up, scheduling, reporting and content systems for growing companies."),
   ("Data and integration design", "Postgres, Supabase, APIs and event flows that keep the model grounded in the truth."),
   ("Verification and monitoring", "Gates, ledgers, health checks and assertion registries so failures are loud."),
   ("Founder-level advisory", "Where AI belongs in the business, what to build, what to buy, what to skip."),
  ]),
  why_title="Why this approach",
  why=[
   "Systems engineering discipline — verification, monitoring and reliability — applied to AI, not just generation.",
   "Provider-agnostic design: frontier models with fallbacks, no lock-in to a single vendor.",
   "Built on the tools a business already runs; migration only when it earns its cost.",
   "Documented so your team can operate it; I don't build systems only I can run.",
   "Founder of CustomLab.ai; 5+ shipped products across AI SaaS, CRM and ad management.",
  ],
  faq=[
   ("What's the difference between an AI architect and an AI developer?", "A developer implements a feature. An architect decides the system: what the model may do, where code must be deterministic, how data flows, how failures surface. I do both, but the architecture is what determines whether the project holds up."),
   ("Do you build it yourself or hand off a design?", "I build it — alone or alongside your team — and stay on for operation. A design that nobody can run is not finished."),
   ("Which industries?", "Home services and contractors, professional services, real estate and property operators, and multi-venture founders. The patterns transfer; the tools are chosen per business."),
   ("How do you price architecture work?", "Scoped engagements with a written deliverable and the hours or revenue it should affect. Discovery calls are free; no retainer is required to start."),
   ("Where are you based?", "West Palm Beach, Florida. I serve Palm Beach County in person and the rest of Florida and the United States remotely."),
  ],
  close=("Design it once, run it for years", "If you're about to build — or rebuild — an AI system, a short architecture conversation now saves a rewrite later."),
  crosslinks=[("/agentic-ai-engineer-west-palm-beach/", "Agentic AI engineering"), ("/ai-consultant-palm-beach-county/", "AI consultant"), ("/ai-automation", "AI automation services"), ("/custom-software", "Custom software")],
  service_name="AI Systems Architecture", service_type="AI systems architecture and implementation",
 ),
]

BANNED = re.compile(r"guarantee|#1|number one|best in|ZimVie|\b\d{2,}\+? (clients|companies|businesses)\b", re.I)

def esc(s): return html.escape(s, quote=True)

def ld(obj): return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False) + '</script>'

def page_html(p):
    url = f"{DOMAIN}/{p['slug']}/"
    h = TEMPLATE
    # ---- head
    h = re.sub(r"<title>.*?</title>", f"<title>{esc(p['title'])}</title>", h, count=1, flags=re.S)
    h = re.sub(r'(<meta name="description" content=")[^"]*(")', lambda m: m.group(1) + esc(p['description']) + m.group(2), h, count=1)
    h = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), h, count=1)
    h = re.sub(r'(<meta property="og:title" content=")[^"]*(")', lambda m: m.group(1) + esc(p['title']) + m.group(2), h, count=1)
    h = re.sub(r'(<meta property="og:description" content=")[^"]*(")', lambda m: m.group(1) + esc(p['description']) + m.group(2), h, count=1)
    h = re.sub(r'(<meta property="og:url" content=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), h, count=1)
    h = re.sub(r'(<meta name="twitter:title" content=")[^"]*(")', lambda m: m.group(1) + esc(p['title']) + m.group(2), h, count=1)
    h = re.sub(r'(<meta name="twitter:description" content=")[^"]*(")', lambda m: m.group(1) + esc(p['description']) + m.group(2), h, count=1)
    # ---- structured data: replace every ld+json block with this page's set
    schema = [
        {"@context": "https://schema.org", "@type": "Service", "name": p["service_name"], "serviceType": p["service_type"],
         "provider": {"@id": PERSON_ID}, "areaServed": PERSON["areaServed"], "url": url, "description": p["description"]},
        {"@context": "https://schema.org", "@type": "WebPage", "@id": url, "url": url, "name": p["title"],
         "description": p["description"], "about": {"@id": PERSON_ID}, "isPartOf": {"@type": "WebSite", "url": DOMAIN, "name": "Zachary Vorsteg"}},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN + "/"},
            {"@type": "ListItem", "position": 2, "name": p["service_name"], "item": url}]},
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in p["faq"]]},
    ]
    h = re.sub(r'<script type="application/ld\+json">.*?</script>\s*', "", h, flags=re.S)
    h = h.replace("</head>", "\n".join(ld(s) for s in schema) + "\n</head>", 1)
    # ---- main
    sections = "".join(
        f'<section class="svc-section"><div class="container"><h2>{esc(t)}</h2>' + "".join(f"<p>{esc(x)}</p>" for x in paras) + "</div></section>"
        for t, paras in p["sections"])
    grid_title, cards = p["grid"]
    grid = (f'<section class="svc-section"><div class="container"><h2>{esc(grid_title)}</h2><div class="svc-grid">' +
            "".join(f'<div class="svc-card"><h3>{esc(a)}</h3><p>{esc(b)}</p></div>' for a, b in cards) + "</div></div></section>")
    why = (f'<section class="svc-section"><div class="container"><h2>{esc(p["why_title"])}</h2><ul class="svc-list">' +
           "".join(f"<li>{esc(x)}</li>" for x in p["why"]) + "</ul></div></section>")
    faq = ('<section class="svc-section"><div class="container"><h2>Frequently asked questions</h2><div class="faq-block">' +
           "".join(f'<div class="faq-item"><h3>{esc(q)}</h3><p>{esc(a)}</p></div>' for q, a in p["faq"]) + "</div></div></section>")
    c_title, c_text = p["close"]
    cross = "".join(f'<a href="{esc(href)}"{" target=\"_blank\" rel=\"noopener\"" if href.startswith("http") else ""}>{esc(t)}</a>' for href, t in p["crosslinks"])
    close = (f'<section class="svc-close"><div class="container"><h2>{esc(c_title)}</h2><p>{esc(c_text)}</p>'
             f'<a href="/#contact" class="btn btn-accent">Start a project</a><div class="svc-crosslinks">{cross}</div></div></section>')
    c2h, c2t = p["cta2"]
    hero = (f'<section class="svc-hero"><div class="container"><div class="svc-hero-content"><div class="hero-eyebrow">{esc(p["eyebrow"])}</div>'
            f'<h1>{esc(p["h1"])}</h1><p>{esc(p["lede"])}</p><div class="svc-cta-row"><a href="/#contact" class="btn btn-accent">Start a project</a>'
            f'<a href="{esc(c2h)}"{" target=\"_blank\" rel=\"noopener\"" if c2h.startswith("http") else ""} class="btn btn-secondary">{esc(c2t)}</a></div></div></div></section>')
    main = "<main>" + hero + sections[:len(sections)] + grid + why + faq + close + "</main>"
    # keep the first section, insert grid after it: build order hero, s1, grid, s2, why, faq, close
    s_html = [f'<section class="svc-section"><div class="container"><h2>{esc(t)}</h2>' + "".join(f"<p>{esc(x)}</p>" for x in paras) + "</div></section>" for t, paras in p["sections"]]
    main = "<main>" + hero + s_html[0] + grid + "".join(s_html[1:]) + why + faq + close + "</main>"
    h = re.sub(r"<main>.*?</main>", lambda m: main, h, count=1, flags=re.S)
    # ---- nav highlight: mark AI Automation link as current section
    return h

def main():
    written = []
    for p in PAGES:
        out = page_html(p)
        text = re.sub(r"<[^>]+>", " ", out)
        bad = [m.group(0) for m in BANNED.finditer(text)]
        assert not bad, f"{p['slug']}: banned phrase {bad}"
        assert len(p["title"]) <= 65, f"{p['slug']}: title {len(p['title'])} chars"
        assert 110 <= len(p["description"]) <= 165, f"{p['slug']}: description {len(p['description'])} chars"
        d = ROOT / p["slug"]; d.mkdir(exist_ok=True)
        (d / "index.html").write_text(out, encoding="utf-8")
        written.append(f"/{p['slug']}/ ({len(out)} bytes, title {len(p['title'])}c, desc {len(p['description'])}c)")
    # ---- homepage Person entity: replace the existing Person block in place
    idx = ROOT / "index.html"
    h = idx.read_text(encoding="utf-8")
    blocks = list(re.finditer(r'<script type="application/ld\+json">(.*?)</script>', h, re.S))
    def is_person(b):
        try: return json.loads(b.group(1)).get("@type") == "Person"   # top-level only (Organization blocks embed a founder Person)
        except Exception: return False
    person = [b for b in blocks if is_person(b)]
    assert len(person) == 1, "expected exactly one Person block on the homepage"
    h = h[:person[0].start()] + ld(PERSON) + h[person[0].end():]
    # link the Organization blocks back to the person by @id (inverse founder link)
    h = re.sub(r'("founder":\s*\{)\s*"@type":\s*"Person",\s*"name":\s*"Zachary Vorsteg"', r'\1"@id": "' + PERSON_ID + '", "@type": "Person", "name": "Zachary Vorsteg"', h)
    idx.write_text(h, encoding="utf-8")
    (ROOT / "entity" ).mkdir(exist_ok=True)
    (ROOT / "entity" / "person.jsonld").write_text(json.dumps(PERSON, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("\n".join("  wrote " + w for w in written))
    print("  homepage Person schema replaced; entity/person.jsonld written; founder back-links:", len(re.findall(PERSON_ID + '", "@type": "Person"', h)))

if __name__ == "__main__":
    main()

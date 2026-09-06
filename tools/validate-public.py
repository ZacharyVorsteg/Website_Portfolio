from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, re, sys, xml.etree.ElementTree as ET

ROOT=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path(__file__).resolve().parents[1]/'public'
if not (ROOT/'index.html').is_file(): raise SystemExit('Build and stage public/ before validation.')
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.links=[];self.assets=[];self.ids=set();self.canonical=[];self.h1=0
    def handle_starttag(self,t,a):
        a=dict(a)
        if 'id' in a:self.ids.add(a['id'])
        if t=='h1':self.h1+=1
        if t=='a' and 'href' in a:self.links.append(a['href'])
        if t in ['img','script','video','source','track']:
            self.assets += [a[x] for x in ['src','poster','data-src'] if x in a]
        if t=='link' and a.get('rel')=='stylesheet':self.assets.append(a.get('href',''))
        if t=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href',''))

# JSON that parses can still contradict the page a visitor reads. Keep these
# independently maintained service FAQs aligned across visible copy and schema.
FAQ_CORE_PAGES = {
    'ai-automation/index.html', 'custom-software/index.html',
    'finance/index.html', 'commercial-real-estate/index.html',
}

class FAQText(HTMLParser):
    """Collect decoded text from visible .faq-item headings and paragraphs."""
    VOID_TAGS = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
                 'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.items = []
        self.item_depth = None
        self.capture = None
        self.parts = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in self.VOID_TAGS:
            if self.capture:
                self.parts[self.capture[0]].append(' ')
            return
        self.stack.append(tag)
        if 'faq-item' in attrs.get('class', '').split():
            self.item_depth = len(self.stack)
            self.parts = {'question': [], 'answer': []}
        elif self.item_depth is not None and tag in ('h3', 'p'):
            self.capture = ('question' if tag == 'h3' else 'answer', len(self.stack))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID_TAGS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag not in self.stack:
            return
        depth = len(self.stack) - self.stack[::-1].index(tag)
        if self.capture and depth <= self.capture[1]:
            self.parts[self.capture[0]].append(' ')
            self.capture = None
        if self.item_depth is not None and depth <= self.item_depth:
            self.items.append(tuple(' '.join(''.join(self.parts[key]).split())
                                    for key in ('question', 'answer')))
            self.item_depth = None
            self.parts = None
        del self.stack[depth - 1:]

    def handle_data(self, data):
        if self.capture:
            self.parts[self.capture[0]].append(data)

class PlainText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)

    def handle_starttag(self, tag, attrs):
        if tag in ('br', 'p', 'li'):
            self.parts.append(' ')

    def handle_endtag(self, tag):
        if tag in ('p', 'li'):
            self.parts.append(' ')

def normalized_text(value):
    parser = PlainText()
    parser.feed(value if isinstance(value, str) else '')
    return ' '.join(''.join(parser.parts).split())

def faq_alignment_errors(relative_path, source, schemas):
    if relative_path not in FAQ_CORE_PAGES:
        return []
    visible = FAQText()
    visible.feed(source)
    faq_schemas = []
    for schema in schemas:
        nodes = schema.get('@graph', [schema]) if isinstance(schema, dict) else []
        faq_schemas.extend(node for node in nodes if isinstance(node, dict)
                           and node.get('@type') == 'FAQPage')
    if not visible.items or len(faq_schemas) != 1:
        return [f'FAQ visible/schema mismatch: {relative_path} requires visible FAQs and one FAQPage schema']
    structured = []
    for question in faq_schemas[0].get('mainEntity', []):
        answer = question.get('acceptedAnswer', {}) if isinstance(question, dict) else {}
        structured.append((normalized_text(question.get('name', '')) if isinstance(question, dict) else '',
                           normalized_text(answer.get('text', '')) if isinstance(answer, dict) else ''))
    if visible.items != structured:
        return [f'FAQ visible/schema mismatch: {relative_path} (questions, order or answer text differ)']
    return []

pages={};failures=[]
for p in ROOT.rglob('*.html'):
    if any(x in p.parts for x in ['node_modules','logs','tests','tools','docs']) or p.name.startswith('_'):continue
    parser=Page();text=p.read_text();parser.feed(text);pages[p]=parser
    schemas=[]
    for raw in re.findall(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',text,re.S|re.I):
        try:schemas.append(json.loads(raw))
        except ValueError as e:failures.append(f'Invalid schema: {p.relative_to(ROOT)} {e}')
    failures.extend(faq_alignment_errors(p.relative_to(ROOT).as_posix(), text, schemas))

def destination(current,link):
    u=urlsplit(link)
    if u.scheme and u.netloc!='zacharyvorsteg.com':return None,u
    if not u.path:target=current
    else:target=(ROOT/u.path.lstrip('/')) if u.path.startswith('/') else current.parent/u.path
    if target.is_dir():target=target/'index.html'
    if not target.exists() and target.suffix=='':target=target/'index.html'
    return target,u

for p,page in pages.items():
    for link in page.links+page.assets:
        if link.startswith(('mailto:','tel:','data:','javascript:')):continue
        target,u=destination(p,link)
        if target is None:continue
        if not target.exists():
            # Known redirect, validated separately in Netlify config/live release.
            if u.path=='/apps.html':continue
            failures.append(f'Missing target {p.relative_to(ROOT)} -> {link}')
        elif u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:
            failures.append(f'Missing anchor {p.relative_to(ROOT)} -> {link}')

urls=[x.text for x in ET.parse(ROOT/'sitemap.xml').getroot().iter() if x.tag.endswith('}loc')]
if len(urls)!=len(set(urls)):failures.append('Duplicate sitemap URL')
for url in urls:
    target,u=destination(ROOT/'index.html',url)
    if not target or not target.exists():failures.append(f'Sitemap missing {url}')
    elif target in pages and (pages[target].h1!=1 or pages[target].canonical!=[url]):failures.append(f'Bad H1/canonical count {url}')

for forbidden in ['AGENTS.md','package.json','tools','tests','docs','.git','node_modules','images/production/ugc-sloane-ads.mp4','images/production/ugc-sloane-reveal.mp4','images/production/ugc-sloane-ads.jpg','images/production/ugc-sloane-reveal.jpg']:
    if (ROOT/forbidden).exists():failures.append(f'Internal/unreviewed source published: {forbidden}')

print(json.dumps({'html_pages':len(pages),'sitemap_urls':len(urls),'failures':failures},indent=2))
raise SystemExit(bool(failures))

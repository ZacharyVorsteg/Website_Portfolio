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

pages={};failures=[]
for p in ROOT.rglob('*.html'):
    if any(x in p.parts for x in ['node_modules','logs','tests','tools','docs']) or p.name.startswith('_'):continue
    parser=Page();text=p.read_text();parser.feed(text);pages[p]=parser
    for raw in re.findall(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',text,re.S|re.I):
        try:json.loads(raw)
        except ValueError as e:failures.append(f'Invalid schema: {p.relative_to(ROOT)} {e}')

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

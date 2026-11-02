from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

site = Path(__file__).resolve().parent

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.files = []
        self.projects = 0
        self.teasers = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f"Duplicate id: {attrs['id']}"
            self.ids.add(attrs['id'])
        if tag == 'a':
            self.links.append(attrs.get('href', ''))
            if attrs.get('target') == '_blank':
                assert 'noopener' in attrs.get('rel', '')
        if tag == 'script' and 'src' in attrs:
            self.files.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') in ('stylesheet', 'icon'):
            self.files.append(attrs['href'])
        classes = attrs.get('class', '').split()
        if tag == 'article' and ('project' in classes or 'system-card' in classes):
            self.projects += 1
        if tag == 'article' and 'teaser' in classes:
            self.teasers += 1

page = Page()
page.feed((site / 'index.html').read_text(encoding='utf-8-sig'))
assert page.projects == 5
assert page.teasers == 2
for link in page.links:
    assert link and link != '#'
    if link.startswith('#'):
        assert link[1:] in page.ids, f'Missing anchor: {link}'
    elif '://' not in link:
        target = site / urlsplit(link).path
        assert target.is_file(), f'Missing file: {link}'
        if urlsplit(link).fragment:
            linked_page = Page()
            linked_page.feed(target.read_text(encoding='utf-8'))
            assert urlsplit(link).fragment in linked_page.ids, f'Missing linked anchor: {link}'
for file in page.files:
    if '://' not in file:
        assert (site / file).is_file(), f'Missing asset: {file}'
assert (site / 'support.html').is_file()
assert (site / '.nojekyll').is_file()
print(f'PASS: {page.projects} projects, {page.teasers} teasers, {len(page.links)} links, unique IDs and all local homepage assets.')


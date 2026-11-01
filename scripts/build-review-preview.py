"""Build a standalone review copy after `npm run build`; never deploys."""
from pathlib import Path
import base64
import mimetypes
import re

root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
html = (dist / 'index.html').read_text()
html = re.sub(r'<script type="module"[^>]*src="([^"]+)"[^>]*></script>', lambda m: '<script type="module">' + (dist / m[1].lstrip('/')).read_text() + '</script>', html)
html = re.sub(r'<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>', lambda m: '<style>' + (dist / m[1].lstrip('/')).read_text() + '</style>', html)
for asset in (dist / 'assets').iterdir():
    if asset.suffix not in {'.png', '.webp', '.jpg', '.jpeg', '.svg'}:
        continue
    uri = 'data:' + mimetypes.guess_type(asset.name)[0] + ';base64,' + base64.b64encode(asset.read_bytes()).decode()
    html = html.replace('/assets/' + asset.name, uri)
html = html.replace('<head>', '<head>\n<meta name="robots" content="noindex,nofollow" />', 1)
html = re.sub(r'<link rel="canonical"[^>]*>', '', html)
assert not re.search(r'(?:src|href)="/assets/', html)
assert not re.search(r'url\([\x27\x22]?/assets/', html)
output = root.parent / 'WisdomAsia-redesign-preview.html'
output.write_text(html)
print(output)

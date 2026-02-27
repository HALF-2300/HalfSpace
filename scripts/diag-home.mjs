const baseUrl = process.env.URL || 'http://localhost:9200';

function extractHrefLinks(html) {
  const links = [];
  let i = 0;
  while (true) {
    const hrefIdx = html.indexOf('href="', i);
    if (hrefIdx === -1) break;
    const start = hrefIdx + 'href="'.length;
    const end = html.indexOf('"', start);
    if (end === -1) break;
    links.push(html.slice(start, end));
    i = end + 1;
  }
  return links;
}

async function main() {
  const res = await fetch(baseUrl);
  console.log('GET /', res.status, res.headers.get('content-type'));
  const html = await res.text();

  const hrefs = extractHrefLinks(html);
  const css = hrefs.filter((h) => h.includes('.css'));
  const js = hrefs.filter((h) => h.includes('.js'));

  console.log('css_links', css.slice(0, 10));
  console.log('js_links', js.slice(0, 10));

  if (!css.length) {
    console.log('No .css links found in HTML. This typically means CSS failed to compile/load.');
    return;
  }

  const cssUrl = new URL(css[0], baseUrl).toString();
  const cssRes = await fetch(cssUrl);
  console.log('GET first css', cssRes.status, cssRes.headers.get('content-type'), cssUrl);
  const cssText = await cssRes.text();
  console.log('css_snip', cssText.slice(0, 200).replace(/\s+/g, ' ').trim());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


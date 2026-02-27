// app/all-pages/page.tsx
import Link from 'next/link';
import { siteMap } from '@/data/sitemap';

function groupByCategory(items: typeof siteMap) {
  return items.reduce<Record<string, typeof siteMap>>((acc, item) => {
    const key = item.category || 'Other';
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
}

export default function AllPagesPage() {
  const lang = 'en';
  const dir = 'ltr';

  const grouped = groupByCategory(siteMap);

  const categories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  return (
    <main
      dir={dir}
      style={{
        minHeight: '100vh',
        padding: '28px 18px',
        position: 'relative',
        zIndex: 1,
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: 0.2 }}>
            All Pages
          </h1>
          <p style={{ opacity: 0.8, marginTop: 6 }}>
            A complete list of the site pages, grouped by category.
          </p>
        </div>
      </header>

      <section style={{ marginTop: 22, display: 'grid', gap: 18 }}>
        {categories.map((cat) => {
          const items = grouped[cat].slice().sort((a, b) => {
            const ta = a.title_en || a.slug;
            const tb = b.title_en || b.slug;
            return ta.localeCompare(tb);
          });

          return (
            <div
              key={cat}
              style={{
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 16,
                padding: 16,
                background: 'rgba(0,0,0,0.18)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
                {cat}
                <span style={{ opacity: 0.7, fontWeight: 500, marginInlineStart: 8 }}>({items.length})</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {items.map((p) => {
                  const title = p.title_en || p.slug;
                  const label = p.navLabel || title;

                  return (
                    <Link
                      key={p.slug}
                      href={p.href}
                      style={{
                        borderRadius: 14,
                        padding: 14,
                        textDecoration: 'none',
                        border: '1px solid rgba(255,255,255,0.14)',
                        background: 'rgba(255,255,255,0.04)',
                        display: 'block',
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>
                        {label}
                      </div>
                      <div style={{ opacity: 0.75, fontSize: 13 }}>{title}</div>
                      <div style={{ opacity: 0.6, fontSize: 12, marginTop: 8 }}>{p.slug}</div>
                      {p.featured ? (
                        <div
                          style={{
                            display: 'inline-block',
                            marginTop: 10,
                            padding: '4px 8px',
                            borderRadius: 999,
                            border: '1px solid rgba(160,210,255,0.28)',
                            opacity: 0.9,
                            fontSize: 12,
                          }}
                        >
                          Featured
                        </div>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}

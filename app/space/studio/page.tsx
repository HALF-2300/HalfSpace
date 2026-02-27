'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { marked } from 'marked'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import styles from './studio.module.css'

type Article = {
  id: string
  title: string
  category: string
  tags: string[]
  excerpt: string
  body: string
  updatedAt: string
}

const STORAGE_KEY = 'space-studio-articles'
const PIN_KEY = 'space-studio-pin'
const DEFAULT_ARTICLE: Article = {
  id: '',
  title: '',
  category: '',
  tags: [],
  excerpt: '',
  body: '',
  updatedAt: '',
}

marked.setOptions({
  gfm: true,
  breaks: true,
})

export default function SpaceStudioPage() {
  const envPin = process.env.NEXT_PUBLIC_STUDIO_PIN ?? ''
  const [authorized, setAuthorized] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')

  const [articles, setArticles] = useState<Article[]>([])
  const [draft, setDraft] = useState<Article>(DEFAULT_ARTICLE)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const storedPin = window.localStorage.getItem(PIN_KEY) ?? ''
    if (envPin) {
      if (storedPin === envPin) {
        setAuthorized(true)
      }
    } else {
      // No env pin: allow straight entry, persist soft token to remember choice
      if (!storedPin) {
        window.localStorage.setItem(PIN_KEY, 'granted')
      }
      setAuthorized(true)
    }
  }, [envPin])

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Article[]
        setArticles(parsed)
      } catch {
        setArticles([])
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  }, [articles])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const openId = params.get('open')
    if (!openId) return
    const target = articles.find((a) => a.id === openId)
    if (target) {
      hydrateDraft(target)
    }
  }, [articles])

  const filteredArticles = useMemo(() => {
    if (!search) return articles
    const s = search.toLowerCase()
    return articles.filter((a) => `${a.title} ${a.category} ${a.tags.join(' ')} ${a.excerpt}`.toLowerCase().includes(s))
  }, [articles, search])

  const previewHtml = useMemo(() => {
    if (!draft.body?.trim()) return '<p>ابدأ بالكتابة لعرض المعاينة.</p>'
    return marked.parse(draft.body)
  }, [draft.body])

  const handleUnlock = () => {
    if (envPin) {
      if (pinInput === envPin) {
        window.localStorage.setItem(PIN_KEY, envPin)
        setAuthorized(true)
        setPinError('')
      } else {
        setPinError('الرمز غير صحيح.')
      }
    } else {
      // Local PIN optional; store if provided
      if (pinInput) {
        window.localStorage.setItem(PIN_KEY, pinInput)
      } else {
        window.localStorage.setItem(PIN_KEY, 'granted')
      }
      setAuthorized(true)
      setPinError('')
    }
  }

  const resetDraft = () => {
    setSelectedId(null)
    setDraft({ ...DEFAULT_ARTICLE, id: crypto.randomUUID(), updatedAt: new Date().toISOString() })
  }

  useEffect(() => {
    // Create a fresh draft on mount
    resetDraft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveDraft = () => {
    if (!draft.title.trim()) return
    const now = new Date().toISOString()
    const next: Article = {
      ...draft,
      id: draft.id || crypto.randomUUID(),
      updatedAt: now,
      tags: draft.tags.map((t) => t.trim()).filter(Boolean),
    }

    setArticles((prev) => {
      const exists = prev.find((a) => a.id === next.id)
      if (exists) {
        return prev.map((a) => (a.id === next.id ? next : a))
      }
      return [next, ...prev]
    })
    setSelectedId(next.id)
    setDraft(next)
  }

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id))
    if (selectedId === id) {
      resetDraft()
    }
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(articles, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'space-studio-bundle.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result)) as Article[]
        if (Array.isArray(parsed)) {
          setArticles(parsed)
        }
      } catch {
        // ignore bad bundle
      }
    }
    reader.readAsText(file)
  }

  const hydrateDraft = (article: Article) => {
    setSelectedId(article.id)
    setDraft(article)
  }

  if (!authorized) {
    return (
      <div className={styles.page}>
        <CanvasStarfield intensity="medium" />
        <div className={styles.bgGlow} />
        <div className={styles.auth}>
          <div className={styles.badge}>
            <span aria-hidden>🛰️</span> Space Studio Lock
          </div>
          <h1 className={styles.title}>أدخل رمز الاستديو</h1>
          <p className={styles.subhead}>
            {envPin
              ? 'هذا الوضع محمي برمز من المتغير البيئي NEXT_PUBLIC_STUDIO_PIN.'
              : 'يمكنك تحديد PIN محلي اختياري أو الدخول مباشرة.'}
          </p>
          <input
            className={styles.input}
            placeholder="PIN"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            type="password"
          />
          <div className={styles.buttonRow} style={{ justifyContent: 'center' }}>
            <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={handleUnlock}>
              دخول الاستديو
            </button>
          </div>
          {pinError && <div className={styles.alert}>{pinError}</div>}
          <p className={styles.small}>محفوظ محلياً فقط.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <CanvasStarfield intensity="low" />
      <div className={styles.bgGlow} />

      <div className={styles.grid}>
        <div className={`${styles.glass} ${styles.panel}`}>
          <div className={styles.header}>
            <div>
              <div className={styles.badge}>
                <span aria-hidden>🛰️</span> Space Studio
              </div>
              <h1 className={styles.title}>محرر محتوى محلي</h1>
              <p className={styles.subhead}>
                إنشاء وتعديل مقالات، معاينة فورية، وحفظ في المتصفح مع تصدير/استيراد.
              </p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>العنوان</label>
              <input
                className={styles.input}
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="عنوان المقال"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>التصنيف</label>
              <input
                className={styles.input}
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                placeholder="Category"
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>الوسوم (مفصولة بفاصلة)</label>
              <input
                className={styles.input}
                value={draft.tags.join(', ')}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, tags: e.target.value.split(',').map((t) => t.trim()) }))
                }
                placeholder="nebula, exoplanet, timeline"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>ملخص قصير</label>
              <input
                className={styles.input}
                value={draft.excerpt}
                onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
                placeholder="سطر تلخيصي للمقال"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>المحتوى (Markdown)</label>
            <textarea
              className={styles.textarea}
              value={draft.body}
              onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
              placeholder="# عنوان\n\n- نقطة\n- نقطة\n\n**نص عريض** و `code`."
            />
          </div>

          <div className={styles.buttonRow}>
            <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={saveDraft}>
              حفظ / تحديث
            </button>
            <button className={styles.button} onClick={resetDraft}>
              مسودة جديدة
            </button>
            {selectedId && (
              <button className={`${styles.button} ${styles.buttonDanger}`} onClick={() => deleteArticle(selectedId)}>
                حذف
              </button>
            )}
            <button className={styles.button} onClick={handleExport}>
              Export JSON
            </button>
            <button className={styles.button} onClick={() => fileInputRef.current?.click()}>
              Import JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={handleImport}
            />
          </div>
          <div className={styles.meta}>
            <span className={styles.pill}>LocalStorage</span>
            <span className={styles.pill}>Route: /space/studio</span>
            <span className={styles.pill}>يظهر تلقائياً في Space Library</span>
          </div>
        </div>

        <div className={`${styles.glass} ${styles.panel}`}>
          <div className={styles.header}>
            <div>
              <div className={styles.badge}>المدخلات المحفوظة</div>
              <p className={styles.subhead}>بحث، اختيار للمراجعة، أو حذف.</p>
            </div>
            <div className={styles.field} style={{ margin: 0, width: '220px' }}>
              <input
                className={styles.input}
                placeholder="بحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <hr className={styles.divider} />
          <div className={styles.list}>
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className={`${styles.card} ${selectedId === article.id ? styles.cardActive : ''}`}
                onClick={() => hydrateDraft(article)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{article.title || 'بدون عنوان'}</h3>
                  <span className={styles.tag}>{article.category || 'Uncategorized'}</span>
                </div>
                <p className="text-sm text-gray-300">{article.excerpt || '—'}</p>
                <div className={styles.meta}>
                  <span className={styles.tag}>Tags: {article.tags.join(', ') || '—'}</span>
                  <span className={styles.tag}>{new Date(article.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {filteredArticles.length === 0 && (
              <div className={styles.alert}>لا توجد عناصر مطابقة. أضف مقالاً جديداً.</div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.grid} style={{ paddingTop: 0 }}>
        <div className={`${styles.glass} ${styles.panel}`} style={{ gridColumn: '1 / -1' }}>
          <div className={styles.header}>
            <div>
              <div className={styles.badge}>معاينة حية</div>
              <p className={styles.subhead}>Markdown → عرض فوري.</p>
            </div>
          </div>
          <div className={styles.preview} dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </div>
    </div>
  )
}

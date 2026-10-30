'use client'

import Link from 'next/link'
import { useEffect, useId, useState } from 'react'
import { destinations, learningPaths, type HubLocale, type HubCategory } from '@/data/halfspace/exploration'
import { filterDestinations, readExploredIds } from '@/utils/halfspace/science'
import { spaceSections } from '@/data/spaceSections'
import LightTravelLab from './LightTravelLab'
import styles from './exploration-hub.module.css'

const STORAGE_KEY = 'halfspace:explored:v1'
const categories: ('all' | HubCategory)[] = ['all', 'explore', 'learn', 'lab']
const categoryLabels = {
  en: { all: 'All destinations', explore: 'Experience', learn: 'Understand', lab: 'Experiment' },
  ar: { all: 'كل الوجهات', explore: 'عِش التجربة', learn: 'افهم', lab: 'جرّب' },
}
const kindLabels = {
  en: { science: 'Science reading', simulation: 'Educational simulation', creative: 'Creative experience' },
  ar: { science: 'قراءة علمية', simulation: 'محاكاة تعليمية', creative: 'تجربة إبداعية' },
}

export default function ExplorationHub({ locale = 'en', basePath = '/space/home' }: { locale?: HubLocale; basePath?: string }) {
  const ar = locale === 'ar'
  const searchId = useId()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | HubCategory>('all')
  const [pathId, setPathId] = useState('first')
  const [explored, setExplored] = useState<string[]>([])
  const [storageReady, setStorageReady] = useState(false)
  const [canSave, setCanSave] = useState(true)
  const activePath = learningPaths.find(path => path.id === pathId) || learningPaths[0]
  const results = filterDestinations(destinations, query, category)
  const completedSteps = activePath.steps.filter(id => explored.includes(id)).length

  useEffect(() => {
    try { setExplored(readExploredIds(localStorage.getItem(STORAGE_KEY), destinations.map(item => item.id))) }
    catch { setCanSave(false) }
    setStorageReady(true)
  }, [])

  useEffect(() => {
    if (!storageReady) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(explored)) }
    catch { setCanSave(false) }
  }, [explored, storageReady])

  function toggleExplored(id: string) {
    setExplored(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id])
  }

  return (
    <div className={styles.hub} lang={locale} dir={ar ? 'rtl' : 'ltr'}>
      <a className="hs-skip" href="#destinations">{ar ? 'انتقل إلى الوجهات' : 'Skip to destinations'}</a>
      <div className="hs-topline">
        <div className="hs-sector"><span className="hs-half" dir="ltr">Half<span> / </span></span><span>{ar ? 'قطاع الفضاء والمعرفة' : 'SPACE & KNOWLEDGE'}</span></div>
        <div className="hs-top-actions">
          <a href="#our-purpose">{ar ? 'رؤيتنا' : 'Our purpose'}</a>
          <Link href={`${basePath}?lang=${ar ? 'en' : 'ar'}`} hrefLang={ar ? 'en' : 'ar'} lang={ar ? 'en' : 'ar'}>{ar ? 'English' : 'العربية'} <span aria-hidden="true">↗</span></Link>
        </div>
      </div>

      <section className="hs-hero" aria-labelledby="hs-title">
        <div className="hs-hero-copy">
          <p className="hs-eyebrow"><span className="hs-status-dot" /> HALFSPACE · {ar ? 'أحد قطاعات Half' : 'A SECTOR OF HALF'}</p>
          <h1 id="hs-title">{ar ? <>الكون واسع.<br /><span>وهنا تبدأ رحلتك.</span></> : <>A universe of wonder.<br /><span>A place to begin.</span></>}</h1>
          <p className="hs-hero-description">{ar ? 'نحوّل فضولك إلى رحلة بين العلم والتجربة والخيال. اقترب من الكون، افهم كيف نعرفه، وامنح أسئلتك مساحة أبعد.' : 'Turn your curiosity into a journey through science, experience, and imagination. Get closer to the cosmos. Discover how we know what we know.'}</p>
          <div className="hs-hero-actions">
            <a className="hs-button hs-primary" href="#paths">{ar ? 'اختر مسارك' : 'Find your path'} <span aria-hidden="true">{ar ? '←' : '→'}</span></a>
            <a className="hs-button hs-secondary" href="#light-lab">{ar ? 'جرّب مختبر الضوء' : 'Try the light lab'} <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hs-hero-footnote"><span>01 / 03</span><p>{ar ? 'استكشف. افهم. ثم اسأل أكثر.' : 'Explore. Understand. Ask a better question.'}</p></div>
        </div>
        <div className="hs-orbit-art" role="img" aria-label={ar ? 'رسم فني لأفق كوكب ومدارات ضوئية، وليس صورة رصدية' : 'Artistic illustration of a planetary horizon and light orbits, not an observation'}>
          <div className="hs-art-stars" />
          <div className="hs-orbit hs-orbit-one" /><div className="hs-orbit hs-orbit-two" />
          <div className="hs-planet"><span /></div>
          <span className="hs-orbit-point" />
          <div className="hs-art-coordinate" dir="ltr">HALF / SPACE<br /><span>THE CURIOSITY SECTOR</span></div>
          <div className="hs-art-caption"><span>✦</span><p>{ar ? 'من الدهشة إلى الفهم' : 'FROM WONDER TO UNDERSTANDING'}<small>{ar ? 'تصوّر فني · ليس بمقياس حقيقي' : 'ARTIST’S IMPRESSION · NOT TO SCALE'}</small></p></div>
        </div>
      </section>

      <div className="hs-principles" aria-label={ar ? 'مبادئ التجربة' : 'Our principles'}>
        <div><span>01</span><p>{ar ? 'علم يقود الفضول' : 'Science-led curiosity'}</p></div>
        <div><span>02</span><p>{ar ? 'تجربة على إيقاعك' : 'Exploration at your pace'}</p></div>
        <div><span>03</span><p>{ar ? 'خيال يعرف حدوده' : 'Imagination, clearly labelled'}</p></div>
      </div>

      <section className="hs-section" id="paths" aria-labelledby="hs-paths-title">
        <div className="hs-section-heading">
          <div><p className="hs-eyebrow">{ar ? 'نقطة الانطلاق' : 'YOUR DEPARTURE POINT'}</p><h2 id="hs-paths-title">{ar ? 'ليس عليك أن تعرف من أين تبدأ.' : 'You don’t need to know where to start.'}</h2></div>
          <p>{ar ? 'ثلاثة مسارات عبر تجاربنا الحالية. اختر ما يشبه فضولك.' : 'Three routes through our existing universe. Choose the one that feels like you.'}</p>
        </div>
        <div className="hs-path-options" aria-label={ar ? 'مسارات الاستكشاف' : 'Exploration paths'}>
          {learningPaths.map((path, index) => <button type="button" key={path.id} className="hs-path-option" aria-pressed={pathId === path.id} onClick={() => setPathId(path.id)} aria-controls="hs-path-steps">
            <span className="hs-path-number">0{index + 1}<span aria-hidden="true">↗</span></span>
            <small>{path.audience[locale]}</small><strong>{path.title[locale]}</strong><p>{path.description[locale]}</p>
          </button>)}
        </div>
        <div className="hs-path-detail" id="hs-path-steps">
          <div className="hs-path-detail-header"><h3>{activePath.title[locale]}</h3><span role="status">{completedSteps} / {activePath.steps.length} {ar ? 'استكشفتها' : 'explored'}</span></div>
          <p className="hs-small">{ar ? 'افتح الوجهة، ثم علّم ما استكشفته بنفسك. هذا سجل زياراتك وليس تقييمًا لمعرفتك.' : 'Open a destination, then mark what you have explored. This is your visit log, not a knowledge assessment.'}</p>
          <ol className="hs-path-steps">
            {activePath.steps.map((id, index) => {
              const destination = destinations.find(item => item.id === id)!
              return <li key={id}>
                <span className="hs-step-number">0{index + 1}</span>
                <Link href={destination.href} prefetch={false}><strong>{destination.title[locale]}</strong><small>{kindLabels[locale][destination.kind]} · {destination.minutes} {ar ? 'دقائق تقريبًا' : 'min suggested'} <span aria-hidden="true">↗</span></small></Link>
                <label className="hs-check"><input type="checkbox" disabled={!storageReady} checked={explored.includes(id)} onChange={() => toggleExplored(id)} /><span>{ar ? 'استكشفتها' : 'Explored'}</span></label>
              </li>
            })}
          </ol>
          <div className="hs-progress-footer"><span>{canSave ? (ar ? 'يُحفظ سجلك في هذا المتصفح فقط.' : 'Your log is saved in this browser only.') : (ar ? 'التخزين غير متاح؛ يبقى سجلك حتى مغادرة الصفحة.' : 'Storage unavailable; your log lasts for this page session.')}</span>{explored.length > 0 && <button type="button" onClick={() => setExplored([])}>{ar ? 'مسح السجل' : 'Clear log'}</button>}</div>
        </div>
      </section>

      <LightTravelLab locale={locale} />

      <section className="hs-section" id="destinations" aria-labelledby="hs-destinations-title">
        <div className="hs-section-heading">
          <div><p className="hs-eyebrow">{ar ? 'أطلس HalfSpace' : 'THE HALFSPACE ATLAS'}</p><h2 id="hs-destinations-title">{ar ? 'إلى أين يأخذك فضولك؟' : 'Where will curiosity take you?'}</h2></div>
          <p>{ar ? 'كل هذه الوجهات موجودة بالفعل. بعضها يقدّم محتوى باللغة الإنجليزية.' : 'Real destinations from the existing collection. Suggested times are a guide, never a limit.'}</p>
        </div>
        <div className="hs-discovery-controls">
          <div className="hs-filters" aria-label={ar ? 'تصفية الوجهات' : 'Filter destinations'}>{categories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{categoryLabels[locale][item]}</button>)}</div>
          <div className="hs-search"><label htmlFor={searchId}>{ar ? 'ابحث في الوجهات' : 'Search destinations'}</label><input id={searchId} type="search" value={query} placeholder={ar ? 'نجوم، مدارات، مجرّات…' : 'Stars, gravity, galaxies…'} onChange={event => setQuery(event.target.value)} /></div>
        </div>
        <p className="hs-result-count" role="status">{results.length} {ar ? 'وجهة' : 'destinations'}{query && <> · «{query}»</>}</p>
        <div className="hs-destinations-grid">
          {results.map(item => <article className={`hs-destination hs-destination-${item.category}`} key={item.id}>
            <div className="hs-destination-top"><span className="hs-destination-symbol" aria-hidden="true">{item.symbol}</span><span className={`hs-kind hs-kind-${item.kind}`}>{kindLabels[locale][item.kind]}</span></div>
            <h3><Link href={item.href} prefetch={false}>{item.title[locale]} <span aria-hidden="true">↗</span></Link></h3>
            <p>{item.description[locale]}</p>
            <div className="hs-destination-meta"><span>{categoryLabels[locale][item.category]}</span><span>{item.minutes} {ar ? 'دقائق تقريبًا' : 'min suggested'}</span></div>
          </article>)}
        </div>
        {results.length === 0 && <div className="hs-empty"><h3>{ar ? 'لم نجد وجهة بهذه الكلمات.' : 'No destination found just yet.'}</h3><p>{ar ? 'جرّب كلمة أخرى أو أعد عرض كل الوجهات.' : 'Try another word, or reset the filters to see every destination.'}</p><button type="button" className="hs-button hs-secondary" onClick={() => { setQuery(''); setCategory('all') }}>{ar ? 'عرض كل الوجهات' : 'Show every destination'}</button></div>}
      </section>

      <section className="hs-section hs-purpose" id="our-purpose" aria-labelledby="hs-purpose-title">
        <div><p className="hs-eyebrow">HALF / {ar ? 'رؤيتنا' : 'OUR PURPOSE'}</p><h2 id="hs-purpose-title">{ar ? 'مساحة للفضول داخل Half.' : 'A home for curiosity within Half.'}</h2><p>{ar ? 'HalfSpace هو قطاع استكشاف الفضاء والمعرفة العلمية في Half. نجمع بين وضوح الشرح والتجربة التفاعلية والدهشة البصرية، لنمنح الطلاب والمعلّمين وكل فضولي طريقًا أعمق لفهم الكون.' : 'HalfSpace is Half’s sector for space exploration and scientific learning. We bring clear explanations, hands-on experiences, and visual wonder together for students, educators, and anyone with a question about the universe.'}</p></div>
        <div className="hs-science-policy" id="science"><h3>{ar ? 'الدهشة تستحق الدقة.' : 'Wonder deserves rigour.'}</h3>
          <p>{ar ? 'نميّز في هذه البوابة بين القراءة العلمية والمحاكاة التعليمية والتجارب الإبداعية. المحاكاة تبسّط الواقع، والخيال والتأمل ليسا دليلًا رصديًا. تصنيفات البوابة لا تعني أن كل صفحات الأرشيف خضعت لمراجعة علمية شاملة.' : 'This gateway distinguishes science reading, educational simulations, and creative experiences. Models simplify reality; imagination and reflection are not observational evidence. Gateway labels do not imply a complete scientific review of every archived page.'}</p>
          <p>{ar ? 'تجد مصادر مختبر الضوء وحدود نموذجه بجوار الحساب. الأرقام المؤرخة في الأرشيف سجلات ثابتة وليست قياسات مباشرة.' : 'The light lab’s sources and assumptions sit beside its calculation. Dated archive figures are static records, not live measurements.'}</p>
          <div className="hs-source-links"><a href="https://science.nasa.gov/" target="_blank" rel="noreferrer">NASA Science ↗</a><a href="https://www.esa.int/Science_Exploration" target="_blank" rel="noreferrer">ESA Science ↗</a></div>
        </div>
      </section>

      <nav className="hs-archive-links" aria-label={ar ? 'أقسام الموقع السابقة' : 'Existing site sections'}><span>{ar ? 'تابع عبر أقسامنا' : 'KEEP EXPLORING'}</span>{spaceSections.filter(item => item.key !== 'home').map(section => <Link key={section.key} href={section.href} prefetch={false}>{section.title} <span aria-hidden="true">↗</span></Link>)}<Link href="/space/portal" prefetch={false}>{ar ? 'البوابة السابقة' : 'Original portal'} ↗</Link></nav>
      <div className="hs-endnote"><span dir="ltr">HalfSpace <span className="hs-muted">/ Half</span></span><p>{ar ? 'كل إجابة تفتح أفقًا جديدًا.' : 'Every answer opens another horizon.'}</p><a href="#hs-title">{ar ? 'إلى البداية ↑' : 'Back to the beginning ↑'}</a></div>
    </div>
  )
}

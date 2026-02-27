 'use client'

 import { useEffect, useMemo, useState } from 'react'
 import CanvasStarfield from '@/components/space/CanvasStarfield'
 import NebulaFog from '@/components/space/experience/NebulaFog'
 import styles from './universe-experience.module.css'

 type DensityLevel = 'light' | 'medium'

 type JourneyCard = {
   id: string
   title: string
   subtitle: string
   summary: string
 }

 const journeyCards: JourneyCard[] = [
   {
     id: 'origins',
     title: 'Origins',
     subtitle: 'بدايات الكون',
     summary:
       'وميض اللحظة الأولى بعد الانفجار العظيم، تقلبات دقيقة ولّدت كل البنى الكونية التي نراها اليوم. اقرأ أكثر →',
   },
   {
     id: 'stars',
     title: 'Stars',
     subtitle: 'ولادة النجوم',
     summary:
       'سحب هيدروجين تبرد ببطء، تنهار، وتضيء. دورة حياة من الضباب إلى الضوء ثم رماد كوني يغذي أجيالاً جديدة.',
   },
   {
     id: 'galaxies',
     title: 'Galaxies',
     subtitle: 'مدن كونية',
     summary:
       'أذرع حلزونية ترقص حول مراكز مظلمة، تيارات نجمية وممرات غبارية تشكل خرائط للزمن العميق. اقرأ أكثر →',
   },
   {
     id: 'black-holes',
     title: 'Black Holes',
     subtitle: 'حواف الزمكان',
     summary:
       'نقاط بلا عودة، حيث يتوقف الوقت تقريباً ويشتد الضوء حتى يصبح صامتاً. أقراص تراكمية تلتمع قبل الغياب.',
   },
 ]

 export default function UniverseExperiencePage() {
   const [motionEnabled, setMotionEnabled] = useState(true)
   const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
   const [starLevel, setStarLevel] = useState<DensityLevel>('medium')
   const [fogLevel, setFogLevel] = useState<DensityLevel>('light')
   const [activeCardId, setActiveCardId] = useState<string | null>(null)

   useEffect(() => {
     const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

     const applyPreference = (shouldReduce: boolean) => {
       setPrefersReducedMotion(shouldReduce)
       if (shouldReduce) {
         setMotionEnabled(false)
       }
     }

     applyPreference(mediaQuery.matches)

     const handleChange = (event: MediaQueryListEvent) => {
       applyPreference(event.matches)
     }

     mediaQuery.addEventListener('change', handleChange)
     return () => mediaQuery.removeEventListener('change', handleChange)
   }, [])

    const starIntensity = useMemo(() => (starLevel === 'light' ? 'low' : 'medium') as 'low' | 'medium', [starLevel])
   const fogDensity = useMemo(() => (fogLevel === 'light' ? 0.28 : 0.6), [fogLevel])
   const fogShouldRender = motionEnabled && !prefersReducedMotion
   const activeCard = useMemo(() => journeyCards.find((card) => card.id === activeCardId) ?? null, [activeCardId])

   return (
     <div className={styles.shell} data-motion={motionEnabled ? 'on' : 'off'}>
       {motionEnabled && (
         <CanvasStarfield
           intensity={starIntensity}
           className={styles.starfield}
         />
       )}

       {!motionEnabled && <div className={styles.staticBackdrop} aria-hidden />}

       {fogShouldRender && (
         <NebulaFog
           density={fogDensity}
           reducedMotion={!motionEnabled || prefersReducedMotion}
         />
       )}

       <div className={styles.overlay} aria-hidden />
       <div className={styles.vignette} aria-hidden />

       <div className={styles.contentWrap}>
         <section className={`${styles.hero} ${styles.fadeSlide}`}>
           <div className={styles.eyebrow} aria-label="cinematic overlay">
             <span>Universe Experience</span>
             <span className={styles.floatSoft}>🌌</span>
           </div>
           <h1 className={`${styles.title} text-gradient`}>
             تجربة بصرية تسبح في الكون
           </h1>
           <p className={styles.subtitle}>
             خلفية نجوم حيّة مع ضباب سديمي خفيف ووميض شهب هادئ. واجهة سينمائية بلمسات توهج،
             وتحكم فوري بالحركة والكثافة لمرافقة رحلتك.
           </p>
           <div className={styles.heroActions}>
             <button
               className={`${styles.primaryButton} glow-purple`}
               onClick={() => document?.getElementById('controls')?.scrollIntoView({ behavior: 'smooth' })}
             >
               ابدأ التجربة
             </button>
             <button
               className={styles.ghostButton}
               onClick={() => setMotionEnabled((prev) => !prev)}
               aria-pressed={motionEnabled}
             >
               {motionEnabled ? 'إيقاف الحركة' : 'تشغيل الحركة'}
             </button>
           </div>
         </section>

         <section id="controls" className="px-4">
           <div className={`${styles.grid} ${styles.fadeSlide}`}>
             <div className={styles.panel}>
               <div className={styles.panelHeader}>
                 <p className={styles.panelTitle}>الحركة</p>
                 <span className={styles.panelHint}>
                   {prefersReducedMotion ? 'تفضيل النظام: تقليل الحركة' : 'تبديل فوري'}
                 </span>
               </div>
               <p className={styles.note}>
                 تحكم في الحركة الكونية بين التشغيل والإيقاف مع احترام إعدادات النظام.
               </p>
               <div className={styles.softDivider} />
               <div className={styles.pillGroup}>
                 <button
                   className={styles.pill}
                   data-active={motionEnabled}
                   onClick={() => setMotionEnabled(true)}
                 >
                   تشغيل الحركة
                 </button>
                 <button
                   className={styles.pill}
                   data-active={!motionEnabled}
                   onClick={() => setMotionEnabled(false)}
                 >
                   إيقاف الحركة
                 </button>
               </div>
             </div>

             <div className={styles.panel}>
               <div className={styles.panelHeader}>
                 <p className={styles.panelTitle}>كثافة النجوم</p>
                 <span className={styles.panelHint}>خفيف / متوسط</span>
               </div>
               <p className={styles.note}>حدد كثافة النجوم والومضات للحصول على الخلفية المناسبة.</p>
               <div className={styles.softDivider} />
               <div className={styles.pillGroup}>
                 <button
                   className={styles.pill}
                   data-active={starLevel === 'light'}
                   onClick={() => setStarLevel('light')}
                 >
                   خفيف
                 </button>
                 <button
                   className={styles.pill}
                   data-active={starLevel === 'medium'}
                   onClick={() => setStarLevel('medium')}
                 >
                   متوسط
                 </button>
               </div>
             </div>

             <div className={styles.panel}>
               <div className={styles.panelHeader}>
                 <p className={styles.panelTitle}>كثافة الضباب</p>
                 <span className={styles.panelHint}>سديم هادئ</span>
               </div>
               <p className={styles.note}>ضبط الضباب السديمي لتغليف المشهد بضوء خافت.</p>
               <div className={styles.softDivider} />
               <div className={styles.pillGroup}>
                 <button
                   className={styles.pill}
                   data-active={fogLevel === 'light'}
                   onClick={() => setFogLevel('light')}
                 >
                   خفيف
                 </button>
                 <button
                   className={styles.pill}
                   data-active={fogLevel === 'medium'}
                   onClick={() => setFogLevel('medium')}
                 >
                   متوسط
                 </button>
               </div>
             </div>
           </div>
         </section>

         <section className={`${styles.journeySection} ${styles.fadeSlide}`}>
           <div className={styles.journeyHeader}>
             <p className={styles.eyebrow}>رحلة قصيرة</p>
             <h2 className="text-4xl md:text-5xl font-bold text-gradient mt-4 mb-3">
               محطات كونية خاطفة
             </h2>
             <p className="text-lg text-gray-200">
               اضغط على بطاقة لتفتح نافذة صغيرة فيها لمحة سريعة مع تلميح "اقرأ أكثر".
             </p>
           </div>
           <div className={styles.journeyGrid}>
             {journeyCards.map((card) => (
               <button
                 key={card.id}
                 className={`${styles.journeyCard} ${styles.floatSoft}`}
                 onClick={() => setActiveCardId(card.id)}
                 aria-haspopup="dialog"
                 aria-controls="journey-modal"
               >
                 <div className={styles.pulseHalo} aria-hidden />
                 <p className="text-sm text-indigo-200">{card.title}</p>
                 <p className={styles.journeyTitle}>{card.subtitle}</p>
                 <p className={styles.journeySub}>{card.summary}</p>
                 <span className={styles.journeyCTA}>
                   اكتشف اللمحة
                   <span aria-hidden>→</span>
                 </span>
               </button>
             ))}
           </div>
         </section>
       </div>

       {activeCard && (
         <div
           className={styles.modalBackdrop}
           role="dialog"
           aria-modal="true"
           aria-labelledby="journey-modal-title"
           id="journey-modal"
         >
           <div className={styles.modal}>
             <div className={styles.modalHeader}>
               <span className={styles.badge}>{activeCard.title}</span>
               <button className={styles.closeButton} onClick={() => setActiveCardId(null)}>
                 إغلاق
               </button>
             </div>
             <h3 id="journey-modal-title" className="text-2xl font-bold text-gradient mb-2">
               {activeCard.subtitle}
             </h3>
             <p className={styles.modalText}>{activeCard.summary}</p>
             <div className={styles.readMore}>
               اقرأ أكثر
               <span aria-hidden>→</span>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }

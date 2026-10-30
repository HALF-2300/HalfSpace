'use client'

import { useId, useState } from 'react'
import { distancePresets, type HubLocale } from '@/data/halfspace/exploration'
import { constantSpeedJourney, lightTravelSeconds, type DistanceUnit } from '@/utils/halfspace/science'

function duration(seconds: number, locale: HubLocale) {
  const units = [
    { divisor: 31557600, en: 'years', ar: 'سنة' },
    { divisor: 86400, en: 'days', ar: 'يوم' },
    { divisor: 3600, en: 'hours', ar: 'ساعة' },
    { divisor: 60, en: 'minutes', ar: 'دقيقة' },
    { divisor: 1, en: 'seconds', ar: 'ثانية' },
  ]
  const unit = units.find(item => seconds >= item.divisor) || units[units.length - 1]
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(seconds / unit.divisor)} ${unit[locale]}`
}

export default function LightTravelLab({ locale }: { locale: HubLocale }) {
  const ar = locale === 'ar'
  const id = useId()
  const [distance, setDistance] = useState('1')
  const [unit, setUnit] = useState<DistanceUnit>('au')
  const [speed, setSpeed] = useState('0.5')
  const selected = distancePresets.find(preset => preset.unit === unit && preset.distance === Number(distance))
  let seconds: number | null = null
  try {
    if (distance.trim()) seconds = lightTravelSeconds(Number(distance), unit)
    if (seconds !== null && !Number.isFinite(seconds * 2)) seconds = null
  } catch { /* Invalid input is explained inline rather than rendered as a result. */ }

  let journey: { earthSeconds: number; shipSeconds: number } | null = null
  try {
    if (seconds !== null) journey = constantSpeedJourney(Number(distance), unit, Number(speed))
  } catch { /* The validated calculation must never render an invented value. */ }

  return (
    <section className="hs-lab hs-section" id="light-lab" aria-labelledby={`${id}-title`}>
      <div className="hs-lab-intro">
        <p className="hs-eyebrow">{ar ? 'المختبر / ٠١' : 'THE LAB / 01'}</p>
        <h2 id={`${id}-title`}>{ar ? 'حتى الضوء يحتاج إلى وقت.' : 'Even light takes time.'}</h2>
        <p>{ar ? 'عندما تنظر إلى الفضاء، ترى الماضي. اختر وجهة أو أدخل مسافة واكتشف تأخّر الضوء.' : 'Looking into space means looking into the past. Pick a destination or enter a distance to discover the delay.'}</p>
        <div className="hs-signal-diagram" aria-hidden="true">
          <span className="hs-signal-earth" /><span className="hs-signal-line" /><span className="hs-signal-star">✦</span>
        </div>
        <p className="hs-small">{ar ? 'رسم توضيحي؛ الأحجام والمسافات ليست بمقياس واحد.' : 'Illustration; sizes and distances are not to scale.'}</p>
      </div>
      <div className="hs-lab-console">
        <fieldset>
          <legend>{ar ? 'اختر وجهتك' : 'Choose a destination'}</legend>
          <div className="hs-presets">
            {distancePresets.map(preset => (
              <button type="button" key={preset.id} aria-pressed={selected?.id === preset.id} onClick={() => { setDistance(String(preset.distance)); setUnit(preset.unit) }}>
                {preset.name[locale]}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="hs-distance-inputs">
          <div>
            <label htmlFor={`${id}-distance`}>{ar ? 'المسافة' : 'Distance'}</label>
            <input id={`${id}-distance`} type="number" min="0" step="any" value={distance} onChange={event => setDistance(event.target.value)} aria-invalid={seconds === null} aria-describedby={`${id}-note`} />
          </div>
          <div>
            <label htmlFor={`${id}-unit`}>{ar ? 'الوحدة' : 'Unit'}</label>
            <select id={`${id}-unit`} value={unit} onChange={event => setUnit(event.target.value as DistanceUnit)}>
              <option value="km">{ar ? 'كيلومتر' : 'Kilometres'}</option>
              <option value="au">{ar ? 'وحدة فلكية (AU)' : 'Astronomical units (AU)'}</option>
              <option value="ly">{ar ? 'سنة ضوئية' : 'Light-years'}</option>
            </select>
          </div>
        </div>
        <div className="hs-delay-results" aria-live="polite" aria-atomic="true">
          {seconds !== null ? <>
            <div><span>{ar ? 'وصول الضوء باتجاه واحد' : 'One-way light time'}</span><strong>{duration(seconds, locale)}</strong></div>
            <div><span>{ar ? 'إرسال إشارة وتلقّي الرد' : 'Signal + immediate reply'}</span><strong>{duration(seconds * 2, locale)}</strong></div>
          </> : <p className="hs-input-error">{ar ? 'أدخل مسافة محدودة تساوي صفرًا أو أكبر، ضمن نطاق الحساب.' : 'Enter a finite distance of zero or greater within the calculation range.'}</p>}
        </div>
        <p id={`${id}-note`} className="hs-small">{selected?.note[locale] || (ar ? 'مسافة افتراضية يحدّدها المستخدم.' : 'A hypothetical distance chosen by you.')}</p>
        <section className="hs-journey" aria-labelledby={`${id}-journey-title`}>
          <p className="hs-eyebrow">{ar ? 'تجربة إضافية / النسبية الخاصة' : 'NEXT EXPERIMENT / SPECIAL RELATIVITY'}</p>
          <h3 id={`${id}-journey-title`}>{ar ? 'وماذا لو سافرنا بدل الضوء؟' : 'What if we travelled instead?'}</h3>
          <p className="hs-small">{ar ? 'قارن بين الزمن في إطار الأرض والزمن الذي تسجّله ساعة على مركبة تتحرّك بسرعة ثابتة.' : 'Compare elapsed time in the Earth frame with time recorded by a clock aboard a constant-speed spacecraft.'}</p>
          <label htmlFor={`${id}-speed`}>{ar ? 'سرعة المركبة كنسبة من سرعة الضوء' : 'Spacecraft speed as a fraction of light speed'}</label>
          <select id={`${id}-speed`} value={speed} onChange={event => setSpeed(event.target.value)}>
            <option value="0.1">0.1c · 10%</option>
            <option value="0.5">0.5c · 50%</option>
            <option value="0.9">0.9c · 90%</option>
            <option value="0.99">0.99c · 99%</option>
          </select>
          <div className="hs-journey-results" aria-live="polite" aria-atomic="true">
            {journey ? <>
              <div><span>{ar ? 'الزمن المنقضي في إطار الأرض' : 'Elapsed time in Earth frame'}</span><strong>{duration(journey.earthSeconds, locale)}</strong></div>
              <div><span>{ar ? 'الزمن المنقضي على ساعة المركبة' : 'Elapsed time on ship clock'}</span><strong>{duration(journey.shipSeconds, locale)}</strong></div>
            </> : <p className="hs-input-error">{ar ? 'أدخل مسافة صالحة لمقارنة زمن الرحلة.' : 'Enter a valid distance to compare journey times.'}</p>}
          </div>
          <p className="hs-small">{ar ? 'افتراض تعليمي: جسمان ساكنان في إطار واحد، وحركة مستقيمة بسرعة ثابتة طوال الرحلة. نهمل التسارع والتباطؤ والجاذبية وتمدد الكون؛ ولا نتنبأ بإمكان بناء هذه المركبة. الزمن على المركبة = زمن الأرض × √(1 − (v/c)²).' : 'Teaching model: endpoints at rest in one frame and straight-line, constant-speed travel throughout. Acceleration, braking, gravity and cosmic expansion are omitted; this is not a claim such a spacecraft can be built. Ship time = Earth time × √(1 − (v/c)²).'}</p>
          <a className="hs-journey-source" href="https://einstein.stanford.edu/content/relativity/q917.html" target="_blank" rel="noreferrer">{ar ? 'جامعة ستانفورد · شرح تباطؤ الزمن' : 'Stanford · Relativistic time dilation'} ↗</a>
        </section>
        <details className="hs-model-notes">
          <summary>{ar ? 'كيف نحسب؟ وما حدود النموذج؟' : 'How do we calculate this?'} </summary>
          <p>{ar ? 'الزمن = المسافة ÷ سرعة الضوء. نستخدم c = 299,792.458 كم/ث في الفراغ، والوحدة الفلكية = 149,597,870.7 كم، والسنة الضوئية هي المسافة التي يقطعها الضوء في سنة يوليانية (365.25 يومًا). نفترض مسافة ثابتة وردًا فوريًا؛ نهمل الحركة النسبية وتأثير الجاذبية وتمدد الكون. هذا زمن إشارة، وليس زمن رحلة مركبة.' : 'Time = distance ÷ light speed. We use c = 299,792.458 km/s in vacuum, 1 AU = 149,597,870.7 km, and a light-year defined by a Julian year (365.25 days). We assume fixed separation and an immediate reply; relative motion, gravity, and cosmic expansion are omitted. This is a signal delay, not a spacecraft travel time.'}</p>
          <a href="https://science.nasa.gov/universe/cosmic-distances/" target="_blank" rel="noreferrer">NASA · Cosmic distances ↗</a>
          <a href="https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/" target="_blank" rel="noreferrer">NASA · {ar ? 'المسافات وأزمنة الضوء' : 'Distances & light travel times'} ↗</a>
        </details>
      </div>
    </section>
  )
}

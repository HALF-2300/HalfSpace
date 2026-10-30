export type HubLocale = 'en' | 'ar'
export type HubCategory = 'explore' | 'learn' | 'lab'
export type Bilingual = Record<HubLocale, string>
export interface Destination {
  id: string
  href: string
  category: HubCategory
  kind: 'science' | 'simulation' | 'creative'
  title: Bilingual
  description: Bilingual
  minutes: number
  symbol: string
}

export const destinations: Destination[] = [
  { id: 'solar', href: '/solar-system', category: 'learn', kind: 'science', title: { en: 'Our solar neighbourhood', ar: 'جوارنا الشمسي' }, description: { en: 'Meet the planets, their moons, and the worlds that share our Sun.', ar: 'تعرّف إلى الكواكب وأقمارها والعوالم التي تشاركنا الشمس.' }, minutes: 8, symbol: '01' },
  { id: 'journey', href: '/space-journey', category: 'explore', kind: 'simulation', title: { en: 'A journey beyond Earth', ar: 'رحلة تتجاوز الأرض' }, description: { en: 'Travel through an illustrated universe, one discovery at a time.', ar: 'اعبر كونًا مصوّرًا، واكتشفه خطوة بخطوة.' }, minutes: 5, symbol: '02' },
  { id: 'lab', href: '/space/lab-pro', category: 'lab', kind: 'simulation', title: { en: 'The physics playground', ar: 'ساحة تجارب الفيزياء' }, description: { en: 'Change the conditions. Explore gravity, orbits, and stellar evolution.', ar: 'غيّر الشروط واختبر الجاذبية والمدارات وتطوّر النجوم.' }, minutes: 12, symbol: '03' },
  { id: 'library', href: '/space/library', category: 'learn', kind: 'science', title: { en: 'The knowledge library', ar: 'مكتبة المعرفة' }, description: { en: 'Follow a question into essays, explanations, and deeper reading.', ar: 'اتبع سؤالك عبر المقالات والشروح والقراءات المتعمّقة.' }, minutes: 10, symbol: '04' },
  { id: 'observatory', href: '/space/observatory', category: 'explore', kind: 'simulation', title: { en: 'The observatory', ar: 'المرصد' }, description: { en: 'Explore a model of the sky and the phenomena that shape it.', ar: 'استكشف نموذجًا للسماء والظواهر التي تشكّلها.' }, minutes: 7, symbol: '05' },
  { id: 'blackholes', href: '/black-holes', category: 'learn', kind: 'science', title: { en: 'At the edge of a black hole', ar: 'عند حافة ثقب أسود' }, description: { en: 'Explore event horizons, curved spacetime, and the limits of observation.', ar: 'استكشف آفاق الحدث وانحناء الزمكان وحدود الرصد.' }, minutes: 9, symbol: '06' },
  { id: 'deep', href: '/space/deep-universe', category: 'learn', kind: 'science', title: { en: 'The deep universe', ar: 'أعماق الكون' }, description: { en: 'From gravitational waves to the cosmic origins of heavy elements.', ar: 'من موجات الجاذبية إلى الأصول الكونية للعناصر الثقيلة.' }, minutes: 8, symbol: '07' },
  { id: 'swim', href: '/space/galaxy-swim', category: 'explore', kind: 'creative', title: { en: 'Drift among the stars', ar: 'انسياب بين النجوم' }, description: { en: 'An artistic, contemplative starfield. Explore at your own pace.', ar: 'تجربة نجوم فنية وتأملية تستكشفها على إيقاعك.' }, minutes: 4, symbol: '08' },
  { id: 'halfspace', href: '/space/halfspace', category: 'explore', kind: 'creative', title: { en: 'The HalfSpace experience', ar: 'تجربة HalfSpace' }, description: { en: 'Knowledge orbs, speculative worlds, and questions about our place in the cosmos.', ar: 'كرات معرفية وعوالم تخيّلية وأسئلة عن مكاننا في الكون.' }, minutes: 10, symbol: '09' },
  { id: 'gallery', href: '/space/gallery', category: 'explore', kind: 'creative', title: { en: 'The image gallery', ar: 'معرض الصور' }, description: { en: 'A visual collection for looking closer and discovering new questions.', ar: 'مجموعة بصرية للتأمل عن قرب واكتشاف أسئلة جديدة.' }, minutes: 5, symbol: '10' },
  { id: 'handbook', href: '/space/handbook', category: 'learn', kind: 'science', title: { en: 'Your exploration handbook', ar: 'دليلك للاستكشاف' }, description: { en: 'Find your bearings with essential concepts, shortcuts, and useful links.', ar: 'حدّد وجهتك بالمفاهيم الأساسية والاختصارات والروابط المفيدة.' }, minutes: 3, symbol: '11' },
  { id: 'media', href: '/space/media', category: 'explore', kind: 'creative', title: { en: 'The media vault', ar: 'أرشيف الوسائط' }, description: { en: 'Browse the existing collection of images, video, and visual stories.', ar: 'تصفّح مجموعة الصور والفيديو والحكايات البصرية الموجودة.' }, minutes: 6, symbol: '12' },
]

export const learningPaths = [
  { id: 'first', title: { en: 'My first expedition', ar: 'رحلتي الأولى' }, audience: { en: 'For the curious beginner', ar: 'للمستكشف المبتدئ' }, description: { en: 'Start close to home, then look further.', ar: 'ابدأ من جوارنا، ثم وسّع أفقك.' }, steps: ['solar', 'journey', 'handbook'] },
  { id: 'physics', title: { en: 'Think like a scientist', ar: 'فكّر كعالِم' }, audience: { en: 'For students & deeper questions', ar: 'للطلاب وأصحاب الأسئلة العميقة' }, description: { en: 'Read, experiment, and question your model.', ar: 'اقرأ، وجرّب، واختبر النموذج الذي تستخدمه.' }, steps: ['blackholes', 'lab', 'deep'] },
  { id: 'teach', title: { en: 'Bring the cosmos to class', ar: 'خذ الكون إلى الصف' }, audience: { en: 'For teachers & shared discovery', ar: 'للمعلّمين والاستكشاف الجماعي' }, description: { en: 'A reading, a hands-on activity, a sky to discuss.', ar: 'قراءة ونشاط عملي وسماء تفتح باب النقاش.' }, steps: ['library', 'lab', 'observatory'] },
]

export const distancePresets = [
  { id: 'moon', name: { en: 'The Moon', ar: 'القمر' }, distance: 384400, unit: 'km' as const, note: { en: 'Mean Earth–Moon distance; the actual distance varies.', ar: 'متوسط بُعد القمر عن الأرض؛ المسافة الفعلية تتغيّر.' } },
  { id: 'sun', name: { en: 'The Sun', ar: 'الشمس' }, distance: 1, unit: 'au' as const, note: { en: 'One astronomical unit approximates the mean Earth–Sun distance.', ar: 'الوحدة الفلكية تقارب متوسط المسافة بين الأرض والشمس.' } },
  { id: 'proxima', name: { en: 'Proxima Centauri', ar: 'بروكسيما سنتوري' }, distance: 4.24, unit: 'ly' as const, note: { en: 'Approximately 4.24 light-years from our solar system.', ar: 'يبعد نحو 4.24 سنة ضوئية عن نظامنا الشمسي.' } },
]

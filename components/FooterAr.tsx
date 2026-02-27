import Link from 'next/link'

export default function FooterAr() {
  return (
    <footer className="relative mt-20 glass border-t border-purple-500/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <p className="text-xl font-semibold text-gradient mb-4">
            صُنع للفضوليين
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <span>عدد الحقائق: 247</span>
            <span>•</span>
            <span>عدد الصفحات: 12</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-right">
            <h4 className="text-white font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/galaxy-map" className="text-gray-400 hover:text-white transition-colors">الخريطة</Link></li>
              <li><Link href="/solar-system" className="text-gray-400 hover:text-white transition-colors">الكواكب</Link></li>
              <li><Link href="/missions" className="text-gray-400 hover:text-white transition-colors">المهمّات</Link></li>
            </ul>
          </div>
          <div className="text-center">
            <h4 className="text-white font-semibold mb-4">استكشف</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/historic-images" className="text-gray-400 hover:text-white transition-colors">الصور</Link></li>
              <li><Link href="/glossary" className="text-gray-400 hover:text-white transition-colors">القاموس</Link></li>
              <li><Link href="/quizzes" className="text-gray-400 hover:text-white transition-colors">الاختبارات</Link></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold mb-4">مصادر</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">NASA</a></li>
              <li><a href="https://www.esa.int" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">ESA</a></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">عن الموقع</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-purple-500/20 text-center">
          <p className="text-sm text-gray-400">
            © 2026 بوابة الفضاء | Space Gate
          </p>
          <p className="text-xs text-gray-500 mt-2">
            كل ما تعمّقت… صارت السماء أقرب
          </p>
        </div>
      </div>
    </footer>
  )
}


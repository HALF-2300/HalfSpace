import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative mt-20 glass border-t border-purple-500/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">🚀</span>
              <h3 className="text-2xl font-bold text-gradient">
                مستكشف الفضاء
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              بوابتك النهائية إلى الكون. استكشف الكواكب والنجوم والمجرات وأسرار الكون. 
              مبني للطلاب والمعلمين وعشاق الفضاء في جميع أنحاء العالم.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://www.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                🌌 NASA
              </a>
              <a href="https://www.esa.int" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                🛰️ ESA
              </a>
              <a href="https://apod.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                📸 APOD
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">استكشف</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/solar-system" className="text-gray-400 hover:text-white transition-colors">النظام الشمسي</Link></li>
              <li><Link href="/planets" className="text-gray-400 hover:text-white transition-colors">الكواكب</Link></li>
              <li><Link href="/stars" className="text-gray-400 hover:text-white transition-colors">النجوم</Link></li>
              <li><Link href="/galaxies" className="text-gray-400 hover:text-white transition-colors">المجرات</Link></li>
              <li><Link href="/missions" className="text-gray-400 hover:text-white transition-colors">البعثات</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">تعلم</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/space-history" className="text-gray-400 hover:text-white transition-colors">تاريخ الفضاء</Link></li>
              <li><Link href="/astronauts" className="text-gray-400 hover:text-white transition-colors">رواد الفضاء</Link></li>
              <li><Link href="/telescopes" className="text-gray-400 hover:text-white transition-colors">التلسكوبات</Link></li>
              <li><Link href="/future-missions" className="text-gray-400 hover:text-white transition-colors">البعثات المستقبلية</Link></li>
              <li><Link href="/cosmology" className="text-gray-400 hover:text-white transition-colors">علم الكونيات</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-purple-500/20 text-center">
          <p className="text-sm text-gray-400">
            © 2026 مستكشف الفضاء. تم إنشاؤه بشغف لاستكشاف الفضاء. 
            جميع الصور من ناسا ووكالة الفضاء الأوروبية ومصادر المجال العام الأخرى.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            أعظم موقع فضائي على الأرض 🌍 → 🚀 → 🌌
          </p>
        </div>
      </div>
    </footer>
  )
}


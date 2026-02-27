export default function AboutPage() {
  return (
    <div className="pt-20 relative min-h-screen">
      <section className="py-12 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
          عن الموقع
        </h1>
        <div className="glass rounded-3xl p-12 border border-purple-500/30 space-y-6 text-right">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">بوابة الفضاء | Space Gate</h2>
            <p className="text-gray-300 leading-relaxed">
              موسوعة فضاء عربية شاملة تجمع بين المتعة والمعرفة. نقدم محتوى تعليمي ممتع عن الفضاء، الكواكب، النجوم، المجرات، والمهمات الفضائية.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-3">رؤيتنا</h3>
            <p className="text-gray-300 leading-relaxed">
              "مركز تحكم + موسوعة ممتعة" - نريد أن نجعل استكشاف الفضاء تجربة تفاعلية وممتعة للجميع.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3">المصادر</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• <a href="https://www.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">NASA</a> - الإدارة الوطنية للملاحة الجوية والفضاء</li>
              <li>• <a href="https://www.esa.int" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">ESA</a> - وكالة الفضاء الأوروبية</li>
              <li>• <a href="https://apod.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">APOD</a> - صورة اليوم الفلكية</li>
            </ul>
          </div>

          <div className="pt-6 border-t border-purple-500/30">
            <p className="text-gray-400 text-sm">
              "كل ما تعمّقت… صارت السماء أقرب."
            </p>
            <p className="text-gray-400 text-sm mt-2">
              "الفضاء ما هو بعيد… البعيد هو إنك ما تسأل."
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}


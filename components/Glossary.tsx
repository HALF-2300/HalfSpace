'use client'

import { useState } from 'react'
import { RelatedContent } from '@/components/SpaceSearch'
import { slugify } from '@/utils/indexer/spaceIndexer'

interface GlossaryTerm {
  term: string
  termAr: string
  definition: string
  definitionAr: string
  category: string
  categoryAr: string
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Light Year',
    termAr: 'سنة ضوئية',
    definition: 'The distance light travels in one year, about 9.46 trillion kilometers',
    definitionAr: 'المسافة التي يقطعها الضوء في سنة واحدة، حوالي 9.46 تريليون كيلومتر',
    category: 'distance',
    categoryAr: 'مسافة'
  },
  {
    term: 'Spectrum',
    termAr: 'طيف',
    definition: 'The range of wavelengths of electromagnetic radiation',
    definitionAr: 'مجموعة أطوال موجات الإشعاع الكهرومغناطيسي',
    category: 'physics',
    categoryAr: 'فيزياء'
  },
  {
    term: 'Redshift',
    termAr: 'انزياح أحمر',
    definition: 'The increase in wavelength of light from distant objects, indicating they are moving away',
    definitionAr: 'زيادة طول موجة الضوء من الأجسام البعيدة، مما يشير إلى أنها تبتعد',
    category: 'physics',
    categoryAr: 'فيزياء'
  },
  {
    term: 'Nebula',
    termAr: 'سديم',
    definition: 'A cloud of gas and dust in space, where stars are born',
    definitionAr: 'سحابة من الغاز والغبار في الفضاء، حيث تولد النجوم',
    category: 'cosmic-objects',
    categoryAr: 'أجسام كونية'
  },
  {
    term: 'Exoplanet',
    termAr: 'كوكب خارجي',
    definition: 'A planet that orbits a star outside our solar system',
    definitionAr: 'كوكب يدور حول نجم خارج نظامنا الشمسي',
    category: 'planets',
    categoryAr: 'كواكب'
  },
  {
    term: 'Black Hole',
    termAr: 'ثقب أسود',
    definition: 'A region of space where gravity is so strong that nothing can escape',
    definitionAr: 'منطقة في الفضاء حيث الجاذبية قوية جداً لدرجة أن لا شيء يمكنه الهروب',
    category: 'cosmic-objects',
    categoryAr: 'أجسام كونية'
  },
  {
    term: 'Event Horizon',
    termAr: 'أفق الحدث',
    definition: 'The boundary around a black hole beyond which nothing can escape',
    definitionAr: 'الحدود حول الثقب الأسود التي بعدها لا شيء يمكنه الهروب',
    category: 'cosmic-objects',
    categoryAr: 'أجسام كونية'
  },
  {
    term: 'Supernova',
    termAr: 'مستعر أعظم',
    definition: 'The explosive death of a massive star',
    definitionAr: 'الموت الانفجاري لنجم ضخم',
    category: 'stars',
    categoryAr: 'نجوم'
  },
  {
    term: 'Galaxy',
    termAr: 'مجرة',
    definition: 'A massive system of stars, gas, dust, and dark matter held together by gravity',
    definitionAr: 'نظام ضخم من النجوم والغاز والغبار والمادة المظلمة متماسك بالجاذبية',
    category: 'cosmic-objects',
    categoryAr: 'أجسام كونية'
  },
  {
    term: 'Asteroid',
    termAr: 'كويكب',
    definition: 'A rocky object orbiting the Sun, smaller than a planet',
    definitionAr: 'جسم صخري يدور حول الشمس، أصغر من الكوكب',
    category: 'solar-system',
    categoryAr: 'نظام شمسي'
  },
  {
    term: 'Comet',
    termAr: 'مذنب',
    definition: 'An icy body that releases gas and dust, forming a tail when near the Sun',
    definitionAr: 'جسم جليدي يطلق الغاز والغبار، مكوناً ذيلاً عند اقترابه من الشمس',
    category: 'solar-system',
    categoryAr: 'نظام شمسي'
  },
  {
    term: 'Orbit',
    termAr: 'مدار',
    definition: 'The path an object takes around another object due to gravity',
    definitionAr: 'المسار الذي يسلكه جسم حول جسم آخر بسبب الجاذبية',
    category: 'physics',
    categoryAr: 'فيزياء'
  },
  {
    term: 'Solar System',
    termAr: 'نظام شمسي',
    definition: 'The Sun and all objects that orbit it, including planets, moons, asteroids, and comets',
    definitionAr: 'الشمس وجميع الأجسام التي تدور حولها، بما في ذلك الكواكب والأقمار والكويكبات والمذنبات',
    category: 'solar-system',
    categoryAr: 'نظام شمسي'
  },
  {
    term: 'Cosmic Microwave Background',
    termAr: 'إشعاع الخلفية الكوني',
    definition: 'The leftover radiation from the Big Bang, visible as microwave light',
    definitionAr: 'الإشعاع المتبقي من الانفجار العظيم، مرئي كضوء ميكروويف',
    category: 'cosmology',
    categoryAr: 'علم الكونيات'
  },
  {
    term: 'Dark Matter',
    termAr: 'مادة مظلمة',
    definition: 'Invisible matter that makes up about 27% of the universe',
    definitionAr: 'مادة غير مرئية تشكل حوالي 27% من الكون',
    category: 'cosmology',
    categoryAr: 'علم الكونيات'
  },
  {
    term: 'Dark Energy',
    termAr: 'طاقة مظلمة',
    definition: 'A mysterious force causing the universe to expand faster',
    definitionAr: 'قوة غامضة تسبب توسع الكون بشكل أسرع',
    category: 'cosmology',
    categoryAr: 'علم الكونيات'
  }
]

const categories = [
  { id: 'all', name: 'All', nameEn: 'All' },
  { id: 'distance', name: 'Distance', nameEn: 'Distance' },
  { id: 'physics', name: 'Physics', nameEn: 'Physics' },
  { id: 'cosmic-objects', name: 'Cosmic Objects', nameEn: 'Cosmic Objects' },
  { id: 'planets', name: 'Planets', nameEn: 'Planets' },
  { id: 'stars', name: 'Stars', nameEn: 'Stars' },
  { id: 'solar-system', name: 'Solar System', nameEn: 'Solar System' },
  { id: 'cosmology', name: 'Cosmology', nameEn: 'Cosmology' }
]

export default function Glossary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null)

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory
    const matchesSearch = 
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.termAr.includes(searchTerm) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definitionAr.includes(searchTerm)
    return matchesCategory && matchesSearch
  })

  const relatedIdForTerm = (term: GlossaryTerm) => `term-${slugify(term.term || term.termAr)}`

  return (
    <div className="min-h-screen pt-20 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient portal-title">
            Quick Glossary
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Space terms with simple and clear explanations
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a term..."
              className="w-full px-6 py-4 glass rounded-xl border-2 border-purple-500/30 focus:border-purple-500/50 outline-none text-white placeholder-gray-400"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'glass border border-purple-500/30 text-gray-300 hover:border-purple-500/50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map((term) => (
            <div
              key={term.term}
              onClick={() => setSelectedTerm(term)}
              className="glass rounded-2xl p-6 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-bold text-gradient">{term.term}</h3>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                  {categories.find(c => c.id === term.category)?.name || term.category}
                </span>
              </div>
              <p className="text-gray-400 text-sm line-clamp-3">{term.definition}</p>
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No terms found</p>
          </div>
        )}

        {/* Modal */}
        {selectedTerm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedTerm(null)}
          >
            <div
              className="glass rounded-3xl p-8 max-w-2xl w-full border-2 border-purple-500/50 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-bold text-gradient mb-2">{selectedTerm.term}</h2>
                </div>
                <button
                  onClick={() => setSelectedTerm(null)}
                  className="text-3xl text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-purple-400 font-semibold mb-2">Definition</div>
                  <p className="text-gray-300 text-lg">{selectedTerm.definition}</p>
                </div>
                <div>
                  <div className="text-purple-400 font-semibold mb-2">Category</div>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded">
                    {categories.find(c => c.id === selectedTerm.category)?.name || selectedTerm.category}
                  </span>
                </div>
                <RelatedContent
                  id={relatedIdForTerm(selectedTerm)}
                  type="term"
                  title="Related content"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


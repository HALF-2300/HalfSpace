import React from 'react'
import Link from 'next/link'
import SimplePageLayout from '@/components/SimplePageLayout'

export const metadata = {
  title: 'Explorar el espacio: guía completa | HalfSPACE',
  description: 'Guía completa sobre el espacio: descubrimientos, estrellas lejanas, búsqueda de vida, fenómenos cósmicos y más.',
}

// All Spanish routes live under /es; keep navigation in Spanish
const es = (path: string) => path.startsWith('/es') ? path : `/es${path === '/' ? '' : path}`

const spaceTopicsEs = [
  {
    category: 'La búsqueda de vida',
    icon: '🔬',
    color: 'from-green-900/30 to-blue-900/30',
    borderColor: 'border-green-500/20',
    topics: [
      { name: 'Astrobiología', url: '/astrobiology', icon: '🦠', description: 'La búsqueda de vida más allá de la Tierra' },
      { name: 'Exoplanetas', url: '/exoplanets', icon: '🪐', description: 'Más de 5.000 planetas alrededor de estrellas lejanas' },
      { name: 'Mundos habitables', url: '/exoplanets#habitable', icon: '🌍', description: 'Planetas que podrían albergar vida' },
      { name: 'Extremófilos', url: '/astrobiology#extremophiles', icon: '🦠', description: 'Vida en condiciones extremas' },
    ],
  },
  {
    category: 'Estrellas y objetos estelares',
    icon: '✨',
    color: 'from-yellow-900/30 to-orange-900/30',
    borderColor: 'border-yellow-500/20',
    topics: [
      { name: 'Estrellas lejanas', url: '/distant-stars', icon: '⭐', description: 'De los vecinos más cercanos a faros del cosmos' },
      { name: 'Tipos de estrellas', url: '/stars', icon: '💫', description: 'De enanas rojas a supergigantes' },
      { name: 'Guarderías estelares', url: '/nebulae', icon: '🌫️', description: 'Donde nacen las estrellas' },
      { name: 'Supernovas', url: '/supernovae', icon: '💥', description: 'Muertes estelares explosivas' },
      { name: 'Estrellas de neutrones y púlsares', url: '/pulsars', icon: '📡', description: 'Restos estelares ultradensos' },
      { name: 'Enanas blancas', url: '/white-dwarfs', icon: '⚪', description: 'Etapas finales de las estrellas' },
    ],
  },
  {
    category: 'Fenómenos cósmicos',
    icon: '💫',
    color: 'from-purple-900/30 to-pink-900/30',
    borderColor: 'border-purple-500/20',
    topics: [
      { name: 'Agujeros negros', url: '/black-holes', icon: '⚫', description: 'Donde la gravedad lo gobierna todo' },
      { name: 'Ondas gravitacionales', url: '/gravitational-waves', icon: '〰️', description: 'Ondulaciones en el espacio-tiempo' },
      { name: 'Materia y energía oscuras', url: '/dark-matter', icon: '🌑', description: 'Los componentes ocultos del universo' },
      { name: 'Nebulosas', url: '/nebulae', icon: '🌫️', description: 'Nubes cósmicas asombrosas' },
      { name: 'Cuásares', url: '/quasars', icon: '✨', description: 'Los objetos más brillantes del universo' },
    ],
  },
  {
    category: 'Nuestro sistema solar',
    icon: '☀️',
    color: 'from-blue-900/30 to-cyan-900/30',
    borderColor: 'border-blue-500/20',
    topics: [
      { name: 'Visión general del sistema solar', url: '/solar-system', icon: '🪐', description: 'Nuestro vecindario cósmico' },
      { name: 'Planetas', url: '/planets', icon: '🌍', description: 'Ocho mundos, infinitas maravillas' },
      { name: 'Asteroides y cometas', url: '/asteroids', icon: '☄️', description: 'Cuerpos pequeños, gran importancia' },
      { name: 'El Sol', url: '/sun', icon: '☀️', description: 'Nuestra estrella y dador de vida' },
      { name: 'Clima espacial', url: '/space-weather', icon: '🌤️', description: 'Tormentas solares y sus efectos' },
    ],
  },
  {
    category: 'Cosmología y universo',
    icon: '🌌',
    color: 'from-indigo-900/30 to-purple-900/30',
    borderColor: 'border-indigo-500/20',
    topics: [
      { name: 'Cosmología', url: '/cosmology', icon: '🌐', description: 'Origen y destino del universo' },
      { name: 'Big Bang', url: '/big-bang', icon: '💥', description: 'Cómo empezó todo' },
      { name: 'Estructura del universo', url: '/universe-structure', icon: '🕸️', description: 'La red cósmica' },
      { name: 'Multiverso', url: '/multiverse', icon: '🎭', description: 'Más allá de nuestro universo' },
      { name: 'Relatividad', url: '/relativity', icon: '⚛️', description: 'El espacio-tiempo de Einstein' },
    ],
  },
  {
    category: 'Exploración espacial',
    icon: '🚀',
    color: 'from-red-900/30 to-orange-900/30',
    borderColor: 'border-red-500/20',
    topics: [
      { name: 'Historia de la exploración espacial', url: '/space-history', icon: '📜', description: 'Del Sputnik a Marte' },
      { name: 'Misiones', url: '/missions', icon: '🚀', description: 'Las mayores misiones espaciales' },
      { name: 'Estaciones espaciales', url: '/space-stations', icon: '🛰️', description: 'Laboratorios orbitales' },
      { name: 'Telescopios', url: '/telescopes', icon: '🔭', description: 'Nuestras ventanas al cosmos' },
      { name: 'Misiones futuras', url: '/future-missions', icon: '🛸', description: 'Lo que nos espera' },
    ],
  },
  {
    category: 'Galaxias y más allá',
    icon: '🌌',
    color: 'from-pink-900/30 to-purple-900/30',
    borderColor: 'border-pink-500/20',
    topics: [
      { name: 'Galaxias', url: '/galaxies', icon: '🌌', description: 'Islas de estrellas' },
      { name: 'Vía Láctea', url: '/galaxy-map', icon: '🌀', description: 'Nuestra galaxia madre' },
      { name: 'Medio interestelar', url: '/interstellar-medium', icon: '🌌', description: 'Lo que hay entre las estrellas' },
    ],
  },
]

export default function ExplorePageEs() {
  return (
    <SimplePageLayout
      title="Explorar el espacio: guía completa"
      subtitle="Todo lo que necesitas saber sobre el cosmos — desde nuestro sistema solar hasta el borde del universo observable"
    >
      <div className="space-y-12">
        <section className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20">
          <div className="text-6xl mb-4">🌌</div>
          <h2 className="text-3xl font-bold mb-4">Tu enciclopedia espacial completa</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Sumérgete en el cosmos con información detallada sobre descubrimientos, estrellas lejanas,
            la búsqueda de vida, fenómenos cósmicos, exploración espacial y todo lo demás. Desde exoplanetas
            potencialmente habitables hasta los misterios de los agujeros negros, desde nuestras estrellas
            más cercanas hasta el borde del universo observable.
          </p>
        </section>

        <section>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">5.000+</div>
              <div className="text-gray-400">Exoplanetas descubiertos</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 backdrop-blur-sm rounded-lg p-6 border border-green-500/20 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">200+</div>
              <div className="text-gray-400">Lunas en el sistema solar</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm rounded-lg p-6 border border-orange-500/20 text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">13.800 millones</div>
              <div className="text-gray-400">Años del universo</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">2 billones</div>
              <div className="text-gray-400">Galaxias</div>
            </div>
          </div>
        </section>

        {spaceTopicsEs.map((section, index) => (
          <section key={index}>
            <div className={`bg-gradient-to-r ${section.color} backdrop-blur-sm rounded-lg p-6 border ${section.borderColor} mb-6`}>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-4xl">{section.icon}</span>
                <span>{section.category}</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.topics.map((topic, topicIndex) => (
                <Link
                  key={topicIndex}
                  href={es(topic.url)}
                  className="group bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{topic.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-gray-400">{topic.description}</p>
                    </div>
                    <div className="text-white/50 group-hover:text-white transition-colors">→</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>🌟</span>
            <span>Temas imprescindibles</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href={es('/astrobiology')} className="group bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-8 border border-green-500/20 hover:border-green-500/40 transition-all">
              <div className="text-5xl mb-4">🦠</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-green-400 transition-colors">¿Estamos solos?</h3>
              <p className="text-gray-300">
                Explora la búsqueda de vida más allá de la Tierra — desde microbios en Marte hasta civilizaciones
                inteligentes en sistemas estelares lejanos. Conoce las biofirmas, los extremófilos y la ecuación de Drake.
              </p>
            </Link>
            <Link href={es('/exoplanets')} className="group bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="text-5xl mb-4">🪐</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">Mundos más allá de nuestro sistema solar</h3>
              <p className="text-gray-300">
                Descubre más de 5.000 exoplanetas, incluidos mundos potencialmente habitables como Próxima b y TRAPPIST-1e,
                y planetas extraños donde llueve vidrio o piedras preciosas.
              </p>
            </Link>
            <Link href={es('/distant-stars')} className="group bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm rounded-lg p-8 border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors">De las estrellas más cercanas a gigantes cósmicos</h3>
              <p className="text-gray-300">
                Viaja desde Próxima Centauri (a 4,2 años luz) hasta las estrellas más luminosas, grandes y antiguas del universo.
                Conoce Betelgeuse, VY Canis Majoris y más.
              </p>
            </Link>
            <Link href="/es/black-holes" className="group bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="text-5xl mb-4">💫</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">Los eventos más extremos del universo</h3>
              <p className="text-gray-300">
                Estallidos de rayos gamma más brillantes que galaxias enteras, misteriosas ráfagas rápidas de radio,
                ondas gravitacionales de agujeros negros en colisión y más fenómenos cósmicos extremos.
              </p>
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20 text-center">
          <h2 className="text-3xl font-bold mb-4">Comienza tu viaje cósmico</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
            Ya sea que te interese la vida en otros mundos, los agujeros negros o el origen y destino del universo,
            tenemos información completa y actualizada sobre cada tema espacial.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={es('/astrobiology')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">Búsqueda de vida</Link>
            <Link href={es('/exoplanets')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">Explorar exoplanetas</Link>
            <Link href={es('/distant-stars')} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">Descubrir estrellas</Link>
            <Link href="/es/cosmology" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">Orígenes del universo</Link>
          </div>
        </section>
      </div>
    </SimplePageLayout>
  )
}

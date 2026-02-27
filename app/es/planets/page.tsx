import PageTemplate from '@/components-ar/PageTemplate'

export default function PlanetsPageEs() {
  return (
    <PageTemplate
      title="Planetas"
      subtitle="Mundos de maravillas"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Planetas"
      didYouKnow={[
        "¡Júpiter es tan grande que todos los demás planetas del sistema solar cabrían dentro!",
        "Venus gira al revés — ¡un día en Venus es más largo que su año!",
        "La densidad de Saturno es tan baja que flotaría si encontraras un océano lo bastante grande.",
        "Neptuno tiene vientos de hasta 2.100 km/h (1.300 mph) — ¡los más rápidos del sistema solar!",
      ]}
      sections={[
        {
          title: "Planetas terrestres",
          content: (
            <div className="space-y-4">
              <p>Los cuatro planetas interiores — Mercurio, Venus, Tierra y Marte — se llaman planetas terrestres porque tienen superficies sólidas y rocosas. Son relativamente pequeños y densos, con núcleos metálicos y cortezas de silicatos.</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Mercurio:</strong> el planeta más pequeño, el más cercano al Sol, con temperaturas extremas de 427 °C a -173 °C</li>
                <li><strong className="text-white">Venus:</strong> el más caliente, con una atmósfera densa y tóxica y una presión superficial 92 veces la de la Tierra</li>
                <li><strong className="text-white">Tierra:</strong> el único planeta con vida conocida, con agua líquida y atmósfera protectora</li>
                <li><strong className="text-white">Marte:</strong> el planeta rojo, con indicios de agua antigua y posible exploración humana futura</li>
              </ul>
            </div>
          ),
          image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800",
          imageAlt: "Planetas terrestres"
        },
        {
          title: "Gigantes gaseosos",
          content: (
            <div className="space-y-4">
              <p>Júpiter y Saturno son gigantes gaseosos, planetas enormes compuestos sobre todo de hidrógeno y helio. No tienen superficie sólida y tienen atmósferas profundas con nubes turbulentas y tormentas.</p>
              <p>Júpiter es el planeta más grande de nuestro sistema solar, con la Gran Mancha Roja — una tormenta más grande que la Tierra que lleva siglos activa. Saturno es famoso por sus espectaculares anillos, formados por partículas de hielo y roca que orbitan el planeta.</p>
            </div>
          ),
          image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800",
          imageAlt: "Gigantes gaseosos"
        },
        {
          title: "Gigantes de hielo",
          content: (
            <div className="space-y-4">
              <p>Urano y Neptuno son gigantes de hielo, formados sobre todo por agua, metano y amoníaco helados alrededor de un núcleo rocoso. Estos planetas lejanos tienen atmósferas profundas y frías y propiedades únicas.</p>
              <p>Urano gira de lado, probablemente por un gran impacto en el pasado. Neptuno tiene los vientos más rápidos del sistema solar, hasta 2.100 km/h (1.300 mph). Ambos tienen sistemas de anillos tenues y muchas lunas.</p>
            </div>
          ),
        },
        {
          title: "Características de los planetas",
          content: "Cada planeta tiene rasgos únicos: atmósferas, campos magnéticos, lunas y actividad geológica. Algunos tienen anillos, otros patrones climáticos extremos, y algunos podrían tener océanos bajo la superficie. Entender estos mundos diversos nos ayuda a aprender sobre la formación planetaria y la posibilidad de vida en otros lugares del universo.",
        }
      ]}
      facts={[
        { fact: "Júpiter tiene 95 lunas conocidas", icon: "🪐" },
        { fact: "Los anillos de Saturno tienen solo 10 metros de grosor", icon: "💍" },
        { fact: "Venus es más caliente que Mercurio aunque está más lejos del Sol", icon: "🔥" },
        { fact: "Marte tiene el volcán más grande del sistema solar: Olympus Mons", icon: "🌋" },
      ]}
      quiz={[
        {
          question: "¿Qué planeta se conoce como 'el planeta rojo'?",
          options: ["Venus", "Marte", "Júpiter", "Saturno"],
          correct: 1,
          explanation: "Marte se llama el planeta rojo por el óxido de hierro (herrumbre) en su superficie, que le da su aspecto rojizo."
        },
        {
          question: "¿Cuál es el planeta más grande de nuestro sistema solar?",
          options: ["Saturno", "Júpiter", "Neptuno", "Urano"],
          correct: 1,
          explanation: "Júpiter es el más grande, con más masa que el resto de planetas juntos."
        },
        {
          question: "¿Qué planeta gira de lado?",
          options: ["Neptuno", "Urano", "Saturno", "Venus"],
          correct: 1,
          explanation: "Urano gira de lado con una inclinación de 98°, probablemente por un gran impacto en el pasado."
        }
      ]}
      relatedLinks={[
        { name: "Sistema solar", href: "/es/solar-system" },
        { name: "Marte", href: "/es/mars" },
        { name: "Júpiter", href: "/es/jupiter" },
        { name: "Saturno", href: "/es/saturn" },
        { name: "La Luna", href: "/es/moon" }
      ]}
    />
  )
}

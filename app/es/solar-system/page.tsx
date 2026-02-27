import PageTemplate from '@/components/PageTemplate'

export default function SolarSystemPageEs() {
  return (
    <PageTemplate
      title="Sistema solar"
      subtitle="Nuestro vecindario cósmico"
      heroImage="https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg"
      heroImageAlt="Sistema solar"
      didYouKnow={[
        "El sistema solar tiene unos 4.600 millones de años y se formó a partir del colapso de una nube de gas y polvo.",
        "Si el Sol tuviera el tamaño de una pelota de playa, la Tierra sería como un guisante situado a más de 30 metros.",
        "El sistema solar viaja por la galaxia a unos 515.000 km/h mientras orbita el centro de la Vía Láctea.",
        "Entre la Tierra y la Luna cabrían alineados todos los planetas, ¡con espacio de sobra! La Luna está realmente lejos.",
      ]}
      sections={[
        {
          title: "Visión general",
          tagline: "Una danza cósmica de planetas, lunas y asteroides alrededor de nuestra estrella",
          content:
            "El sistema solar es el conjunto formado por el Sol y todos los objetos que orbitan a su alrededor. Se formó hace unos 4.600 millones de años a partir del colapso gravitatorio de una gran nube molecular. Casi toda la masa del sistema se concentra en el Sol; la mayor parte del resto está en Júpiter. Los cuatro planetas interiores son rocosos, mientras que los cuatro exteriores son gigantes gaseosos o de hielo.",
          image: "https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg",
          imageAlt: "Esquema del sistema solar",
          quickFacts: [
            { label: "Edad", value: "4.600 millones de años", icon: "⏰" },
            { label: "Velocidad en la galaxia", value: "≈ 515.000 km/h", icon: "🌌" },
            { label: "Estrella más cercana", value: "Próxima Centauri (4,24 años luz)", icon: "⭐" },
          ],
          cta: {
            text: "Explorar todos los planetas",
            href: "/es/planets",
            style: "primary",
          },
        },
        {
          title: "El Sol",
          tagline: "El corazón del sistema solar, fuente de toda nuestra energía",
          content:
            "En el centro del sistema solar se encuentra el Sol, una estrella de tipo G que contiene el 99,86% de la masa del sistema. Su inmensa gravedad mantiene a los planetas, asteroides y cometas en órbita. Es un enorme reactor de fusión nuclear que convierte hidrógeno en helio y libera cantidades colosales de energía. Cada segundo, el Sol fusiona unos 600 millones de toneladas de hidrógeno.",
          image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg",
          imageAlt: "El Sol",
          quickFacts: [
            { label: "Temperatura superficial", value: "≈ 5.500 °C", icon: "🔥" },
            { label: "Temperatura del núcleo", value: "≈ 15 millones °C", icon: "☀️" },
            { label: "Luz hasta la Tierra", value: "8 minutos y 20 segundos", icon: "⚡" },
            { label: "Masa", value: "330.000 veces la de la Tierra", icon: "🌍" },
          ],
          cta: {
            text: "Descubrir el Sol",
            href: "/es/sun",
            style: "primary",
          },
        },
        {
          title: "Los ocho planetas",
          tagline: "Ocho mundos, cada uno con su propia historia",
          content: (
            <div className="space-y-4">
              <p>
                El sistema solar contiene ocho planetas: cuatro rocosos (Mercurio, Venus, Tierra y Marte) y cuatro gigantes
                (Júpiter, Saturno, Urano y Neptuno).
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>
                  <strong className="text-white">Mercurio:</strong> el más cercano al Sol, con enormes variaciones de temperatura.
                </li>
                <li>
                  <strong className="text-white">Venus:</strong> el planeta más caliente, con una atmósfera densa y tóxica.
                </li>
                <li>
                  <strong className="text-white">Tierra:</strong> el único planeta conocido con vida.
                </li>
                <li>
                  <strong className="text-white">Marte:</strong> el “planeta rojo”, objetivo principal de la futura exploración humana.
                </li>
                <li>
                  <strong className="text-white">Júpiter:</strong> el planeta más grande, con la Gran Mancha Roja.
                </li>
                <li>
                  <strong className="text-white">Saturno:</strong> famoso por su espectacular sistema de anillos.
                </li>
                <li>
                  <strong className="text-white">Urano:</strong> gira prácticamente tumbado sobre su costado.
                </li>
                <li>
                  <strong className="text-white">Neptuno:</strong> alberga los vientos más rápidos del sistema solar.
                </li>
              </ul>
            </div>
          ),
          image: "https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg",
          imageAlt: "Los ocho planetas",
          quickFacts: [
            { label: "Más cercano al Sol", value: "Mercurio (≈ 58 millones km)", icon: "🪐" },
            { label: "Más lejano", value: "Neptuno (≈ 4.500 millones km)", icon: "🔵" },
            { label: "Planeta más grande", value: "Júpiter", icon: "🪐" },
            { label: "Planeta más pequeño", value: "Mercurio", icon: "🪐" },
          ],
          cta: {
            text: "Comparar planetas",
            href: "/es/planet-comparison",
            style: "secondary",
          },
        },
        {
          title: "Planetas enanos y pequeños cuerpos",
          tagline: "El reino de los mundos diminutos con grandes secretos",
          content:
            "Más allá de Neptuno se extiende el Cinturón de Kuiper, hogar de planetas enanos como Plutón, Eris y Haumea. El sistema solar también contiene millones de asteroides, sobre todo en el cinturón principal entre Marte y Júpiter, y multitud de cometas que probablemente se originan en la Nube de Oort, una envoltura esférica de objetos helados que podría llegar hasta 100.000 unidades astronómicas del Sol.",
          quickFacts: [
            { label: "Asteroides en el cinturón principal", value: "≈ 1,9 millones", icon: "☄️" },
            { label: "Distancia de la Nube de Oort", value: "hasta 100.000 UA", icon: "🌌" },
            { label: "Planetas enanos confirmados", value: "5 o más", icon: "🪐" },
          ],
          cta: {
            text: "Explorar asteroides y cometas",
            href: "/es/asteroids",
            style: "primary",
          },
        },
      ]}
      facts={[
        { fact: "El sistema solar tiene alrededor de 4.600 millones de años.", icon: "⏰" },
        { fact: "La luz del Sol tarda unos 8 minutos en llegar a la Tierra.", icon: "☀️" },
        { fact: "Júpiter ayuda a proteger a los planetas interiores desviando muchos asteroides.", icon: "🛡️" },
        { fact: "La Nube de Oort se extiende casi hasta la mitad del camino hacia la estrella más cercana.", icon: "☁️" },
      ]}
      quiz={[
        {
          question: "¿Qué porcentaje de la masa del sistema solar contiene el Sol?",
          options: ["50%", "75%", "99,86%", "85%"],
          correct: 2,
          explanation:
            "El Sol contiene el 99,86% de la masa total del sistema solar; todos los demás objetos juntos suman solo el 0,14%.",
        },
        {
          question: "¿Cuántos planetas tiene nuestro sistema solar?",
          options: ["7", "8", "9", "10"],
          correct: 1,
          explanation:
            "Hay 8 planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Plutón se reclasificó como planeta enano en 2006.",
        },
        {
          question: "¿De dónde proceden la mayoría de los cometas de periodo largo?",
          options: ["Cinturón de asteroides", "Cinturón de Kuiper", "Nube de Oort", "Entre Marte y Júpiter"],
          correct: 2,
          explanation:
            "Se cree que la mayoría de los cometas de periodo largo se originan en la Nube de Oort, una lejana reserva de cuerpos helados.",
        },
      ]}
      relatedLinks={[
        { name: "Planetas", href: "/es/planets" },
        { name: "Marte", href: "/es/mars" },
        { name: "Júpiter", href: "/es/jupiter" },
        { name: "Asteroides", href: "/es/asteroids" },
        { name: "Cometas", href: "/es/comets" },
      ]}
      showTodayInSpace={true}
      showIconicMissions={true}
      galleryCategory="solar-system"
      galleryViewMoreHref="/es/historical-images"
    />
  )
}


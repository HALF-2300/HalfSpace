import PageTemplate from '@/components/PageTemplate'

export default function BlackHolesPageEs() {
  return (
    <PageTemplate
      title="Agujeros negros"
      subtitle="El misterio cósmico definitivo"
      heroImage="https://images-assets.nasa.gov/image/PIA22914/PIA22914~orig.jpg"
      heroImageAlt="Agujero negro"
      didYouKnow={[
        "Si cayeras en un agujero negro, tu cuerpo se estiraría como un espagueti: a esto se le llama “espaguetificación”.",
        "La primera imagen de un agujero negro se obtuvo en 2019 gracias al Telescopio del Horizonte de Sucesos (EHT).",
        "Un agujero negro del tamaño de una moneda podría tener más masa que toda la Tierra.",
        "El tiempo se ralentiza cerca de un agujero negro debido a la gravedad extrema: este efecto se llama dilatación del tiempo.",
      ]}
      sections={[
        {
          title: "¿Qué es un agujero negro?",
          tagline: "Donde la física llega a sus límites y los misterios se profundizan",
          content:
            "Un agujero negro es una región del espacio-tiempo donde la gravedad es tan fuerte que nada, ni siquiera la luz, puede escapar una vez que cruza el horizonte de sucesos. Se forman cuando estrellas muy masivas colapsan al final de sus vidas, o a través de otros procesos extremos. Los agujeros negros son invisibles, pero podemos detectarlos por sus efectos gravitatorios sobre la materia y la luz cercanas. Representan uno de los entornos más extremos del universo.",
          image: "https://images-assets.nasa.gov/image/PIA22914/PIA22914~orig.jpg",
          imageAlt: "Visualización de un agujero negro",
          quickFacts: [
            { label: "Primera imagen", value: "2019 (M87*)", icon: "📸" },
            { label: "Velocidad de la luz", value: "299.792 km/s", icon: "⚡" },
            { label: "Más grande conocido", value: "≈ 66.000 millones de soles", icon: "🌌" },
          ],
          cta: {
            text: "Explorar cosmología",
            href: "/es/cosmology",
            style: "primary",
          },
        },
        {
          title: "Tipos de agujeros negros",
          tagline: "De restos estelares a gigantes cósmicos en los centros de galaxias",
          content: (
            <div className="space-y-4">
              <p>Los agujeros negros vienen en distintos tamaños:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>
                  <strong className="text-white">Agujeros negros estelares:</strong>
                  se forman a partir del colapso de estrellas masivas y suelen tener entre 3 y 20 veces la masa del Sol.
                </li>
                <li>
                  <strong className="text-white">Agujeros negros de masa intermedia:</strong>
                  van desde cientos hasta cientos de miles de masas solares; su origen aún se estudia y podrían formarse por fusiones de agujeros negros estelares.
                </li>
                <li>
                  <strong className="text-white">Agujeros negros supermasivos:</strong>
                  se encuentran en el centro de las galaxias y contienen millones o miles de millones de masas solares. Sagitario A*, en el centro de la Vía Láctea, tiene unas 4 millones de masas solares.
                </li>
              </ul>
            </div>
          ),
          image: "https://images-assets.nasa.gov/image/PIA16695/PIA16695~orig.jpg",
          imageAlt: "Tipos de agujeros negros",
          quickFacts: [
            { label: "Masa estelar típica", value: "3–20 soles", icon: "⭐" },
            { label: "Centro de la Vía Láctea", value: "≈ 4 millones de soles", icon: "🌌" },
            { label: "Temperatura", value: "Casi cero absoluto", icon: "❄️" },
          ],
          cta: {
            text: "Descubrir galaxias",
            href: "/es/galaxies",
            style: "secondary",
          },
        },
        {
          title: "Horizonte de sucesos y singularidad",
          tagline: "El punto de no retorno donde la realidad se deforma por completo",
          content:
            "El horizonte de sucesos es la frontera alrededor de un agujero negro a partir de la cual nada puede escapar. Una vez que la materia cruza este límite, cae inevitablemente hacia la singularidad: un punto de densidad aparentemente infinita en el centro del agujero negro, donde nuestras teorías actuales de física dejan de funcionar. El tamaño del horizonte depende de la masa del agujero negro; para uno estelar puede ser de solo unos pocos kilómetros de ancho.",
          image: "https://images-assets.nasa.gov/image/PIA16695/PIA16695~orig.jpg",
          imageAlt: "Horizonte de sucesos",
          quickFacts: [
            { label: "Tamaño del horizonte", value: "3–30 km (estelar)", icon: "⚫" },
            { label: "Fuerza de la gravedad", value: "Prácticamente infinita en el centro", icon: "🌀" },
            { label: "Dilatación del tiempo", value: "Extrema cerca del horizonte", icon: "⏰" },
          ],
        },
        {
          title: "¿Cómo observamos los agujeros negros?",
          tagline: "Ver lo invisible gracias a la ciencia y la tecnología",
          content:
            "Detectamos agujeros negros a través de sus efectos sobre la materia que los rodea. Cuando el gas y el polvo caen hacia un agujero negro, forman un disco de acreción que se calienta y emite rayos X y otras formas de radiación. El Telescopio del Horizonte de Sucesos captó en 2019 la primera imagen de la “sombra” de un agujero negro, en el centro de la galaxia M87. Además, los detectores de ondas gravitacionales han observado fusiones de agujeros negros.",
          quickFacts: [
            { label: "Resolución del EHT", value: "Ver una naranja en la Luna", icon: "🔭" },
            { label: "Temperatura del disco", value: "Millones de grados", icon: "🔥" },
            { label: "Ondas gravitacionales", value: "Ondas en el espacio-tiempo", icon: "🌊" },
          ],
          cta: {
            text: "Explorar telescopios",
            href: "/es/telescopes",
            style: "primary",
          },
        },
      ]}
      facts={[
        { fact: "La primera imagen de un agujero negro se publicó en 2019.", icon: "📸" },
        { fact: "Los agujeros negros pueden girar casi a la velocidad de la luz.", icon: "🌀" },
        { fact: "La radiación de Hawking hace que los agujeros negros se evaporen muy lentamente.", icon: "☢️" },
        { fact: "La mayoría de las galaxias albergan un agujero negro supermasivo en su centro.", icon: "🌌" },
      ]}
      quiz={[
        {
          question: "¿Cómo se llama la frontera alrededor de un agujero negro de la que nada puede escapar?",
          options: ["Singularidad", "Horizonte de sucesos", "Disco de acreción", "Esfera de fotones"],
          correct: 1,
          explanation:
            "El horizonte de sucesos es el límite a partir del cual ni siquiera la luz puede escapar de la gravedad del agujero negro.",
        },
        {
          question: "¿Qué le ocurre al tiempo cerca de un agujero negro?",
          options: ["Se acelera", "Se ralentiza", "Se detiene", "Retrocede"],
          correct: 1,
          explanation:
            "Cerca de un agujero negro la gravedad es tan intensa que el tiempo se ralentiza, tal y como predice la relatividad general.",
        },
      ]}
      relatedLinks={[
        { name: "Galaxias", href: "/es/galaxies" },
        { name: "Estrellas", href: "/es/stars" },
        { name: "Cosmología", href: "/es/cosmology" },
        { name: "Materia oscura", href: "/es/dark-matter" },
      ]}
      showTodayInSpace={true}
      galleryCategory="black-holes"
      galleryViewMoreHref="/es/historical-images"
    />
  )
}


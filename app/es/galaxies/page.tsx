import PageTemplate from '@/components/PageTemplate'

export default function GalaxiesPageEs() {
  return (
    <PageTemplate
      title="Galaxias"
      subtitle="Islas de estrellas en el cosmos"
      heroImage="https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg"
      heroImageAlt="Galaxia espiral"
      didYouKnow={[
        'Los astrónomos estiman que hay alrededor de 2 billones de galaxias en el universo observable.',
        'La Vía Láctea y la galaxia de Andrómeda colisionarán y se fusionarán dentro de unos 4.500 millones de años.',
        'Una galaxia puede contener desde unos pocos millones hasta cien billones de estrellas.',
        'La galaxia más grande conocida, IC 1101, es unas 50 veces más grande que la Vía Láctea.',
      ]}
      sections={[
        {
          title: '¿Qué es una galaxia?',
          tagline: 'Ciudades cósmicas formadas por estrellas, gas, polvo y materia oscura',
          content:
            'Una galaxia es un enorme sistema de estrellas, gas, polvo y materia oscura unido por la gravedad. Su tamaño varía desde galaxias enanas con unos pocos millones de estrellas hasta gigantes con billones de estrellas. Nuestra galaxia, la Vía Láctea, contiene entre 100.000 y 400.000 millones de estrellas y es solo una entre miles de millones de galaxias en el universo observable.',
          image: 'https://images-assets.nasa.gov/image/PIA21453/PIA21453~orig.jpg',
          imageAlt: 'Galaxia espiral',
        },
        {
          title: 'Tipos principales de galaxias',
          content: (
            <div className="space-y-4">
              <p>Según su forma, las galaxias se suelen clasificar en tres tipos básicos:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>
                  <strong className="text-white">Galaxias espirales:</strong>
                  poseen un disco en rotación con brazos espirales llenos de estrellas jóvenes, gas y polvo. La Vía Láctea es una galaxia espiral barrada.
                </li>
                <li>
                  <strong className="text-white">Galaxias elípticas:</strong>
                  tienen forma ovalada y apariencia suave; están compuestas sobre todo por estrellas viejas y apenas forman nuevas estrellas. Muchas de las galaxias más masivas son elípticas.
                </li>
                <li>
                  <strong className="text-white">Galaxias irregulares:</strong>
                  no presentan una forma definida; a menudo son el resultado de interacciones gravitatorias o colisiones con otras galaxias y contienen abundante gas para formar nuevas estrellas.
                </li>
              </ul>
            </div>
          ),
          image: 'https://images-assets.nasa.gov/image/PIA04226/PIA04226~orig.jpg',
          imageAlt: 'Diferentes tipos de galaxias',
        },
        {
          title: 'Nuestra casa: la Vía Láctea',
          content:
            'La Vía Láctea es una galaxia espiral barrada con un diámetro de unos 100.000 años luz. El sistema solar se encuentra en un brazo menor llamado Brazo de Orión (o Brazo Local), a unos 27.000 años luz del centro galáctico. En el centro reside un agujero negro supermasivo llamado Sagitario A*, con una masa de unos 4 millones de soles. El Sol tarda unos 225–250 millones de años en completar una órbita alrededor del centro galáctico: un “año cósmico”.',
          image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002200/GSFC_20171208_Archive_e002200~orig.jpg',
          imageAlt: 'Ilustración de la Vía Láctea',
        },
        {
          title: 'Formación y evolución de las galaxias',
          content:
            'Las galaxias se formaron a partir de pequeñas variaciones de densidad en el universo temprano, hace unos 13.800 millones de años. Con el tiempo, la gravedad hizo que estas regiones colapsaran y crecieran. A lo largo de miles de millones de años, las galaxias han evolucionado mediante fusiones, brotes de formación estelar e interacciones con su entorno. Estudiar la evolución de las galaxias nos ayuda a comprender la historia y el destino del universo.',
        },
      ]}
      facts={[
        { fact: 'La Vía Láctea contiene entre 100.000 y 400.000 millones de estrellas.', icon: '⭐' },
        { fact: 'Andrómeda es la galaxia espiral grande más cercana a nosotros.', icon: '🌌' },
        { fact: 'Las galaxias pueden colisionar y fusionarse a lo largo de miles de millones de años.', icon: '💥' },
        { fact: 'La materia oscura constituye la mayor parte de la masa de una galaxia.', icon: '🌑' },
      ]}
      quiz={[
        {
          question: '¿De qué tipo es la Vía Láctea?',
          options: ['Elíptica', 'Espiral', 'Irregular', 'Enana'],
          correct: 1,
          explanation:
            'La Vía Láctea es una galaxia espiral barrada, con brazos que salen de una estructura central en forma de barra.',
        },
        {
          question: '¿Cuántas galaxias se estima que hay en el universo observable?',
          options: ['100 millones', '1.000 millones', '2 billones', '10.000 millones'],
          correct: 2,
          explanation:
            'Las observaciones de campo profundo indican que podría haber alrededor de 2 billones de galaxias en el universo observable.',
        },
      ]}
      relatedLinks={[
        { name: 'Estrellas', href: '/es/stars' },
        { name: 'Agujeros negros', href: '/es/black-holes' },
        { name: 'Materia oscura', href: '/es/dark-matter' },
        { name: 'Cosmología', href: '/es/cosmology' },
      ]}
      showTodayInSpace={true}
      galleryCategory="stars"
      galleryViewMoreHref="/es/historical-images"
    />
  )
}



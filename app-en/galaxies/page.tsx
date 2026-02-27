import PageTemplate from '@/components/PageTemplate'

export default function GalaxiesPage() {
  return (
    <PageTemplate
      title="Galaxies"
      subtitle="Island Universes"
      heroImage="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920"
      heroImageAlt="Galaxy"
      didYouKnow={[
        "There are an estimated 2 trillion galaxies in the observable universe!",
        "The Milky Way and Andromeda galaxies will collide in about 4.5 billion years.",
        "Galaxies can contain anywhere from 10 million to 100 trillion stars.",
        "The largest known galaxy, IC 1101, is 50 times larger than the Milky Way!",
      ]}
      sections={[
        {
          title: "What Are Galaxies?",
          content: "Galaxies are vast collections of stars, gas, dust, and dark matter bound together by gravity. They range in size from dwarf galaxies with just a few million stars to giant galaxies with trillions of stars. Our Milky Way galaxy contains an estimated 100-400 billion stars and is just one of billions of galaxies in the observable universe. Galaxies are the largest gravitationally bound structures in the universe.",
          image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",
          imageAlt: "Spiral galaxy"
        },
        {
          title: "Types of Galaxies",
          content: (
            <div className="space-y-4">
              <p>Galaxies are classified into three main types based on their shape:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Spiral Galaxies:</strong> Characterized by rotating disks with spiral arms, containing young stars, gas, and dust. Our Milky Way is a spiral galaxy. They have a central bulge and rotating disk structure.</li>
                <li><strong className="text-white">Elliptical Galaxies:</strong> Smooth, oval-shaped galaxies with older stars and little gas or dust. They range from nearly spherical to highly elongated. Most massive galaxies are elliptical.</li>
                <li><strong className="text-white">Irregular Galaxies:</strong> Galaxies without a distinct shape, often the result of gravitational interactions or collisions with other galaxies. They contain lots of gas and dust for star formation.</li>
              </ul>
            </div>
          ),
          image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800",
          imageAlt: "Different galaxy types"
        },
        {
          title: "The Milky Way",
          content: "Our home galaxy, the Milky Way, is a barred spiral galaxy approximately 100,000 light-years in diameter. It contains our Solar System, which is located about 27,000 light-years from the galactic center in the Orion Arm. The Milky Way has a supermassive black hole at its center called Sagittarius A*, with a mass equivalent to about 4 million suns. It takes the Sun about 225-250 million years to complete one orbit around the galactic center.",
          image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800",
          imageAlt: "Milky Way"
        },
        {
          title: "Galaxy Formation and Evolution",
          content: "Galaxies formed from fluctuations in the density of matter in the early universe, about 13.8 billion years ago. Over billions of years, galaxies have evolved through mergers, star formation, and interactions with other galaxies. The study of galaxy evolution helps us understand the history and future of the universe. Galaxies continue to form stars, merge with other galaxies, and evolve over cosmic time.",
        }
      ]}
      facts={[
        { fact: "The Milky Way contains 100-400 billion stars", icon: "⭐" },
        { fact: "Andromeda is the nearest major galaxy to us", icon: "🌌" },
        { fact: "Galaxies can collide and merge over billions of years", icon: "💥" },
        { fact: "Dark matter makes up most of a galaxy's mass", icon: "🌑" },
      ]}
      quiz={[
        {
          question: "What type of galaxy is the Milky Way?",
          options: ["Elliptical", "Spiral", "Irregular", "Lenticular"],
          correct: 1,
          explanation: "The Milky Way is a barred spiral galaxy, with spiral arms extending from a central bar structure."
        },
        {
          question: "How many galaxies are estimated to exist in the observable universe?",
          options: ["100 million", "1 billion", "2 trillion", "10 billion"],
          correct: 2,
          explanation: "Astronomers estimate there are approximately 2 trillion galaxies in the observable universe."
        }
      ]}
      relatedLinks={[
        { name: "Stars", href: "/stars" },
        { name: "Black Holes", href: "/black-holes" },
        { name: "Dark Matter", href: "/dark-matter" },
        { name: "Cosmology", href: "/cosmology" }
      ]}
    />
  )
}


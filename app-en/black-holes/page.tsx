import PageTemplate from '@/components/PageTemplate'

export default function BlackHolesPage() {
  return (
    <PageTemplate
      title="Black Holes"
      subtitle="The Ultimate Cosmic Mystery"
      heroImage="https://images-assets.nasa.gov/image/PIA22914/PIA22914~orig.jpg"
      heroImageAlt="Black Hole"
      didYouKnow={[
        "If you fell into a black hole, you would be stretched into a long, thin strand - a process called 'spaghettification'!",
        "The first image of a black hole was captured in 2019 by the Event Horizon Telescope.",
        "A black hole the size of a coin would have more mass than Earth!",
        "Time slows down near a black hole due to extreme gravity - this is called time dilation.",
      ]}
      sections={[
        {
          title: "What Are Black Holes?",
          content: "Black holes are regions of spacetime where gravity is so strong that nothing, not even light, can escape once it crosses the event horizon. They form when massive stars collapse at the end of their lives, or through other extreme processes. Black holes are invisible because no light can escape them, but we can detect them through their gravitational effects on nearby matter and light. They represent one of the most extreme environments in the universe.",
          image: "https://images-assets.nasa.gov/image/PIA22914/PIA22914~orig.jpg",
          imageAlt: "Black hole visualization"
        },
        {
          title: "Types of Black Holes",
          content: (
            <div className="space-y-4">
              <p>Black holes come in different sizes:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Stellar Black Holes:</strong> Formed from collapsing massive stars, typically 3-20 times the mass of our Sun. These are the most common type.</li>
                <li><strong className="text-white">Intermediate Black Holes:</strong> Ranging from 100 to 100,000 solar masses, their formation is still being studied. They may form from merging stellar black holes.</li>
                <li><strong className="text-white">Supermassive Black Holes:</strong> Found at the centers of galaxies, containing millions to billions of solar masses. Sagittarius A* at the center of our Milky Way has about 4 million solar masses. These are thought to form early in galaxy formation.</li>
              </ul>
            </div>
          ),
          image: "https://images-assets.nasa.gov/image/PIA16695/PIA16695~orig.jpg",
          imageAlt: "Types of black holes"
        },
        {
          title: "Event Horizon and Singularity",
          content: "The event horizon is the boundary around a black hole beyond which nothing can escape. Once matter crosses this point, it's inevitably drawn toward the singularity—a point of infinite density at the center of the black hole where our understanding of physics breaks down. The size of the event horizon depends on the black hole's mass. For a stellar black hole, the event horizon might be just a few kilometers across.",
          image: "https://images-assets.nasa.gov/image/PIA16695/PIA16695~orig.jpg",
          imageAlt: "Event horizon"
        },
        {
          title: "Observing Black Holes",
          content: "We detect black holes through their effects on surrounding matter. When matter falls into a black hole, it forms an accretion disk that heats up and emits X-rays and other radiation. The Event Horizon Telescope captured the first direct image of a black hole's shadow in 2019, showing the supermassive black hole at the center of galaxy M87. Gravitational wave detectors have also detected black hole mergers.",
        }
      ]}
      facts={[
        { fact: "The first black hole image was captured in 2019", icon: "📸" },
        { fact: "Black holes can spin at nearly the speed of light", icon: "🌀" },
        { fact: "Hawking radiation causes black holes to slowly evaporate", icon: "☢️" },
        { fact: "Supermassive black holes exist at the center of most galaxies", icon: "🌌" },
      ]}
      quiz={[
        {
          question: "What is the boundary around a black hole called?",
          options: ["Singularity", "Event Horizon", "Accretion Disk", "Photon Sphere"],
          correct: 1,
          explanation: "The event horizon is the boundary beyond which nothing, not even light, can escape a black hole's gravity."
        },
        {
          question: "What happens to time near a black hole?",
          options: ["It speeds up", "It slows down", "It stops", "It reverses"],
          correct: 1,
          explanation: "Time slows down near a black hole due to extreme gravity - this is a prediction of Einstein's theory of general relativity."
        }
      ]}
      relatedLinks={[
        { name: "Galaxies", href: "/galaxies" },
        { name: "Stars", href: "/stars" },
        { name: "Cosmology", href: "/cosmology" },
        { name: "Dark Matter", href: "/dark-matter" }
      ]}
    />
  )
}


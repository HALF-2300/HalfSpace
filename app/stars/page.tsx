import PageTemplate from '@/components/PageTemplate'

export default function StarsPage() {
  return (
    <PageTemplate
      title="Stars"
      subtitle="The Cosmic Furnaces"
      heroImage="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920"
      heroImageAlt="Stars"
      didYouKnow={[
        "The nearest star to Earth (besides the Sun) is Proxima Centauri, 4.24 light-years away.",
        "A neutron star can spin 600 times per second - faster than a kitchen blender!",
        "The largest known star, UY Scuti, is 1,700 times larger than our Sun.",
        "Stars twinkle because Earth's atmosphere bends starlight as it passes through.",
      ]}
      sections={[
        {
          title: "What Are Stars?",
          tagline: "The cosmic furnaces that light up the universe",
          content: "Stars are massive, luminous spheres of plasma held together by gravity. They are the fundamental building blocks of galaxies and the source of light and energy in the universe. Our Sun is a star, and there are billions of other stars in our galaxy alone, each with its own unique characteristics and life cycle. Stars form from collapsing clouds of gas and dust, and their life cycles depend on their mass.",
          image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800",
          imageAlt: "Stars in the night sky",
          quickFacts: [
            { label: "Nearest star (after Sun)", value: "Proxima Centauri (4.24 ly)", icon: "⭐" },
            { label: "Stars in Milky Way", value: "100-400 billion", icon: "🌌" },
            { label: "Sun's surface temp", value: "5,500°C", icon: "☀️" }
          ],
          cta: {
            text: "Explore the Sun",
            href: "/sun",
            style: "primary"
          }
        },
        {
          title: "Star Formation",
          tagline: "Where cosmic dust becomes stellar fire",
          content: "Stars form from collapsing clouds of gas and dust called nebulae. When a region of a nebula becomes dense enough, gravity causes it to collapse. As the cloud collapses, it heats up and forms a protostar. When the core temperature reaches about 10 million degrees Celsius, nuclear fusion begins, and a star is born. This process can take millions of years. The mass of the collapsing cloud determines the star's size and type.",
          image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800",
          imageAlt: "Star formation",
          quickFacts: [
            { label: "Fusion ignition temp", value: "10 million°C", icon: "🔥" },
            { label: "Formation time", value: "Millions of years", icon: "⏰" },
            { label: "Nebula size", value: "Light-years across", icon: "☁️" }
          ],
          cta: {
            text: "Discover Nebulae",
            href: "/nebulae",
            style: "secondary"
          }
        },
        {
          title: "Star Classification",
          tagline: "The cosmic spectrum from blue giants to red dwarfs",
          content: (
            <div className="space-y-4">
              <p>Stars are classified by their temperature and brightness using the Morgan-Keenan system. The main sequence stars are categorized as:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">O-type:</strong> Hottest, bluest stars (30,000-50,000 K) - rare and short-lived</li>
                <li><strong className="text-white">B-type:</strong> Hot, blue-white stars (10,000-30,000 K)</li>
                <li><strong className="text-white">A-type:</strong> White stars (7,500-10,000 K)</li>
                <li><strong className="text-white">F-type:</strong> Yellow-white stars (6,000-7,500 K)</li>
                <li><strong className="text-white">G-type:</strong> Yellow stars like our Sun (5,200-6,000 K)</li>
                <li><strong className="text-white">K-type:</strong> Orange stars (3,700-5,200 K)</li>
                <li><strong className="text-white">M-type:</strong> Coolest, reddest stars (2,400-3,700 K) - most common type</li>
              </ul>
            </div>
          ),
          quickFacts: [
            { label: "Hottest stars (O-type)", value: "50,000°C", icon: "🔵" },
            { label: "Coolest stars (M-type)", value: "2,400°C", icon: "🔴" },
            { label: "Our Sun (G-type)", value: "5,500°C", icon: "☀️" }
          ]
        },
        {
          title: "Star Life Cycle",
          tagline: "From birth to death, the cosmic journey of stellar evolution",
          content: "A star's life cycle depends on its mass. Low-mass stars like red dwarfs can burn for trillions of years. Medium-mass stars like our Sun live for billions of years, eventually becoming red giants and then white dwarfs. High-mass stars live fast and die young, ending their lives in spectacular supernova explosions that can form neutron stars or black holes. The death of massive stars enriches the universe with heavy elements.",
          quickFacts: [
            { label: "Red dwarf lifespan", value: "Trillions of years", icon: "🔴" },
            { label: "Sun's lifespan", value: "10 billion years", icon: "☀️" },
            { label: "Supernova explosion", value: "Brighter than galaxies", icon: "💥" }
          ],
          cta: {
            text: "Learn About Supernovae",
            href: "/supernovae",
            style: "primary"
          }
        }
      ]}
      facts={[
        { fact: "Our Sun is a medium-sized G-type star", icon: "☀️" },
        { fact: "Red dwarfs can live for trillions of years", icon: "🔴" },
        { fact: "Supernovae can outshine entire galaxies", icon: "💥" },
        { fact: "White dwarfs are Earth-sized but as massive as the Sun", icon: "⚪" },
      ]}
      quiz={[
        {
          question: "What type of star is our Sun?",
          options: ["O-type", "G-type", "M-type", "B-type"],
          correct: 1,
          explanation: "Our Sun is a G-type main-sequence star, also called a yellow dwarf."
        },
        {
          question: "What happens when a massive star dies?",
          options: ["Becomes a white dwarf", "Explodes as a supernova", "Becomes a planet", "Turns into a nebula"],
          correct: 1,
          explanation: "Massive stars end their lives in spectacular supernova explosions, which can create neutron stars or black holes."
        }
      ]}
      relatedLinks={[
        { name: "Galaxies", href: "/galaxies" },
        { name: "Nebulae", href: "/nebulae" },
        { name: "Black Holes", href: "/black-holes" },
        { name: "Solar System", href: "/solar-system" }
      ]}
      showTodayInSpace={true}
      galleryCategory="stars"
      galleryViewMoreHref="/historical-images"
    />
  )
}


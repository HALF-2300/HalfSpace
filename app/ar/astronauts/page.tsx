import PageTemplate from '@/components-ar/PageTemplate'

export default function AstronautsPage() {
  return (
    <PageTemplate
      title="Astronauts"
      subtitle="Heroes of Space Exploration"
      heroImage="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920"
      heroImageAlt="Astronaut"
      didYouKnow={[
        "Astronauts can grow up to 2 inches taller in space due to spinal decompression!",
        "The longest single spaceflight was 437 days by Valeri Polyakov aboard Mir.",
        "Astronauts must exercise 2.5 hours daily to prevent muscle and bone loss.",
        "More than 600 people have traveled to space since Yuri Gagarin's historic flight!",
      ]}
      sections={[
        {
          title: "Pioneers of Space",
          content: (
            <div className="space-y-4">
              <p>Astronauts are the brave individuals who venture into space, pushing the boundaries of human exploration:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Yuri Gagarin (1961):</strong> First human in space - "Let's go!"</li>
                <li><strong className="text-white">Neil Armstrong (1969):</strong> First person to walk on the Moon - "That's one small step..."</li>
                <li><strong className="text-white">Valentina Tereshkova (1963):</strong> First woman in space</li>
                <li><strong className="text-white">Sally Ride (1983):</strong> First American woman in space</li>
                <li><strong className="text-white">John Glenn (1962):</strong> First American to orbit Earth</li>
              </ul>
            </div>
          ),
        },
        {
          title: "Training and Selection",
          content: "Becoming an astronaut requires extensive training and preparation. Candidates must have advanced degrees in science, engineering, or mathematics, along with years of professional experience. They undergo rigorous physical and psychological testing, then train for years in simulators, underwater facilities, and extreme environments to prepare for space missions. Training includes learning to operate spacecraft, conduct spacewalks, and perform scientific experiments.",
        },
        {
          title: "Life in Space",
          content: "Living in space presents unique challenges. Astronauts experience microgravity, which affects their bodies in various ways. They must exercise daily to prevent muscle and bone loss. Daily activities like eating, sleeping, and personal hygiene require special equipment and techniques. Despite these challenges, astronauts conduct important scientific research and maintain the International Space Station. The experience of seeing Earth from space is often described as transformative.",
        }
      ]}
      facts={[
        { fact: "12 people have walked on the Moon", icon: "🌙" },
        { fact: "Astronauts see 16 sunrises per day on the ISS", icon: "☀️" },
        { fact: "Spacewalks can last up to 8 hours", icon: "🚶" },
        { fact: "The oldest astronaut was 77 years old", icon: "👴" },
      ]}
      relatedLinks={[
        { name: "Space Stations", href: "/ar/space-stations" },
        { name: "Life in Space", href: "/ar/life-in-space" },
        { name: "Missions", href: "/ar/missions" },
        { name: "Space History", href: "/ar/space-history" }
      ]}
    />
  )
}


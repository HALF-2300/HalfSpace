import PageTemplate from '@/components-ar/PageTemplate'

export default function SpaceHistoryPage() {
  return (
    <PageTemplate
      title="Space History"
      subtitle="The Journey of Human Space Exploration"
      heroImage="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920"
      heroImageAlt="Space History"
      timeline={[
        { year: '1957', title: 'Sputnik 1', description: 'First artificial satellite launched by the Soviet Union, beginning the Space Age', icon: '🛰️' },
        { year: '1961', title: 'Yuri Gagarin', description: 'First human in space - "Let\'s go!"', icon: '👨‍🚀' },
        { year: '1969', title: 'Apollo 11', description: 'First humans land on the Moon - "That\'s one small step..."', icon: '🌙' },
        { year: '1971', title: 'Salyut 1', description: 'First space station launched', icon: '🛰️' },
        { year: '1981', title: 'Space Shuttle', description: 'First reusable spacecraft launches', icon: '🚀' },
        { year: '1990', title: 'Hubble Launch', description: 'Space telescope revolutionizes astronomy', icon: '🔭' },
        { year: '1998', title: 'ISS Assembly', description: 'International Space Station assembly begins', icon: '🌍' },
        { year: '2021', title: 'James Webb', description: 'Most powerful space telescope launches', icon: '🌌' },
      ]}
      sections={[
        {
          title: "The Space Race",
          content: (
            <div className="space-y-4">
              <p>The Space Race began during the Cold War between the United States and the Soviet Union, driving rapid advances in space technology:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">1957:</strong> Sputnik 1 becomes the first artificial satellite</li>
                <li><strong className="text-white">1961:</strong> Yuri Gagarin becomes the first human in space</li>
                <li><strong className="text-white">1969:</strong> Apollo 11 lands humans on the Moon</li>
                <li><strong className="text-white">1971:</strong> First space station, Salyut 1, launched</li>
                <li><strong className="text-white">1981:</strong> First Space Shuttle flight</li>
              </ul>
            </div>
          ),
        },
        {
          title: "International Cooperation",
          content: "Space exploration has evolved from competition to cooperation. The International Space Station represents collaboration between NASA, Roscosmos, ESA, JAXA, and CSA. Missions like the James Webb Space Telescope involve international partnerships. This global cooperation is essential for tackling the challenges and costs of space exploration while sharing knowledge and discoveries. Today, over 70 countries have space programs.",
        }
      ]}
      facts={[
        { fact: "Sputnik 1 was the size of a beach ball", icon: "🏐" },
        { fact: "12 humans have walked on the Moon", icon: "👣" },
        { fact: "The Space Shuttle flew 135 missions", icon: "🚀" },
        { fact: "Over 600 people have traveled to space", icon: "👨‍🚀" },
      ]}
      relatedLinks={[
        { name: "Missions", href: "/missions" },
        { name: "Astronauts", href: "/astronauts" },
        { name: "Space Stations", href: "/space-stations" },
        { name: "Future Missions", href: "/future-missions" }
      ]}
    />
  )
}


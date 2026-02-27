import PageTemplate from '@/components/PageTemplate'
import MissionCard from '@/components/MissionCard'

export default function MissionsPage() {
  const missions = [
    {
      name: 'Apollo 11',
      agency: 'NASA',
      year: '1969',
      description: 'First human landing on the Moon. Neil Armstrong and Buzz Aldrin became the first humans to walk on the lunar surface.',
      image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800',
      status: 'completed' as const,
    },
    {
      name: 'Voyager 1 & 2',
      agency: 'NASA',
      year: '1977',
      description: 'Interstellar probes that continue to send data from beyond our solar system. Voyager 1 is the farthest human-made object from Earth.',
      image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
      status: 'active' as const,
    },
    {
      name: 'Hubble Space Telescope',
      agency: 'NASA/ESA',
      year: '1990',
      description: 'Revolutionized our understanding of the universe with stunning images and groundbreaking discoveries about galaxies, stars, and planets.',
      image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800',
      status: 'active' as const,
      link: '/telescopes'
    },
    {
      name: 'Mars Rovers',
      agency: 'NASA',
      year: '2004-2021',
      description: 'Spirit, Opportunity, Curiosity, and Perseverance exploring the Red Planet, searching for signs of past life and preparing for human missions.',
      image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800',
      status: 'active' as const,
      link: '/mars'
    },
    {
      name: 'James Webb Space Telescope',
      agency: 'NASA/ESA/CSA',
      year: '2021',
      description: 'The most powerful space telescope ever built, revealing the early universe and studying exoplanet atmospheres.',
      image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800',
      status: 'active' as const,
      link: '/telescopes'
    },
    {
      name: 'Artemis Program',
      agency: 'NASA',
      year: '2025',
      description: 'Returning humans to the Moon and establishing a sustainable lunar presence. Will land the first woman and first person of color on the Moon.',
      image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800',
      status: 'planned' as const,
      link: '/future-missions'
    },
  ]

  return (
    <PageTemplate
      title="Space Missions"
      subtitle="Humanity's Journey to the Stars"
      heroImage="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920"
      heroImageAlt="Space Mission"
      didYouKnow={[
        "Voyager 1 is over 15 billion miles from Earth and still sending data after 45+ years!",
        "The Hubble Space Telescope has made over 1.5 million observations since 1990.",
        "The International Space Station travels at 17,500 mph, completing an orbit every 90 minutes.",
        "Apollo 11 astronauts left a plaque on the Moon that reads: 'We came in peace for all mankind.'",
      ]}
      sections={[
        {
          title: "Historic Missions",
          content: (
            <div className="space-y-4">
              <p>Space exploration has achieved remarkable milestones that have shaped our understanding of the universe:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Apollo 11 (1969):</strong> First human landing on the Moon - "That's one small step for man, one giant leap for mankind."</li>
                <li><strong className="text-white">Voyager 1 & 2 (1977):</strong> Interstellar probes carrying the Golden Record with sounds and images of Earth</li>
                <li><strong className="text-white">Hubble Space Telescope (1990):</strong> Revolutionized astronomy with stunning images of distant galaxies and nebulae</li>
                <li><strong className="text-white">Mars Rovers:</strong> Spirit, Opportunity, Curiosity, and Perseverance exploring the Red Planet</li>
                <li><strong className="text-white">Cassini-Huygens (1997-2017):</strong> Explored Saturn and its moons, especially Titan</li>
              </ul>
            </div>
          ),
          image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800",
          imageAlt: "Historic space missions"
        },
        {
          title: "Current Missions",
          content: "Today, numerous missions are actively exploring space. The James Webb Space Telescope is revealing the early universe, the Parker Solar Probe is studying the Sun up close, and multiple Mars missions are searching for signs of past life. The International Space Station continues to serve as a laboratory in microgravity, while missions like Juno study Jupiter and New Horizons explores the Kuiper Belt. These missions are expanding our knowledge every day.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Current space missions"
        },
        {
          title: "Future Missions",
          content: "Exciting missions are planned for the coming decades. NASA's Artemis program aims to return humans to the Moon and establish a sustainable presence. The Europa Clipper will explore Jupiter's moon Europa, which may harbor life in its subsurface ocean. Missions to Mars will continue, with plans for sample return and eventual human exploration. The search for exoplanets and signs of life beyond Earth continues with new telescopes and missions.",
          image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",
          imageAlt: "Future space missions"
        }
      ]}
      facts={[
        { fact: "Voyager 1 is the farthest human-made object", icon: "🚀" },
        { fact: "Hubble has observed over 50,000 celestial objects", icon: "🔭" },
        { fact: "The ISS has been continuously occupied since 2000", icon: "🛰️" },
        { fact: "12 humans have walked on the Moon", icon: "👨‍🚀" },
      ]}
      timeline={[
        { year: '1957', title: 'Sputnik 1', description: 'First artificial satellite launched by the Soviet Union', icon: '🛰️' },
        { year: '1961', title: 'Yuri Gagarin', description: 'First human in space', icon: '👨‍🚀' },
        { year: '1969', title: 'Apollo 11', description: 'First humans land on the Moon', icon: '🌙' },
        { year: '1977', title: 'Voyager Missions', description: 'Interstellar probes launched', icon: '🚀' },
        { year: '1990', title: 'Hubble Launch', description: 'Space telescope revolutionizes astronomy', icon: '🔭' },
        { year: '2000', title: 'ISS Occupation', description: 'International Space Station becomes continuously occupied', icon: '🛰️' },
        { year: '2021', title: 'James Webb Launch', description: 'Most powerful space telescope begins operations', icon: '🌌' },
      ]}
      quiz={[
        {
          question: "Which mission first landed humans on the Moon?",
          options: ["Apollo 10", "Apollo 11", "Apollo 12", "Apollo 13"],
          correct: 1,
          explanation: "Apollo 11, launched in 1969, was the first mission to successfully land humans on the Moon."
        },
        {
          question: "What is the farthest human-made object from Earth?",
          options: ["New Horizons", "Voyager 1", "Voyager 2", "Pioneer 10"],
          correct: 1,
          explanation: "Voyager 1 is over 15 billion miles from Earth and continues to send data back to us."
        }
      ]}
      relatedLinks={[
        { name: "Future Missions", href: "/future-missions" },
        { name: "Space History", href: "/space-history" },
        { name: "Astronauts", href: "/astronauts" },
        { name: "Mars", href: "/mars" }
      ]}
    />
  )
}


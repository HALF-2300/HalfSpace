import PageTemplate from '@/components/PageTemplate'

export default function SolarSystemPage() {
  return (
    <PageTemplate
      title="Solar System"
      subtitle="Our Cosmic Neighborhood"
      heroImage="https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg"
      heroImageAlt="Solar System"
      didYouKnow={[
        "The Solar System is about 4.6 billion years old, formed from a collapsing cloud of gas and dust.",
        "If the Sun were the size of a beach ball, Earth would be the size of a pea 100 feet away!",
        "The Solar System travels through space at about 515,000 mph as it orbits the center of the Milky Way.",
        "All planets could fit between Earth and the Moon with room to spare - the Moon is really far away!",
      ]}
      sections={[
        {
          title: "Overview",
          content: "The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. It formed approximately 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with most of the remaining mass contained in Jupiter. The four inner planets are terrestrial planets, while the four outer planets are gas giants.",
          image: "https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg",
          imageAlt: "Solar System"
        },
        {
          title: "The Sun",
          content: "At the center of our Solar System is the Sun, a G-type main-sequence star that contains 99.86% of the system's known mass. The Sun's enormous gravitational pull keeps all planets, asteroids, comets, and other objects in orbit around it. It's a massive nuclear fusion reactor, converting hydrogen into helium and releasing vast amounts of energy. Every second, the Sun converts 600 million tons of hydrogen into helium, releasing energy equivalent to billions of nuclear bombs.",
          image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg",
          imageAlt: "The Sun"
        },
        {
          title: "The Eight Planets",
          content: (
            <div className="space-y-4">
              <p>Our Solar System contains eight planets: four terrestrial planets (Mercury, Venus, Earth, and Mars) and four gas giants (Jupiter, Saturn, Uranus, and Neptune).</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Mercury:</strong> Closest to the Sun, with extreme temperature variations</li>
                <li><strong className="text-white">Venus:</strong> Hottest planet with a thick, toxic atmosphere</li>
                <li><strong className="text-white">Earth:</strong> The only known planet with life</li>
                <li><strong className="text-white">Mars:</strong> The Red Planet, future target for human exploration</li>
                <li><strong className="text-white">Jupiter:</strong> Largest planet, with a Great Red Spot storm</li>
                <li><strong className="text-white">Saturn:</strong> Famous for its spectacular ring system</li>
                <li><strong className="text-white">Uranus:</strong> Rotates on its side</li>
                <li><strong className="text-white">Neptune:</strong> Fastest winds in the Solar System</li>
              </ul>
            </div>
          ),
          image: "https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg",
          imageAlt: "The Eight Planets"
        },
        {
          title: "Dwarf Planets and Small Bodies",
          content: "Beyond Neptune lies the Kuiper Belt, home to dwarf planets like Pluto, Eris, and Haumea. The Solar System also contains millions of asteroids, primarily located in the asteroid belt between Mars and Jupiter, and countless comets that originate from the Oort Cloud, a distant spherical shell of icy objects surrounding the Solar System at distances up to 100,000 astronomical units.",
        }
      ]}
      facts={[
        { fact: "The Solar System is 4.6 billion years old", icon: "⏰" },
        { fact: "It takes light 8 minutes to travel from the Sun to Earth", icon: "☀️" },
        { fact: "Jupiter protects inner planets by deflecting asteroids", icon: "🛡️" },
        { fact: "The Oort Cloud extends almost halfway to the nearest star", icon: "☁️" },
      ]}
      quiz={[
        {
          question: "What percentage of the Solar System's mass does the Sun contain?",
          options: ["50%", "75%", "99.86%", "85%"],
          correct: 2,
          explanation: "The Sun contains 99.86% of the Solar System's total mass, with all planets, moons, asteroids, and comets making up just 0.14%."
        },
        {
          question: "How many planets are in our Solar System?",
          options: ["7", "8", "9", "10"],
          correct: 1,
          explanation: "There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Pluto was reclassified as a dwarf planet in 2006."
        },
        {
          question: "Where do most comets originate?",
          options: ["Asteroid Belt", "Kuiper Belt", "Oort Cloud", "Between Mars and Jupiter"],
          correct: 2,
          explanation: "Most comets originate from the Oort Cloud, a distant spherical shell of icy objects surrounding the Solar System."
        }
      ]}
      relatedLinks={[
        { name: "Planets", href: "/planets" },
        { name: "Mars", href: "/mars" },
        { name: "Jupiter", href: "/jupiter" },
        { name: "Asteroids", href: "/asteroids" },
        { name: "Comets", href: "/comets" }
      ]}
    />
  )
}


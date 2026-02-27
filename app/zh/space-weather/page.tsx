import PageTemplate from '@/components-ar/PageTemplate'

export default function SpaceWeatherPage() {
  return (
    <PageTemplate
      title="Space Weather"
      subtitle="The Sun's Impact on Space"
      heroImage="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920"
      heroImageAlt="Space Weather"
      didYouKnow={[
        "Solar flares can release energy equivalent to millions of nuclear bombs!",
        "The Carrington Event of 1859 caused telegraph systems to fail worldwide!",
        "Auroras occur when solar particles interact with Earth's magnetic field!",
        "Space weather can disrupt satellites, power grids, and communications!",
      ]}
      sections={[
        {
          title: "What is Space Weather?",
          content: "Space weather refers to conditions in space that can affect Earth and space-based technology. It's driven by the Sun's activity, including solar flares, coronal mass ejections, and solar wind. These phenomena can disrupt satellites, power grids, communications, and pose radiation risks to astronauts. Understanding and predicting space weather is crucial for protecting our technology and space missions.",
        },
        {
          title: "Solar Activity",
          content: (
            <div className="space-y-4">
              <p>The Sun's activity varies in an 11-year cycle:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Solar Flares:</strong> Intense bursts of radiation from the Sun's surface</li>
                <li><strong className="text-white">Coronal Mass Ejections:</strong> Massive clouds of charged particles ejected from the Sun</li>
                <li><strong className="text-white">Solar Wind:</strong> Continuous stream of charged particles from the Sun</li>
                <li><strong className="text-white">Sunspots:</strong> Dark regions on the Sun's surface indicating magnetic activity</li>
              </ul>
            </div>
          ),
        },
        {
          title: "Effects on Earth",
          content: "When space weather reaches Earth, it can cause auroras (Northern and Southern Lights), disrupt radio communications, damage satellites, and cause power grid failures. The most severe space weather events can cause widespread blackouts and satellite failures. In 1859, the Carrington Event caused telegraph systems to fail worldwide—a similar event today would cause catastrophic damage to our technology-dependent society.",
        }
      ]}
      facts={[
        { fact: "Solar cycles last 11 years", icon: "☀️" },
        { fact: "Auroras are caused by space weather", icon: "🌌" },
        { fact: "Space weather can damage satellites", icon: "🛰️" },
        { fact: "The Sun's activity affects Earth's climate", icon: "🌍" },
      ]}
      relatedLinks={[
        { name: "Stars", href: "/zh/stars" },
        { name: "Solar System", href: "/zh/solar-system" },
        { name: "Astronauts", href: "/zh/astronauts" }
      ]}
    />
  )
}


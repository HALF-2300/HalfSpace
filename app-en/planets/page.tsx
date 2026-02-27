import PageTemplate from '@/components/PageTemplate'

export default function PlanetsPage() {
  return (
    <PageTemplate
      title="Planets"
      subtitle="Worlds of Wonder"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Planets"
      didYouKnow={[
        "Jupiter is so massive that all other planets in the Solar System could fit inside it!",
        "Venus rotates backwards - a day on Venus is longer than its year!",
        "Saturn's density is so low that it would float if you could find an ocean large enough.",
        "Neptune has winds reaching speeds of 2,100 km/h (1,300 mph) - the fastest in the Solar System!",
      ]}
      sections={[
        {
          title: "Terrestrial Planets",
          content: (
            <div className="space-y-4">
              <p>The four inner planets—Mercury, Venus, Earth, and Mars—are called terrestrial planets because they have solid, rocky surfaces. These planets are relatively small and dense, with metallic cores and silicate mantles and crusts.</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Mercury:</strong> The smallest planet, closest to the Sun, with extreme temperature variations from 427°C to -173°C</li>
                <li><strong className="text-white">Venus:</strong> The hottest planet with a thick, toxic atmosphere and crushing surface pressure 92 times that of Earth</li>
                <li><strong className="text-white">Earth:</strong> The only known planet with life, featuring liquid water and a protective atmosphere</li>
                <li><strong className="text-white">Mars:</strong> The Red Planet, with evidence of ancient water and potential for future human exploration</li>
              </ul>
            </div>
          ),
          image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800",
          imageAlt: "Terrestrial Planets"
        },
        {
          title: "Gas Giants",
          content: (
            <div className="space-y-4">
              <p>Jupiter and Saturn are gas giants, massive planets primarily composed of hydrogen and helium. They lack solid surfaces and have thick atmospheres with swirling clouds and powerful storms.</p>
              <p>Jupiter is the largest planet in our Solar System, with a Great Red Spot—a storm larger than Earth that has been raging for centuries. Saturn is famous for its spectacular ring system, made of ice particles and rocky debris orbiting the planet.</p>
            </div>
          ),
          image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800",
          imageAlt: "Gas Giants"
        },
        {
          title: "Ice Giants",
          content: (
            <div className="space-y-4">
              <p>Uranus and Neptune are ice giants, composed primarily of water, methane, and ammonia ices surrounding a rocky core. These distant planets have deep, cold atmospheres and unique characteristics.</p>
              <p>Uranus rotates on its side, likely due to a massive collision in its past. Neptune has the fastest winds in the Solar System, reaching speeds of up to 2,100 km/h (1,300 mph). Both planets have faint ring systems and numerous moons.</p>
            </div>
          ),
        },
        {
          title: "Planetary Characteristics",
          content: "Each planet has unique features: atmospheres, magnetic fields, moons, and geological activity. Some planets have rings, others have extreme weather patterns, and some may have subsurface oceans. Understanding these diverse worlds helps us learn about planetary formation and the potential for life elsewhere in the universe.",
        }
      ]}
      facts={[
        { fact: "Jupiter has 95 known moons", icon: "🪐" },
        { fact: "Saturn's rings are only 10 meters thick", icon: "💍" },
        { fact: "Venus is hotter than Mercury despite being farther from the Sun", icon: "🔥" },
        { fact: "Mars has the largest volcano in the Solar System: Olympus Mons", icon: "🌋" },
      ]}
      quiz={[
        {
          question: "Which planet is known as the 'Red Planet'?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          correct: 1,
          explanation: "Mars is called the Red Planet due to iron oxide (rust) on its surface, giving it a reddish appearance."
        },
        {
          question: "What is the largest planet in our Solar System?",
          options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
          correct: 1,
          explanation: "Jupiter is the largest planet, with a mass greater than all other planets combined."
        },
        {
          question: "Which planet rotates on its side?",
          options: ["Neptune", "Uranus", "Saturn", "Venus"],
          correct: 1,
          explanation: "Uranus rotates on its side at a 98-degree angle, likely due to a massive collision in its past."
        }
      ]}
      relatedLinks={[
        { name: "Solar System", href: "/solar-system" },
        { name: "Mars", href: "/mars" },
        { name: "Jupiter", href: "/jupiter" },
        { name: "Saturn", href: "/saturn" },
        { name: "Moon", href: "/moon" }
      ]}
    />
  )
}


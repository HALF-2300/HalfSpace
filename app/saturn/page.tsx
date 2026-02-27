import PageTemplate from '@/components/PageTemplate'

export default function SaturnPage() {
  return (
    <PageTemplate
      title="Saturn"
      subtitle="The Ringed Planet"
      heroImage="https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=1920"
      heroImageAlt="Saturn"
      didYouKnow={[
        "Saturn is less dense than water - it would float if you could find an ocean large enough!",
        "Saturn's rings are only about 10 meters thick but extend 282,000 km from the planet!",
        "Saturn has 146 known moons, including Titan which is larger than Mercury!",
        "Titan has lakes and rivers of liquid methane and ethane!",
      ]}
      sections={[
        {
          title: "The Ringed Wonder",
          content: "Saturn is the sixth planet from the Sun and the second-largest in our Solar System, famous for its spectacular ring system. Like Jupiter, it's a gas giant composed mostly of hydrogen and helium. Saturn is less dense than water—if there were an ocean large enough, Saturn would float! The planet's beautiful rings are made of countless ice particles and rocky debris, ranging from tiny grains to house-sized chunks.",
        },
        {
          title: "The Rings",
          content: "Saturn's rings are divided into several major ring groups (A, B, C, D, E, F, and G rings) separated by gaps. The rings extend up to 282,000 kilometers from Saturn but are only about 10 meters thick in most places. They're thought to be remnants of comets, asteroids, or shattered moons. The rings are constantly changing, with new features appearing and old ones disappearing. The Cassini mission provided unprecedented views of the ring system.",
        },
        {
          title: "Moons of Saturn",
          content: "Saturn has at least 146 known moons, including Titan, the second-largest moon in the Solar System. Titan has a thick atmosphere and lakes of liquid methane and ethane. Enceladus has geysers spewing water ice from its south pole, suggesting a subsurface ocean. Other notable moons include Mimas (the 'Death Star' moon), Iapetus (with its two-tone coloring), and many small moonlets that help maintain the ring structure.",
        }
      ]}
      facts={[
        { fact: "Saturn has 146 known moons", icon: "🪐" },
        { fact: "Titan is larger than the planet Mercury", icon: "🌙" },
        { fact: "Enceladus has geysers of water ice", icon: "❄️" },
        { fact: "Saturn's rings are mostly ice particles", icon: "💍" },
      ]}
      relatedLinks={[
        { name: "Planets", href: "/planets" },
        { name: "Solar System", href: "/solar-system" },
        { name: "Jupiter", href: "/jupiter" },
        { name: "Missions", href: "/missions" }
      ]}
    />
  )
}


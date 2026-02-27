import PageTemplate from '@/components/PageTemplate'

export default function VenusPage() {
  return (
    <PageTemplate
      title="Venus"
      subtitle="The Hottest Planet"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Venus"
      didYouKnow={[
        "Venus is the hottest planet in our Solar System at 471°C (880°F)!",
        "Venus rotates backwards - a day on Venus is longer than its year!",
        "Venus has crushing atmospheric pressure 92 times that of Earth!",
        "Venus is often called Earth's 'evil twin' due to its similar size but hostile conditions!",
      ]}
      sections={[
        {
          title: "Earth's Twin",
          content: "Venus is often called Earth's twin because it's similar in size and composition. However, Venus is a hellish world with surface temperatures hot enough to melt lead. The planet is shrouded in thick clouds of sulfuric acid, and its atmosphere is 96% carbon dioxide. Despite being farther from the Sun than Mercury, Venus is hotter due to its runaway greenhouse effect.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Venus"
        },
        {
          title: "Hostile Environment",
          content: "Venus has the most hostile environment of any planet in our Solar System. The surface pressure is equivalent to being 900 meters (3,000 feet) underwater on Earth. The thick atmosphere traps heat, creating a runaway greenhouse effect. Rain on Venus is made of sulfuric acid, and the surface is covered with volcanic features. Spacecraft that have landed on Venus have only survived for a few hours before being crushed and melted.",
        },
        {
          title: "Retrograde Rotation",
          content: "Venus rotates backwards compared to most planets. A day on Venus (243 Earth days) is longer than its year (225 Earth days). This retrograde rotation means the Sun rises in the west and sets in the east on Venus. Scientists believe a massive collision in Venus's past may have caused this unusual rotation.",
        }
      ]}
      facts={[
        { fact: "Venus is the brightest object in the night sky after the Moon", icon: "✨" },
        { fact: "Venus has over 1,600 volcanoes", icon: "🌋" },
        { fact: "Venus rotates once every 243 Earth days", icon: "🔄" },
        { fact: "Venus has no moons", icon: "🌙" },
      ]}
      relatedLinks={[
        { name: "Planets", href: "/planets" },
        { name: "Solar System", href: "/solar-system" },
        { name: "Mercury", href: "/mercury" }
      ]}
    />
  )
}


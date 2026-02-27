import PageTemplate from '@/components/PageTemplate'

export default function NeptunePage() {
  return (
    <PageTemplate
      title="Neptune"
      subtitle="The Windy Planet"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Neptune"
      didYouKnow={[
        "Neptune has the fastest winds in the Solar System - up to 2,100 km/h (1,300 mph)!",
        "Neptune takes 165 Earth years to orbit the Sun - one year on Neptune!",
        "Neptune was the first planet discovered through mathematical prediction!",
        "Neptune's blue color comes from methane in its atmosphere!",
      ]}
      sections={[
        {
          title: "The Farthest Planet",
          content: "Neptune is the eighth and farthest planet from the Sun, an ice giant similar to Uranus. It's famous for its deep blue color, caused by methane in its atmosphere. Neptune has the fastest winds in the Solar System, reaching speeds of up to 2,100 km/h (1,300 mph) - nearly supersonic! Despite being so far from the Sun, Neptune has an internal heat source that drives its weather.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Neptune"
        },
        {
          title: "Discovery",
          content: "Neptune was the first planet discovered through mathematical prediction rather than observation. Astronomers noticed that Uranus's orbit didn't match predictions, suggesting another planet's gravity was affecting it. French mathematician Urbain Le Verrier calculated where this planet should be, and it was found in 1846, exactly where predicted.",
        },
        {
          title: "Great Dark Spot",
          content: "Like Jupiter's Great Red Spot, Neptune has a Great Dark Spot - a massive storm system. However, unlike Jupiter's storm which has lasted for centuries, Neptune's Great Dark Spot appears and disappears. When Voyager 2 visited in 1989, it observed a storm the size of Earth. By the time Hubble observed Neptune in 1994, the storm had disappeared.",
        }
      ]}
      facts={[
        { fact: "Neptune has 14 known moons", icon: "🌙" },
        { fact: "Neptune is 30 times farther from the Sun than Earth", icon: "☀️" },
        { fact: "Only Voyager 2 has visited Neptune", icon: "🛰️" },
        { fact: "Neptune has a faint ring system", icon: "💍" },
      ]}
      relatedLinks={[
        { name: "Planets", href: "/planets" },
        { name: "Solar System", href: "/solar-system" },
        { name: "Uranus", href: "/uranus" }
      ]}
    />
  )
}


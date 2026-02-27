import PageTemplate from '@/components/PageTemplate'

export default function UranusPage() {
  return (
    <PageTemplate
      title="Uranus"
      subtitle="The Sideways Planet"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Uranus"
      didYouKnow={[
        "Uranus rotates on its side at a 98-degree angle!",
        "Uranus has faint rings that were discovered in 1977!",
        "A year on Uranus equals 84 Earth years!",
        "Uranus is the coldest planet in our Solar System at -224°C!",
      ]}
      sections={[
        {
          title: "The Ice Giant",
          content: "Uranus is the seventh planet from the Sun and an ice giant composed primarily of water, methane, and ammonia ices. It's the coldest planet in our Solar System, with temperatures dropping to -224°C (-371°F). Uranus has a unique feature: it rotates on its side at a 98-degree angle, likely due to a massive collision in its past. This gives Uranus extreme seasons.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Uranus"
        },
        {
          title: "Unique Rotation",
          content: "Uranus's sideways rotation creates extreme seasons. For 21 years, one pole points toward the Sun while the other is in darkness. Then the situation reverses for the next 21 years. During these periods, the equator receives very little sunlight. This unique orientation makes Uranus one of the most unusual planets in our Solar System.",
        },
        {
          title: "Atmosphere and Moons",
          content: "Uranus has a thick atmosphere composed mainly of hydrogen and helium, with methane giving it a blue-green color. The planet has 27 known moons, named after characters from Shakespeare and Alexander Pope. The largest moons are Titania and Oberon. Uranus also has a faint ring system discovered in 1977.",
        }
      ]}
      facts={[
        { fact: "Uranus has 27 known moons", icon: "🌙" },
        { fact: "Uranus is 4 times wider than Earth", icon: "📏" },
        { fact: "Only one spacecraft has visited Uranus: Voyager 2", icon: "🛰️" },
        { fact: "Uranus's rings are dark and hard to see", icon: "💍" },
      ]}
      relatedLinks={[
        { name: "Planets", href: "/planets" },
        { name: "Solar System", href: "/solar-system" },
        { name: "Neptune", href: "/neptune" }
      ]}
    />
  )
}


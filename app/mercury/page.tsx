import PageTemplate from '@/components/PageTemplate'

export default function MercuryPage() {
  return (
    <PageTemplate
      title="Mercury"
      subtitle="The Swift Planet"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Mercury"
      didYouKnow={[
        "Mercury is the smallest planet in our Solar System!",
        "A day on Mercury lasts 176 Earth days - longer than its year!",
        "Mercury has extreme temperature swings: 427°C during the day, -173°C at night!",
        "Mercury has no atmosphere, so its surface is directly exposed to space!",
      ]}
      sections={[
        {
          title: "The Closest Planet to the Sun",
          content: "Mercury is the smallest planet in our Solar System and the closest to the Sun. It's a rocky planet with a heavily cratered surface, similar to Earth's Moon. Despite being closest to the Sun, Mercury is not the hottest planet - that title belongs to Venus due to its thick atmosphere. Mercury has no atmosphere to retain heat, so temperatures swing dramatically between day and night.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Mercury"
        },
        {
          title: "Extreme Conditions",
          content: "Mercury experiences the most extreme temperature variations in the Solar System. During the day, surface temperatures can reach 427°C (800°F), hot enough to melt lead. At night, temperatures drop to -173°C (-280°F). This 600-degree temperature swing happens because Mercury has no atmosphere to trap heat. The planet's slow rotation also contributes to these extremes.",
        },
        {
          title: "Surface Features",
          content: "Mercury's surface is covered with craters from billions of years of asteroid and comet impacts. The largest crater, Caloris Basin, is 1,550 kilometers (960 miles) across. The planet also has cliffs called 'scarps' that formed as Mercury's interior cooled and contracted. These features tell us about the planet's geological history.",
        }
      ]}
      facts={[
        { fact: "Mercury completes an orbit in 88 Earth days", icon: "⏰" },
        { fact: "Mercury is only slightly larger than Earth's Moon", icon: "🌙" },
        { fact: "Mercury has a large iron core", icon: "🔩" },
        { fact: "Only two spacecraft have visited Mercury", icon: "🛰️" },
      ]}
      relatedLinks={[
        { name: "Planets", href: "/planets" },
        { name: "Solar System", href: "/solar-system" },
        { name: "Venus", href: "/venus" }
      ]}
    />
  )
}


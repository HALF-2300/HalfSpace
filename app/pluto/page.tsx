import PageTemplate from '@/components/PageTemplate'

export default function PlutoPage() {
  return (
    <PageTemplate
      title="Pluto"
      subtitle="The Dwarf Planet"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Pluto"
      didYouKnow={[
        "Pluto was reclassified as a dwarf planet in 2006!",
        "Pluto has a heart-shaped glacier on its surface!",
        "Pluto has 5 known moons, including Charon which is half its size!",
        "A day on Pluto equals 6.4 Earth days!",
      ]}
      sections={[
        {
          title: "The Dwarf Planet",
          content: "Pluto is a dwarf planet in the Kuiper Belt, discovered in 1930 by Clyde Tombaugh. It was considered the ninth planet until 2006 when the International Astronomical Union redefined what constitutes a planet. Pluto is smaller than Earth's Moon and has a highly elliptical orbit that sometimes brings it closer to the Sun than Neptune. Despite its small size, Pluto has a complex geology with mountains, glaciers, and possibly an underground ocean.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Pluto"
        },
        {
          title: "New Horizons Mission",
          content: "In 2015, NASA's New Horizons spacecraft made the first close-up observations of Pluto, revealing a surprisingly complex world. The mission discovered mountains of water ice, nitrogen glaciers, and a thin atmosphere. The most striking feature is a heart-shaped region called Tombaugh Regio, a large glacier of nitrogen and methane ice. New Horizons continues to explore the Kuiper Belt.",
        },
        {
          title: "Moons of Pluto",
          content: "Pluto has five known moons. The largest, Charon, is so large relative to Pluto that they orbit around a point between them, making them a binary system. The other moons are Nix, Hydra, Kerberos, and Styx. Charon's surface is covered with water ice and shows evidence of geological activity, including canyons and smooth plains.",
        }
      ]}
      facts={[
        { fact: "Pluto takes 248 Earth years to orbit the Sun", icon: "⏰" },
        { fact: "Pluto's surface temperature is -229°C", icon: "❄️" },
        { fact: "Pluto has a thin nitrogen atmosphere", icon: "💨" },
        { fact: "New Horizons took 9.5 years to reach Pluto", icon: "🚀" },
      ]}
      relatedLinks={[
        { name: "Solar System", href: "/solar-system" },
        { name: "Asteroids", href: "/asteroids" },
        { name: "Kuiper Belt", href: "/kuiper-belt" }
      ]}
    />
  )
}


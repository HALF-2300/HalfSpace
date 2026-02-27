import PageTemplate from '@/components-ar/PageTemplate'

export default function AsteroidBeltPage() {
  return (
    <PageTemplate
      title="Asteroid Belt"
      subtitle="Between Mars and Jupiter"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Asteroid Belt"
      didYouKnow={[
        "The asteroid belt is mostly empty space!",
        "Asteroids are typically millions of kilometers apart!",
        "The total mass of the asteroid belt is less than Earth's Moon!",
        "Jupiter's gravity prevented the asteroid belt from forming a planet!",
      ]}
      sections={[
        {
          title: "What is the Asteroid Belt?",
          content: "The asteroid belt is a region of space between the orbits of Mars and Jupiter, populated by millions of rocky objects called asteroids. Despite popular depictions showing a dense field of rocks, the belt is mostly empty space with asteroids typically millions of kilometers apart. The largest asteroid, Ceres, is also classified as a dwarf planet and contains about a third of the belt's total mass.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Asteroid Belt"
        },
        {
          title: "Formation",
          content: "The asteroid belt formed from the early Solar System's protoplanetary disk. Jupiter's massive gravity prevented the material in this region from coalescing into a planet. Instead, the material remained as small bodies. Over billions of years, collisions have broken larger asteroids into smaller pieces, creating the diverse population we see today.",
        },
        {
          title: "Composition",
          content: "Asteroids in the belt are primarily composed of rock and metal. They're classified into different types based on their composition: C-type (carbonaceous, most common), S-type (silicaceous), and M-type (metallic). These different types formed at different distances from the Sun and provide clues about the early Solar System's composition.",
        }
      ]}
      facts={[
        { fact: "The asteroid belt is 2-4 AU wide", icon: "📏" },
        { fact: "Ceres is the largest object in the belt", icon: "🪨" },
        { fact: "Asteroids are remnants from planet formation", icon: "⏰" },
        { fact: "Spacecraft have successfully navigated through the belt", icon: "🚀" },
      ]}
      relatedLinks={[
        { name: "Asteroids", href: "/es/asteroids" },
        { name: "Solar System", href: "/es/solar-system" },
        { name: "Jupiter", href: "/es/jupiter" }
      ]}
    />
  )
}


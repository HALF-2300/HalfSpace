import PageTemplate from '@/components/PageTemplate'

export default function WhiteDwarfsPage() {
  return (
    <PageTemplate
      title="White Dwarfs"
      subtitle="Stellar Remnants"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="White Dwarfs"
      didYouKnow={[
        "White dwarfs are Earth-sized but as massive as the Sun!",
        "A teaspoon of white dwarf material would weigh 5.5 tons on Earth!",
        "White dwarfs are the final stage of most stars!",
        "White dwarfs will eventually cool and become black dwarfs over trillions of years!",
      ]}
      sections={[
        {
          title: "What Are White Dwarfs?",
          content: "White dwarfs are the dense, Earth-sized remnants of stars like our Sun. When medium-mass stars exhaust their nuclear fuel, they expel their outer layers, leaving behind a hot, dense core. White dwarfs are supported by electron degeneracy pressure - a quantum mechanical effect that prevents further collapse. They're incredibly dense, with a white dwarf the size of Earth having the mass of the Sun.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "White Dwarf"
        },
        {
          title: "Formation",
          content: "White dwarfs form when stars up to 8 solar masses reach the end of their lives. After the red giant phase, these stars expel their outer layers, creating beautiful planetary nebulae. The remaining core, no longer producing energy through fusion, cools and contracts to become a white dwarf. Over billions of years, white dwarfs will cool and fade, eventually becoming black dwarfs.",
        },
        {
          title: "Fate of Our Sun",
          content: "In about 5 billion years, our Sun will become a white dwarf. After expanding into a red giant and consuming the inner planets, the Sun will expel its outer layers, leaving behind a white dwarf core. This white dwarf will be about the size of Earth but contain half the Sun's current mass. It will slowly cool over trillions of years.",
        }
      ]}
      facts={[
        { fact: "White dwarfs are 100,000 times denser than the Sun", icon: "⚖️" },
        { fact: "White dwarfs have surface temperatures of 8,000-40,000°C", icon: "🔥" },
        { fact: "97% of all stars will become white dwarfs", icon: "⭐" },
        { fact: "White dwarfs can explode as Type Ia supernovae", icon: "💥" },
      ]}
      relatedLinks={[
        { name: "Stars", href: "/stars" },
        { name: "Nebulae", href: "/nebulae" },
        { name: "Supernovae", href: "/supernovae" }
      ]}
    />
  )
}


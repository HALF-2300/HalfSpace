import PageTemplate from '@/components-ar/PageTemplate'

export default function BrownDwarfsPage() {
  return (
    <PageTemplate
      title="Brown Dwarfs"
      subtitle="Failed Stars"
      heroImage="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920"
      heroImageAlt="Brown Dwarfs"
      didYouKnow={[
        "Brown dwarfs are too small to be stars but too large to be planets!",
        "Brown dwarfs can't sustain hydrogen fusion!",
        "Brown dwarfs are sometimes called 'failed stars'!",
        "The first brown dwarf was confirmed in 1995!",
      ]}
      sections={[
        {
          title: "What Are Brown Dwarfs?",
          content: "Brown dwarfs are objects that fall between stars and planets in size. They're too massive to be planets (at least 13 times Jupiter's mass) but not massive enough to sustain hydrogen fusion like true stars (less than about 80 Jupiter masses). Brown dwarfs can briefly fuse deuterium (heavy hydrogen) but not regular hydrogen. They're often called 'failed stars' because they never reached the mass needed to become true stars.",
          image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800",
          imageAlt: "Brown Dwarf"
        },
        {
          title: "Properties",
          content: "Brown dwarfs are cool objects that glow dimly in infrared light. They're difficult to detect because they're much fainter than stars. Brown dwarfs cool over time, eventually becoming planet-like objects. Some brown dwarfs have atmospheres with clouds and weather patterns. They can be found both as isolated objects and orbiting other stars.",
        },
        {
          title: "Discovery",
          content: "The first confirmed brown dwarf, Gliese 229B, was discovered in 1995. Since then, thousands have been identified. Brown dwarfs help us understand the boundary between stars and planets and provide insights into stellar formation processes. They're common in the galaxy, possibly as numerous as stars.",
        }
      ]}
      facts={[
        { fact: "Brown dwarfs are 13-80 times Jupiter's mass", icon: "⚖️" },
        { fact: "Brown dwarfs cool and fade over billions of years", icon: "❄️" },
        { fact: "Some brown dwarfs have surface temperatures below freezing", icon: "🌡️" },
        { fact: "Brown dwarfs can have weather and clouds", icon: "☁️" },
      ]}
      relatedLinks={[
        { name: "Stars", href: "/ar/stars" },
        { name: "Exoplanets", href: "/ar/exoplanets" },
        { name: "Jupiter", href: "/ar/jupiter" }
      ]}
    />
  )
}


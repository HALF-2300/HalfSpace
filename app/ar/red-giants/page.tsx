import PageTemplate from '@/components-ar/PageTemplate'

export default function RedGiantsPage() {
  return (
    <PageTemplate
      title="Red Giants"
      subtitle="Dying Stars"
      heroImage="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920"
      heroImageAlt="Red Giants"
      didYouKnow={[
        "Red giants can be 100 times larger than the Sun!",
        "Our Sun will become a red giant in 5 billion years!",
        "Red giants are cooler but brighter than main-sequence stars!",
        "Red giants create heavy elements through nuclear fusion!",
      ]}
      sections={[
        {
          title: "What Are Red Giants?",
          content: "Red giants are large, cool stars in a late stage of stellar evolution. When a star like our Sun exhausts the hydrogen fuel in its core, the core contracts and heats up, while the outer layers expand and cool. This creates a red giant - a star that's much larger and brighter than it was on the main sequence, but with a cooler, redder surface. Red giants are among the largest stars in the universe.",
          image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800",
          imageAlt: "Red Giant"
        },
        {
          title: "Formation",
          content: "Red giants form when medium-mass stars (0.5-8 solar masses) run out of hydrogen in their cores. The core contracts under gravity, heating up until helium fusion begins. Meanwhile, the outer layers expand dramatically, sometimes to hundreds of times the star's original size. Despite being cooler, red giants are much brighter because of their enormous surface area.",
        },
        {
          title: "Fate of Our Sun",
          content: "In about 5 billion years, our Sun will become a red giant. It will expand to about 200 times its current size, engulfing Mercury and Venus, and possibly Earth. The Sun will shine 2,000 times brighter than today. After the red giant phase, the Sun will expel its outer layers, forming a planetary nebula, and leave behind a white dwarf core.",
        }
      ]}
      facts={[
        { fact: "Red giants can be 100-1,000 times larger than the Sun", icon: "📏" },
        { fact: "Red giants are cooler but brighter than main-sequence stars", icon: "🌡️" },
        { fact: "Red giants create carbon and oxygen through fusion", icon: "⚛️" },
        { fact: "The red giant phase lasts millions to billions of years", icon: "⏰" },
      ]}
      relatedLinks={[
        { name: "Stars", href: "/ar/stars" },
        { name: "White Dwarfs", href: "/ar/white-dwarfs" },
        { name: "Nebulae", href: "/ar/nebulae" }
      ]}
    />
  )
}


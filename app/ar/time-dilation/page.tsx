import PageTemplate from '@/components-ar/PageTemplate'

export default function TimeDilationPage() {
  return (
    <PageTemplate
      title="Time Dilation"
      subtitle="Einstein's Relativity"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Time Dilation"
      didYouKnow={[
        "Time moves slower near massive objects like black holes!",
        "Time moves slower for objects traveling at high speeds!",
        "GPS satellites must account for time dilation!",
        "Time dilation is a real effect, not just theory!",
      ]}
      sections={[
        {
          title: "What is Time Dilation?",
          content: "Time dilation is a phenomenon predicted by Einstein's theory of relativity where time passes at different rates depending on gravity and velocity. According to special relativity, time moves slower for objects moving at high speeds relative to an observer. According to general relativity, time moves slower in stronger gravitational fields. These effects are real and have been experimentally verified.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Time Dilation"
        },
        {
          title: "Special Relativity",
          content: "Special relativity shows that time is relative - it depends on the observer's motion. The faster you move relative to someone else, the slower time passes for you from their perspective. This effect becomes significant only at speeds approaching the speed of light. For everyday speeds, the effect is negligible but measurable with precise instruments.",
        },
        {
          title: "General Relativity",
          content: "General relativity shows that gravity affects time. The stronger the gravitational field, the slower time passes. This means time moves slower near massive objects like black holes or even on Earth's surface compared to space. GPS satellites must account for this effect - their clocks run slightly faster in orbit than on Earth's surface.",
        }
      ]}
      facts={[
        { fact: "Time dilation is used in GPS systems", icon: "📡" },
        { fact: "Time moves slower near black holes", icon: "🕳️" },
        { fact: "Astronauts age slightly slower in space", icon: "👨‍🚀" },
        { fact: "Time dilation has been experimentally verified", icon: "✅" },
      ]}
      relatedLinks={[
        { name: "Black Holes", href: "/ar/black-holes" },
        { name: "Cosmology", href: "/ar/cosmology" },
        { name: "Gravitational Waves", href: "/ar/gravitational-waves" }
      ]}
    />
  )
}


import PageTemplate from '@/components-ar/PageTemplate'

export default function PulsarsPage() {
  return (
    <PageTemplate
      title="Pulsars"
      subtitle="Cosmic Lighthouses"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Pulsars"
      didYouKnow={[
        "Pulsars are rapidly rotating neutron stars that emit beams of radiation!",
        "Some pulsars rotate hundreds of times per second!",
        "Pulsars are incredibly precise cosmic clocks!",
        "The first pulsar was discovered in 1967 and nicknamed 'Little Green Men'!",
      ]}
      sections={[
        {
          title: "What Are Pulsars?",
          content: "Pulsars are rapidly rotating neutron stars that emit beams of electromagnetic radiation from their magnetic poles. As the star rotates, these beams sweep across space like a cosmic lighthouse. When the beam points toward Earth, we detect a pulse of radiation. Pulsars are the collapsed cores of massive stars that exploded as supernovae, compressed to the size of a city but with more mass than the Sun.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Pulsar"
        },
        {
          title: "Discovery",
          content: "Pulsars were discovered in 1967 by Jocelyn Bell Burnell and Antony Hewish. The first pulsar's regular pulses were so precise that they initially considered the possibility of an artificial signal from an alien civilization, earning it the nickname 'Little Green Men 1' (LGM-1). However, they soon realized it was a natural phenomenon - a rapidly rotating neutron star.",
        },
        {
          title: "Millisecond Pulsars",
          content: "The fastest pulsars, called millisecond pulsars, rotate hundreds of times per second. These are incredibly precise cosmic clocks, with timing accuracy better than atomic clocks. Scientists use pulsars to test Einstein's theory of general relativity and to search for gravitational waves. The precision of pulsar timing makes them valuable tools for fundamental physics.",
        }
      ]}
      facts={[
        { fact: "Pulsars can rotate up to 716 times per second", icon: "🌀" },
        { fact: "Pulsars are only 20-30 km in diameter", icon: "📏" },
        { fact: "A teaspoon of pulsar material weighs billions of tons", icon: "⚖️" },
        { fact: "Over 3,000 pulsars have been discovered", icon: "🔭" },
      ]}
      relatedLinks={[
        { name: "Stars", href: "/es/stars" },
        { name: "Neutron Stars", href: "/es/neutron-stars" },
        { name: "Supernovae", href: "/es/supernovae" }
      ]}
    />
  )
}


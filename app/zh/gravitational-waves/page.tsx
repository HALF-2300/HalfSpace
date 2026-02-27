import PageTemplate from '@/components-ar/PageTemplate'

export default function GravitationalWavesPage() {
  return (
    <PageTemplate
      title="Gravitational Waves"
      subtitle="Ripples in Spacetime"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Gravitational Waves"
      didYouKnow={[
        "Gravitational waves were predicted by Einstein in 1916!",
        "Gravitational waves were first detected in 2015!",
        "Gravitational waves travel at the speed of light!",
        "Merging black holes create the strongest gravitational waves!",
      ]}
      sections={[
        {
          title: "What Are Gravitational Waves?",
          content: "Gravitational waves are ripples in the fabric of spacetime, caused by accelerating massive objects. They were predicted by Einstein's theory of general relativity in 1916 but weren't directly detected until 2015. Gravitational waves are created by the most violent events in the universe: merging black holes, neutron star collisions, and supernovae. They carry information about their sources across the universe.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Gravitational Waves"
        },
        {
          title: "First Detection",
          content: "Gravitational waves were first directly detected on September 14, 2015, by the LIGO (Laser Interferometer Gravitational-Wave Observatory) detectors. The signal came from two black holes merging 1.3 billion light-years away. This discovery confirmed Einstein's prediction and opened a new window for observing the universe. The detection team won the 2017 Nobel Prize in Physics.",
        },
        {
          title: "Detection Methods",
          content: "Gravitational waves are detected using laser interferometers like LIGO and Virgo. These instruments measure tiny changes in distance (smaller than a proton) caused by passing gravitational waves. Space-based detectors like LISA are planned to detect lower-frequency waves. Gravitational wave astronomy allows us to observe events we can't see with light, like black hole mergers.",
        }
      ]}
      facts={[
        { fact: "Gravitational waves stretch and compress space itself", icon: "🌊" },
        { fact: "LIGO can detect waves from billions of light-years away", icon: "📡" },
        { fact: "Merging black holes create the strongest waves", icon: "🕳️" },
        { fact: "Gravitational waves pass through everything", icon: "🚪" },
      ]}
      relatedLinks={[
        { name: "Black Holes", href: "/zh/black-holes" },
        { name: "Neutron Stars", href: "/zh/neutron-stars" },
        { name: "Cosmology", href: "/zh/cosmology" }
      ]}
    />
  )
}


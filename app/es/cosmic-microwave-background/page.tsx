import PageTemplate from '@/components-ar/PageTemplate'

export default function CosmicMicrowaveBackgroundPage() {
  return (
    <PageTemplate
      title="Cosmic Microwave Background"
      subtitle="Echo of the Big Bang"
      heroImage="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920"
      heroImageAlt="Cosmic Microwave Background"
      didYouKnow={[
        "The CMB is leftover radiation from 380,000 years after the Big Bang!",
        "The CMB temperature is 2.7 Kelvin (-270°C)!",
        "The CMB fills the entire universe uniformly!",
        "Tiny fluctuations in the CMB led to galaxy formation!",
      ]}
      sections={[
        {
          title: "What is the CMB?",
          content: "The Cosmic Microwave Background (CMB) is the oldest light in the universe, leftover radiation from when the universe was only 380,000 years old. At that time, the universe cooled enough for atoms to form, and light could travel freely for the first time. This 'first light' has been traveling through space for 13.8 billion years and now appears as microwave radiation filling the entire universe.",
          image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",
          imageAlt: "Cosmic Microwave Background"
        },
        {
          title: "Discovery",
          content: "The CMB was accidentally discovered in 1965 by Arno Penzias and Robert Wilson at Bell Labs. They detected a persistent microwave signal coming from all directions in the sky. Initially thought to be interference, they realized it was cosmic radiation predicted by the Big Bang theory. This discovery earned them the 1978 Nobel Prize in Physics and provided strong evidence for the Big Bang.",
        },
        {
          title: "Tiny Fluctuations",
          content: "The CMB is remarkably uniform, but tiny temperature variations (about 0.00001°C) reveal the seeds of cosmic structure. These fluctuations represent density variations in the early universe that grew through gravity to form galaxies, stars, and planets. The pattern of these fluctuations tells us about the universe's composition, age, and geometry.",
        }
      ]}
      facts={[
        { fact: "The CMB is visible in all directions", icon: "👁️" },
        { fact: "CMB temperature is 2.725 Kelvin", icon: "🌡️" },
        { fact: "The CMB reveals the universe's age and composition", icon: "🔍" },
        { fact: "Planck satellite mapped the CMB in detail", icon: "🛰️" },
      ]}
      relatedLinks={[
        { name: "Big Bang", href: "/es/big-bang" },
        { name: "Cosmology", href: "/es/cosmology" },
        { name: "Dark Matter", href: "/es/dark-matter" }
      ]}
    />
  )
}


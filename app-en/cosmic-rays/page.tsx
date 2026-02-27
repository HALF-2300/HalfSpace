import PageTemplate from '@/components/PageTemplate'

export default function CosmicRaysPage() {
  return (
    <PageTemplate
      title="Cosmic Rays"
      subtitle="High-Energy Particles"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Cosmic Rays"
      didYouKnow={[
        "Cosmic rays travel at nearly the speed of light!",
        "Some cosmic rays have energies millions of times greater than particle accelerators!",
        "Cosmic rays come from supernovae and other high-energy events!",
        "Cosmic rays can damage electronics and pose risks to astronauts!",
      ]}
      sections={[
        {
          title: "What Are Cosmic Rays?",
          content: "Cosmic rays are high-energy particles (mostly protons and atomic nuclei) that travel through space at nearly the speed of light. Despite their name, they're not rays but particles. Cosmic rays originate from various sources including supernovae, active galactic nuclei, and other high-energy astrophysical events. They constantly bombard Earth, though most are deflected by our magnetic field and atmosphere.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Cosmic Rays"
        },
        {
          title: "Sources",
          content: "Most cosmic rays come from within our galaxy, accelerated by supernova shock waves. Some ultra-high-energy cosmic rays may come from outside the Milky Way. When a massive star explodes as a supernova, it creates shock waves that can accelerate particles to incredible energies. These particles then travel through space, some eventually reaching Earth.",
        },
        {
          title: "Effects and Detection",
          content: "Cosmic rays can create secondary particles when they collide with atoms in Earth's atmosphere. These collisions create showers of particles that can be detected on the ground. Cosmic rays pose radiation risks to astronauts and can cause electronic errors in spacecraft. They're also responsible for some of the carbon-14 in our atmosphere, which is used in radiocarbon dating.",
        }
      ]}
      facts={[
        { fact: "Cosmic rays constantly bombard Earth", icon: "☢️" },
        { fact: "Ultra-high-energy cosmic rays are extremely rare", icon: "💫" },
        { fact: "Earth's atmosphere protects us from most cosmic rays", icon: "🛡️" },
        { fact: "Cosmic rays helped discover antimatter", icon: "⚛️" },
      ]}
      relatedLinks={[
        { name: "Supernovae", href: "/supernovae" },
        { name: "Space Weather", href: "/space-weather" },
        { name: "Astronauts", href: "/astronauts" }
      ]}
    />
  )
}

